# MtaaniHost Environment Variables

## Required Variables

### Server
```env
PORT=5000                        # Server port
NODE_ENV=development             # development or production
```

### JWT
```env
JWT_SECRET=your_long_random_secret_32_chars_minimum
JWT_EXPIRY=7d                    # Token expiry (e.g., 7d, 24h)
```

### Database
```env
DB_PATH=./db.json                # Path to JSON database file
```

### Email (Gmail SMTP)
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com   # Your Gmail address
SMTP_PASS=your-app-password      # Gmail app password (not regular password)
EMAIL_FROM="MtaaniHost <no-reply@mtaanitech.com>"
```

### Paystack
```env
PAYSTACK_SECRET_KEY=sk_live_...  # Paystack live secret key
PAYSTACK_PUBLIC_KEY=pk_live_...  # Paystack live public key
PAYSTACK_WEBHOOK_SECRET=...      # Paystack webhook secret
```

### Cloudflare
```env
CLOUDFLARE_API_TOKEN=...         # Your Cloudflare API token
CLOUDFLARE_ACCOUNT_ID=...        # Your Cloudflare account ID
BASE_DOMAIN=mtaanitech.workers.dev
```

### Admin
```env
ADMIN_PASSWORD=your_strong_admin_password
ADMIN_PASSWORD_HASH=$2b$10$...   # bcrypt hash of admin password
APP_URL=http://localhost:5000    # App base URL (for email links)
```

### Security
```env
MAX_LOGIN_ATTEMPTS=5             # Max failed login attempts
LOCK_TIMEOUT_MS=900000           # Account lock timeout (15 min)
RATE_LIMIT_WINDOW_MS=900000      # Rate limit window (15 min)
RATE_LIMIT_MAX=100               # Max requests per window
MAX_FILE_SIZE=52428800           # Max upload size (50MB)
```

---

## How to Generate Required Values

### Generate JWT_SECRET
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Generate ADMIN_PASSWORD_HASH
```bash
node -e "const bcrypt=require('bcrypt'); console.log(bcrypt.hashSync('your_strong_admin_password', 10));"
```

### Get Gmail SMTP Credentials
1. Enable 2-Factor Authentication on your Google account
2. Go to myaccount.google.com > Security > App passwords
3. Select Mail and Windows Computer
4. Generate password
5. Copy the 16-character password to SMTP_PASS

### Get Paystack Keys
1. Login to paystack.com
2. Go to Settings > API Keys & Webhooks
3. Copy your live keys (if production) or test keys (if testing)

### Get Cloudflare API Token
1. Login to cloudflare.com
2. Go to My Profile > API Tokens
3. Create Token with Cloudflare Pages permissions
4. Copy token

### Get Cloudflare Account ID
1. Login to cloudflare.com
2. Go to any domain
3. Copy Account ID from right sidebar

---

## Local Development (.env)

Use this as a template for local development:

```env
PORT=5000
NODE_ENV=development
JWT_SECRET=local_development_secret_key_change_in_production
JWT_EXPIRY=7d
DB_PATH=./db.json
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-gmail-app-password
EMAIL_FROM="MtaaniHost <no-reply@mtaanitech.com>"
PAYSTACK_SECRET_KEY=sk_test_xxx
PAYSTACK_PUBLIC_KEY=pk_test_xxx
PAYSTACK_WEBHOOK_SECRET=test_webhook_secret
CLOUDFLARE_API_TOKEN=local_token
CLOUDFLARE_ACCOUNT_ID=local_account_id
BASE_DOMAIN=mtaanitech.workers.dev
APP_URL=http://localhost:5000
ADMIN_PASSWORD=your_admin_password
ADMIN_PASSWORD_HASH=$2b$10$generated_hash_here
MAX_LOGIN_ATTEMPTS=5
LOCK_TIMEOUT_MS=900000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
MAX_FILE_SIZE=52428800
```

---

## Production (.env on Render)

Use this structure for production on Render:

```env
PORT=10000
NODE_ENV=production
JWT_SECRET=your_very_long_random_production_secret
JWT_EXPIRY=7d
DB_PATH=./db.json
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=production-email@gmail.com
SMTP_PASS=production-app-password
EMAIL_FROM="MtaaniHost <no-reply@mtaanitech.com>"
PAYSTACK_SECRET_KEY=sk_live_your_production_key
PAYSTACK_PUBLIC_KEY=pk_live_your_production_key
PAYSTACK_WEBHOOK_SECRET=production_webhook_secret
CLOUDFLARE_API_TOKEN=production_cloudflare_token
CLOUDFLARE_ACCOUNT_ID=production_account_id
BASE_DOMAIN=mtaanitech.workers.dev
APP_URL=https://mtaanihost-api.onrender.com
ADMIN_PASSWORD=very_strong_production_admin_password
ADMIN_PASSWORD_HASH=$2b$10$production_hash_here
MAX_LOGIN_ATTEMPTS=5
LOCK_TIMEOUT_MS=900000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
MAX_FILE_SIZE=52428800
```

---

## Security Notes

⚠️ **NEVER commit `.env` to git**

- `.env` is already in `.gitignore`
- Keep production secrets safe
- Rotate keys regularly
- Use strong passwords
- Enable 2FA on all accounts

