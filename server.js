require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const multer = require("multer");
const AdmZip = require("adm-zip");
const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");
const rateLimit = require("express-rate-limit");
const { body, validationResult } = require("express-validator");

const app = express();
const PORT = process.env.PORT || 5000;
const DB_PATH = process.env.DB_PATH || path.join(__dirname, "db.json");

app.use(helmet());

const allowedOrigins = [
  "http://localhost:5000",
  "http://localhost:3000",
  "https://mtaanitech.com"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed"));
    }
  },
  credentials: true
}));

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "admin.html"));
});

const globalLimiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 900000),
  max: Number(process.env.RATE_LIMIT_MAX || 100),
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests. Please try again later."
});
app.use(globalLimiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 8,
  message: "Too many login/signup attempts. Please wait and try again."
});

const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: Number(process.env.MAX_FILE_SIZE || 52428800)
  },
  fileFilter: function (_, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== ".zip") {
      return cb(new Error("Only ZIP files are allowed"));
    }
    cb(null, true);
  }
});

function readDb() {
  if (!fs.existsSync(DB_PATH)) {
    writeDb({
      users: [],
      projects: [],
      payments: [],
      bots: [],
      auditLogs: []
    });
  }

  return JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
}

function writeDb(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

function daysFromNow(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

function getUserByEmail(email) {
  const db = readDb();
  return db.users.find((u) => u.email.toLowerCase() === String(email).toLowerCase());
}

function getUserById(id) {
  const db = readDb();
  return db.users.find((u) => u.id === id);
}

function getProjectById(id) {
  const db = readDb();
  return db.projects.find((p) => p.id === id);
}

function hashPassword(password) {
  return bcrypt.hashSync(password, 10);
}

function verifyPassword(password, hash) {
  return bcrypt.compareSync(password, hash);
}

function generateToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY || "7d"
  });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return null;
  }
}

function authenticate(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Auth token missing" });
  }

  const token = header.split(" ")[1];
  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }

  req.userId = decoded.userId;
  next();
}

function authenticateAdmin(req, res, next) {
  const key = req.headers["x-admin-key"];

  if (!key) {
    return res.status(401).json({ message: "Admin key required" });
  }

  if (!process.env.ADMIN_PASSWORD_HASH) {
    return res.status(500).json({ message: "Admin hash not configured" });
  }

  const valid = bcrypt.compareSync(key, process.env.ADMIN_PASSWORD_HASH);
  if (!valid) {
    logAction(null, "ADMIN_LOGIN_FAILED", req.ip, req.get("user-agent"));
    return res.status(403).json({ message: "Invalid admin key" });
  }

  logAction(null, "ADMIN_LOGIN_SUCCESS", req.ip, req.get("user-agent"));
  next();
}

function logAction(userId, action, ip, userAgent, details = {}) {
  const db = readDb();
  db.auditLogs.push({
    id: uuidv4(),
    userId: userId || "anonymous",
    action,
    ip: ip || "unknown",
    userAgent: userAgent || "unknown",
    details,
    timestamp: new Date().toISOString()
  });
  writeDb(db);
}

function getEmailTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
}

async function sendVerificationEmail(email, token) {
  const verifyUrl = `${process.env.APP_URL || "http://localhost:5000"}/verify-email?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`;

  await getEmailTransporter().sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Verify your MtaaniHost account",
    html: `
      <h2>Welcome to MtaaniHost</h2>
      <p>Click the button below to verify your email.</p>
      <p>
        <a href="${verifyUrl}" style="display:inline-block;padding:10px 18px;background:#2563eb;color:#fff;text-decoration:none;border-radius:6px;">
          Verify Email
        </a>
      </p>
      <p>If you did not register, ignore this email.</p>
    `
  });
}

async function sendPaymentConfirmation(email, projectName, amountKsh) {
  await getEmailTransporter().sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "MtaaniHost payment confirmed",
    html: `
      <h2>Payment successful</h2>
      <p>Your payment of KES ${amountKsh} for <strong>${projectName}</strong> has been received.</p>
      <p>Your project is now active for 30 days.</p>
    `
  });
}

async function initializePaystack(email, amountKsh, projectId, userId) {
  const response = await axios.post(
    "https://api.paystack.co/transaction/initialize",
    {
      email,
      amount: Number(amountKsh) * 100,
      currency: "KES",
      metadata: {
        projectId,
        userId,
        product: "MtaaniHost"
      }
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json"
      }
    }
  );

  return response.data.data;
}

async function verifyPaystack(reference) {
  const response = await axios.get(
    `https://api.paystack.co/transaction/verify/${reference}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
      }
    }
  );

  return response.data.data;
}

async function deployStaticProject(project) {
  return `https://${project.projectName.toLowerCase().replace(/[^a-z0-9-]/g, "-")}.mtaanitech.workers.dev`;
}

function checkExpiredProjects() {
  const db = readDb();
  let changed = false;

  db.projects.forEach((project) => {
    if (project.suspended) return;
    if (project.expiresAt && new Date(project.expiresAt) < new Date()) {
      project.status = "suspended";
      project.suspended = true;
      project.updatedAt = new Date().toISOString();
      changed = true;
    }
  });

  if (changed) {
    writeDb(db);
  }
}

setInterval(checkExpiredProjects, 60 * 1000);

app.get("/health", (req, res) => {
  res.json({ ok: true, service: "MtaaniHost" });
});

app.post(
  "/signup",
  authLimiter,
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters")
      .matches(/[A-Z]/)
      .withMessage("Password must contain uppercase letter")
      .matches(/[a-z]/)
      .withMessage("Password must contain lowercase letter")
      .matches(/[0-9]/)
      .withMessage("Password must contain number")
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const normalizedEmail = String(email).trim().toLowerCase();

    if (getUserByEmail(normalizedEmail)) {
      logAction(null, "SIGNUP_FAILED_USER_EXISTS", req.ip, req.get("user-agent"), { email: normalizedEmail });
      return res.status(400).json({ message: "User already exists" });
    }

    try {
      const db = readDb();
      const user = {
        id: uuidv4(),
        email: normalizedEmail,
        passwordHash: hashPassword(password),
        emailVerified: false,
        verificationToken: uuidv4(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      db.users.push(user);
      writeDb(db);

      await sendVerificationEmail(user.email, user.verificationToken);

      logAction(user.id, "SIGNUP_SUCCESS", req.ip, req.get("user-agent"), { email: user.email });

      res.status(201).json({
        message: "Account created. Check your email to verify your account."
      });
    } catch (error) {
      console.error("Signup error:", error);
      logAction(null, "SIGNUP_FAILED", req.ip, req.get("user-agent"), { error: error.message });
      res.status(500).json({ message: "Signup failed" });
    }
  }
);

app.get("/verify-email", (req, res) => {
  const { email, token } = req.query;

  if (!email || !token) {
    return res.status(400).send("Invalid verification link.");
  }

  const db = readDb();
  const user = db.users.find(
    (u) =>
      u.email === String(email).toLowerCase() &&
      u.verificationToken === String(token)
  );

  if (!user) {
    logAction(null, "VERIFY_EMAIL_FAILED", req.ip, req.get("user-agent"), { email });
    return res.status(400).send("Invalid or expired verification link.");
  }

  user.emailVerified = true;
  user.verificationToken = "";
  user.updatedAt = new Date().toISOString();
  writeDb(db);

  logAction(user.id, "EMAIL_VERIFIED", req.ip, req.get("user-agent"));

  res.send(`
    <html>
      <body style="font-family:Arial;padding:40px;">
        <h2>Email verified successfully.</h2>
        <p>You can now log in and deploy your project.</p>
        <a href="${process.env.APP_URL || "http://localhost:5000"}">Go to MtaaniHost</a>
      </body>
    </html>
  `);
});

app.post(
  "/login",
  authLimiter,
  [
    body("email").isEmail().withMessage("Valid email required"),
    body("password").notEmpty().withMessage("Password required")
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const user = getUserByEmail(email);

    if (!user || !verifyPassword(password, user.passwordHash)) {
      logAction(null, "LOGIN_FAILED", req.ip, req.get("user-agent"), { email });
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!user.emailVerified) {
      logAction(user.id, "LOGIN_ATTEMPT_UNVERIFIED", req.ip, req.get("user-agent"));
      return res.status(403).json({ message: "Please verify your email first" });
    }

    const token = generateToken(user.id);

    logAction(user.id, "LOGIN_SUCCESS", req.ip, req.get("user-agent"));

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        emailVerified: true
      }
    });
  }
);

app.post(
  "/deploy-website",
  authenticate,
  upload.single("zipFile"),
  [
    body("projectName").matches(/^[a-z0-9-]+$/).withMessage("Project name can only contain lowercase letters, numbers and hyphens")
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = getUserById(req.userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (!user.emailVerified) {
      return res.status(403).json({ message: "Verify your email before deploying" });
    }

    const { projectName, githubUrl } = req.body;
    const safeProjectName = String(projectName).toLowerCase().trim();

    try {
      const db = readDb();
      const projectId = uuidv4();

      const project = {
        id: projectId,
        userId: req.userId,
        projectName: safeProjectName,
        type: "website",
        source: req.file ? "zip" : "github",
        githubUrl: githubUrl || "",
        zipFileName: req.file ? req.file.originalname : "",
        status: "deploying",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        expiresAt: daysFromNow(7),
        paymentStatus: "trial",
        suspended: false
      };

      db.projects.push(project);
      writeDb(db);

      if (req.file) {
        const zip = new AdmZip(req.file.path);
        const extractDir = path.join(__dirname, "projects", projectId);

        const entries = zip.getEntries();
        const suspicious = entries.some((entry) => {
          const name = entry.entryName;
          return name.includes("..") || name.includes("\\") || name.includes("..\\");
        });

        if (suspicious) {
          throw new Error("Suspicious zip file detected");
        }

        fs.mkdirSync(extractDir, { recursive: true });
        zip.extractAllTo(extractDir, true);
        fs.unlinkSync(req.file.path);
      }

      const liveUrl = await deployStaticProject(project);

      const updatedDb = readDb();
      const projectIndex = updatedDb.projects.findIndex((p) => p.id === projectId);
      updatedDb.projects[projectIndex].liveUrl = liveUrl;
      updatedDb.projects[projectIndex].status = "active";
      updatedDb.projects[projectIndex].updatedAt = new Date().toISOString();
      writeDb(updatedDb);

      logAction(req.userId, "WEBSITE_DEPLOYED", req.ip, req.get("user-agent"), {
        projectId,
        projectName: safeProjectName
      });

      res.json({
        message: "Website deployed successfully",
        project: updatedDb.projects[projectIndex]
      });
    } catch (error) {
      console.error("Website deploy error:", error);
      logAction(req.userId, "WEBSITE_DEPLOY_FAILED", req.ip, req.get("user-agent"), {
        error: error.message,
        projectName: safeProjectName
      });
      res.status(500).json({ message: "Deployment failed", error: error.message });
    }
  }
);

app.post(
  "/deploy-bot",
  authenticate,
  [
    body("projectName").matches(/^[a-z0-9-]+$/).withMessage("Bot name invalid"),
    body("botType").isIn(["meta", "baileys", "telegram", "discord"]).withMessage("Unsupported bot type")
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = getUserById(req.userId);
    if (!user || !user.emailVerified) {
      return res.status(403).json({ message: "Verify your email before deploying bot" });
    }

    const { projectName, botType, credentials } = req.body;
    const db = readDb();

    const projectId = uuidv4();
    const botId = uuidv4();

    const project = {
      id: projectId,
      userId: req.userId,
      projectName: String(projectName).toLowerCase(),
      type: "bot",
      botType,
      credentials: credentials || {},
      liveUrl: `https://${String(projectName).toLowerCase().replace(/[^a-z0-9-]/g, "-")}.mtaanitech.workers.dev`,
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      expiresAt: daysFromNow(7),
      paymentStatus: "trial",
      suspended: false
    };

    const bot = {
      id: botId,
      projectId,
      botType,
      status: "running",
      restarts: 0,
      lastRestart: new Date().toISOString()
    };

    db.projects.push(project);
    db.bots.push(bot);
    writeDb(db);

    logAction(req.userId, "BOT_DEPLOYED", req.ip, req.get("user-agent"), {
      projectId,
      botType
    });

    res.json({
      message: "Bot deployed successfully",
      project,
      bot
    });
  }
);

app.post("/paystack/init", async (req, res) => {
  const { email, amount, projectId, userId } = req.body;

  if (!email || !amount || !projectId || !userId) {
    return res.status(400).json({ message: "email, amount, projectId and userId are required" });
  }

  try {
    const init = await initializePaystack(email, amount, projectId, userId);
    res.json({
      authorization_url: init.authorization_url,
      reference: init.reference
    });
  } catch (error) {
    console.error("Paystack init error:", error.response?.data || error.message);
    res.status(400).json({ message: "Failed to initialize payment" });
  }
});

app.get("/paystack/verify", async (req, res) => {
  const { reference } = req.query;

  if (!reference) {
    return res.status(400).json({ message: "reference is required" });
  }

  try {
    const tx = await verifyPaystack(reference);
    const db = readDb();
    const project = db.projects.find((p) => p.id === tx.metadata.projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    project.paymentStatus = "paid";
    project.status = "active";
    project.suspended = false;
    project.expiresAt = daysFromNow(30);
    project.updatedAt = new Date().toISOString();

    db.payments.push({
      id: uuidv4(),
      projectId: project.id,
      amount: tx.amount / 100,
      reference,
      status: "success",
      paidAt: new Date().toISOString()
    });

    writeDb(db);

    const user = getUserById(project.userId);
    if (user) {
      await sendPaymentConfirmation(user.email, project.projectName, tx.amount / 100);
    }

    logAction(project.userId, "PAYMENT_SUCCESS", req.ip, req.get("user-agent"), {
      projectId: project.id,
      amount: tx.amount / 100,
      reference
    });

    res.json({
      message: "Payment verified successfully",
      project
    });
  } catch (error) {
    console.error("Paystack verify error:", error.response?.data || error.message);
    res.status(400).json({ message: "Unable to verify payment" });
  }
});

app.get("/projects/:id/status", authenticate, (req, res) => {
  const project = getProjectById(req.params.id);
  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  res.json({
    id: project.id,
    projectName: project.projectName,
    status: project.status,
    suspended: project.suspended,
    expiresAt: project.expiresAt,
    paymentStatus: project.paymentStatus
  });
});

app.get("/admin/projects", authenticateAdmin, (req, res) => {
  const db = readDb();
  res.json({
    total: db.projects.length,
    projects: db.projects
  });
});

app.get("/admin/bots", authenticateAdmin, (req, res) => {
  const db = readDb();
  res.json(db.bots);
});

app.get("/admin/audit-logs", authenticateAdmin, (req, res) => {
  const db = readDb();
  res.json(db.auditLogs.slice(-50).reverse());
});

app.patch("/admin/projects/:id", authenticateAdmin, (req, res) => {
  const { id } = req.params;
  const { suspend, addDays } = req.body;

  const db = readDb();
  const project = db.projects.find((p) => p.id === id);

  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  if (typeof suspend === "boolean") {
    project.suspended = suspend;
    project.status = suspend ? "suspended" : "active";
  }

  if (addDays && Number(addDays) > 0) {
    const expiry = new Date(project.expiresAt || Date.now());
    expiry.setDate(expiry.getDate() + Number(addDays));
    project.expiresAt = expiry.toISOString();
  }

  project.updatedAt = new Date().toISOString();
  writeDb(db);

  logAction(null, "ADMIN_PROJECT_UPDATED", req.ip, req.get("user-agent"), { projectId: id, suspend, addDays });

  res.json({ message: "Project updated", project });
});

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`MtaaniHost backend running on port ${PORT}`);
});
