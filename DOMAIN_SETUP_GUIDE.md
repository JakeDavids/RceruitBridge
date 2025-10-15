# RecruitBridge Domain Configuration & SSL Fix Guide

## ✅ Code Verification Complete

All code is correctly configured:
- ✅ `vercel.json` has proper redirects to `www.recruitbridge.app`
- ✅ `Landing.jsx` CTAs point to `www.recruitbridge.app/signup`, `/login`, `/dashboard`
- ✅ No old `app.recruitbridge.net` or `base44.app` URLs found in codebase
- ✅ Latest commits pushed to GitHub

---

## 🚀 Vercel Configuration Steps (Manual)

Since I cannot directly access your Vercel dashboard, please follow these steps:

### Step 1: Configure App Project (`jadrb`)

**Go to: https://vercel.com/dashboard → Select `jadrb` project**

#### 1.1 Domain Configuration
Navigate to: **Settings → Domains**

**Required domains:**
1. `www.recruitbridge.app`
   - Should be set as **Production domain** (primary)
   - Status should show: ✅ **Valid Configuration**

2. `recruitbridge.app` (apex)
   - Should redirect to `https://www.recruitbridge.app`
   - Status should show: ✅ **Valid Configuration**

**If apex domain shows SSL issues:**
1. Click the domain → **Edit**
2. Click **Reissue Certificate**
3. Wait 2-5 minutes for SSL to provision
4. Refresh page - should show ✅ Valid Configuration

**If still failing:**
1. Click **Remove** on `recruitbridge.app`
2. Click **Add Domain** → Enter `recruitbridge.app`
3. Select **Redirect to www.recruitbridge.app**
4. Wait for SSL provisioning (2-5 minutes)

#### 1.2 Environment Variables
Navigate to: **Settings → Environment Variables**

**Add these variables for Production:**
```
NEXT_PUBLIC_APP_URL = https://www.recruitbridge.app
APP_PUBLIC_URL = https://www.recruitbridge.app
```

**Steps:**
1. Click **Add New**
2. Enter key: `NEXT_PUBLIC_APP_URL`
3. Enter value: `https://www.recruitbridge.app`
4. Select environment: **Production**
5. Click **Save**
6. Repeat for `APP_PUBLIC_URL`

#### 1.3 Redeploy
Navigate to: **Deployments → Latest deployment**
1. Click **...** menu
2. Click **Redeploy**
3. Select **Use existing Build Cache: NO** (clean build)
4. Click **Redeploy**

---

### Step 2: Configure Landing Page Project (`jadrb-landingpage`)

**Go to: https://vercel.com/dashboard → Select `jadrb-landingpage` project**

#### 2.1 Domain Configuration
Navigate to: **Settings → Domains**

**Required domains:**
1. `www.recruitbridge.net`
   - Should be set as **Production domain** (primary)
   - Status should show: ✅ **Valid Configuration**

2. `recruitbridge.net` (apex)
   - Should redirect to `https://www.recruitbridge.net`
   - Status should show: ✅ **Valid Configuration**

**If any SSL issues:** Follow same steps as Step 1.1

#### 2.2 Verify vercel.json
The repo already has correct `vercel.json` with redirects:
```json
{
  "redirects": [
    { "source": "/login", "destination": "https://www.recruitbridge.app/login" },
    { "source": "/signup", "destination": "https://www.recruitbridge.app/signup" },
    { "source": "/dashboard", "destination": "https://www.recruitbridge.app/dashboard" },
    { "source": "/app", "destination": "https://www.recruitbridge.app" }
  ]
}
```

#### 2.3 Redeploy
Navigate to: **Deployments → Latest deployment**
1. Click **...** menu
2. Click **Redeploy**
3. Select **Use existing Build Cache: NO** (clean build)
4. Click **Redeploy**

---

## 🧪 Testing Checklist

After both projects are deployed, test these URLs:

### App Domain (.app)
- [ ] `https://recruitbridge.app` → Should redirect to `https://www.recruitbridge.app` (301/302)
  - ✅ Should show lock icon (SSL valid)
  - ✅ Should load without warnings

- [ ] `https://www.recruitbridge.app` → Should load the app
  - ✅ Should show lock icon (SSL valid)
  - ✅ Should load login page or redirect to Base44 auth
  - ✅ After Base44 login, should redirect to dashboard

- [ ] `https://www.recruitbridge.app/dashboard` → Should load dashboard
  - ✅ Should show lock icon (SSL valid)
  - ✅ Should require authentication

### Landing Domain (.net)
- [ ] `https://recruitbridge.net` → Should load landing page
  - ✅ Should show lock icon (SSL valid)
  - ✅ Should show RecruitBridge landing page

- [ ] `https://www.recruitbridge.net` → Should load landing page
  - ✅ Should show lock icon (SSL valid)

- [ ] `https://recruitbridge.net/login` → Should redirect to `https://www.recruitbridge.app/login`
  - ✅ Should happen automatically

- [ ] `https://recruitbridge.net/signup` → Should redirect to `https://www.recruitbridge.app/signup`
  - ✅ Should happen automatically

- [ ] `https://recruitbridge.net/dashboard` → Should redirect to `https://www.recruitbridge.app/dashboard`
  - ✅ Should happen automatically

### Landing Page CTAs
- [ ] Click "Get Started" button → Should go to `https://www.recruitbridge.app/signup`
- [ ] Click "Login" button (if present) → Should go to `https://www.recruitbridge.app/login`
- [ ] Click "Launch App" button → Should go to `https://www.recruitbridge.app/dashboard`

### Base44 Authentication Flow
- [ ] Visit `https://www.recruitbridge.app`
- [ ] Click login → Should trigger Base44 Google OAuth
- [ ] After successful login → Should redirect to `https://www.recruitbridge.app/dashboard`
- [ ] Should NOT redirect to any `base44.app` URLs
- [ ] Should NOT show any SSL warnings

---

## 🔧 Troubleshooting

### SSL Certificate Not Provisioning
**Symptoms:** Domain shows "Invalid Configuration" or SSL warning

**Solution:**
1. Go to Vercel → Project → Settings → Domains
2. Click the problematic domain
3. Click **Edit** → **Reissue Certificate**
4. Wait 5 minutes
5. If still failing:
   - Remove domain completely
   - Re-add domain
   - Wait for SSL provisioning (can take up to 10 minutes)
   - Check GoDaddy DNS records are correct

### Apex Domain Not Redirecting
**Symptoms:** `recruitbridge.app` loads but doesn't redirect to `www`

**Solution:**
1. Go to Vercel → Project → Settings → Domains
2. Remove `recruitbridge.app` domain
3. Re-add it
4. When prompted, select **"Redirect to www.recruitbridge.app"**
5. Wait for propagation (2-5 minutes)

### Environment Variables Not Taking Effect
**Symptoms:** App still using old URLs

**Solution:**
1. Verify environment variables are set for **Production** environment
2. Trigger a **clean redeploy** (disable build cache)
3. Clear browser cache
4. Test in incognito window

### Vercel Redirects Not Working
**Symptoms:** `recruitbridge.net/login` doesn't redirect to app

**Solution:**
1. Verify `vercel.json` is in the root of the repository
2. Check it's committed and pushed to GitHub
3. Trigger a redeploy
4. Check Vercel build logs for any errors about vercel.json

---

## 📊 Expected Final State

### Domain Configuration
```
recruitbridge.app (apex)
  ↓ (301 redirect)
www.recruitbridge.app (Production) ← Main app loads here
  - SSL: ✅ Valid
  - Loads: Dashboard/Login

recruitbridge.net (apex)
  ↓ (may redirect to www)
www.recruitbridge.net (Production) ← Landing page loads here
  - SSL: ✅ Valid
  - Loads: Landing page
  - /login → redirects to www.recruitbridge.app/login
  - /signup → redirects to www.recruitbridge.app/signup
  - /dashboard → redirects to www.recruitbridge.app/dashboard
```

### User Flows
1. **New User:**
   - Visits `recruitbridge.net` → Sees landing page
   - Clicks "Get Started" → Goes to `www.recruitbridge.app/signup`
   - Signs up via Base44 → Redirected to `www.recruitbridge.app/dashboard`

2. **Existing User:**
   - Types `recruitbridge.app` → Redirects to `www.recruitbridge.app`
   - Logs in via Base44 → Redirected to `www.recruitbridge.app/dashboard`

3. **Direct Access:**
   - Types `recruitbridge.net/login` → Redirects to `www.recruitbridge.app/login`

---

## ✅ Final Verification Checklist

After completing all Vercel configurations and redeployments:

- [ ] ✅ `recruitbridge.app` → redirects to `www` with SSL
- [ ] ✅ `www.recruitbridge.app` → SSL valid, app loads
- [ ] ✅ `recruitbridge.net` → SSL valid, landing page loads
- [ ] ✅ `www.recruitbridge.net` → SSL valid, landing page loads
- [ ] ✅ `recruitbridge.net/login` → redirects to app login
- [ ] ✅ `recruitbridge.net/signup` → redirects to app signup
- [ ] ✅ `recruitbridge.net/dashboard` → redirects to app dashboard
- [ ] ✅ Base44 login → redirects to `www.recruitbridge.app/dashboard`
- [ ] ✅ No SSL warnings on any domain
- [ ] ✅ No `base44.app` URLs visible to users
- [ ] ✅ No `app.recruitbridge.net` URLs in use

---

## 🎯 Summary

**What's already done (in code):**
- ✅ All CTA buttons updated to use `www.recruitbridge.app`
- ✅ `vercel.json` configured with proper redirects
- ✅ No old URLs in codebase
- ✅ Latest code committed and pushed to GitHub

**What you need to do (in Vercel):**
1. Configure domains in both projects (ensure apex redirects to www)
2. Add environment variables to app project
3. Reissue SSL certificates if needed
4. Trigger clean redeployments of both projects
5. Test all URLs from checklist above

**Result:**
- Users can access the app at `www.recruitbridge.app`
- Landing page at `recruitbridge.net` redirects users to the app
- All SSL certificates valid
- No warnings or broken links
