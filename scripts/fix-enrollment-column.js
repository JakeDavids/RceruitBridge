// Fix enrollment column type in Supabase schools table
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://frabthrbowszsqsjykmy.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZyYWJ0aHJib3dzenNxc2p5a215Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDYyOTkxMiwiZXhwIjoyMDc2MjA1OTEyfQ.DPzrbi_XbAZBs4cG97uUGvQGgmQf7CED5p3dty0sgUM';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixEnrollmentColumn() {
  console.log('🔧 Fixing enrollment column type...');

  try {
    // Use raw SQL query via RPC or direct SQL
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE schools ALTER COLUMN enrollment TYPE TEXT;'
    });

    if (error) {
      console.error('❌ Error:', error);
      console.log('\n📝 Please run this SQL manually in Supabase SQL Editor:');
      console.log('ALTER TABLE schools ALTER COLUMN enrollment TYPE TEXT;');
    } else {
      console.log('✅ Column type fixed successfully!');
    }
  } catch (err) {
    console.error('❌ Error:', err.message);
    console.log('\n📝 Please run this SQL manually in Supabase SQL Editor:');
    console.log('ALTER TABLE schools ALTER COLUMN enrollment TYPE TEXT;');
  }
}

fixEnrollmentColumn();
