// Quick script to verify Supabase connection and tables
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function verify() {
  console.log('🔍 Verifying Supabase Connection...\n');
  console.log(`📍 Project URL: ${supabaseUrl}`);

  try {
    // Test connection by listing tables
    const { data, error } = await supabase
      .from('users')
      .select('count', { count: 'exact', head: true });

    if (error) {
      console.error('❌ Error connecting to Supabase:', error.message);
      process.exit(1);
    }

    console.log('\n✅ Connection successful!\n');

    // Check all expected tables
    const tables = [
      'users',
      'athletes',
      'schools',
      'coaches',
      'targeted_schools',
      'coach_contacts',
      'outreach',
      'email_identities',
      'mailboxes',
      'mail_threads',
      'messages'
    ];

    console.log('📊 Checking Tables:\n');

    for (const table of tables) {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.log(`   ❌ ${table}: NOT FOUND (${error.message})`);
      } else {
        console.log(`   ✅ ${table}: ${count || 0} records`);
      }
    }

    console.log('\n🎉 Verification complete!\n');
  } catch (error) {
    console.error('❌ Fatal error:', error.message);
    process.exit(1);
  }
}

verify();
