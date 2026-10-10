# FINAL_CHECKLIST.md

# Final Production Checklist

## Required credentials

- [ ] GitHub token
- [ ] Render token
- [ ] Cloudflare token
- [ ] Cloudflare account ID
- [ ] Paystack live keys
- [ ] Gmail app password
- [ ] JWT secret
- [ ] Admin password hash

## Local run

- [ ] `npm install`
- [ ] `cp .env.example .env`
- [ ] `npm run dev`
- [ ] Test signup
- [ ] Test login
- [ ] Test admin

## Production deploy

- [ ] Deploy backend to Render
- [ ] Add env vars in Render
- [ ] Update frontend URLs to Render backend
- [ ] Deploy frontend to Cloudflare Pages
- [ ] Deploy worker to Cloudflare Workers
- [ ] Configure Paystack webhook
- [ ] Test live payment flow

## Security

- [ ] `.env` not committed
- [ ] all secrets stored securely
- [ ] strong admin password
- [ ] Gmail 2FA enabled
