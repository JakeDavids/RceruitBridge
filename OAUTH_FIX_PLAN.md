# 🔴 OAUTH REDIRECT LOOP - ROOT CAUSE FOUND

## Problem Identified:

**Location**: `/src/pages/Layout.jsx` lines 100-102, 109-111

**Issue**: Using `window.location.href = '/Profile'` causes infinite redirect loop because:
1. User logs in via Google OAuth
2. Supabase redirects to `/dashboard`
3. Layout.jsx checks auth
4. Sees no onboarding_completed
5. Does `window.location.href = '/Profile'`
6. This triggers full page reload
7. Goes back to step 3 → **INFINITE LOOP**

## Additional Issues Found:

1. **Layout.jsx line 102**: `window.location.href` causes redirect loop
2. **Layout.jsx line 274**: Redirects non-authed users but doesn't check PUBLIC_PATHS properly
3. **Google Cloud Console**: Has unnecessary redirect URIs (`/auth/callback`, `/dashboard`)

## The Fix (3 Changes):

### Change 1: Fix Layout.jsx Redirects
- Replace `window.location.href` with `<Navigate>`
- Add proper loading state
- Fix PUBLIC_PATHS check

### Change 2: Fix Google Cloud Console Redirect URIs
REMOVE these URIs:
- ❌ `https://www.recruitbridge.app/auth/callback`
- ❌ `http://localhost:5173/auth/callback`
- ❌ `https://www.recruitbridge.app/dashboard`

KEEP only:
- ✅ `https://frabthrbowszsqsjykmy.supabase.co/auth/v1/callback`

### Change 3: Fix Supabase Site URL & Redirect URLs
In Supabase Dashboard → Authentication → URL Configuration:
- Site URL: `https://www.recruitbridge.app`
- Redirect URLs: Add both `/dashboard` and `/Profile`

## Why This Will Work:

1. Google OAuth only goes to Supabase callback (no confusion)
2. Supabase redirects to app with auth token in URL
3. Layout.jsx uses React Router Navigate (no page reload)
4. No more redirect loops!
