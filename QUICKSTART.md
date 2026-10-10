# Quick Start Guide

## Local Development

### 1. Setup
```bash
cd mtaanihost
npm install
cp .env.example .env
```

### 2. Edit .env
Set your test/development values:
- Paystack test keys (sk_test_, pk_test_)
- Gmail app password
- Test admin password

### 3. Run
```bash
npm run dev
```

Open:
- Homepage: http://localhost:5000
- Admin: http://localhost:5000/admin

---

## Production Deployment

### Quick Checklist

- [ ] Backend deployed to Render
- [ ] Frontend deployed to Cloudflare Pages
- [ ] Worker deployed to Cloudflare
- [ ] Paystack live keys configured
- [ ] Gmail SMTP working
- [ ] Admin password set
- [ ] Frontend URLs updated to Render backend
- [ ] All environment variables set correctly

### Test Production

```bash
# Health check
curl https://mtaanihost-api.onrender.com/health

# Signup
curl -X POST https://mtaanihost-api.onrender.com/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"SecurePass123"}'

# Admin
curl https://mtaanihost-api.onrender.com/admin/projects \
  -H "x-admin-key: your_admin_password"
```

---

## Files Structure

```
mtaanihost/
├── public/
│   ├── index.html          # Frontend homepage
│   └── admin.html          # Admin dashboard
├── workers/
│   ├── wrangler.toml       # Worker config
│   └── webhook.js          # Bot/webhook handler
├── server.js               # Backend API
├── package.json            # Dependencies
├── db.json                 # Database (JSON)
├── .env.example            # Environment template
├── .env                    # Local config (not committed)
├── DEPLOYMENT.md           # Full deployment guide
├── API.md                  # API documentation
├── ENV.md                  # Environment variables
├── RENDER_ENV.md           # Render setup
├── CLOUDFLARE_SETUP.md     # Cloudflare setup
└── README.md               # Main readme
```

---

## Support

Read the docs:
- `DEPLOYMENT.md` - Full deployment guide
- `API.md` - API endpoints and examples
- `ENV.md` - Environment variables explained
- `RENDER_ENV.md` - Render configuration
- `CLOUDFLARE_SETUP.md` - Cloudflare setup

