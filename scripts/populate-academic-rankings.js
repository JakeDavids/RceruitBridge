import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, '../.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Tier 1: Elite academic institutions (Ivy League level)
const tier1Schools = [
  'Harvard', 'Yale', 'Princeton', 'Columbia', 'Penn', 'Pennsylvania', 'Dartmouth', 'Brown', 'Cornell',
  'Stanford', 'MIT', 'Duke', 'Northwestern', 'Vanderbilt', 'Rice', 'Notre Dame',
  'Caltech', 'Johns Hopkins', 'WashU', 'Washington University', 'Emory',
  'Carnegie Mellon', 'Georgetown', 'Williams', 'Amherst', 'Swarthmore', 'Pomona',
  'Bowdoin', 'Middlebury', 'Wesleyan', 'Claremont', 'Harvey Mudd'
];

// Tier 2: Highly competitive and selective schools
const tier2Schools = [
  'Michigan', 'Virginia', 'UCLA', 'Berkeley', 'North Carolina', 'USC', 'Wake Forest',
  'Boston College', 'Tufts', 'NYU', 'Brandeis', 'Rochester', 'Case Western',
  'Georgia Tech', 'Illinois', 'Wisconsin', 'Texas', 'Washington', 'Florida',
  'William & Mary', 'Villanova', 'Lehigh', 'Bucknell', 'Colgate', 'Davidson',
  'Richmond', 'Bates', 'Colby', 'Hamilton', 'Trinity', 'Kenyon', 'Oberlin',
  'Reed', 'Vassar', 'Haverford', 'Carleton', 'Macalester', 'Grinnell'
];

// Tier 3: Solid competitive schools
const tier3Conferences = [
  'Patriot', 'Pioneer', 'CAA', 'NEC', 'Big Sky', 'Missouri Valley', 'Colonial Athletic'
];

// Elite conferences (mostly Tier 1-2)
const eliteConferences = ['Ivy League', 'ACC', 'Big Ten', 'SEC', 'Pac 12', 'Big 12'];

// Tier 5 indicators
const tier5Conferences = ['CCCAA', 'NJCAA', 'MACCC', 'KJCCC', 'SWJCFC', 'SCFA'];

function determineTier(school) {
  const name = school.name.toLowerCase();
  const conference = school.conference || '';
  const division = school.division || '';

  // Check if it's Tier 1 (Elite)
  if (tier1Schools.some(t1 => name.includes(t1.toLowerCase()))) {
    return 'Tier 1 – Most Competitive';
  }

  // Check if it's Tier 2 (Highly Competitive)
  if (tier2Schools.some(t2 => name.includes(t2.toLowerCase()))) {
    return 'Tier 2 – Highly Competitive';
  }

  // Ivy League is always Tier 1
  if (conference === 'Ivy League') {
    return 'Tier 1 – Most Competitive';
  }

  // Elite conferences in FBS are typically Tier 2-3
  if (eliteConferences.includes(conference) && division === 'FBS') {
    return 'Tier 2 – Highly Competitive';
  }

  // NESCAC (New England Small College Athletic Conference) is typically Tier 1-2
  if (conference === 'NESCAC') {
    return 'Tier 2 – Highly Competitive';
  }

  // Patriot League and similar academic conferences
  if (tier3Conferences.includes(conference)) {
    return 'Tier 3 – Competitive';
  }

  // JUCO schools are typically Tier 5
  if (division === 'JUCO' || tier5Conferences.some(t5 => conference.includes(t5))) {
    return 'Tier 5 – Least Competitive';
  }

  // FBS schools not in elite conferences
  if (division === 'FBS') {
    return 'Tier 3 – Competitive';
  }

  // FCS schools
  if (division === 'FCS') {
    // UAA, ODAC, SCAC are academic conferences
    if (['UAA', 'ODAC', 'SCAC', 'NEWMAC', 'Centennial'].includes(conference)) {
      return 'Tier 2 – Highly Competitive';
    }
    return 'Tier 3 – Competitive';
  }

  // D2 schools
  if (division === 'D2') {
    return 'Tier 4 – Less Competitive';
  }

  // D3 schools - more varied
  if (division === 'D3') {
    // Academic D3 conferences
    if (['UAA', 'NESCAC', 'SCAC', 'NEWMAC', 'Centennial', 'CCIW'].includes(conference)) {
      return 'Tier 2 – Highly Competitive';
    }
    return 'Tier 4 – Less Competitive';
  }

  // Default
  return 'Tier 4 – Less Competitive';
}

async function populateAcademicRankings() {
  console.log('🎓 Populating academic rankings for all schools...\n');

  try {
    // Fetch all schools
    const { data: schools, error } = await supabase
      .from('schools')
      .select('*');

    if (error) {
      console.error('Error fetching schools:', error);
      return;
    }

    console.log(`📊 Processing ${schools.length} schools...\n`);

    const tierCounts = {
      'Tier 1 – Most Competitive': 0,
      'Tier 2 – Highly Competitive': 0,
      'Tier 3 – Competitive': 0,
      'Tier 4 – Less Competitive': 0,
      'Tier 5 – Least Competitive': 0
    };

    let updated = 0;
    let failed = 0;

    // Process in batches of 50
    for (let i = 0; i < schools.length; i += 50) {
      const batch = schools.slice(i, i + 50);

      for (const school of batch) {
        const tier = determineTier(school);
        tierCounts[tier]++;

        const { error: updateError } = await supabase
          .from('schools')
          .update({ academic_ranking: tier })
          .eq('id', school.id);

        if (updateError) {
          console.error(`Failed to update ${school.name}:`, updateError);
          failed++;
        } else {
          updated++;
        }
      }

      console.log(`✓ Processed ${Math.min(i + 50, schools.length)}/${schools.length} schools`);
    }

    console.log('\n✅ Academic ranking population complete!\n');
    console.log('📊 Final distribution:');
    Object.entries(tierCounts).forEach(([tier, count]) => {
      const percentage = ((count / schools.length) * 100).toFixed(1);
      console.log(`  ${tier}: ${count} schools (${percentage}%)`);
    });
    console.log(`\n✓ Successfully updated: ${updated}`);
    console.log(`✗ Failed: ${failed}`);

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

populateAcademicRankings();
