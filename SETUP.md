# RecruitBridge Setup Instructions

## Current Issue: SSL Error on Login

### Problem
When users click "Get Started" on the landing page, they see:
```
ERR_SSL_VERSION_OR_CIPHER_MISMATCH
app.recruitbridge.net uses an unsupported protocol
```

### Root Cause
Base44's OAuth is configured to redirect to `app.recruitbridge.net`, but only `recruitbridge.net` is configured in Vercel.

### Solution (Choose One)

#### Option 1: Add app subdomain to Vercel (Recommended)
1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Click "Add Domain"
3. Enter `app.recruitbridge.net`
4. Follow Vercel's instructions to update DNS records at GoDaddy:
   - Add a CNAME record: `app` → `cname.vercel-dns.com`
5. Wait for DNS propagation (5-30 minutes)
6. Test by visiting `https://app.recruitbridge.net`

#### Option 2: Change Base44 OAuth URL
1. Log into Base44 dashboard
2. Go to your app settings → Authentication
3. Change OAuth redirect URL from `app.recruitbridge.net` to `recruitbridge.net`
4. Save changes
5. Test login on the landing page

### Temporary Workaround
Users can access the app directly by:
1. Going to the Base44-hosted version
2. Or manually navigating to `/Dashboard` after being on the landing page

## After Fixing Login
Once login works, the onboarding flow will:
1. Show landing page at `recruitbridge.net`
2. Click "Get Started" triggers Google OAuth
3. After login, redirect to Dashboard
4. Page-level guided tour starts (not modal walkthrough)
