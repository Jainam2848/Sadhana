const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// 1. Simple manual .env parser to avoid requiring dotenv dependency
const envPath = path.join(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split(/\r?\n/).forEach(line => {
    // Skip comments
    if (line.trim().startsWith('#')) return;
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || '';
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.substring(1, value.length - 1);
      }
      process.env[key] = value.trim();
    }
  });
}

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
// We require the service_role key to bypass Row-Level Security policies for admin actions
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  console.error('Error: EXPO_PUBLIC_SUPABASE_URL is not defined in your .env file.');
  process.exit(1);
}

if (!supabaseServiceRoleKey) {
  console.error('\n❌ Missing SUPABASE_SERVICE_ROLE_KEY');
  console.error('To run this seed script, please add your Supabase Service Role Key to your .env file:');
  console.error('SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here\n');
  console.error('You can find this key on your Supabase Dashboard under:');
  console.error('Project Settings -> API -> service_role (secret)\n');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function runSeed() {
  try {
    const seedDataPath = path.join(__dirname, 'seed_data.json');
    if (!fs.existsSync(seedDataPath)) {
      console.error(`Error: Seed data file not found at ${seedDataPath}`);
      process.exit(1);
    }
    
    const seedData = JSON.parse(fs.readFileSync(seedDataPath, 'utf-8'));
    
    // 1. Seed Routines
    console.log(`Seeding ${seedData.routines.length} routines into sadhana_routines...`);
    const { error: routinesError } = await supabase
      .from('sadhana_routines')
      .upsert(seedData.routines, { onConflict: 'id' });
      
    if (routinesError) {
      throw new Error(`Failed to seed routines: ${routinesError.message}`);
    }
    console.log('✅ Routines upserted successfully.');

    // 2. Clean Existing Global Plans
    // Since day_of_week + user_id has unique check, we delete global plans (user_id IS NULL)
    // first to avoid any unique constraint errors.
    console.log('Cleaning up old global daily plans...');
    const { error: cleanPlansError } = await supabase
      .from('sadhana_plans')
      .delete()
      .is('user_id', null);

    if (cleanPlansError) {
      throw new Error(`Failed to clean plans: ${cleanPlansError.message}`);
    }

    // 3. Seed Daily Plans
    console.log(`Seeding ${seedData.plans.length} global fallback daily plans...`);
    const { error: plansError } = await supabase
      .from('sadhana_plans')
      .insert(seedData.plans);
      
    if (plansError) {
      throw new Error(`Failed to seed plans: ${plansError.message}`);
    }
    console.log('✅ Daily plans seeded successfully.');
    console.log('\n🎉 Database seeding complete!');
    
  } catch (error) {
    console.error('\n❌ Seeding failed:', error.message);
    process.exit(1);
  }
}

runSeed();
