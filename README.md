# MtaaniHost

A production-ready MVP for website + bot hosting with email verification, admin controls, and Paystack billing.

## Features

- User signup/login
- Email verification
- JWT authentication
- Project deployment metadata
- Bot deployment metadata
- Paystack billing flow
- Admin dashboard
- Audit logs
- Security headers and rate limiting

## Quick Start

```bash
npm install
cp .env.example .env
npm run dev
```

Then open:
- http://localhost:5000
- http://localhost:5000/admin

## Documentation

- `CREDENTIALS_SETUP.md` — where to get tokens/keys
- `RENDER_DEPLOY.md` — Render backend deployment
- `CLOUDFLARE_DEPLOY.md` — Cloudflare Pages + Worker deployment
- `PAYSTACK_SETUP.md` — Paystack setup and webhook config
- `FINAL_CHECKLIST.md` — final production checklist

## Environment

Copy `.env.example` to `.env` and fill in your real production values.

## License

MIT
