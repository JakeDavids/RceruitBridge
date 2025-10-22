# 🔐 COMPLETE AUTH SETUP - FOLLOW THESE EXACT STEPS

## ✅ WHAT I'VE DONE FOR YOU:
1. ✅ Added Mailgun credentials to `.env.local`
2. ✅ Fixed the signup flow to auto-login users OR redirect to login after confirmation
3. ✅ Created SQL script to auto-create user profiles
4. ✅ Code is ready - dev server is running at http://localhost:5173

---

## 🎯 WHAT YOU NEED TO DO (5 MINUTES):

### STEP 1: Fix Supabase Database (2 minutes)

1. **Open this link in your browser:**
   https://supabase.com/dashboard/project/frabthrbowszsqsjykmy/sql/new

2. **Copy EVERYTHING from the code block below:**

```sql
-- COMPLETE AUTH FIX - Copy everything below and paste it

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, plan, onboarding_completed, tour_progress, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    'free',
    false,
    'not_started',
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO postgres, anon, authenticated, service_role;

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own data" ON public.users;
CREATE POLICY "Users can read own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own data" ON public.users;
CREATE POLICY "Users can update own data" ON public.users
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Service role can insert users" ON public.users;
CREATE POLICY "Service role can insert users" ON public.users
  FOR INSERT WITH CHECK (true);

INSERT INTO public.users (id, email, plan, onboarding_completed, tour_progress, created_at, updated_at)
SELECT
  id,
  email,
  'free' as plan,
  false as onboarding_completed,
  'not_started' as tour_progress,
  created_at,
  NOW() as updated_at
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.users)
ON CONFLICT (id) DO NOTHING;

SELECT 'Auth setup complete! Users will now be auto-created and can login immediately.' as result;
```

3. **Click the "RUN" button** (or press Ctrl+Enter on Windows, Cmd+Enter on Mac)

4. **You should see:** "Auth setup complete! Users will now be auto-created and can login immediately."

---

### STEP 2: Configure Mailgun SMTP in Supabase (3 minutes)

1. **Open this link:**
   https://supabase.com/dashboard/project/frabthrbowszsqsjykmy/settings/auth

2. **Scroll down to "SMTP Settings"**

3. **Click "Enable Custom SMTP"**

4. **Fill in these EXACT values:**

   ```
   Sender name: RecruitBridge
   Sender email: noreply@recruitbridge.net

   Host: smtp.mailgun.org
   Port number: 587
   Username: postmaster@recruitbridge.net
   Password: [USE YOUR MAILGUN API KEY FROM .env.local]

   Encryption: STARTTLS
   ```

5. **Click "SAVE"** at the bottom

6. **Scroll to "Email Auth" section** (on the same page)
   - Find the checkbox that says **"Enable email confirmations"**
   - **UNCHECK IT** (turn it OFF) - This lets users login immediately without waiting for email

7. **Click "SAVE"** again

---

### STEP 3: Test Your Auth Flow (1 minute)

1. **Open your browser in PRIVATE/INCOGNITO mode** (this clears cache)
   - Chrome: Ctrl+Shift+N (Windows) or Cmd+Shift+N (Mac)
   - Firefox: Ctrl+Shift+P (Windows) or Cmd+Shift+P (Mac)

2. **Go to:** http://localhost:5173/signup

3. **Sign up with a NEW email:**
   - Enter email: your-test-email@gmail.com
   - Enter password: password123
   - Confirm password: password123
   - Click "Create Account"

4. **You should see:** "Account created! Redirecting to dashboard..."

5. **You'll be automatically logged in and redirected to /dashboard**

---

## 🎉 WHAT HAPPENS NOW:

### For Users Signing Up:
1. User enters email and password
2. Account is created instantly
3. User profile is auto-created in database
4. User is logged in immediately
5. User is redirected to /dashboard
6. NO email confirmation needed!

### For Users Logging In:
1. User goes to /login
2. User enters email and password
3. User clicks "Sign In"
4. User is redirected to /dashboard
5. NO extra steps!

---

## 🔧 IF SOMETHING DOESN'T WORK:

### Problem: Still seeing "Invalid API key"
**Solution:** Clear your browser cache completely:
- Chrome: Ctrl+Shift+Delete → Check "Cached images and files" → Clear data
- OR just use Incognito mode for testing

### Problem: Still seeing "{}" error
**Solution:** You didn't run the SQL script. Go back to STEP 1.

### Problem: Not receiving emails
**Solution:** That's OK! I turned off email confirmation so users can login immediately. If you WANT email confirmation:
- In Supabase Dashboard → Auth Settings → Check "Enable email confirmations"
- Users will get confirmation emails via Mailgun

### Problem: Users see "email not confirmed" error
**Solution:** In Supabase Dashboard → Auth Settings → UNCHECK "Enable email confirmations"

---

## 📧 ABOUT @recruitbridge.net EMAIL ADDRESSES:

Your Mailgun is set up with these domains:
- recruitbridge.net (main domain)
- mg.recruitbridge.net (for sending)
- in.recruitbridge.net (for receiving)

When users send emails to coaches, they'll use addresses like:
- `firstname.lastname@recruitbridge.net`

This is already configured in your Mailgun. We'll set up the email sending system AFTER you confirm auth is working.

---

## ✅ CHECKLIST:

- [ ] Ran SQL script in Supabase SQL Editor (STEP 1)
- [ ] Configured Mailgun SMTP in Supabase (STEP 2)
- [ ] Disabled "Enable email confirmations" (STEP 2, #6)
- [ ] Tested signup in Incognito mode (STEP 3)
- [ ] User was redirected to /dashboard automatically

---

## 🚀 ONCE THIS WORKS:

Reply "AUTH WORKS" and I'll set up:
1. Email identity system (@recruitbridge.net addresses for users)
2. Email sending to coaches
3. Email inbox for receiving replies
4. Mailgun webhooks for inbound emails

But first, let's make sure auth works perfectly!
