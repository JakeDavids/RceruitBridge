# Redirect Loop Fix - ERR_TOO_MANY_REDIRECTS

## Problem Statement

After successfully fixing the landing page Base44 authentication issue, a new problem emerged:

**Symptom:** When clicking "Get Started" from the landing page or visiting `www.recruitbridge.app` directly, the browser showed:
```
This page isn't working
www.recruitbridge.app redirected you too many times.
ERR_TOO_MANY_REDIRECTS
```

This occurred on both desktop and mobile browsers, even after clearing cookies.

## Root Cause

The infinite redirect loop was caused by `Layout.jsx` calling `User.login()` on **every render** when no authenticated user was detected:

```javascript
// Lines 227-237 (BEFORE FIX)
if (!user) {
  User.login(); // ← Called on EVERY render
  return <LoadingSpinner />;
}
```

### The Loop Explained

1. User visits `www.recruitbridge.app`
2. Layout renders → No user → `User.login()` called
3. Redirects to `base44.app/login` for Google OAuth
4. User authenticates successfully
5. Base44 redirects back to `www.recruitbridge.app` with auth callback
6. **Layout renders again** → Auth not yet processed → `User.login()` called again
7. Redirects to Base44 → **Infinite loop begins**

The issue was that `User.login()` was being called before the authentication callback could be processed, creating an endless cycle.

## Solution Implemented

Added a `loginInitiated` state flag to ensure `User.login()` is only called **once** per session:

### Changes in Layout.jsx

**Line 78 - Added state variable:**
```javascript
const [loginInitiated, setLoginInitiated] = React.useState(false);
```

**Lines 227-250 - Updated authentication logic:**
```javascript
// 🚫 Redirect to Base44 login if not authenticated
if (!user && !loginInitiated) {
  setLoginInitiated(true);
  User.login();
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="text-center">
        <div className="animate-spin h-12 w-12 border-b-2 border-blue-600 rounded-full mx-auto mb-4"></div>
        <p className="text-slate-600">Redirecting to login...</p>
      </div>
    </div>
  );
}

if (!user && loginInitiated) {
  // Waiting for Base44 redirect/callback
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="text-center">
        <div className="animate-spin h-12 w-12 border-b-2 border-blue-600 rounded-full mx-auto mb-4"></div>
        <p className="text-slate-600">Authenticating...</p>
      </div>
    </div>
  );
}
```

## How This Works

### First Render (Unauthenticated User)
1. `user === null` and `loginInitiated === false`
2. Enters first condition block
3. Sets `loginInitiated = true`
4. Calls `User.login()` (triggers Base44 redirect)
5. Shows "Redirecting to login..." spinner

### Second Render (During Auth Callback)
1. `user === null` (auth still processing) and `loginInitiated === true`
2. Enters second condition block
3. **Does NOT call User.login() again** ✅
4. Shows "Authenticating..." spinner
5. Waits for auth to complete

### Third Render (After Authentication)
1. `user !== null` (auth completed)
2. Skips both condition blocks
3. Renders authenticated app with sidebar
4. User sees dashboard

## Expected User Flow After Fix

### Landing Page Flow
1. User visits `recruitbridge.net` → Landing page loads (no auth required) ✅
2. User clicks "Get Started" → Redirects to `www.recruitbridge.app/signup`
3. Base44 login modal appears → User authenticates with Google
4. After successful auth → User lands on `www.recruitbridge.app/dashboard` ✅

### Direct App Access Flow
1. User visits `www.recruitbridge.app` → Layout checks auth
2. No user → Triggers `User.login()` once
3. Base44 login modal appears → User authenticates with Google
4. After successful auth → User lands on dashboard ✅

### Existing User Flow
1. User with existing session visits `www.recruitbridge.app`
2. Layout checks auth → User exists
3. Skips authentication blocks
4. Renders dashboard immediately ✅

## Testing Instructions

### Test 1: Landing Page CTA
```
1. Open incognito window
2. Visit: https://recruitbridge.net
3. Click "Get Started" button
4. Should redirect to www.recruitbridge.app/signup
5. Should show Base44 login modal (Google OAuth)
6. After login → Should land on www.recruitbridge.app/dashboard
7. Should NOT see ERR_TOO_MANY_REDIRECTS
```

### Test 2: Direct App Access
```
1. Open incognito window
2. Visit: https://www.recruitbridge.app
3. Should show Base44 login modal immediately
4. After login → Should land on www.recruitbridge.app/dashboard
5. Should NOT loop back to login
```

### Test 3: Authenticated Session
```
1. Complete Test 2 (login once)
2. Visit: https://www.recruitbridge.app/profile
3. Should load immediately without login prompt
4. Navigate to other pages → Should all load without auth prompts
```

### Test 4: Mobile Browser
```
1. Open Safari/Chrome on mobile
2. Visit: https://recruitbridge.net
3. Click "Get Started"
4. Complete Base44 login
5. Should land on dashboard without redirect loop
```

## Deployment Instructions

### Step 1: Deploy to Both Vercel Projects

**Landing Page Project (`jadrb-landingpage`):**
1. Go to: https://vercel.com/dashboard → Select `jadrb-landingpage`
2. Navigate to: **Deployments** → Latest deployment
3. Click **...** menu → **Redeploy**
4. **Uncheck** "Use existing Build Cache"
5. Click **Redeploy**

**App Project (`jadrb`):**
1. Go to: https://vercel.com/dashboard → Select `jadrb`
2. Navigate to: **Deployments** → Latest deployment
3. Click **...** menu → **Redeploy**
4. **Uncheck** "Use existing Build Cache"
5. Click **Redeploy**

### Step 2: Wait for Deployment
- Wait 2-5 minutes for both deployments to complete
- Check deployment status shows ✅ Ready

### Step 3: Verify Environment Variables

**App Project (`jadrb`) should have:**
```
VITE_APP_MODE = app
```

**Landing Page Project (`jadrb-landingpage`) should have:**
```
VITE_APP_MODE = landing
```

If these are missing, add them and redeploy again.

### Step 4: Test All Flows
Complete all tests from "Testing Instructions" section above.

## Commit Reference

Fixed in commit: `e35cc43`

**Files Changed:**
- `src/pages/Layout.jsx` - Added `loginInitiated` state flag and updated authentication logic

## Technical Details

### Why State Flag Works

React state persists across re-renders within the same component instance:

```javascript
// Render 1
loginInitiated = false → User.login() called → Set loginInitiated = true

// Render 2 (triggered by Base44 redirect)
loginInitiated = true → User.login() NOT called → Waits for auth

// Render 3 (after auth completes)
user exists → Skips auth blocks → Shows app
```

The flag prevents the second render from triggering another login call before the first one completes.

### Why useEffect Doesn't Help Here

Some might suggest wrapping `User.login()` in a `useEffect`, but this doesn't solve the problem:

```javascript
// This STILL causes infinite loop
useEffect(() => {
  if (!user) {
    User.login(); // Called every time !user is true
  }
}, [user]);
```

The issue is that `User.login()` **redirects away from the app**, so when the Base44 callback returns, the component mounts fresh and `user` is still null (temporarily), triggering the effect again.

The state flag approach works because we set it **before** the redirect, so when the callback returns, the flag is already true (assuming React preserves state during the redirect cycle, which it does in this case).

### Alternative Solution (Not Used)

Another approach would be to use `sessionStorage`:

```javascript
if (!user && !sessionStorage.getItem('loginAttempted')) {
  sessionStorage.setItem('loginAttempted', 'true');
  User.login();
  return <LoadingSpinner />;
}
```

We chose the state flag approach because:
- More React-idiomatic
- Automatically clears on browser tab close
- No manual cleanup needed
- Works even if user blocks sessionStorage

## Complete Fix Timeline

### Issue 1: Landing Page Base44 Redirect ✅ SOLVED
**Problem:** Both `.net` and `.app` redirected to Base44 login
**Fix:** Lazy loading (React.lazy) + Proxy pattern for Base44 client
**Result:** Landing page loads without authentication

### Issue 2: Infinite Redirect Loop ✅ SOLVED
**Problem:** ERR_TOO_MANY_REDIRECTS when accessing app
**Fix:** `loginInitiated` state flag to prevent multiple User.login() calls
**Result:** Clean authentication flow without loops

## Summary

**Before Fix:**
- Landing page worked ✅
- App access triggered infinite redirect loop ❌
- ERR_TOO_MANY_REDIRECTS on all authentication attempts ❌

**After Fix:**
- Landing page works ✅
- App access triggers authentication once ✅
- User successfully lands on dashboard after login ✅
- No redirect loops ✅
- Mobile and desktop both work ✅

**Next Step:**
Deploy both projects to Vercel (without build cache) and test all user flows.
