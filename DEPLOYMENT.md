# MtaaniHost Deployment Guide

## Backend Deployment on Render

### Step 1: Create Render Account
- Go to render.com
- Sign up or login

### Step 2: Create Web Service
- Click "New +" > "Web Service"
- Connect your GitHub repo: `mtaanitech/mtaanihost`
- Name: `mtaanihost-api`
- Environment: `Node`
- Build Command: `npm install`
- Start Command: `npm start`

### Step 3: Add Environment Variables

Copy all these exactly into Render environment:

```
PORT=10000
NODE_ENV=production
JWT_SECRET=your_very_long_random_secret_at_least_32_chars
JWT_EXPIRY=7d
DB_PATH=./db.json
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-real-email@gmail.com
SMTP_PASS=your-gmail-app-password
EMAIL_FROM="MtaaniHost <no-reply@mtaanitech.com>"
PAYSTACK_SECRET_KEY=sk_live_your_real_paystack_key
PAYSTACK_PUBLIC_KEY=pk_live_your_real_paystack_key
PAYSTACK_WEBHOOK_SECRET=your_paystack_webhook_secret
CLOUDFLARE_API_TOKEN=your_cloudflare_api_token
CLOUDFLARE_ACCOUNT_ID=your_cloudflare_account_id
BASE_DOMAIN=mtaanitech.workers.dev
APP_URL=https://mtaanihost-api.onrender.com
ADMIN_PASSWORD=your_strong_admin_password
ADMIN_PASSWORD_HASH=$2b$10$your_generated_hash
MAX_LOGIN_ATTEMPTS=5
LOCK_TIMEOUT_MS=900000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
MAX_FILE_SIZE=52428800
```

### Step 4: Deploy
- Click "Create Web Service"
- Wait for build to complete
- You'll get a live URL like: `https://mtaanihost-api.onrender.com`

---

## Frontend Deployment on Cloudflare Pages

### Step 1: Create Cloudflare Account
- Go to cloudflare.com
- Sign up or login

### Step 2: Deploy Static Files
- Go to Workers & Pages
- Click "Create application"
- Click "Pages"
- Click "Upload assets"
- Drag and drop the `public/` folder contents
- Project name: `mtaanihost-frontend`
- Click "Deploy site"

You'll get a URL like: `https://mtaanihost-frontend.youraccount.pages.dev`

### Step 3: Update Frontend URLs

Edit `public/index.html` and `public/admin.html`:

Find and replace:
```js
http://localhost:5000
```

With your Render backend URL:
```js
https://mtaanihost-api.onrender.com
```

Then push the changes:
```bash
git add .
git commit -m "Update API URLs for production"
git push
```

Redeploy frontend on Cloudflare Pages.

---

## Cloudflare Worker Deployment

### Step 1: Install Wrangler
```bash
npm install -g wrangler
```

### Step 2: Login
```bash
wrangler login
```

### Step 3: Deploy Worker
```bash
cd workers
wrangler deploy
```

You'll get a URL like: `https://mtaanihost-webhook.yoursubdomain.workers.dev`

Use this URL as:
- Bot webhook endpoint
- Callback destination
- Bot event receiver

---

## Paystack Setup

### Get Live Keys
1. Login to paystack.com
2. Go to Settings > API Keys & Webhooks
3. Copy your live keys (starts with `sk_live_` and `pk_live_`)
4. Add to your `.env` or Render environment variables

### Set Webhook
1. In Paystack dashboard
2. Settings > API Keys & Webhooks
3. Webhook URL: `https://mtaanihost-api.onrender.com/paystack/webhook`
4. Save

---

## Gmail SMTP Setup

### Enable 2-Factor Authentication
1. Go to myaccount.google.com
2. Security
3. 2-Step Verification (enable it)

### Generate App Password
1. Back to Security
2. App passwords
3. Select Mail and Windows Computer
4. Generate password
5. Copy the generated password
6. Use in `.env` as `SMTP_PASS`

---

## Final URLs

After all deployments, you'll have:

- Backend API: `https://mtaanihost-api.onrender.com`
- Frontend: `https://mtaanihost-frontend.youraccount.pages.dev`
- Webhook Worker: `https://mtaanihost-webhook.yoursubdomain.workers.dev`
- Admin Panel: `https://mtaanihost-frontend.youraccount.pages.dev/admin`

---

## Testing Production

### Test Signup
```bash
curl -X POST https://mtaanihost-api.onrender.com/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"SecurePass123"}'
```

### Test Login
```bash
curl -X POST https://mtaanihost-api.onrender.com/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"SecurePass123"}'
```

### Test Admin
```bash
curl https://mtaanihost-api.onrender.com/admin/projects \
  -H "x-admin-key: your_admin_password"
```

### Test Health
```bash
curl https://mtaanihost-api.onrender.com/health
```

---

## Production Checklist

- [ ] Render backend deployed
- [ ] Cloudflare Pages frontend deployed
- [ ] Cloudflare Worker deployed
- [ ] All environment variables set correctly
- [ ] Paystack live keys configured
- [ ] Gmail SMTP working
- [ ] Admin key set and hashed
- [ ] Frontend URLs updated to production
- [ ] Test signup/login flow
- [ ] Test deployment flow
- [ ] Test payment flow
- [ ] Test admin panel
- [ ] Test project expiry
- [ ] Custom domain configured (optional)

