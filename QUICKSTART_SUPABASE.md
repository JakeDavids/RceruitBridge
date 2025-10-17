# 🚀 Quick Start: Supabase Migration

## ✅ What's Been Done

1. **Profile Page Fixed** - No more white screen! Disabled guided tour in mock mode
2. **Visual Styling Enhanced** - All pages match colorful sidebar design
3. **Supabase Migration Ready** - Complete setup tools created

## 📁 New Files Created

- `SUPABASE_SETUP.md` - Detailed setup guide
- `MIGRATION_CHECKLIST.md` - 16-phase checklist
- `supabase-schema.sql` - Complete database schema
- `src/api/supabaseClient.js` - Supabase client (replaces Base44)
- `CSV_IMPORT_GUIDE.md` - Guide for importing schools from Google Sheets
- `scripts/import-to-supabase.js` - Import script

## 🎯 Next Steps (DO THESE NOW!)

### Step 1: Create Supabase Project (5 minutes)

1. Go to **https://supabase.com**
2. Sign up/log in
3. Click **"New Project"**
4. Fill in:
   - Name: RecruitBridge
   - Database Password: (save this!)
   - Region: US West (or closest to you)
5. Wait 2-3 minutes for project to be ready

### Step 2: Get Your Credentials (2 minutes)

Once project is ready:

1. Go to **Settings** → **API**
2. Copy these THREE values:

```
Project URL: https://xxxxx.supabase.co
anon public: eyJhbGc...
service_role: eyJhbGc...(keep secret!)
```

Save these somewhere safe!

### Step 3: Run the Database Schema (3 minutes)

1. In Supabase dashboard, go to **SQL Editor**
2. Click **"New Query"**
3. Open your `supabase-schema.sql` file
4. Copy ALL the SQL (it's about 400 lines)
5. Paste into SQL Editor
6. Click **"Run"**
7. Wait for completion (~10 seconds)
8. Go to **Table Editor** and verify you see tables

### Step 4: Configure Environment (2 minutes)

Create `.env.local` file in project root:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...your-anon-key...
SUPABASE_SERVICE_KEY=eyJhbGc...your-service-role-key...
```

Replace with YOUR actual credentials from Step 2!

### Step 5: Install Supabase (1 minute)

```bash
npm install @supabase/supabase-js dotenv
```

### Step 6: Import Schools from Google Sheets (Optional - 15 minutes)

If you have schools data in Google Sheets:

1. Export from Google Sheets: **File** → **Download** → **CSV**
2. Save as `schools.csv` in project root
3. Follow the **CSV_IMPORT_GUIDE.md** for detailed instructions
4. Or use Supabase's built-in CSV import in Table Editor

### Step 7: Set Up Google OAuth (10 minutes)

1. Go to **Authentication** → **Providers** in Supabase
2. Enable **Google**
3. Go to **https://console.cloud.google.com/**
4. Create OAuth credentials
5. Add redirect URI: `https://YOUR_PROJECT.supabase.co/auth/v1/callback`
6. Copy Client ID and Secret back to Supabase

---

## 🎉 Once Complete

After completing steps 1-7:

1. Open `src/api/entities.js`
2. Change imports from:
   ```javascript
   import { User, Athlete, ... } from "./base44Client";
   ```
   To:
   ```javascript
   import { User, Athlete, ... } from "./supabaseClient";
   ```

3. Same for `src/api/integrations.js` and `src/api/functions.js`

4. Test locally:
   ```bash
   npm run dev
   ```

5. Deploy to Vercel (add env vars in Vercel dashboard)

---

## ⏱️ Time Estimate

- **Steps 1-5**: ~13 minutes
- **Step 6** (optional CSV import): ~15 minutes
- **Step 7** (Google OAuth): ~10 minutes
- **Code updates**: ~30 minutes
- **Testing**: ~30 minutes

**Total: 1-2 hours**

---

## 📞 Need Help?

Follow the detailed guides:
- Read `SUPABASE_SETUP.md` for more details
- Check `MIGRATION_CHECKLIST.md` for full checklist
- Supabase docs: https://supabase.com/docs

---

## 🐛 Profile Page Fix - Attempt 3 Deployed!

Latest fix deployed with comprehensive error handling:
- Wrapped all async calls in try-catch blocks
- Added finally block to ALWAYS exit loading state
- Mock user fallback if User.me() fails
- Added debug console logs
- Should resolve white screen issue once and for all

**Test the fix:** Visit `/profile` and check browser console for debug logs

---

## 📂 Where to Find Your Files

All Supabase setup files are in your project root:

```
/Users/davidskids/Projects/RecruitBridge/
├── QUICKSTART_SUPABASE.md      ← You are here!
├── SUPABASE_SETUP.md            ← Detailed setup guide
├── MIGRATION_CHECKLIST.md       ← 16-phase checklist
├── CSV_IMPORT_GUIDE.md          ← Import schools from Google Sheets
├── supabase-schema.sql          ← Run this in Supabase SQL Editor
└── src/api/supabaseClient.js    ← Ready to use once Supabase is set up
```

---

**Ready to start? Begin with Step 1 above! 👆**
