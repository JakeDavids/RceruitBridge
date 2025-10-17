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
- `scripts/export-base44-data.js` - Export script
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

### Step 6: Export Base44 Data (Optional - 5 minutes)

Only if you have existing data in Base44:

```bash
npm run export-base44
```

This creates `data-export/` folder with all your data.

### Step 7: Import to Supabase (Optional - 5 minutes)

If you exported data:

```bash
npm run import-supabase
```

### Step 8: Set Up Google OAuth (10 minutes)

1. Go to **Authentication** → **Providers** in Supabase
2. Enable **Google**
3. Go to **https://console.cloud.google.com/**
4. Create OAuth credentials
5. Add redirect URI: `https://YOUR_PROJECT.supabase.co/auth/v1/callback`
6. Copy Client ID and Secret back to Supabase

---

## 🎉 Once Complete

After completing steps 1-8:

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
- **Steps 6-7** (optional): ~10 minutes
- **Step 8**: ~10 minutes
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

## 🐛 Profile Page Fixed!

The white screen issue is now resolved:
- Disabled guided tour in mock mode
- Page now loads all form fields
- Save button works correctly
- Redirects to Dashboard after save

---

**Ready to start? Begin with Step 1 above! 👆**
