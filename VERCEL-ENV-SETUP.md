# 🔧 VERCEL ENVIRONMENT VARIABLES - EXACT SETUP

## ⚠️ CRITICAL: Your production auth is failing because Vercel env vars are not set correctly

The error `AuthApiError: Invalid API key` means Supabase client is getting `undefined` for the API keys.

---

## ✅ STEP-BY-STEP FIX:

### 1. Go to Vercel Project Settings
**URL:** https://vercel.com/jakedavids-projects/recruitbridge/settings/environment-variables

### 2. DELETE these old variables (if they exist):
- ❌ `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- ❌ `NEXT_PUBLIC_SUPABASE_URL`
- ❌ `NEXT_PUBLIC_APP_URL`
- ❌ `SUPABASE_JWT_SECRET`
- ❌ `APP_PUBLIC_URL`

### 3. ADD these 4 variables (click "Add" for each):

#### Variable 1:
```
Key: VITE_SUPABASE_URL
Value: https://frabthrbowszsqsjykmy.supabase.co
Environments: ✅ Production  ✅ Preview  ✅ Development
```

#### Variable 2:
```
Key: VITE_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZyYWJ0aHJib3dzenNxc2p5a215Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2Mjk5MTIsImV4cCI6MjA3NjIwNTkxMn0.Lw_vt8PId8AtX4ZVijVbyR1VWuh1r9gMb4-cvwxChCw
Environments: ✅ Production  ✅ Preview  ✅ Development
```

#### Variable 3:
```
Key: SUPABASE_SERVICE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZyYWJ0aHJib3dzenNxc2p5a215Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDYyOTkxMiwiZXhwIjoyMDc2MjA1OTEyfQ.DPzrbi_XbAZBs4cG97uUGvQGgmQf7CED5p3dty0sgUM
Environments: ✅ Production  ✅ Preview  ✅ Development

⚠️ DO NOT add VITE_ prefix to this one!
```

#### Variable 4:
```
Key: VITE_APP_MODE
Value: app
Environments: ✅ Production  ✅ Preview  ✅ Development
```

### 4. Click "Save" for each variable

### 5. IMPORTANT: Redeploy
After adding all variables, you MUST redeploy:
- Go to: https://vercel.com/jakedavids-projects/recruitbridge/deployments
- Click the "..." menu on the latest deployment
- Click "Redeploy"
- Wait for deployment to finish (2-3 minutes)

---

## 🧪 TEST AFTER REDEPLOYMENT:

1. Clear browser cache (Ctrl+Shift+Delete)
2. Go to: https://www.recruitbridge.app/login
3. Try logging in
4. Should work without "Invalid API key" error

---

## 🔍 HOW TO VERIFY ENV VARS ARE SET:

After redeployment, check the build logs:
1. Go to deployment page
2. Click on the deployment
3. Look at "Building" logs
4. Should see: "✓ Environment variables loaded"

If you don't see env vars loaded, they weren't set correctly.

---

## ⚠️ COMMON MISTAKES:

1. **Adding VITE_ prefix to SERVICE_KEY** - DON'T! Only ANON_KEY and URL need VITE_ prefix
2. **Not checking all 3 environment checkboxes** - Must check Production, Preview, AND Development
3. **Not redeploying after adding vars** - Vercel won't use new vars until you redeploy
4. **Having old NEXT_PUBLIC_ vars** - Delete them, they conflict with VITE_ vars

---

## 📧 FOR LANDING PAGE (recruitbridge.net):

If you have a separate Vercel project for the landing page:
- Landing page is static and doesn't need Supabase keys
- The `transformStyle: 'preserve-3d'` error is a Framer Motion issue
- That's a separate issue from auth

---

## ✅ FINAL CHECKLIST:

- [ ] Deleted all NEXT_PUBLIC_ environment variables
- [ ] Added VITE_SUPABASE_URL with correct value
- [ ] Added VITE_SUPABASE_ANON_KEY with correct value
- [ ] Added SUPABASE_SERVICE_KEY (NO VITE_ PREFIX) with correct value
- [ ] Added VITE_APP_MODE=app
- [ ] Checked all 3 environments for each variable
- [ ] Clicked "Save" for each variable
- [ ] Triggered a redeploy
- [ ] Waited for deployment to complete
- [ ] Tested login at https://www.recruitbridge.app/login

---

**Once you complete these steps, production auth will work!**
