# School Import Guide - 779 Schools with Academic Tiers

## Overview

This guide explains how to import 779 schools with academic tier rankings into RecruitBridge.

---

## Step 1: Add Columns to Database

**File**: `scripts/add_school_columns.sql`

**Go to**: https://supabase.com/dashboard/project/frabthrbowszsqsjykmy/sql/new

**Copy and paste**:
```sql
-- Add academic_ranking and staff_directory_url columns to schools table

-- Add academic_ranking column (Tier 1-5)
ALTER TABLE schools
ADD COLUMN IF NOT EXISTS academic_ranking integer;

-- Add staff_directory_url column
ALTER TABLE schools
ADD COLUMN IF NOT EXISTS staff_directory_url text;

-- Add comment for academic_ranking
COMMENT ON COLUMN schools.academic_ranking IS 'Academic tier: 1=Most Competitive (Ivy League), 2=Highly Competitive, 3=Competitive, 4=Less Competitive, 5=Least Competitive';

-- Verify columns were added
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'schools'
  AND column_name IN ('academic_ranking', 'staff_directory_url');

SELECT '✅ Columns added successfully!' as status;
```

**Click RUN** and verify you see `✅ Columns added successfully!`

---

## Step 2: Prepare Your CSV File

**Format**: CSV with these exact column names (case-sensitive):
```
Schools,City,State,Division,Conference,Academic_ranking,Enrollment
```

**Example rows**:
```csv
Schools,City,State,Division,Conference,Academic_ranking,Enrollment
"Harvard University","Cambridge","MA","FCS","Ivy League",1,23000
"University of Alabama","Tuscaloosa","AL","FBS","SEC",2,38100
"Ohio State University","Columbus","OH","FBS","Big Ten",2,61170
```

**Academic_ranking Values**:
- `1` = Tier 1 – Most Competitive (Ivy League level)
- `2` = Tier 2 – Highly Competitive
- `3` = Tier 3 – Competitive
- `4` = Tier 4 – Less Competitive
- `5` = Tier 5 – Least Competitive

**Note**: If your CSV has different column names (e.g., "Confrence" instead of "Conference"), the script handles it.

---

## Step 3: Save CSV File

Save your CSV file to the project directory, for example:
```
/Users/davidskids/Projects/RecruitBridge/schools_data.csv
```

---

## Step 4: Install Dependencies (if needed)

If you haven't already, install the CSV parser:
```bash
npm install csv-parse dotenv
```

---

## Step 5: Run Import Script

**In terminal**:
```bash
node scripts/import-schools-csv.js schools_data.csv
```

**What it does**:
- Reads your CSV file
- For each school:
  - Checks if it already exists (by name + state)
  - If exists: **Updates** the school with new data
  - If not exists: **Inserts** new school
- Shows progress for each school
- Prints summary at end

**Example output**:
```
📄 Reading CSV file: schools_data.csv
✅ Parsed 779 schools from CSV

✅ Inserted: Harvard University (MA)
🔄 Updated: University of Alabama (AL)
✅ Inserted: Ohio State University (OH)
...

═══════════════════════════════════════
📊 Import Summary:
   ✅ Inserted: 750 schools
   🔄 Updated: 29 schools
   ❌ Errors: 0
   📝 Total processed: 779
═══════════════════════════════════════
```

---

## Step 6: Verify in Application

1. Go to https://www.recruitbridge.app/schools
2. Search for a school you imported
3. You should see:
   - **Division badge** (FBS, FCS, etc.)
   - **Conference badge** with color
   - **Academic Tier badge** (e.g., "🎓 Tier 1")
   - **Hover over tier badge** to see full definition

**Tooltip shows**:
```
Tier 1 – Most Competitive
Elite academic institutions (e.g., Ivy League level)
```

---

## Academic Tier Display

### Visual Examples:

**Tier 1** (Purple):
- Badge: `🎓 Tier 1`
- Hover: "Tier 1 – Most Competitive: Elite academic institutions (e.g., Ivy League level)"

**Tier 2** (Blue):
- Badge: `🎓 Tier 2`
- Hover: "Tier 2 – Highly Competitive: Very selective schools with high academic rigor"

**Tier 3** (Green):
- Badge: `🎓 Tier 3`
- Hover: "Tier 3 – Competitive: Solid academic programs with moderate selectivity"

**Tier 4** (Yellow):
- Badge: `🎓 Tier 4`
- Hover: "Tier 4 – Less Competitive: Generally accessible schools with higher acceptance rates"

**Tier 5** (Gray):
- Badge: `🎓 Tier 5`
- Hover: "Tier 5 – Least Competitive: Open enrollment or minimally selective schools"

---

## Troubleshooting

### Error: "Missing environment variables"

**Solution**: Ensure `.env.local` has:
```bash
VITE_SUPABASE_URL=https://frabthrbowszsqsjykmy.supabase.co
SUPABASE_SERVICE_KEY=your-service-key-here
```

### Error: "File not found"

**Solution**: Check the file path. Use absolute path if needed:
```bash
node scripts/import-schools-csv.js /full/path/to/schools_data.csv
```

### Schools not showing tier badge

**Solution**:
1. Check that `academic_ranking` column has values (1-5)
2. Verify column was added in Step 1
3. Clear browser cache and reload

---

## Adding Staff Directory Links

If you have staff directory URLs for schools, add a column to your CSV:
```csv
Schools,City,State,Division,Conference,Academic_ranking,Enrollment,Staff_Directory_URL
"Harvard University","Cambridge","MA","FCS","Ivy League",1,23000,"https://gocrimson.com/staff"
```

The import script will automatically populate the `staff_directory_url` field.

---

## Files Created

1. `scripts/add_school_columns.sql` - Add columns to database
2. `scripts/import-schools-csv.js` - Import script
3. `src/pages/Schools.jsx` - Updated with tier tooltips
4. `SCHOOL_IMPORT_GUIDE.md` - This guide

---

## Need Help?

If you encounter issues:
1. Check the error message from the import script
2. Verify CSV format matches exactly
3. Ensure database columns were added (Step 1)
4. Check console logs in browser DevTools
