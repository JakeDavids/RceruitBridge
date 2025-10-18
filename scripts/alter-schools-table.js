// Alter schools table enrollment column to TEXT
// This uses a workaround since we can't run DDL directly via JS client

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

// Load environment variables
const envFile = readFileSync('.env.local', 'utf8');
const envVars = {};
envFile.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && !key.startsWith('#')) {
    envVars[key.trim()] = valueParts.join('=').trim();
  }
});

const supabaseUrl = envVars.VITE_SUPABASE_URL;
const supabaseServiceKey = envVars.SUPABASE_SERVICE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function alterTable() {
  console.log('🔧 Attempting to alter schools table...\n');

  try {
    // First, let's check current table structure
    console.log('1. Checking current table structure...');

    const { data: tableInfo, error: infoError } = await supabase
      .rpc('exec_sql', {
        query: `
          SELECT column_name, data_type
          FROM information_schema.columns
          WHERE table_name = 'schools';
        `
      });

    if (infoError) {
      console.log('   ⚠️  Cannot check table structure via RPC (this is expected)');
      console.log('   Trying alternative approach...\n');
    }

    // Try to alter the column via RPC (may not work depending on Supabase setup)
    console.log('2. Attempting to alter enrollment column to TEXT...');

    const { data, error } = await supabase.rpc('exec_sql', {
      query: 'ALTER TABLE schools ALTER COLUMN enrollment TYPE TEXT;'
    });

    if (error) {
      console.log('   ❌ Cannot alter table via API (expected behavior)');
      console.log('   Error:', error.message);
      console.log('\n📝 MANUAL ACTION REQUIRED:\n');
      console.log('   Please run this SQL manually in Supabase Dashboard:');
      console.log('   1. Go to: https://supabase.com/dashboard/project/frabthrbowszsqsjykmy/sql/new');
      console.log('   2. Paste: ALTER TABLE schools ALTER COLUMN enrollment TYPE TEXT;');
      console.log('   3. Click "Run"\n');
      console.log('   Then run the import: node scripts/load-schools.js');
      process.exit(1);
    }

    console.log('   ✅ Column altered successfully!');
    console.log('\n🎉 Table is ready for import!');
    console.log('   Run: node scripts/load-schools.js');

  } catch (err) {
    console.error('❌ Error:', err.message);
    console.log('\n📝 MANUAL ACTION REQUIRED:\n');
    console.log('   Please run this SQL manually in Supabase Dashboard:');
    console.log('   1. Go to: https://supabase.com/dashboard/project/frabthrbowszsqsjykmy/sql/new');
    console.log('   2. Paste: ALTER TABLE schools ALTER COLUMN enrollment TYPE TEXT;');
    console.log('   3. Click "Run"\n');
    console.log('   Then run the import: node scripts/load-schools.js');
    process.exit(1);
  }
}

alterTable();
