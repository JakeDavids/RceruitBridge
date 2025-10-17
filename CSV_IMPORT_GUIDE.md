# 📊 CSV Import Guide: Schools Data from Google Sheets

## Overview

This guide shows you how to import your schools data from Google Sheets directly into Supabase.

## Prerequisites

- ✅ Supabase project created
- ✅ Database schema running (supabase-schema.sql)
- ✅ `.env.local` file configured with Supabase credentials

## Step 1: Export from Google Sheets (2 minutes)

1. Open your Google Sheets with schools data
2. Click **File** → **Download** → **Comma Separated Values (.csv)**
3. Save the file as `schools.csv` in your project root

## Step 2: Prepare CSV Format (3 minutes)

Your CSV should have these columns (match exactly):

```csv
name,location,division,conference,head_coach_name,head_coach_email,website,phone,notes
Stanford University,Stanford CA,D1,Pac-12,John Doe,jdoe@stanford.edu,https://stanford.edu,(650) 123-4567,Top academic school
UCLA,Los Angeles CA,D1,Big Ten,Jane Smith,jsmith@ucla.edu,https://ucla.edu,(310) 123-4567,Great program
```

### Required Columns:
- `name` - School name (e.g., "Stanford University")
- `location` - City and state (e.g., "Stanford CA")
- `division` - D1, D2, D3, NAIA, or JUCO

### Optional Columns:
- `conference` - Conference name (e.g., "SEC", "Big Ten")
- `head_coach_name` - Head coach name
- `head_coach_email` - Coach email
- `website` - School website URL
- `phone` - School phone number
- `notes` - Any additional notes

**IMPORTANT:** Make sure column names match exactly (lowercase, underscores instead of spaces).

## Step 3: Create Import Script (5 minutes)

Create a new file `scripts/import-schools-csv.js`:

```javascript
// Import schools from CSV file to Supabase
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get Supabase credentials from environment
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials!');
  console.error('Make sure you have .env.local configured.');
  process.exit(1);
}

// Create Supabase client with service role (bypasses RLS)
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Simple CSV parser
function parseCSV(csvText) {
  const lines = csvText.split('\n').filter(line => line.trim());
  const headers = lines[0].split(',').map(h => h.trim());

  const records = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    const record = {};

    headers.forEach((header, index) => {
      record[header] = values[index] || null;
    });

    records.push(record);
  }

  return records;
}

async function importSchools() {
  console.log('🚀 Starting Schools CSV Import\n');

  const csvPath = path.join(__dirname, '../schools.csv');

  if (!fs.existsSync(csvPath)) {
    console.error('❌ CSV file not found: schools.csv');
    console.error('Place your schools.csv file in the project root directory.');
    process.exit(1);
  }

  try {
    // Read and parse CSV
    const csvText = fs.readFileSync(csvPath, 'utf8');
    const schools = parseCSV(csvText);

    console.log(`📊 Found ${schools.length} schools in CSV\n`);

    // Import in batches
    const BATCH_SIZE = 50;
    let imported = 0;
    let errors = 0;

    for (let i = 0; i < schools.length; i += BATCH_SIZE) {
      const batch = schools.slice(i, i + BATCH_SIZE);

      const { data, error } = await supabase
        .from('schools')
        .insert(batch)
        .select();

      if (error) {
        console.error(`❌ Error in batch ${i / BATCH_SIZE + 1}:`, error.message);
        errors += batch.length;
      } else {
        imported += data.length;
        console.log(`✅ Imported batch ${i / BATCH_SIZE + 1} (${imported}/${schools.length})`);
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log(`\n📊 Import Summary:`);
    console.log(`   ✅ Successfully imported: ${imported} schools`);
    console.log(`   ❌ Errors: ${errors} schools`);
    console.log('\n✅ Import complete!\n');

  } catch (error) {
    console.error('\n❌ Fatal error during import:', error);
    process.exit(1);
  }
}

// Run the import
importSchools();
```

## Step 4: Add NPM Script (1 minute)

Add this to `package.json` scripts:

```json
"scripts": {
  "import-schools": "node scripts/import-schools-csv.js"
}
```

## Step 5: Run Import (2 minutes)

```bash
npm run import-schools
```

You should see output like:

```
🚀 Starting Schools CSV Import

📊 Found 150 schools in CSV

✅ Imported batch 1 (50/150)
✅ Imported batch 2 (100/150)
✅ Imported batch 3 (150/150)

============================================================

📊 Import Summary:
   ✅ Successfully imported: 150 schools
   ❌ Errors: 0 schools

✅ Import complete!
```

## Step 6: Verify in Supabase (1 minute)

1. Go to Supabase dashboard
2. Navigate to **Table Editor**
3. Click on **schools** table
4. You should see all your imported schools!

## Troubleshooting

### Problem: "CSV file not found"
**Solution:** Make sure `schools.csv` is in your project root (same folder as package.json)

### Problem: "Column does not exist"
**Solution:** Check that your CSV column names match the database exactly:
- Use lowercase
- Use underscores not spaces (e.g., `head_coach_name` not `Head Coach Name`)

### Problem: Import fails with validation errors
**Solution:**
- Make sure `division` values are: D1, D2, D3, NAIA, or JUCO (exact match)
- Remove any special characters or quotes from your data
- Check for empty required fields (name, location, division)

### Problem: Some schools imported, some failed
**Solution:**
- Check the error messages - they'll tell you which rows failed
- Fix those rows in your CSV
- Delete imported schools from Supabase Table Editor
- Re-run the import

## Alternative: Direct CSV Import via Supabase (Easier!)

Supabase has a built-in CSV import feature:

1. Go to **Table Editor** in Supabase
2. Click on **schools** table
3. Click **Insert** → **Import data from CSV**
4. Upload your `schools.csv` file
5. Map columns (drag and drop to match)
6. Click **Import**

This method is easier but less customizable than the script above.

## Next Steps

After importing schools:

1. ✅ Go to Target Schools page in your app
2. ✅ Search and target schools
3. ✅ Schools will now appear in your target list

---

**Total Time: ~15 minutes**

Need help? Check the Supabase docs: https://supabase.com/docs/guides/database/tables
