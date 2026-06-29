const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

let supabaseUrl = '';
let serviceRoleKey = '';

const envPath = path.join(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split(/\r?\n/).forEach(line => {
    if (line.trim().startsWith('#')) return;
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || '';
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.substring(1, value.length - 1);
      }
      if (key === 'EXPO_PUBLIC_SUPABASE_URL') {
        supabaseUrl = value.trim();
      }
      if (key === 'SUPABASE_SERVICE_ROLE_KEY') {
        serviceRoleKey = value.trim();
      }
    }
  });
}

console.log('Supabase URL:', supabaseUrl);

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

async function run() {
  const { data, error } = await supabaseAdmin
    .from('onboarding_responses')
    .select('*')
    .limit(1);

  if (error) {
    console.error('Error fetching from onboarding_responses:', error);
  } else {
    console.log('Successfully fetched from onboarding_responses!');
    if (data.length > 0) {
      console.log('Columns returned:', Object.keys(data[0]));
    } else {
      console.log('Table is empty, no rows to inspect columns from.');
    }
  }
}

run();
