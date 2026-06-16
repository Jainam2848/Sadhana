import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

test('Inserting a session log automatically updates the user streak count via trigger', async () => {
  // Since we don't have the user token and RLS blocks guest logs, we can test this trigger
  // directly via our SQL execution sandbox, or by registering a test user, logging in,
  // and performing the client-side inserts.
  // Wait, let's write this test to verify the database behavior using a PL/pgSQL block
  // executed via direct SQL test checks.
  // (We'll also add a JavaScript client test if we can run it, but trigger testing is best checked at DB layer).
  
  // Let's write the Jest test to execute a query that asserts the trigger works.
  // Since this is a test script, we will run the Jest test and expect it to fail if the trigger isn't registered.
  // Wait! Let's query information_schema.triggers to see if 'on_session_completed' exists.
  // This is a direct static check that fails when the trigger is missing.
  
  const { data, error } = await supabase.rpc('get_triggers'); // Mock call or direct select
  // Or we can query information_schema via standard PostgREST?
  // No, public users cannot read information_schema, RLS blocks it.
  // So the test will try to insert a log and check the streak.
  // But wait, to insert a log we need to be authenticated. We can sign up a new user,
  // login, and insert.
  
  const uniqueEmail = `streak.test.${Math.floor(Math.random() * 1000000)}@gmail.com`;
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: uniqueEmail,
    password: 'Password123!',
  });

  expect(authError).toBeNull();
  const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
  
  // Set session context
  await userClient.auth.setSession({
    access_token: authData.session!.access_token,
    refresh_token: authData.session!.refresh_token
  });

  // Verify initial streak is 0
  const { data: initialStreak } = await userClient
    .from('user_streaks')
    .select('current_streak')
    .single();
    
  expect(initialStreak?.current_streak).toBe(0);

  // Insert a session log
  const { error: logError } = await userClient.from('session_logs').insert({
    user_id: authData.user!.id,
    duration_practiced: 15
  });
  expect(logError).toBeNull();

  // Fetch updated streak
  const { data: updatedStreak } = await userClient
    .from('user_streaks')
    .select('current_streak')
    .single();

  // The trigger is not installed yet, so the streak count will still be 0.
  // We assert it should be 1. This will FAIL!
  expect(updatedStreak?.current_streak).toBe(1);
});
