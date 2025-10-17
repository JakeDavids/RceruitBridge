# 🚀 RecruitBridge Supabase Migration Guide

## Step 1: Create Supabase Project

1. Go to https://supabase.com
2. Sign up / Log in
3. Click "New Project"
4. Fill in:
   - **Project Name**: RecruitBridge
   - **Database Password**: (save this somewhere safe!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free tier is fine to start
5. Wait 2-3 minutes for project to provision

## Step 2: Get Your Credentials

Once project is ready:

1. Go to **Settings** → **API**
2. Copy these values (you'll need them):
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGc...` (long string)
   - **service_role key**: `eyJhbGc...` (even longer string - KEEP SECRET!)

## Step 3: Set Up Database Schema

1. Go to **SQL Editor** in Supabase dashboard
2. Click "New Query"
3. Copy and paste the SQL from `supabase-schema.sql` (we'll create this next)
4. Click "Run"

## Step 4: Configure Google OAuth

1. Go to **Authentication** → **Providers** in Supabase
2. Enable **Google** provider
3. You'll need to create Google OAuth credentials:
   - Go to https://console.cloud.google.com/
   - Create a new project (or use existing)
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URI: `https://YOUR_PROJECT.supabase.co/auth/v1/callback`
4. Copy Client ID and Client Secret back to Supabase

## Step 5: Set Up Row Level Security (RLS)

RLS policies will be included in the schema SQL file. They ensure:
- Users can only see their own data
- Athletes can only modify their own profiles
- Schools and Coaches data is read-only for all users

## Step 6: Install Supabase Client

```bash
npm install @supabase/supabase-js
```

## Step 7: Configure Environment Variables

Create `.env.local` file:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...your-anon-key...
```

Add to `.gitignore`:
```
.env.local
```

## Step 8: Replace Base44 Client

We'll create a new `supabaseClient.js` that matches the Base44 interface, so you won't need to change much code.

## Step 9: Export Data from Base44

We'll create a script to export all your existing data from Base44 to JSON files.

## Step 10: Import Data to Supabase

Use the Supabase dashboard or bulk import script to load your data.

---

## Next Steps

Once you complete steps 1-2 above, I'll generate:
1. Complete database schema SQL
2. Supabase client wrapper
3. Base44 data export script
4. Data import script
5. Migration checklist

**Are you ready to create the Supabase project now?**
