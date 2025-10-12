# Two-App Setup Instructions

## Overview
Due to Base44's architecture limitations, we're implementing a two-app setup:
- **recruitbridge.net** → Landing page (static, no auth)
- **app.recruitbridge.net** → Full application (with Base44 auth)

## What I've Done (Code Changes)

✅ Updated `src/App.jsx` to check `VITE_APP_MODE` environment variable
✅ Updated `src/pages/Landing.jsx` to redirect to `https://app.recruitbridge.net`
✅ Updated `src/pages/index.jsx` (current landing) to redirect to app subdomain
✅ Removed all Base44/auth calls from landing pages

## What YOU Need to Do in Vercel

### Step 1: Create Landing Page Project

1. Go to https://vercel.com/dashboard
2. Click **"Add New..." → "Project"**
3. Select your `RecruitBridge` repository (same GitHub repo)
4. **Project Name**: `recruitbridge-landing` (or similar)
5. **BEFORE clicking Deploy**, configure:

   **Environment Variables** - Add:
   ```
   VITE_APP_MODE=landing
   ```

   **Build Settings** - Leave as:
   ```
   Build Command: npm run build
   Output Directory: dist
   ```

6. Click **Deploy**
7. After deployment finishes, go to **Settings → Domains**
8. Click **"Add"** and add these custom domains:
   - `recruitbridge.net`
   - `www.recruitbridge.net`

### Step 2: Update Your Current Project (Main App)

1. Go to your **EXISTING** Vercel project (the one currently deployed)
2. Go to **Settings → Domains**
3. **REMOVE** these domains:
   - `recruitbridge.net`
   - `www.recruitbridge.net`
4. **KEEP** this domain:
   - `app.recruitbridge.net`
5. Go to **Settings → Environment Variables**
6. Click **"Add New"**
7. Add:
   ```
   Variable: VITE_APP_MODE
   Value: app
   ```
8. Go to **Deployments** → Find latest deployment → Click **"..."** → **"Redeploy"**

### Step 3: Test the Setup

After DNS propagates (5-10 minutes):

1. Visit https://recruitbridge.net
   - Should show landing page
   - Click "Get Started" → redirects to app.recruitbridge.net

2. Visit https://app.recruitbridge.net
   - Should trigger Google OAuth
   - After login → shows Dashboard

## How It Works

### Landing Page (recruitbridge.net)
- Runs: `VITE_APP_MODE=landing`
- App.jsx checks mode and renders ONLY `Landing.jsx`
- No Base44 SDK, no auth
- All buttons redirect to `https://app.recruitbridge.net`

### Main App (app.recruitbridge.net)
- Runs: `VITE_APP_MODE=app` (or undefined)
- App.jsx renders full app with routing and auth
- Base44 SDK with `requiresAuth: true`
- OAuth redirects handled by Base44

## Troubleshooting

### "White screen" on recruitbridge.net
- Check environment variable is set: `VITE_APP_MODE=landing`
- Check in Vercel: Settings → Environment Variables
- Redeploy after adding the variable

### "Still redirecting to auth" on recruitbridge.net
- Make sure you're using the landing project, not the main app project
- Verify domains are assigned correctly:
  - Landing project has: recruitbridge.net, www.recruitbridge.net
  - Main project has: app.recruitbridge.net

### "Can't login" on app.recruitbridge.net
- Check Base44 dashboard OAuth settings
- Make sure redirect URI includes: https://app.recruitbridge.net

## Migration Note

This is the **only** solution that works with Base44's current architecture. Base44 support confirmed they don't support hybrid public/private pages on a single app.

If you want a single-app experience in the future, you'll need to migrate to:
- Supabase (recommended - similar to Base44 but more flexible)
- Firebase
- Custom backend
