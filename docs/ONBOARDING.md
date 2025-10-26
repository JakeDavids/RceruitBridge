# Onboarding Guide: Supabase + Mailgun Integration

This guide will walk you through obtaining all required API keys and configuring them in Vercel.

## Prerequisites
- Supabase account and project
- Mailgun account with verified domain
- Vercel project deployed

---

## Step 1: Get Supabase Credentials

### 1.1 Get Project URL and Keys

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Click on your project
3. In the left sidebar, click **Settings** (gear icon at bottom)
4. Click **API** in the settings menu
5. You'll see three values:

   **Project URL:**
   - Copy the value under "Project URL"
   - Example: `https://abcdefghijklm.supabase.co`
   - This is your `SUPABASE_URL`

   **anon public key:**
   - Copy the value under "Project API keys" → "anon public"
   - Starts with `eyJ...`
   - This is your `SUPABASE_ANON_KEY`

   **service_role key:**
   - Copy the value under "Project API keys" → "service_role"
   - Starts with `eyJ...`
   - ⚠️ **KEEP THIS SECRET** - Never expose in client-side code
   - This is your `SUPABASE_SERVICE_ROLE`

### 1.2 Create the Contacts Table

1. In Supabase dashboard, click **SQL Editor** in the left sidebar
2. Click **New query**
3. Copy the SQL from `docs/SQL.md` and paste it
4. Click **Run** to create the `contacts` table

---

## Step 2: Get Mailgun Credentials

### 2.1 Get API Key

1. Go to [https://app.mailgun.com/](https://app.mailgun.com/)
2. Log in to your account
3. Click **Settings** in the left sidebar
4. Click **API Keys**
5. Copy the **Private API key**
   - Starts with `key-...` or similar
   - This is your `MAILGUN_API_KEY`

### 2.2 Get Domain

1. In Mailgun dashboard, click **Sending** → **Domains** in the left sidebar
2. You'll see your verified domain(s)
3. Copy your sending domain
   - Format: `mg.yourdomain.com` or `yourdomain.com`
   - This is your `MAILGUN_DOMAIN`

### 2.3 Set From Email

Choose the email address you want to send from:
- Format: `noreply@mg.yourdomain.com` or `support@yourdomain.com`
- This is your `MAIL_FROM`

---

## Step 3: Configure DNS for Mailgun

### 3.1 Required DNS Records

In your domain registrar's DNS settings (GoDaddy, Cloudflare, etc.), add these records:

**TXT Records (SPF + DKIM):**
```
Type: TXT
Name: @ (or your subdomain)
Value: v=spf1 include:mailgun.org ~all
TTL: 3600
```

```
Type: TXT
Name: smtp._domainkey.mg (provided by Mailgun)
Value: k=rsa; p=MIGfMA... (provided by Mailgun)
TTL: 3600
```

**MX Records:**
```
Type: MX
Name: mg (or @)
Priority: 10
Value: mxa.mailgun.org
TTL: 3600
```

```
Type: MX
Name: mg (or @)
Priority: 10
Value: mxb.mailgun.org
TTL: 3600
```

**CNAME Record (Tracking):**
```
Type: CNAME
Name: email.mg (provided by Mailgun)
Value: mailgun.org
TTL: 3600
```

### 3.2 Verify DNS

1. Wait 5-60 minutes for DNS propagation
2. In Mailgun dashboard → **Sending** → **Domains**
3. Click **Verify DNS Settings**
4. All records should show ✅ green checkmarks

---

## Step 4: Add Environment Variables to Vercel

### 4.1 Navigate to Environment Variables

1. Go to [https://vercel.com/dashboard](https://vercel.com/dashboard)
2. Click on your project (RceruitBridge)
3. Click **Settings** tab at the top
4. In the left sidebar, click **Environment Variables**

### 4.2 Add Each Variable

For each variable, click **Add New** and enter:

**Variable 1: SUPABASE_URL**
- Name: `SUPABASE_URL`
- Value: (paste your Supabase Project URL)
- Environment: Check all three boxes (Production, Preview, Development)
- Click **Save**

**Variable 2: SUPABASE_ANON_KEY**
- Name: `SUPABASE_ANON_KEY`
- Value: (paste your anon public key)
- Environment: Check all three boxes
- Click **Save**

**Variable 3: SUPABASE_SERVICE_ROLE**
- Name: `SUPABASE_SERVICE_ROLE`
- Value: (paste your service_role key)
- Environment: Check all three boxes
- Click **Save**

**Variable 4: MAILGUN_API_KEY**
- Name: `MAILGUN_API_KEY`
- Value: (paste your Private API key)
- Environment: Check all three boxes
- Click **Save**

**Variable 5: MAILGUN_DOMAIN**
- Name: `MAILGUN_DOMAIN`
- Value: (paste your domain, e.g., `mg.yourdomain.com`)
- Environment: Check all three boxes
- Click **Save**

**Variable 6: MAIL_FROM**
- Name: `MAIL_FROM`
- Value: (paste your from email, e.g., `noreply@mg.yourdomain.com`)
- Environment: Check all three boxes
- Click **Save**

### 4.3 Redeploy

1. After adding all variables, go to **Deployments** tab
2. Click on the most recent deployment
3. Click the **three dots (⋯)** menu in the top right
4. Click **Redeploy**
5. Wait for deployment to complete (~2 minutes)

---

## Step 5: Test the Endpoints

After redeployment, test both endpoints using curl commands (see `docs/VERIFY.md`).

If you get errors, check:
- Vercel deployment logs: **Deployments** → Click deployment → **Function Logs**
- All environment variables are set correctly (no typos)
- Supabase table exists (check SQL Editor)
- Mailgun domain is verified (green checkmarks)

---

## Troubleshooting

### "Missing Supabase configuration" error
- Check that `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE` are set in Vercel
- Verify no trailing spaces in values

### "Supabase insert failed" error
- Check that `contacts` table exists in Supabase
- Run the SQL from `docs/SQL.md` again
- Check table permissions in Supabase → **Authentication** → **Policies**

### "Missing Mailgun configuration" error
- Check that `MAILGUN_API_KEY`, `MAILGUN_DOMAIN`, and `MAIL_FROM` are set
- Verify no trailing spaces in values

### "Email send failed" error
- Check that Mailgun domain is verified (all DNS records green)
- Check API key is the **Private** key, not public key
- Check `MAIL_FROM` email uses your verified domain
- Check Mailgun logs: **Sending** → **Logs**

### "Method not allowed" error
- Ensure you're using POST, not GET
- Check curl command syntax

---

## Next Steps

Once everything is working:
1. Update the test UI at `/test` to match your brand
2. Integrate the endpoints into your main application
3. Add rate limiting (Vercel Edge Config or Redis)
4. Set up monitoring/alerts for failed emails
5. Review Mailgun sending limits for your plan
