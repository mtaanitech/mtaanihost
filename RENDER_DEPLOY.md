# RENDER_DEPLOY.md

# Render Deployment Guide

## Prerequisites

- GitHub repo connected
- Render account
- Production `.env` values ready

## Step 1: Create Web Service

1. Go to Render
2. New > Web Service
3. Connect your repo: `mtaanitech/mtaanihost`
4. Name: `mtaanihost-api`
5. Set runtime to Node
6. Build command: `npm install`
7. Start command: `npm start`

## Step 2: Set Environment Variables

Add these in Render:

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
ADMIN_PASSWORD=your_admin_password
ADMIN_PASSWORD_HASH=$2b$10$your_hash_here
MAX_LOGIN_ATTEMPTS=5
LOCK_TIMEOUT_MS=900000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
MAX_FILE_SIZE=52428800
```

## Step 3: Deploy

Click Create Web Service and wait for the app to build.

Expected URL:

```text
https://mtaanihost-api.onrender.com
```

## Step 4: Verify

```bash
curl https://mtaanihost-api.onrender.com/health
```

