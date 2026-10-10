# CREDENTIALS_SETUP.md

# Setup Credentials Guide

This guide shows where to get the real secret values required for production deployment.

## 1. GitHub Personal Access Token

1. Go to GitHub
2. Settings > Developer settings > Personal access tokens
3. Generate a token with repo access
4. Save it securely

## 2. Render API Token

1. Go to Render
2. Account Settings > API Tokens
3. Create a new token
4. Save it securely

## 3. Cloudflare API Token

1. Go to Cloudflare
2. Profile > API Tokens
3. Create a token with Workers and Pages permissions
4. Save it securely

## 4. Cloudflare Account ID

1. Open Cloudflare dashboard
2. Copy the Account ID from the sidebar
3. Save it

## 5. Paystack Live Keys

1. Go to Paystack dashboard
2. Settings > API Keys & Webhooks
3. Copy the live keys:
   - `sk_live_...`
   - `pk_live_...`
4. Save the webhook secret too

## 6. Gmail App Password

1. Enable 2FA on Gmail
2. Go to App passwords
3. Create a Mail app password
4. Save it

## 7. JWT Secret

Generate with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 8. Admin Password Hash

Generate with:

```bash
node -e "const bcrypt=require('bcrypt'); console.log(bcrypt.hashSync('your_strong_admin_password', 10));"
```

## 9. Production .env

Fill your real values here:

```env
PORT=10000
NODE_ENV=production
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRY=7d
DB_PATH=./db.json
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-real-gmail@gmail.com
SMTP_PASS=your-gmail-app-password
EMAIL_FROM="MtaaniHost <no-reply@mtaanitech.com>"
PAYSTACK_SECRET_KEY=sk_live_...
PAYSTACK_PUBLIC_KEY=pk_live_...
PAYSTACK_WEBHOOK_SECRET=your_webhook_secret
CLOUDFLARE_API_TOKEN=your_cloudflare_token
CLOUDFLARE_ACCOUNT_ID=your_cloudflare_account_id
BASE_DOMAIN=mtaanitech.workers.dev
APP_URL=https://mtaanihost-api.onrender.com
ADMIN_PASSWORD=your_strong_admin_password
ADMIN_PASSWORD_HASH=$2b$10$your_hash_here
MAX_LOGIN_ATTEMPTS=5
LOCK_TIMEOUT_MS=900000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
MAX_FILE_SIZE=52428800
```

Important:
- do not commit `.env` to GitHub
- keep all secrets in a password manager or secure env store
