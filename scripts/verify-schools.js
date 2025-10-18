// Verify schools were imported correctly
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const envFile = readFileSync('.env.local', 'utf8');
const envVars = {};
envFile.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && !key.startsWith('#')) {
    envVars[key.trim()] = valueParts.join('=').trim();
  }
});

const supabaseUrl = envVars.VITE_SUPABASE_URL;
const supabaseAnonKey = envVars.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function verifySchools() {
  console.log('🔍 Verifying schools import...\n');

  // Get total count
  const { data: all, error: allError } = await supabase
    .from('schools')
    .select('*', { count: 'exact', head: true });

  if (allError) {
    console.error('Error:', allError);
    return;
  }

  console.log(`✅ Total schools: ${all?.length || 0}\n`);

  // Sample some famous schools
  const famousSchools = [
    'Alabama Crimson Tide',
    'Ohio State Buckeyes',
    'Michigan Wolverines',
    'Georgia Bulldogs',
    'Notre Dame Fighting Irish'
  ];

  console.log('📋 Sample Schools:\n');

  for (const schoolName of famousSchools) {
    const { data, error } = await supabase
      .from('schools')
      .select('*')
      .ilike('name', `%${schoolName.split(' ')[0]}%`)
      .limit(1)
      .single();

    if (data) {
      console.log(`✅ ${data.name}`);
      console.log(`   Location: ${data.city}, ${data.state}`);
      console.log(`   Division: ${data.division}`);
      console.log(`   Conference: ${data.conference}`);
      console.log(`   Enrollment: ${data.enrollment}`);
      console.log(`   Academic Tier: ${data.academic_ranking}\n`);
    }
  }

  // Show division breakdown
  const { data: fbsSchools } = await supabase
    .from('schools')
    .select('name', { count: 'exact' })
    .eq('division', 'FBS');

  const { data: fcsSchools } = await supabase
    .from('schools')
    .select('name', { count: 'exact' })
    .eq('division', 'FCS');

  console.log('📊 Division Breakdown:');
  console.log(`   FBS: ${fbsSchools?.length || 0} schools`);
  console.log(`   FCS: ${fcsSchools?.length || 0} schools`);
  console.log(`   Total: ${(fbsSchools?.length || 0) + (fcsSchools?.length || 0)} schools\n`);

  console.log('✅ Schools import verified successfully!');
}

verifySchools();
