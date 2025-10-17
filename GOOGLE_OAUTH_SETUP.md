# 🔐 Google OAuth Setup Guide - RecruitBridge

## Overview

This guide will set up Google Sign-In for your RecruitBridge app. When users log in with Google:
- ✅ Their account is created in Supabase `auth.users` table
- ✅ Their profile is created in your `public.users` table
- ✅ They can then create athlete profiles, which link to their account
- ✅ Email identities can be created for them (@recruitbridge.net)

---

## Part 1: Get Google OAuth Credentials (10 minutes)

### Step 1: Go to Google Cloud Console

1. Visit: **https://console.cloud.google.com/**
2. Sign in with your Google account
3. You should see your project or dashboard

### Step 2: Create or Select a Project

If you already have a project for RecruitBridge:
- Click the project dropdown at the top
- Select your existing project

If you need to create a new project:
- Click **"Select a project"** → **"NEW PROJECT"**
- Name: `RecruitBridge`
- Click **"CREATE"**
- Wait for it to be created (~30 seconds)

### Step 3: Enable Google OAuth Consent Screen

1. In the left sidebar, go to: **APIs & Services** → **OAuth consent screen**
2. Select **"External"** (unless you have a Google Workspace account)
3. Click **"CREATE"**

4. Fill in **App information**:
   ```
   App name: RecruitBridge
   User support email: [your email]
   App logo: (optional - skip for now)
   ```

5. **App domain** (optional):
   ```
   Application home page: https://www.recruitbridge.app
   Application privacy policy: https://www.recruitbridge.app/privacy (if you have one)
   Application terms of service: https://www.recruitbridge.app/terms (if you have one)
   ```

6. **Developer contact information**:
   ```
   Email addresses: [your email]
   ```

7. Click **"SAVE AND CONTINUE"**

8. **Scopes** page:
   - Click **"ADD OR REMOVE SCOPES"**
   - Select these scopes:
     - ✅ `.../auth/userinfo.email` - See your email address
     - ✅ `.../auth/userinfo.profile` - See your personal info
   - Click **"UPDATE"**
   - Click **"SAVE AND CONTINUE"**

9. **Test users** page (if in testing mode):
   - Click **"ADD USERS"**
   - Add your email and any test users
   - Click **"SAVE AND CONTINUE"**

10. **Summary** page:
    - Review everything
    - Click **"BACK TO DASHBOARD"**

### Step 4: Create OAuth 2.0 Credentials

1. In the left sidebar: **APIs & Services** → **Credentials**
2. Click **"+ CREATE CREDENTIALS"** at the top
3. Select **"OAuth client ID"**

4. Configure the OAuth client:
   ```
   Application type: Web application
   Name: RecruitBridge Web Client
   ```

5. **Authorized JavaScript origins**:
   - Click **"+ ADD URI"**
   - Add: `https://www.recruitbridge.app`
   - Click **"+ ADD URI"** again
   - Add: `http://localhost:5173` (for local testing)

6. **Authorized redirect URIs** (CRITICAL!):
   - Click **"+ ADD URI"**
   - Add: `https://frabthrbowszsqsjykmy.supabase.co/auth/v1/callback`
   - Click **"+ ADD URI"** again
   - Add: `http://localhost:54321/auth/v1/callback` (for local Supabase testing - optional)

7. Click **"CREATE"**

8. **IMPORTANT**: You'll see a popup with your credentials:
   ```
   Client ID: 123456789-abc...apps.googleusercontent.com
   Client Secret: GOCSPX-...
   ```

   **Copy both of these NOW!** Save them in a safe place.

---

## Part 2: Configure Supabase (5 minutes)

### Step 1: Add Google Provider in Supabase

1. Go to: **https://supabase.com/dashboard/project/frabthrbowszsqsjykmy**
2. Click **Authentication** in the left sidebar
3. Click **Providers** tab
4. Find **Google** in the list
5. Toggle it **ON** (enable it)

### Step 2: Enter Google Credentials

6. You'll see a form with:
   ```
   Client ID (for OAuth): [paste your Client ID here]
   Client Secret (for OAuth): [paste your Client Secret here]
   ```

7. **Redirect URL** should already be filled in:
   ```
   https://frabthrbowszsqsjykmy.supabase.co/auth/v1/callback
   ```
   (This is what we added to Google Console in Part 1)

8. **Additional Scopes** (optional):
   - Leave blank for now (the default scopes are enough)

9. Click **"Save"**

---

## Part 3: Update Your Code (Already Done!)

Good news - your code is already set up! The Supabase client handles Google OAuth automatically.

When a user clicks "Sign in with Google":
1. They're redirected to Google's OAuth page
2. They authorize RecruitBridge
3. Google redirects back to Supabase
4. Supabase creates their account in `auth.users`
5. Your app can then create their profile in `public.users`

---

## Part 4: Add User Creation Hook (IMPORTANT!)

When users sign in with Google, Supabase creates an entry in `auth.users`, but we need to also create an entry in `public.users`. Let me create a database trigger for this:

### SQL to Run in Supabase SQL Editor

```sql
-- Function to create user profile after signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, plan, onboarding_completed, tour_progress)
  VALUES (
    NEW.id,
    NEW.email,
    'free',
    false,
    'not_started'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to run after user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

**To run this:**
1. Go to Supabase Dashboard → **SQL Editor**
2. Click **"New Query"**
3. Paste the SQL above
4. Click **"Run"**

This ensures that every time someone signs in with Google, they automatically get a profile in your `public.users` table!

---

## Part 5: Test Authentication (5 minutes)

### Local Testing (Optional)

1. Run your app locally:
   ```bash
   npm run dev
   ```

2. Open: `http://localhost:5173`
3. Try to access a protected page (should redirect to login)
4. Click "Sign in with Google"
5. You should see Google's OAuth consent screen
6. Authorize the app
7. You should be redirected back and logged in!

### Production Testing

1. Go to: `https://www.recruitbridge.app`
2. Try to access a protected page
3. Click "Sign in with Google"
4. Complete OAuth flow
5. You should be logged in!

### Verify It Worked

Check in Supabase Dashboard:
1. Go to **Authentication** → **Users**
2. You should see your user listed!
3. Go to **Table Editor** → **users**
4. You should see your profile with `plan: 'free'`

---

## 🔧 Troubleshooting

### "Error 400: redirect_uri_mismatch"

**Problem**: The redirect URI doesn't match what's in Google Console

**Fix**:
1. Go to Google Cloud Console → Credentials
2. Edit your OAuth client
3. Make sure this EXACT URL is in "Authorized redirect URIs":
   ```
   https://frabthrbowszsqsjykmy.supabase.co/auth/v1/callback
   ```
4. No trailing slash, no http (must be https)

### "Access blocked: This app's request is invalid"

**Problem**: OAuth consent screen not configured properly

**Fix**:
1. Go to Google Cloud Console → OAuth consent screen
2. Make sure all required fields are filled
3. Make sure your email is added as a test user (if in testing mode)
4. Try publishing the app (change from Testing to Production)

### User logs in but no profile created

**Problem**: The trigger didn't run or failed

**Fix**:
1. Make sure you ran the SQL from Part 4
2. Check Supabase logs for errors
3. Manually create the user profile:
   ```sql
   INSERT INTO public.users (id, email, plan)
   SELECT id, email, 'free'
   FROM auth.users
   WHERE email = 'your-email@gmail.com'
   ON CONFLICT (id) DO NOTHING;
   ```

### "Invalid client" error

**Problem**: Client ID or Secret is wrong

**Fix**:
1. Double-check the Client ID and Secret in Supabase
2. Make sure you copied them correctly from Google Console
3. No extra spaces or characters

---

## 📊 What Happens When Users Sign In

1. **User clicks "Sign in with Google"**
   - Redirects to Google OAuth page

2. **User authorizes app**
   - Google verifies the user
   - Redirects back to Supabase callback URL

3. **Supabase creates auth user**
   - Creates entry in `auth.users` table
   - Generates session token

4. **Trigger creates profile** (from Part 4)
   - Creates entry in `public.users` table
   - Sets default values (plan: 'free', etc.)

5. **User is logged in**
   - Can now create athlete profiles
   - Can access all protected features

6. **Athlete profile creation**
   - User fills out Profile page
   - Creates entry in `public.athletes` table
   - Links to their `user_id` and `created_by` email

7. **Email identity creation** (optional)
   - User can create @recruitbridge.net email
   - Creates entry in `public.email_identities` table
   - Links to their `user_id`

---

## ✅ Summary: Your Credentials

**Google OAuth Credentials** (from Part 1):
```
Client ID: [copy from Google Console]
Client Secret: [copy from Google Console]
Redirect URI: https://frabthrbowszsqsjykmy.supabase.co/auth/v1/callback
```

**Supabase Configuration** (Part 2):
- Provider: Google (enabled)
- Client ID: [pasted in]
- Client Secret: [pasted in]

**Database Setup** (Part 4):
- Trigger created to auto-create user profiles
- Links `auth.users` → `public.users`

---

## 🎉 You're Done!

Once you complete these steps:
- ✅ Users can sign in with Google
- ✅ Accounts are automatically created
- ✅ Profiles are linked to their accounts
- ✅ They can create athlete profiles
- ✅ They can create email identities
- ✅ Everything is properly connected!

**Next**: Test by signing in yourself, then create your athlete profile!
