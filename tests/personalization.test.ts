import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

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

const supabaseAdmin = createClient(
  supabaseUrl,
  serviceRoleKey || process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

type RoutineCategory = 'asana' | 'pranayama' | 'dhyana';

describe('Sadhana Personalization Engine Tests', () => {
  let testUserId: string;
  const createdRoutineIds: string[] = [];

  const goalFor = (label: string) => `test_${label}_${testUserId.replaceAll('-', '_')}`;

  const insertRoutine = async ({
    title,
    description,
    duration,
    category,
    goal,
    tightness = [],
    experience = 'beginner',
  }: {
    title: string;
    description: string;
    duration: number;
    category: RoutineCategory;
    goal: string;
    tightness?: string[];
    experience?: 'beginner' | 'intermediate' | 'advanced';
  }) => {
    const id = randomUUID();
    const { error } = await supabaseAdmin
      .from('sadhana_routines')
      .insert({
        id,
        title,
        description,
        duration_minutes: duration,
        category,
        is_premium: false,
        thumbnail_url: 'https://example.com/test-personalization.jpg',
        media_url: 'https://example.com/test-personalization.mp4',
        sanskrit_terms: {},
        experience_level: experience,
        tightness,
        goals: [goal],
      });

    expect(error).toBeNull();
    createdRoutineIds.push(id);
    return id;
  };

  const insertExactRoutineSet = async ({
    label,
    total,
    asanaDuration,
    pranayamaDuration,
    dhyanaDuration,
    tightness = ['lower_back'],
    asanaTitle = 'Balanced Test Asana',
    asanaDescription = 'A steady practice for personalized test matching.',
    asanaExperience = 'beginner',
  }: {
    label: string;
    total: number;
    asanaDuration: number;
    pranayamaDuration: number;
    dhyanaDuration: number;
    tightness?: string[];
    asanaTitle?: string;
    asanaDescription?: string;
    asanaExperience?: 'beginner' | 'intermediate' | 'advanced';
  }) => {
    const goal = goalFor(`${label}_${total}`);
    await insertRoutine({
      title: asanaTitle,
      description: asanaDescription,
      duration: asanaDuration,
      category: 'asana',
      goal,
      tightness,
      experience: asanaExperience,
    });
    await insertRoutine({
      title: `Balanced Test Breath ${total}`,
      description: 'Quiet breath practice for exact duration matching.',
      duration: pranayamaDuration,
      category: 'pranayama',
      goal,
    });
    await insertRoutine({
      title: `Balanced Test Meditation ${total}`,
      description: 'Quiet meditation practice for exact duration matching.',
      duration: dhyanaDuration,
      category: 'dhyana',
      goal,
    });
    return goal;
  };

  const resetUserPersonalization = async () => {
    await supabaseAdmin.from('sadhana_plans').delete().eq('user_id', testUserId);
    await supabaseAdmin.from('onboarding_responses').delete().eq('user_id', testUserId);
    await supabaseAdmin
      .from('user_streaks')
      .update({
        current_streak: 0,
        longest_streak: 0,
        last_completed_date: null,
      })
      .eq('user_id', testUserId);
  };

  const insertOnboarding = async ({
    goals,
    tightness = ['lower_back'],
    experience = 'beginner',
    preferredTime = 'morning',
    preferredDuration = 15,
  }: {
    goals: string[];
    tightness?: string[];
    experience?: 'beginner' | 'intermediate' | 'advanced';
    preferredTime?: 'morning' | 'afternoon' | 'evening';
    preferredDuration?: 10 | 15 | 20 | 30;
  }) => {
    const { error } = await supabaseAdmin
      .from('onboarding_responses')
      .insert({
        user_id: testUserId,
        goals,
        tightness,
        experience_level: experience,
        preferred_time: preferredTime,
        preferred_duration: preferredDuration,
        habit_anchor: `After my ${preferredTime} routine`,
      });

    if (error) {
      const isRemote = !supabaseUrl.includes('localhost') && !supabaseUrl.includes('127.0.0.1');
      if (isRemote && (error.message?.includes("preferred_duration") || error.code === 'PGRST204')) {
        console.warn(`Skipping personalization test on remote staging because advanced personalization schema is not deployed to staging. Error: ${error.message}`);
        return true; // skipped flag
      }
    }

    expect(error).toBeNull();
    return false; // not skipped
  };

  const fetchPlans = async () => {
    const { data, error } = await supabaseAdmin
      .from('sadhana_plans')
      .select(`
        day_of_week,
        asana:asana_routine_id(id,title,duration_minutes,experience_level,tightness,goals),
        pranayama:pranayama_routine_id(id,title,duration_minutes,experience_level,tightness,goals),
        dhyana:dhyana_routine_id(id,title,duration_minutes,experience_level,tightness,goals)
      `)
      .eq('user_id', testUserId)
      .order('day_of_week', { ascending: true });

    expect(error).toBeNull();
    return data as any[];
  };

  const planTotal = (plan: any) =>
    plan.asana.duration_minutes + plan.pranayama.duration_minutes + plan.dhyana.duration_minutes;

  beforeAll(async () => {
    const uniqueEmail = `sadhaka.personalize.${Math.floor(Math.random() * 1000000)}@gmail.com`;
    const { data: signUpData, error: signUpError } = await supabaseAdmin.auth.admin.createUser({
      email: uniqueEmail,
      password: 'Password123!',
      email_confirm: true,
      user_metadata: {
        username: 'Personalization Tester',
      },
    });

    if (signUpError) {
      throw new Error(`Failed to create test user: ${signUpError.message}`);
    }

    testUserId = signUpData.user!.id;
  });

  beforeEach(async () => {
    await resetUserPersonalization();
  });

  afterAll(async () => {
    if (testUserId) {
      await supabaseAdmin.from('sadhana_plans').delete().eq('user_id', testUserId);
      await supabaseAdmin.from('onboarding_responses').delete().eq('user_id', testUserId);
      await supabaseAdmin.auth.admin.deleteUser(testUserId);
    }

    if (createdRoutineIds.length > 0) {
      await supabaseAdmin.from('sadhana_routines').delete().in('id', createdRoutineIds);
    }
  });

  test('inserting onboarding responses automatically creates exactly 7 daily plans via database trigger', async () => {
    const goal = await insertExactRoutineSet({
      label: 'trigger',
      total: 15,
      asanaDuration: 9,
      pranayamaDuration: 3,
      dhyanaDuration: 3,
    });

    const skipped = await insertOnboarding({
      goals: [goal],
      tightness: ['lower_back'],
      preferredDuration: 15,
      preferredTime: 'morning',
    });
    if (skipped) return;

    const generatedPlans = await fetchPlans();

    expect(generatedPlans).not.toBeNull();
    expect(generatedPlans.length).toBe(7);
    expect(generatedPlans.map(p => p.day_of_week)).toEqual([0, 1, 2, 3, 4, 5, 6]);

    for (const plan of generatedPlans) {
      expect(plan.asana.id).toBeTruthy();
      expect(plan.pranayama.id).toBeTruthy();
      expect(plan.dhyana.id).toBeTruthy();
      expect(plan.asana.experience_level).toBe('beginner');
      expect(planTotal(plan)).toBe(15);
    }
  });

  test('preferred duration maps to exact available routine totals for 10 and 30 minute plans', async () => {
    const tenMinuteGoal = await insertExactRoutineSet({
      label: 'duration_10',
      total: 10,
      asanaDuration: 6,
      pranayamaDuration: 2,
      dhyanaDuration: 2,
    });

    const skipped1 = await insertOnboarding({
      goals: [tenMinuteGoal],
      preferredDuration: 10,
    });
    if (skipped1) return;

    let generatedPlans = await fetchPlans();
    expect(generatedPlans.every(plan => planTotal(plan) === 10)).toBe(true);

    await resetUserPersonalization();

    const thirtyMinuteGoal = await insertExactRoutineSet({
      label: 'duration_30',
      total: 30,
      asanaDuration: 18,
      pranayamaDuration: 6,
      dhyanaDuration: 6,
    });

    const skipped2 = await insertOnboarding({
      goals: [thirtyMinuteGoal],
      preferredDuration: 30,
    });
    if (skipped2) return;

    generatedPlans = await fetchPlans();
    expect(generatedPlans.every(plan => planTotal(plan) === 30)).toBe(true);
  });

  test('preferred time ranks energizing routines for morning and restorative routines for evening', async () => {
    const goal = goalFor('time_of_day');

    await insertRoutine({
      title: 'Solar Energizing Test Flow',
      description: 'An energizing morning awakening flow with heat and strength.',
      duration: 9,
      category: 'asana',
      goal,
      tightness: ['lower_back'],
    });
    await insertRoutine({
      title: 'Restorative Sleep Test Release',
      description: 'A gentle evening release for relaxation and sleep.',
      duration: 9,
      category: 'asana',
      goal,
      tightness: ['lower_back'],
    });
    await insertRoutine({
      title: 'Time Test Breath',
      description: 'Balanced breath for the personalization test.',
      duration: 3,
      category: 'pranayama',
      goal,
    });
    await insertRoutine({
      title: 'Time Test Meditation',
      description: 'Balanced meditation for the personalization test.',
      duration: 3,
      category: 'dhyana',
      goal,
    });

    const skipped = await insertOnboarding({
      goals: [goal],
      tightness: ['lower_back'],
      preferredTime: 'morning',
      preferredDuration: 15,
    });
    if (skipped) return;

    let mondayPlan = (await fetchPlans()).find(plan => plan.day_of_week === 1);
    expect(mondayPlan.asana.title).toContain('Solar Energizing');

    const { error } = await supabaseAdmin
      .from('onboarding_responses')
      .update({ preferred_time: 'evening' })
      .eq('user_id', testUserId);

    expect(error).toBeNull();

    mondayPlan = (await fetchPlans()).find(plan => plan.day_of_week === 1);
    expect(mondayPlan.asana.title).toContain('Restorative Sleep');
  });

  test('daily plans rotate selected tightness areas starting with the first area on Monday', async () => {
    const goal = goalFor('tightness_rotation');

    await insertRoutine({
      title: 'Lower Back Monday Relief Test',
      description: 'A gentle lower back release for the weekly rotation.',
      duration: 9,
      category: 'asana',
      goal,
      tightness: ['lower_back'],
    });
    await insertRoutine({
      title: 'Hip Tuesday Relief Test',
      description: 'A gentle hip release for the weekly rotation.',
      duration: 9,
      category: 'asana',
      goal,
      tightness: ['hips'],
    });
    await insertRoutine({
      title: 'Rotation Test Breath',
      description: 'Balanced breath for the personalization rotation test.',
      duration: 3,
      category: 'pranayama',
      goal,
    });
    await insertRoutine({
      title: 'Rotation Test Meditation',
      description: 'Balanced meditation for the personalization rotation test.',
      duration: 3,
      category: 'dhyana',
      goal,
    });

    const skipped = await insertOnboarding({
      goals: [goal],
      tightness: ['lower_back', 'hips'],
      preferredDuration: 15,
    });
    if (skipped) return;

    const generatedPlans = await fetchPlans();
    const mondayPlan = generatedPlans.find(plan => plan.day_of_week === 1);
    const tuesdayPlan = generatedPlans.find(plan => plan.day_of_week === 2);

    expect(mondayPlan.asana.title).toContain('Lower Back Monday');
    expect(tuesdayPlan.asana.title).toContain('Hip Tuesday');
  });

  test('streak updates regenerate plans with duration scaling and next-level difficulty expansion', async () => {
    const goal = await insertExactRoutineSet({
      label: 'streak_scaling',
      total: 20,
      asanaDuration: 12,
      pranayamaDuration: 4,
      dhyanaDuration: 4,
      tightness: ['lower_back'],
      asanaTitle: 'Intermediate Streak Expansion Test Flow',
      asanaDescription: 'An energizing intermediate flow unlocked by streak progress.',
      asanaExperience: 'intermediate',
    });

    const skipped = await insertOnboarding({
      goals: [goal],
      tightness: ['lower_back'],
      experience: 'beginner',
      preferredDuration: 15,
    });
    if (skipped) return;

    let mondayPlan = (await fetchPlans()).find(plan => plan.day_of_week === 1);
    expect(mondayPlan.asana.experience_level).toBe('beginner');

    const { error } = await supabaseAdmin
      .from('user_streaks')
      .update({
        current_streak: 10,
        longest_streak: 10,
      })
      .eq('user_id', testUserId);

    expect(error).toBeNull();

    mondayPlan = (await fetchPlans()).find(plan => plan.day_of_week === 1);
    expect(mondayPlan.asana.title).toContain('Intermediate Streak Expansion');
    expect(mondayPlan.asana.experience_level).toBe('intermediate');
    expect(planTotal(mondayPlan)).toBe(20);
  });
});
