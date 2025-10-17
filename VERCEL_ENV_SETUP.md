# ⚡ Vercel Environment Variables Setup (2 MINUTES)

## 🚨 DO THIS NOW - APP WON'T WORK WITHOUT IT!

Your app just deployed but it can't connect to Supabase yet. Follow these exact steps:

---

## Step 1: Go to Vercel Dashboard

1. Open: **https://vercel.com**
2. Find your **RecruitBridge** project
3. Click on it

---

## Step 2: Go to Settings → Environment Variables

1. Click **Settings** tab (top of page)
2. Click **Environment Variables** in left sidebar

---

## Step 3: Add These THREE Variables

Click **"Add New"** for each of these:

### Variable 1:
```
Name: VITE_SUPABASE_URL
Value: https://frabthrbowszsqsjykmy.supabase.co
Environment: Production, Preview, Development (select all 3)
```
Click **Save**

### Variable 2:
```
Name: VITE_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZyYWJ0aHJib3dzenNxc2p5a215Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2Mjk5MTIsImV4cCI6MjA3NjIwNTkxMn0.Lw_vt8PId8AtX4ZVijVbyR1VWuh1r9gMb4-cvwxChCw
Environment: Production, Preview, Development (select all 3)
```
Click **Save**

### Variable 3:
```
Name: SUPABASE_SERVICE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZyYWJ0aHJib3dzenNxc2p5a215Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDYyOTkxMiwiZXhwIjoyMDc2MjA1OTEyfQ.DPzrbi_XbAZBs4cG97uUGvQGgmQf7CED5p3dty0sgUM
Environment: Production, Preview, Development (select all 3)
```
Click **Save**

---

## Step 4: Redeploy

1. Go back to **Deployments** tab
2. Find the latest deployment
3. Click the **...** menu (3 dots)
4. Click **Redeploy**
5. Confirm redeploy

**OR** just push any change to GitHub and it will auto-deploy.

---

## ✅ Done!

After redeployment (takes ~2 minutes):

1. Visit **https://www.recruitbridge.app**
2. You should see the landing page
3. Click **"Start Free"** or **"Get Started"**
4. You'll see "Redirecting to sign in..."
5. Google OAuth screen should appear!

---

## 🔧 If It Still Doesn't Work

### Issue: "Missing Supabase credentials" error
- **Check**: Make sure all 3 env vars are added to Vercel
- **Check**: Make sure you redeployed after adding them
- **Check**: Wait 2-3 minutes for deployment to complete

### Issue: Google OAuth not configured
- **This is expected!** Follow `GOOGLE_OAUTH_SETUP.md` to set up Google sign-in
- Until Google OAuth is configured, you'll get a Supabase error when clicking "Start Free"
- But the flow is working correctly!

---

## 📋 Quick Checklist

- [ ] Added VITE_SUPABASE_URL to Vercel
- [ ] Added VITE_SUPABASE_ANON_KEY to Vercel
- [ ] Added SUPABASE_SERVICE_KEY to Vercel
- [ ] Selected all 3 environments (Production, Preview, Development) for each
- [ ] Redeployed from Vercel dashboard
- [ ] Waited 2-3 minutes for deployment
- [ ] Tested https://www.recruitbridge.app

---

## 🎯 Next Steps After This

1. ✅ **Complete this (Vercel env vars)** ← YOU ARE HERE
2. **Set up Google OAuth** (follow `GOOGLE_OAUTH_SETUP.md`)
3. **Create storage bucket** (for profile pictures)
4. **Test full login flow**
5. **Import schools data** (optional - follow `CSV_IMPORT_GUIDE.md`)

---

**Time to complete: 2 minutes**

**Let me know when you've added the env vars and I'll help with Google OAuth next!**
