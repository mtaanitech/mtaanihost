# Cloudflare Pages & Workers Setup

## Frontend Deployment to Cloudflare Pages

### Step 1: Upload to Pages
1. Go to cloudflare.com
2. Click "Workers & Pages"
3. Click "Create application"
4. Click "Pages"
5. Click "Upload assets"
6. Project name: `mtaanihost-frontend`
7. Upload all files from the `public/` folder
8. Deploy

You'll get a URL like:
```
https://mtaanihost-frontend.youraccount.pages.dev
```

### Step 2: Update Frontend URLs

Edit these files:
- `public/index.html`
- `public/admin.html`

Replace:
```js
http://localhost:5000
```

With:
```js
https://mtaanihost-api.onrender.com
```

Then redeploy to Cloudflare Pages.

---

## Worker Deployment

### Step 1: Install Wrangler
```bash
npm install -g wrangler
```

### Step 2: Login
```bash
wrangler login
```

### Step 3: Deploy Worker
```bash
cd workers
wrangler deploy
```

You'll get a URL like:
```
https://mtaanihost-webhook.yoursubdomain.workers.dev
```

Use this as your bot/webhook callback endpoint.

---

## Final URLs

After all deployments:

- **Backend API**: https://mtaanihost-api.onrender.com
- **Frontend**: https://mtaanihost-frontend.youraccount.pages.dev
- **Admin Panel**: https://mtaanihost-frontend.youraccount.pages.dev/admin
- **Webhook/Bot Callback**: https://mtaanihost-webhook.yoursubdomain.workers.dev

