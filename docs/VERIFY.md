# API Verification Guide

This document shows you how to test both API endpoints after deployment.

## Endpoints

Replace `YOUR_DOMAIN` with your actual Vercel deployment URL (e.g., `recruitbridge.app` or `your-project.vercel.app`).

### 1. Add Contact Endpoint

**URL:** `https://YOUR_DOMAIN/api/add-contact`

**Method:** `POST`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "test@example.com"
}
```

**Expected Success Response (200):**
```json
{
  "success": true,
  "message": "Contact added successfully",
  "id": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Expected Error Responses:**

400 - Missing/invalid email:
```json
{
  "error": "Valid email is required"
}
```

500 - Server configuration error:
```json
{
  "error": "Server configuration error"
}
```

---

### 2. Send Email Endpoint

**URL:** `https://YOUR_DOMAIN/api/send-email`

**Method:** `POST`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "to": "recipient@example.com",
  "subject": "Test Email from API",
  "text": "This is a test email sent via the API.",
  "html": "<p>This is a <strong>test email</strong> sent via the API.</p>"
}
```

**Note:** Either `text` or `html` is required (both are optional but at least one must be provided).

**Expected Success Response (200):**
```json
{
  "success": true,
  "message": "Email sent successfully",
  "id": "<20240101120000.1.ABCDEF@mg.yourdomain.com>"
}
```

**Expected Error Responses:**

400 - Missing required fields:
```json
{
  "error": "Missing required fields: to, subject, and either text or html"
}
```

500 - Email send failed:
```json
{
  "error": "Failed to send email",
  "details": "..."
}
```

---

## Testing with cURL

### Test Add Contact

```bash
curl -X POST https://YOUR_DOMAIN/api/add-contact \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

**Verify in Supabase:**
1. Go to Supabase dashboard
2. Click **Table Editor** → **contacts**
3. You should see the email you just added

---

### Test Send Email

```bash
curl -X POST https://YOUR_DOMAIN/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "to":"your-email@example.com",
    "subject":"Test from cURL",
    "text":"This is a test email sent via cURL"
  }'
```

**Verify Email:**
1. Check your inbox for the test email
2. Check spam folder if not in inbox
3. Check Mailgun logs: **Sending** → **Logs** in Mailgun dashboard

---

## Testing with Browser UI

1. Navigate to `https://YOUR_DOMAIN/test`
2. You'll see two forms:
   - **Test Add Contact**: Enter an email and click "Add Contact"
   - **Test Send Email**: Fill in recipient, subject, message and click "Send Email"
3. Status messages will appear below each form

---

## Viewing Logs in Vercel

If you encounter errors:

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on your project
3. Click **Deployments** tab
4. Click on the most recent deployment
5. Scroll down to **Function Logs**
6. You'll see real-time logs from your API endpoints

**What to look for:**
- "Contact added successfully" = working
- "Email sent successfully" = working
- "Missing Supabase configuration" = env vars not set
- "Missing Mailgun configuration" = env vars not set
- "Supabase insert failed" = table doesn't exist or permissions issue
- "Email send failed" = Mailgun domain not verified or wrong API key

---

## Testing Checklist

- [ ] Add Contact endpoint returns 200 with valid email
- [ ] Add Contact endpoint returns 400 with invalid email
- [ ] Contact appears in Supabase `contacts` table
- [ ] Send Email endpoint returns 200 with valid data
- [ ] Send Email endpoint returns 400 with missing fields
- [ ] Email arrives in inbox (check spam)
- [ ] Email shows in Mailgun logs with "Delivered" status
- [ ] Test UI at `/test` works for both forms
- [ ] Vercel function logs show success messages

---

## Common Issues

### Contact not appearing in Supabase
- Check that `contacts` table exists
- Check table policies allow inserts
- Check `SUPABASE_SERVICE_ROLE` is correct

### Email not received
- Check spam folder
- Check Mailgun logs for delivery status
- Check `MAILGUN_DOMAIN` matches verified domain
- Check `MAIL_FROM` uses verified domain
- Check DNS records are all verified (green checkmarks)

### 500 errors
- Check all env vars are set in Vercel
- Check for typos in env var names
- Check Vercel function logs for specific error messages
- Redeploy after adding/changing env vars

---

## Rate Limits

**Mailgun:**
- Free tier: 5,000 emails/month for 3 months, then 1,000/month
- Pay-as-you-go: Check your plan in Mailgun dashboard

**Vercel:**
- Hobby: 100,000 function invocations/month
- Pro: 1,000,000 function invocations/month

Monitor usage in respective dashboards.
