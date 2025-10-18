# Fix "Invalid API Key" Google OAuth Error

The "Invalid API key" error happens because Google OAuth is not properly configured in your Supabase project.

## Step-by-Step Fix:

### Part 1: Get Google OAuth Credentials

1. **Go to Google Cloud Console**: https://console.cloud.google.com/

2. **Select or Create a Project**:
   - Click the project dropdown at the top
   - Select your existing RecruitBridge project OR create a new one

3. **Enable Google+ API** (Required for OAuth):
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API"
   - Click it and press "ENABLE"

4. **Create OAuth 2.0 Credentials**:
   - Go to "APIs & Services" → "Credentials"
   - Click "CREATE CREDENTIALS" → "OAuth client ID"
   - If prompted, configure the OAuth consent screen first:
     - User Type: **External**
     - App name: **RecruitBridge**
     - User support email: Your email
     - Developer contact: Your email
     - Click **Save and Continue** through all steps

5. **Configure OAuth Client**:
   - Application type: **Web application**
   - Name: **RecruitBridge Web Client**

   **Authorized JavaScript origins**:
   ```
   https://frabthrbowszsqsjykmy.supabase.co
   https://www.recruitbridge.app
   http://localhost:5173
   ```

   **Authorized redirect URIs**:
   ```
   https://frabthrbowszsqsjykmy.supabase.co/auth/v1/callback
   https://www.recruitbridge.app/dashboard
   http://localhost:5173/dashboard
   ```

6. **Copy Your Credentials**:
   - After creating, you'll see a modal with:
     - **Client ID**: Something like `123456789-abcdefg.apps.googleusercontent.com`
     - **Client Secret**: Something like `GOCSPX-xxxxxxxxxxxx`
   - **SAVE THESE!** You'll need them for Supabase

---

### Part 2: Configure Supabase

1. **Go to Supabase Dashboard**: https://supabase.com/dashboard

2. **Select Your Project**: `frabthrbowszsqsjykmy`

3. **Navigate to Authentication**:
   - Click "Authentication" in the left sidebar
   - Click "Providers" tab

4. **Enable Google Provider**:
   - Find "Google" in the list
   - Toggle it **ON** (switch to enabled)

5. **Enter Google Credentials**:
   - **Client ID**: Paste from Google Cloud Console
   - **Client Secret**: Paste from Google Cloud Console
   - Click **Save**

6. **Configure URL Settings**:
   - Still in Authentication, go to "URL Configuration"
   - Set **Site URL**: `https://www.recruitbridge.app`
   - Add **Redirect URLs**:
     ```
     https://www.recruitbridge.app/dashboard
     http://localhost:5173/dashboard
     ```
   - Click **Save**

---

### Part 3: Verify Configuration

1. **Test Locally**:
   ```bash
   cd /Users/davidskids/Projects/RecruitBridge
   npm run dev
   ```

2. **Open Browser**: http://localhost:5173/login

3. **Click "Continue with Google"**:
   - Should open Google login popup
   - Select your Google account
   - Should redirect to /dashboard after successful login

4. **Check Browser Console** (F12):
   - Look for any errors
   - If you see "Invalid API key", the credentials are still wrong

---

## Common Issues & Solutions:

### Issue 1: "Invalid API key"
**Cause**: Google OAuth credentials not set in Supabase
**Fix**: Make sure you completed Part 2 and clicked Save

### Issue 2: "Redirect URI mismatch"
**Cause**: The redirect URI in Google Cloud Console doesn't match Supabase callback URL
**Fix**: Add exactly this to Google Cloud Console:
```
https://frabthrbowszsqsjykmy.supabase.co/auth/v1/callback
```

### Issue 3: "Access blocked: This app's request is invalid"
**Cause**: OAuth consent screen not configured
**Fix**: Complete the OAuth consent screen in Google Cloud Console

### Issue 4: Works locally but not in production
**Cause**: Production URL not added to authorized origins
**Fix**: Add `https://www.recruitbridge.app` to both:
- Authorized JavaScript origins (Google)
- Redirect URLs (Supabase)

---

## Quick Test Command:

After configuration, test the Supabase connection:

```bash
cd /Users/davidskids/Projects/RecruitBridge
node -e "
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  'https://frabthrbowszsqsjykmy.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZyYWJ0aHJib3dzenNxc2p5a215Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2Mjk5MTIsImV4cCI6MjA3NjIwNTkxMn0.Lw_vt8PId8AtX4ZVijVbyR1VWuh1r9gMb4-cvwxChCw'
);
console.log('Supabase client created successfully!');
"
```

If this runs without errors, your Supabase connection works!

---

## Still Having Issues?

1. **Check Supabase Logs**:
   - Go to Supabase Dashboard → Logs → Auth
   - Look for error messages when you try to log in

2. **Check Browser Network Tab**:
   - Open DevTools (F12) → Network tab
   - Click "Continue with Google"
   - Look for failed requests (red)
   - Click them to see error details

3. **Verify Environment Variables**:
   ```bash
   cat .env.local
   ```
   Should show:
   ```
   VITE_SUPABASE_URL=https://frabthrbowszsqsjykmy.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGci...
   ```

4. **Clear Browser Cache**:
   - Sometimes old OAuth tokens cause issues
   - Try in Incognito/Private mode

---

## Need Help?

Send me:
1. Screenshot of Google Cloud Console OAuth credentials page
2. Screenshot of Supabase Authentication → Providers → Google settings
3. Full error message from browser console

I'll help you debug further!
