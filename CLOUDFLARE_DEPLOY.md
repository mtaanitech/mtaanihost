# CLOUDFLARE_DEPLOY.md

# Cloudflare Deployment Guide

## Frontend to Cloudflare Pages

1. Go to Cloudflare
2. Workers & Pages
3. Create application
4. Pages > Upload assets
5. Upload the contents of the `public/` folder
6. Project name: `mtaanihost-frontend`

Expected URL:

```text
https://mtaanihost-frontend.youraccount.pages.dev
```

## Worker to Cloudflare Workers

1. Install Wrangler:

```bash
npm install -g wrangler
```

2. Login:

```bash
wrangler login
```

3. Deploy worker:

```bash
cd workers
wrangler deploy
```

Expected URL:

```text
https://mtaanihost-webhook.youraccount.workers.dev
```

## Frontend API URL

Update `public/index.html` and `public/admin.html` from:

```js
http://localhost:5000
```

to:

```js
https://mtaanihost-api.onrender.com
```

