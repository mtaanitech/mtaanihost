# Production Deployment Checklist

## Pre-Deployment

### Local Environment
- [ ] Clone repo locally
- [ ] Run `npm install`
- [ ] Create `.env` from `.env.example`
- [ ] Set development/test values
- [ ] Run `npm run dev`
- [ ] Test signup at http://localhost:5000
- [ ] Test verify email
- [ ] Test login
- [ ] Test deploy website
- [ ] Test deploy bot
- [ ] Test admin at http://localhost:5000/admin
- [ ] Test health check: `curl http://localhost:5000/health`

### Credentials Setup
- [ ] Gmail account with 2FA enabled
- [ ] Gmail app password generated
- [ ] Paystack account created
- [ ] Paystack test keys retrieved
- [ ] Cloudflare account created
- [ ] Cloudflare API token generated
- [ ] Cloudflare Account ID copied
- [ ] Admin password decided
- [ ] Admin password hash generated
- [ ] JWT secret generated

## Deployment Phase 1: Backend

### Render Setup
- [ ] Login to render.com
- [ ] Create new Web Service
- [ ] Connect GitHub repo (mtaanitech/mtaanihost)
- [ ] Set name: `mtaanihost-api`
- [ ] Set runtime: `Node`
- [ ] Set build command: `npm install`
- [ ] Set start command: `npm start`
- [ ] Add environment variables (copy from RENDER_ENV.md)
- [ ] Deploy
- [ ] Wait for build to complete
- [ ] Test health endpoint: `curl https://mtaanihost-api.onrender.com/health`
- [ ] Note the live URL: `https://mtaanihost-api.onrender.com`

### Backend Tests
- [ ] Signup test: `curl -X POST https://mtaanihost-api.onrender.com/signup ...`
- [ ] Login test: `curl -X POST https://mtaanihost-api.onrender.com/login ...`
- [ ] Admin test: `curl https://mtaanihost-api.onrender.com/admin/projects -H "x-admin-key: ..."` 
- [ ] Verify no errors in Render logs

## Deployment Phase 2: Frontend

### Update URLs
- [ ] Edit `public/index.html`
- [ ] Replace `http://localhost:5000` with `https://mtaanihost-api.onrender.com`
- [ ] Edit `public/admin.html`
- [ ] Replace `http://localhost:5000` with `https://mtaanihost-api.onrender.com`
- [ ] Git commit: `git add . && git commit -m "Update API URLs for production"`
- [ ] Git push: `git push`

### Cloudflare Pages Deployment
- [ ] Login to cloudflare.com
- [ ] Go to Workers & Pages
- [ ] Click "Create application"
- [ ] Click "Pages"
- [ ] Click "Upload assets"
- [ ] Project name: `mtaanihost-frontend`
- [ ] Upload all files from `public/` folder
- [ ] Deploy
- [ ] Note the live URL: `https://mtaanihost-frontend.youraccount.pages.dev`
- [ ] Test frontend is accessible

### Frontend Tests
- [ ] Open https://mtaanihost-frontend.youraccount.pages.dev
- [ ] Try signup
- [ ] Try login
- [ ] Test that API calls go to Render backend

## Deployment Phase 3: Worker

### Cloudflare Worker Setup
- [ ] Install wrangler: `npm install -g wrangler`
- [ ] Login: `wrangler login`
- [ ] Navigate to `cd workers`
- [ ] Deploy: `wrangler deploy`
- [ ] Note the live URL: `https://mtaanihost-webhook.yoursubdomain.workers.dev`

### Worker Tests
- [ ] Test health: `curl https://mtaanihost-webhook.yoursubdomain.workers.dev/`
- [ ] Should return: "MtaaniHost Webhook Worker is running"

## Deployment Phase 4: Paystack

### Paystack Production Setup
- [ ] Login to paystack.com
- [ ] Go to Settings > API Keys & Webhooks
- [ ] Get live keys (sk_live_..., pk_live_...)
- [ ] Copy live keys
- [ ] Login to Render
- [ ] Update `PAYSTACK_SECRET_KEY` with live key
- [ ] Update `PAYSTACK_PUBLIC_KEY` with live key
- [ ] Redeploy backend on Render
- [ ] In Paystack dashboard, set webhook URL:
  - `https://mtaanihost-api.onrender.com/paystack/webhook`
- [ ] Test payment flow with test card

### Payment Tests
- [ ] Initiate payment: `curl -X POST https://mtaanihost-api.onrender.com/paystack/init ...`
- [ ] Complete Paystack checkout
- [ ] Verify payment: `curl https://mtaanihost-api.onrender.com/paystack/verify?reference=...`
- [ ] Check project expiry was extended

## Final Verification

### Complete User Flow
- [ ] Sign up new user
- [ ] Verify email
- [ ] Login
- [ ] Deploy website
- [ ] Check project in admin
- [ ] Initiate payment
- [ ] Complete payment
- [ ] Verify project expiry extended
- [ ] Admin suspend project
- [ ] Admin extend project

### Security Checks
- [ ] `.env` file is NOT in repo
- [ ] `.gitignore` includes `.env`
- [ ] No hardcoded secrets in code
- [ ] Admin key is hashed (bcrypt)
- [ ] Passwords are validated (8+ chars)
- [ ] Rate limiting is enabled
- [ ] CORS is restricted
- [ ] HTTPS is enforced

### Performance Checks
- [ ] Backend responds in < 500ms
- [ ] Frontend loads in < 3s
- [ ] Admin operations are fast
- [ ] No database errors in logs

## Post-Deployment

### Monitoring
- [ ] Set up Render logs monitoring
- [ ] Check Paystack transaction logs
- [ ] Monitor Cloudflare analytics
- [ ] Review audit logs regularly

### Backups
- [ ] Set up `db.json` backup strategy
- [ ] Document backup procedure
- [ ] Test restore process

### Next Steps
- [ ] Document any issues found
- [ ] Plan next features
- [ ] Set up monitoring/alerts
- [ ] Plan database migration (MongoDB/PostgreSQL)

## Live URLs

Once everything is deployed, you'll have:

- **Backend API**: https://mtaanihost-api.onrender.com
- **Frontend**: https://mtaanihost-frontend.youraccount.pages.dev
- **Admin Panel**: https://mtaanihost-frontend.youraccount.pages.dev/admin
- **Bot Webhook**: https://mtaanihost-webhook.yoursubdomain.workers.dev
- **Health Check**: https://mtaanihost-api.onrender.com/health

---

**Status**: [ ] Not Started [ ] In Progress [ ] Complete

Date Started: ___________
Date Completed: ___________

