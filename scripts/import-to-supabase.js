// Import exported Base44 data into Supabase
// Run this AFTER:
// 1. Creating your Supabase project
// 2. Running the schema SQL
// 3. Exporting data from Base44
// 4. Setting up .env.local with Supabase credentials

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
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY; // Use service role key for import!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials!');
  console.error('Make sure you have .env.local with:');
  console.error('VITE_SUPABASE_URL=https://xxxxx.supabase.co');
  console.error('SUPABASE_SERVICE_KEY=eyJhbGc...(service_role key)');
  process.exit(1);
}

// Create Supabase client with service role (bypasses RLS)
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const dataDir = path.join(__dirname, '../data-export');

// Import order matters! (due to foreign keys)
const IMPORT_ORDER = [
  'users',
  'schools',
  'coaches',
  'athletes',
  'targeted_schools',
  'coach_contacts',
  'outreach',
  'email_identities',
  'mailboxes',
  'mail_threads',
  'messages'
];

async function importEntity(entityName) {
  console.log(`\n📥 Importing ${entityName}...`);

  const filePath = path.join(dataDir, `${entityName}.json`);

  if (!fs.existsSync(filePath)) {
    console.log(`   ⚠️  File not found: ${filePath}`);
    return { entity: entityName, count: 0, success: false, error: 'File not found' };
  }

  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    if (!Array.isArray(data) || data.length === 0) {
      console.log(`   ⚠️  No data to import`);
      return { entity: entityName, count: 0, success: true };
    }

    console.log(`   Found ${data.length} records`);

    // Batch insert (Supabase has limits, so we'll do it in chunks)
    const BATCH_SIZE = 100;
    let imported = 0;
    let errors = 0;

    for (let i = 0; i < data.length; i += BATCH_SIZE) {
      const batch = data.slice(i, i + BATCH_SIZE);

      // Clean up the data - remove Base44-specific fields
      const cleanBatch = batch.map(record => {
        const clean = { ...record };
        // Remove Base44 metadata
        delete clean._id;
        delete clean.__v;
        // Keep id if it exists (for maintaining relationships)
        return clean;
      });

      const { data: inserted, error } = await supabase
        .from(entityName)
        .insert(cleanBatch)
        .select();

      if (error) {
        console.error(`   ❌ Error in batch ${i / BATCH_SIZE + 1}:`, error.message);
        errors += batch.length;
      } else {
        imported += inserted.length;
        console.log(`   ✅ Imported batch ${i / BATCH_SIZE + 1} (${imported}/${data.length})`);
      }
    }

    console.log(`   📊 Total imported: ${imported}, Errors: ${errors}`);

    return {
      entity: entityName,
      count: imported,
      success: errors === 0,
      totalRecords: data.length,
      errors
    };
  } catch (error) {
    console.error(`   ❌ Error importing ${entityName}:`, error.message);
    return { entity: entityName, count: 0, success: false, error: error.message };
  }
}

async function main() {
  console.log('🚀 Starting Supabase Data Import\n');
  console.log('⚠️  WARNING: This will import data into your Supabase database!');
  console.log('   Make sure you have run the schema SQL first.\n');
  console.log('=' .repeat(60));

  // Check if data directory exists
  if (!fs.existsSync(dataDir)) {
    console.error(`\n❌ Data directory not found: ${dataDir}`);
    console.error('Run export-base44-data.js first to export your data!');
    process.exit(1);
  }

  const results = [];

  // Import entities in order
  for (const entity of IMPORT_ORDER) {
    results.push(await importEntity(entity));
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('\n📊 IMPORT SUMMARY\n');

  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);

  console.log(`✅ Successful imports: ${successful.length}`);
  successful.forEach(r => {
    console.log(`   - ${r.entity}: ${r.count} records imported`);
  });

  if (failed.length > 0) {
    console.log(`\n❌ Failed imports: ${failed.length}`);
    failed.forEach(r => {
      console.log(`   - ${r.entity}: ${r.error || 'Import failed'}`);
    });
  }

  const totalImported = results.reduce((sum, r) => sum + (r.count || 0), 0);
  console.log(`\n📊 Total records imported: ${totalImported}`);
  console.log('\n✅ Import complete!\n');
}

// Run the import
main().catch(error => {
  console.error('\n❌ Fatal error during import:', error);
  process.exit(1);
});
