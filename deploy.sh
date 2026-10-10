#!/bin/bash

# Production Deployment Script for MtaaniHost
# Run this after setting up Render and Cloudflare accounts

echo "🚀 MtaaniHost Production Deployment"
echo "===================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Step 1: Check Node.js${NC}"
if ! command -v node &> /dev/null; then
  echo -e "${RED}❌ Node.js not found${NC}"
  exit 1
fi
echo -e "${GREEN}✅ Node.js $(node -v)${NC}"
echo ""

echo -e "${YELLOW}Step 2: Generate JWT Secret${NC}"
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
echo -e "${GREEN}✅ Generated JWT_SECRET${NC}"
echo ""

echo -e "${YELLOW}Step 3: Generate Admin Password Hash${NC}"
echo "Enter admin password (at least 8 chars):"
read -s ADMIN_PASS
echo ""
echo "Confirming password:"
read -s ADMIN_PASS_CONFIRM
echo ""

if [ "$ADMIN_PASS" != "$ADMIN_PASS_CONFIRM" ]; then
  echo -e "${RED}❌ Passwords do not match${NC}"
  exit 1
fi

ADMIN_HASH=$(node -e "const bcrypt=require('bcrypt'); console.log(bcrypt.hashSync('$ADMIN_PASS', 10));")
echo -e "${GREEN}✅ Generated Admin Hash${NC}"
echo ""

echo -e "${YELLOW}Step 4: Create Production .env${NC}"
cat > .env.production <<EOF
PORT=10000
NODE_ENV=production
JWT_SECRET=$JWT_SECRET
JWT_EXPIRY=7d
DB_PATH=./db.json
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-gmail-app-password
EMAIL_FROM="MtaaniHost <no-reply@mtaanitech.com>"
PAYSTACK_SECRET_KEY=sk_live_your_key
PAYSTACK_PUBLIC_KEY=pk_live_your_key
PAYSTACK_WEBHOOK_SECRET=your_webhook_secret
CLOUDFLARE_API_TOKEN=your_cloudflare_token
CLOUDFLARE_ACCOUNT_ID=your_account_id
BASE_DOMAIN=mtaanitech.workers.dev
APP_URL=https://mtaanihost-api.onrender.com
ADMIN_PASSWORD=$ADMIN_PASS
ADMIN_PASSWORD_HASH=$ADMIN_HASH
MAX_LOGIN_ATTEMPTS=5
LOCK_TIMEOUT_MS=900000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
MAX_FILE_SIZE=52428800
EOF
echo -e "${GREEN}✅ Created .env.production${NC}"
echo -e "${YELLOW}⚠️  Edit .env.production with your real credentials${NC}"
echo ""

echo -e "${YELLOW}Step 5: Install Dependencies${NC}"
npm install
echo -e "${GREEN}✅ Dependencies installed${NC}"
echo ""

echo -e "${GREEN}✅ Setup complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Edit .env.production with real values:"
echo "   - SMTP_USER and SMTP_PASS (Gmail app password)"
echo "   - PAYSTACK_SECRET_KEY and PAYSTACK_PUBLIC_KEY"
echo "   - CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID"
echo ""
echo "2. Upload to Render:"
echo "   - Connect GitHub repo"
echo "   - Copy .env.production values to Render environment"
echo ""
echo "3. Deploy frontend to Cloudflare Pages"
echo "4. Deploy worker to Cloudflare Workers"
echo ""
