# MtaaniHost

MtaaniHost is a platform for hosting:
- static websites
- WhatsApp bots
- Telegram bots
- Discord bots

Users can:
- sign up
- verify email
- deploy website or bot
- get a live URL
- pay via Paystack
- extend project expiry
- get suspended when expired

Admin can:
- view every project
- see payment status
- suspend projects
- extend expiry manually
- review audit logs

## Tech Stack
- Backend: Node.js + Express
- Frontend: HTML + Tailwind CSS
- Database: JSON file for MVP
- Email: Nodemailer
- Payments: Paystack
- Hosting: Cloudflare Pages / Workers
- Security: JWT, bcrypt, helmet, rate limiting, audit logging

## Project Structure

```text
mtaanihost/
├─ .env
├─ .env.example
├─ db.json
├─ package.json
├─ server.js
├─ public/
│  ├─ index.html
│  └─ admin.html
├─ uploads/
├─ projects/
└─ README.md
```

## Features
- User signup
- Email verification
- JWT login
- Website deployment
- Bot deployment
- Paystack flow
- Admin dashboard
- Expiry and suspension
- Audit logs
- ZIP file upload validation
- Rate limit and security hardening

## Installation

1. Install dependencies

```bash
npm install
```

2. Copy environment file

```bash
cp .env.example .env
```

3. Edit `.env`

Set your real values for:
- SMTP
- Paystack
- Cloudflare
- admin hash
- JWT secret

4. Generate admin hash

```bash
node -e "const bcrypt=require('bcrypt'); console.log(bcrypt.hashSync('your_strong_admin_password', 10));"
```

Then add it to `.env`:

```env
ADMIN_PASSWORD_HASH=$2b$10...
```

5. Run locally

```bash
npm run dev
```

Then open:
- http://localhost:5000
- http://localhost:5000/admin

## API Endpoints

### Auth
- POST /signup
- GET /verify-email
- POST /login

### Deploy
- POST /deploy-website
- POST /deploy-bot

### Payment
- POST /paystack/init
- GET /paystack/verify

### Admin
- GET /admin/projects
- GET /admin/bots
- GET /admin/audit-logs
- PATCH /admin/projects/:id

### Health
- GET /health

## Admin Access

Use the admin password as header:

```bash
curl -H "x-admin-key: your_strong_admin_password" http://localhost:5000/admin/projects
```

## Deployment

### Render
Deploy backend to Render with:
- build command: `npm install`
- start command: `npm start`

### Cloudflare Pages
Deploy the frontend as a static site or upload the HTML files.

### Cloudflare Workers
Use a worker for bot/webhook endpoints.

## Production Notes
This repo is a functional MVP using:
- JSON file database
- Cloudflare Pages for final site hosting
- Render for backend
- Paystack for payments
- Gmail SMTP for email

Later improvements:
- MongoDB/PostgreSQL
- real Cloudflare Pages deployment for each user project
- more robust bot runtime orchestration
- containerized bot services
- R2 storage for user uploads

## License
MIT

## Maintainer
MtaaniHost
