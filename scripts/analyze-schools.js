import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from parent directory
dotenv.config({ path: resolve(__dirname, '../.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function analyzeSchools() {
  console.log('🔍 Analyzing schools table...\n');

  try {
    // Get all schools
    const { data: schools, error } = await supabase
      .from('schools')
      .select('*')
      .limit(5); // Get a sample to see structure

    if (error) {
      console.error('Error fetching schools:', error);
      return;
    }

    console.log('📊 Sample school structure:');
    console.log(JSON.stringify(schools[0], null, 2));
    console.log('\n');

    // Count total schools
    const { count: totalCount, error: countError } = await supabase
      .from('schools')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('Error counting schools:', countError);
    } else {
      console.log(`📈 Total schools: ${totalCount}\n`);
    }

    // Check for schools without academic_tier
    const { data: schoolsWithoutTier, count: missingTierCount, error: tierError } = await supabase
      .from('schools')
      .select('id, name, conference', { count: 'exact' })
      .or('academic_tier.is.null,academic_tier.eq.');

    if (tierError) {
      console.error('Error checking academic tiers:', tierError);
    } else {
      console.log(`❌ Schools missing academic_tier: ${missingTierCount}`);
      if (missingTierCount > 0 && schoolsWithoutTier) {
        console.log('\nSample schools without tier:');
        schoolsWithoutTier.slice(0, 10).forEach(school => {
          console.log(`  - ${school.name} (${school.conference || 'No conference'})`);
        });
      }
      console.log('\n');
    }

    // Get unique conferences
    const { data: conferences, error: confError } = await supabase
      .from('schools')
      .select('conference')
      .not('conference', 'is', null);

    if (confError) {
      console.error('Error fetching conferences:', confError);
    } else {
      const uniqueConferences = [...new Set(conferences.map(s => s.conference))].sort();
      console.log(`🏈 Unique conferences (${uniqueConferences.length}):`);
      uniqueConferences.forEach(conf => {
        console.log(`  - ${conf}`);
      });
      console.log('\n');
    }

    // Get division breakdown
    const { data: divisions, error: divError } = await supabase
      .from('schools')
      .select('division')
      .not('division', 'is', null);

    if (divError) {
      console.error('Error fetching divisions:', divError);
    } else {
      const divisionCounts = divisions.reduce((acc, { division }) => {
        acc[division] = (acc[division] || 0) + 1;
        return acc;
      }, {});

      console.log('📊 Schools by division:');
      Object.entries(divisionCounts).sort().forEach(([div, count]) => {
        console.log(`  - ${div}: ${count} schools`);
      });
      console.log('\n');
    }

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

analyzeSchools();
