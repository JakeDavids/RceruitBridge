# Fix "Invalid API Key" Error - Google OAuth Setup

## The Problem
When you click "Continue with Google" and get **"Invalid API key"**, it means:
- Google Cloud Console OAuth credentials are either:
  1. Not created yet, OR
  2. Created but missing the correct redirect URIs

## The Solution (Step-by-Step)

### Step 1: Go to Google Cloud Console
Open: https://console.cloud.google.com/apis/credentials

### Step 2: Create or Edit OAuth 2.0 Client ID

**If you DON'T have an OAuth Client ID yet:**
1. Click **"CREATE CREDENTIALS"** button
2. Select **"OAuth client ID"**
3. Choose Application type: **"Web application"**
4. Name it: **"RecruitBridge"**

**If you ALREADY have an OAuth Client ID:**
1. Find it in the list (looks like "Web client 1" or "RecruitBridge")
2. Click the **pencil icon** (✏️) to edit it

### Step 3: Add Authorized JavaScript Origins

In the "Authorized JavaScript origins" section, add **EXACTLY** these 3 URLs:

```
https://frabthrbowszsqsjykmy.supabase.co
https://www.recruitbridge.app
http://localhost:5173
```

### Step 4: Add Authorized Redirect URIs

In the "Authorized redirect URIs" section, add **EXACTLY** these 4 URLs:

```
https://frabthrbowszsqsjykmy.supabase.co/auth/v1/callback
https://www.recruitbridge.app/dashboard
https://www.recruitbridge.app/auth/callback
http://localhost:5173/dashboard
```

### Step 5: Save and Copy Credentials

1. Click **"SAVE"** button at the bottom

2. After saving, you'll see:
   - **Client ID**: Something like `123456789-abc123xyz.apps.googleusercontent.com`
   - **Client Secret**: Something like `GOCSPX-abcdefghijklmnop`

3. **Click the copy button** (📋) next to each to copy them

### Step 6: Add Credentials to Supabase

1. Go to Supabase Dashboard: https://supabase.com/dashboard

2. Select your project: **frabthrbowszsqsjykmy**

3. Click **"Authentication"** in the left sidebar

4. Click **"Providers"** tab at the top

5. Scroll down and find **"Google"**

6. Toggle the switch to **ON** (enabled)

7. Paste your credentials:
   - **Client ID**: Paste from Google Cloud Console
   - **Client Secret**: Paste from Google Cloud Console

8. Click **"Save"** at the bottom

### Step 7: Test It

1. Start your development server:
   ```bash
   cd /Users/davidskids/Projects/RecruitBridge
   npm run dev
   ```

2. Open browser: http://localhost:5173/login

3. Click **"Continue with Google"**

4. You should see Google's login screen (NOT an error!)

5. Select your Google account

6. You should be redirected to the dashboard
