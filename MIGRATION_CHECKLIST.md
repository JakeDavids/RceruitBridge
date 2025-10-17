# 📋 RecruitBridge Supabase Migration Checklist

## Phase 1: Preparation ✅

- [ ] **1.1** Read `SUPABASE_SETUP.md` completely
- [ ] **1.2** Backup current codebase (git commit all changes)
- [ ] **1.3** Document current Base44 App ID and credentials

## Phase 2: Create Supabase Project

- [ ] **2.1** Go to https://supabase.com and create account
- [ ] **2.2** Create new project "RecruitBridge"
- [ ] **2.3** Wait for project to provision (~2-3 minutes)
- [ ] **2.4** Copy Project URL from Settings → API
- [ ] **2.5** Copy `anon` public key from Settings → API
- [ ] **2.6** Copy `service_role` key from Settings → API (keep secret!)
- [ ] **2.7** Save all credentials securely

## Phase 3: Set Up Database Schema

- [ ] **3.1** Go to SQL Editor in Supabase dashboard
- [ ] **3.2** Create new query
- [ ] **3.3** Copy entire contents of `supabase-schema.sql`
- [ ] **3.4** Paste into SQL Editor
- [ ] **3.5** Click "Run" and wait for completion
- [ ] **3.6** Verify tables created: Go to Table Editor
- [ ] **3.7** Check that you see: users, athletes, schools, coaches, etc.

## Phase 4: Configure Authentication

- [ ] **4.1** Go to Authentication → Providers in Supabase
- [ ] **4.2** Enable Google provider
- [ ] **4.3** Go to Google Cloud Console (console.cloud.google.com)
- [ ] **4.4** Create OAuth 2.0 credentials (or use existing)
- [ ] **4.5** Add authorized redirect URI: `https://YOUR_PROJECT.supabase.co/auth/v1/callback`
- [ ] **4.6** Copy Client ID and Client Secret
- [ ] **4.7** Paste into Supabase Google provider settings
- [ ] **4.8** Save provider settings

## Phase 5: Create Storage Bucket

- [ ] **5.1** Go to Storage in Supabase
- [ ] **5.2** Create new bucket named "uploads"
- [ ] **5.3** Set bucket to Public
- [ ] **5.4** Configure RLS policies for uploads bucket

## Phase 6: Import Schools Data from Google Sheets (Optional)

**NOTE:** Base44 data export is NOT needed - starting fresh with Supabase!

If you have schools data in Google Sheets:

- [ ] **6.1** Export from Google Sheets: File → Download → CSV
- [ ] **6.2** Save as `schools.csv` in project root
- [ ] **6.3** Read `CSV_IMPORT_GUIDE.md` for full instructions
- [ ] **6.4** Create import script or use Supabase built-in CSV import
- [ ] **6.5** Verify schools imported in Supabase Table Editor

If no schools data to import, skip this phase entirely!

## Phase 7: Configure Environment Variables

- [ ] **7.1** Create `.env.local` file in project root
- [ ] **7.2** Add:
  ```
  VITE_SUPABASE_URL=https://xxxxx.supabase.co
  VITE_SUPABASE_ANON_KEY=eyJhbGc...
  SUPABASE_SERVICE_KEY=eyJhbGc...(service_role key)
  ```
- [ ] **7.3** Add `.env.local` to `.gitignore`
- [ ] **7.4** Never commit .env.local to git!

## Phase 8: Install Dependencies

- [ ] **8.1** Run: `npm install @supabase/supabase-js`
- [ ] **8.2** Run: `npm install dotenv` (for import scripts)
- [ ] **8.3** Verify installation successful

## Phase 9: Verify Database Setup

- [ ] **9.1** Go to Supabase Table Editor
- [ ] **9.2** Verify all tables exist (users, athletes, schools, etc.)
- [ ] **9.3** Check that schools table has data (if you imported CSV)
- [ ] **9.4** Test RLS policies are enabled
- [ ] **9.5** Everything should be empty initially - that's normal!
- [ ] **9.6** Data will be created as you use the app

## Phase 10: Update Application Code

- [ ] **10.1** Find all imports of `base44Client`:
  ```bash
  grep -r "from '@/api/base44Client'" src/
  ```
- [ ] **10.2** Replace with `supabaseClient` imports:
  ```javascript
  // OLD:
  import { User } from "@/api/entities";

  // NEW:
  import { User } from "@/api/supabaseClient";
  ```
- [ ] **10.3** Update `src/api/entities.js` to export from supabaseClient
- [ ] **10.4** Update `src/api/integrations.js` to export from supabaseClient
- [ ] **10.5** Update `src/api/functions.js` to export from supabaseClient

## Phase 11: Test Authentication

- [ ] **11.1** Update Layout.jsx to re-enable authentication
- [ ] **11.2** Test Google OAuth login flow
- [ ] **11.3** Verify user data loads correctly
- [ ] **11.4** Test logout functionality

## Phase 12: Test Core Features

- [ ] **12.1** Test Profile page - create/update athlete
- [ ] **12.2** Test Schools page - view and target schools
- [ ] **12.3** Test Coach Contacts - add/edit/delete
- [ ] **12.4** Test Outreach Center - create messages
- [ ] **12.5** Test Dashboard - verify all stats load
- [ ] **12.6** Test Response Center
- [ ] **12.7** Test all other pages

## Phase 13: Set Up Edge Functions (Optional - Advanced)

For AI and email features, you'll need Supabase Edge Functions:

- [ ] **13.1** Install Supabase CLI: `npm install -g supabase`
- [ ] **13.2** Link project: `supabase link --project-ref YOUR_PROJECT_ID`
- [ ] **13.3** Create Edge Function for AI: `supabase functions new ai-generate`
- [ ] **13.4** Create Edge Function for emails: `supabase functions new send-email`
- [ ] **13.5** Deploy functions: `supabase functions deploy`

## Phase 14: Update Deployment Settings

- [ ] **14.1** Add environment variables to Vercel:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
- [ ] **14.2** Rebuild and deploy to Vercel
- [ ] **14.3** Test production deployment

## Phase 15: Final Verification

- [ ] **15.1** Test authentication in production
- [ ] **15.2** Test data loading in production
- [ ] **15.3** Test creating new records
- [ ] **15.4** Monitor Supabase logs for errors
- [ ] **15.5** Check RLS policies working correctly

## Phase 16: Cleanup

- [ ] **16.1** Backup base44Client.js for reference
- [ ] **16.2** Remove Base44 SDK: `npm uninstall @base44/sdk`
- [ ] **16.3** Update documentation
- [ ] **16.4** Celebrate! 🎉

---

## Troubleshooting

### Common Issues:

**Problem**: Schema SQL fails
- **Solution**: Check for syntax errors, run line by line

**Problem**: CSV import fails
- **Solution**: Check column names match exactly (lowercase, underscores). See CSV_IMPORT_GUIDE.md

**Problem**: RLS policies block data access
- **Solution**: Check user is authenticated, verify RLS policies

**Problem**: Authentication doesn't work
- **Solution**: Verify Google OAuth credentials, check redirect URIs

**Problem**: Profile page shows white screen
- **Solution**: Check browser console for debug logs. Latest fix (Attempt 3) should resolve this.

---

## Need Help?

- Supabase Docs: https://supabase.com/docs
- Supabase Discord: https://discord.supabase.com
- Check Supabase logs in dashboard for errors
- See CSV_IMPORT_GUIDE.md for schools data import

---

## Estimated Time

- **Phase 1-5**: 30-60 minutes
- **Phase 6-9**: 15-30 minutes (optional CSV import)
- **Phase 10-12**: 2-4 hours (testing)
- **Phase 13-14**: 1-2 hours (optional)
- **Total**: ~3-5 hours (since no Base44 export needed!)

**Current Status**: 🟢 Ready to begin Phase 2!

**Note**: You're starting fresh with Supabase, so no Base44 data migration needed. This saves time!
