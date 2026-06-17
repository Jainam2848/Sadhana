import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Parse .env to get Service Role Key
let supabaseUrl = 'https://iwwziupfwytlbdlehgoh.supabase.co';
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

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey || process.env.SUPABASE_SERVICE_ROLE_KEY || '');

describe('Sadhana Personalization Engine Tests', () => {
  let testUserId: string;

  beforeAll(async () => {
    // 1. Create a dummy user profile
    testUserId = `test-user-${Math.floor(Math.random() * 1000000)}`;
    
    // We create a temporary mock auth.users row or insert directly into profiles since it has CASCADE
    // To make sure we satisfy foreign key, we can create a real auth user or insert directly if RLS is bypassed via service role.
    // Wait, profiles.id references auth.users(id), so we must create a real user in auth.users or use an existing test user.
    // Let's create a real user in auth using signUp.
    const uniqueEmail = `sadhaka.personalize.${Math.floor(Math.random() * 1000000)}@gmail.com`;
    const { data: signUpData, error: signUpError } = await supabaseAdmin.auth.admin.createUser({
      email: uniqueEmail,
      password: 'Password123!',
      email_confirm: true,
      user_metadata: {
        username: 'Personalization Tester'
      }
    });

    if (signUpError) {
      throw new Error(`Failed to create test user: ${signUpError.message}`);
    }

    testUserId = signUpData.user!.id;
  });

  afterAll(async () => {
    // Clean up created user
    if (testUserId) {
      await supabaseAdmin.auth.admin.deleteUser(testUserId);
    }
  });

  test('Inserting onboarding responses automatically creates exactly 7 daily plans via database trigger', async () => {
    // Ensure no prior plans exist
    const { data: initialPlans } = await supabaseAdmin
      .from('sadhana_plans')
      .select('*')
      .eq('user_id', testUserId);
    expect(initialPlans?.length).toBe(0);

    // Insert onboarding responses
    const { error: insertError } = await supabaseAdmin
      .from('onboarding_responses')
      .insert({
        user_id: testUserId,
        goals: ['stress', 'mobility'],
        tightness: ['lower_back', 'shoulders'],
        experience_level: 'beginner',
        habit_anchor: 'After my morning tea'
      });

    expect(insertError).toBeNull();

    // Verify 7 daily plans are automatically generated
    const { data: generatedPlans, error: plansError } = await supabaseAdmin
      .from('sadhana_plans')
      .select('*')
      .eq('user_id', testUserId)
      .order('day_of_week', { ascending: true });

    expect(plansError).toBeNull();
    expect(generatedPlans).not.toBeNull();
    expect(generatedPlans!.length).toBe(7);

    // Verify day_of_week index coverage (0 to 6)
    const days = generatedPlans!.map(p => p.day_of_week);
    expect(days).toEqual([0, 1, 2, 3, 4, 5, 6]);

    // Verify each plan has matching routines
    for (const plan of generatedPlans!) {
      expect(plan.asana_routine_id).not.toBeNull();
      expect(plan.pranayama_routine_id).not.toBeNull();
      expect(plan.dhyana_routine_id).not.toBeNull();

      // Retrieve and assert asana routine tags
      const { data: asana } = await supabaseAdmin
        .from('sadhana_routines')
        .select('*')
        .eq('id', plan.asana_routine_id)
        .single();
      
      expect(asana.experience_level).toBe('beginner');
      expect(asana.category).toBe('asana');
      
      // The tightness tag should match one of the user's targeted tightness areas
      const matchesTightness = asana.tightness.some((t: string) => ['lower_back', 'shoulders'].includes(t));
      expect(matchesTightness).toBe(true);

      // Retrieve and assert pranayama/dhyana goals
      const { data: pranayama } = await supabaseAdmin
        .from('sadhana_routines')
        .select('*')
        .eq('id', plan.pranayama_routine_id)
        .single();
      expect(pranayama.category).toBe('pranayama');
      expect(pranayama.experience_level).toBe('beginner');

      const { data: dhyana } = await supabaseAdmin
        .from('sadhana_routines')
        .select('*')
        .eq('id', plan.dhyana_routine_id)
        .single();
      expect(dhyana.category).toBe('dhyana');
    }
  });
});
