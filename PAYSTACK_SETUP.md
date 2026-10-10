# PAYSTACK_SETUP.md

# Paystack Setup Guide

## 1. Get Live Keys

1. Go to Paystack dashboard
2. Settings > API Keys & Webhooks
3. Copy live keys:
   - `sk_live_...`
   - `pk_live_...`
4. Save the webhook secret too

## 2. Configure Webhook URL

Use:

```text
https://mtaanihost-api.onrender.com/paystack/webhook
```

## 3. Add to Production .env

```env
PAYSTACK_SECRET_KEY=sk_live_...
PAYSTACK_PUBLIC_KEY=pk_live_...
PAYSTACK_WEBHOOK_SECRET=your_webhook_secret
```

## 4. Test Payment Flow

```bash
curl -X POST https://mtaanihost-api.onrender.com/paystack/init \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","amount":200,"projectId":"demo-project","userId":"demo-user"}'
```

