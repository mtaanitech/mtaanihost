# Production Render Environment Variables

Copy these to your Render Web Service environment variables:

```
PORT=10000
NODE_ENV=production
JWT_SECRET=your_generated_jwt_secret_here
JWT_EXPIRY=7d
DB_PATH=./db.json
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-real-gmail@gmail.com
SMTP_PASS=your-gmail-16-char-app-password
EMAIL_FROM="MtaaniHost <no-reply@mtaanitech.com>"
PAYSTACK_SECRET_KEY=sk_live_your_production_paystack_key
PAYSTACK_PUBLIC_KEY=pk_live_your_production_paystack_key
PAYSTACK_WEBHOOK_SECRET=your_paystack_webhook_secret_here
CLOUDFLARE_API_TOKEN=your_cloudflare_api_token_here
CLOUDFLARE_ACCOUNT_ID=your_cloudflare_account_id_here
BASE_DOMAIN=mtaanitech.workers.dev
APP_URL=https://mtaanihost-api.onrender.com
ADMIN_PASSWORD=your_strong_admin_password_here
ADMIN_PASSWORD_HASH=$2b$10$your_generated_bcrypt_hash_here
MAX_LOGIN_ATTEMPTS=5
LOCK_TIMEOUT_MS=900000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
MAX_FILE_SIZE=52428800
```

## How to set these:

1. Go to render.com
2. Create new Web Service
3. Connect GitHub repo: mtaanitech/mtaanihost
4. Name: mtaanihost-api
5. Build Command: `npm install`
6. Start Command: `npm start`
7. Add each environment variable in the "Environment" section
8. Deploy

After deployment, Render gives you a URL like:
```
https://mtaanihost-api.onrender.com
```

Use this URL to update your frontend.
