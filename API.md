# MtaaniHost API Documentation

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## Auth Endpoints

### POST /signup
Create a new user account

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Response:**
```json
{
  "message": "Account created. Check your email to verify your account."
}
```

**Note:** Password must be 8+ chars with uppercase, lowercase, and number.

---

### GET /verify-email
Verify email address (click link from email)

**Query Params:**
- `token` - verification token from email
- `email` - user email

**Response:** HTML page confirming verification

---

### POST /login
Login to account

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "emailVerified": true
  }
}
```

---

## Deploy Endpoints

### POST /deploy-website
Deploy a static website

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Form Data:**
- `projectName` - lowercase, alphanumeric and hyphens only
- `githubUrl` - (optional) GitHub repository URL
- `zipFile` - (optional) ZIP file containing website files

**Response:**
```json
{
  "message": "Website deployed successfully",
  "project": {
    "id": "uuid",
    "projectName": "mysite",
    "type": "website",
    "status": "active",
    "liveUrl": "https://mysite.mtaanitech.workers.dev",
    "expiresAt": "2024-10-17T00:00:00Z",
    "paymentStatus": "trial",
    "suspended": false
  }
}
```

---

### POST /deploy-bot
Deploy a bot

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Request:**
```json
{
  "projectName": "mybot",
  "botType": "meta",
  "credentials": {
    "token": "your_bot_token"
  }
}
```

**Bot Types:**
- `meta` - WhatsApp Meta Official API
- `baileys` - WhatsApp Baileys
- `telegram` - Telegram Bot API
- `discord` - Discord Bot

**Response:**
```json
{
  "message": "Bot deployed successfully",
  "project": {...},
  "bot": {
    "id": "uuid",
    "projectId": "uuid",
    "botType": "meta",
    "status": "running",
    "restarts": 0,
    "lastRestart": "2024-10-10T00:00:00Z"
  }
}
```

---

## Payment Endpoints

### POST /paystack/init
Initialize Paystack payment

**Request:**
```json
{
  "email": "user@example.com",
  "amount": 200,
  "projectId": "uuid",
  "userId": "uuid"
}
```

**Response:**
```json
{
  "authorization_url": "https://checkout.paystack.com/...",
  "reference": "paystack_reference_id"
}
```

---

### GET /paystack/verify
Verify payment

**Query Params:**
- `reference` - Paystack transaction reference

**Response:**
```json
{
  "message": "Payment verified successfully",
  "project": {
    "id": "uuid",
    "projectName": "mysite",
    "paymentStatus": "paid",
    "expiresAt": "2024-11-10T00:00:00Z"
  }
}
```

---

## Project Endpoints

### GET /projects/:id/status
Get project status

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response:**
```json
{
  "id": "uuid",
  "projectName": "mysite",
  "status": "active",
  "suspended": false,
  "expiresAt": "2024-10-17T00:00:00Z",
  "paymentStatus": "trial"
}
```

---

## Admin Endpoints

All admin endpoints require:
```
x-admin-key: your_admin_password
```

### GET /admin/projects
List all projects

**Response:**
```json
{
  "total": 5,
  "projects": [...]
}
```

---

### GET /admin/bots
List all bots

**Response:**
```json
[...array of bots...]
```

---

### GET /admin/audit-logs
Get last 50 audit logs

**Response:**
```json
[...array of logs...]
```

---

### PATCH /admin/projects/:id
Update project (suspend/extend)

**Request:**
```json
{
  "suspend": true,
  "addDays": 7
}
```

**Response:**
```json
{
  "message": "Project updated",
  "project": {...}
}
```

---

## Health Endpoint

### GET /health
Check API health

**Response:**
```json
{
  "ok": true,
  "service": "MtaaniHost"
}
```

---

## Error Responses

All errors return JSON with status code:

```json
{
  "message": "Error description",
  "error": "Optional error details"
}
```

**Common Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

