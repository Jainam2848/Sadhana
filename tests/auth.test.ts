import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

test('User registration automatically creates a profile row via DB trigger', async () => {
  const uniqueEmail = `sadhaka.test.${Math.floor(Math.random() * 1000000)}@gmail.com`;
  const uniquePassword = 'Password123!';


  // 1. Sign up the new user
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: uniqueEmail,
    password: uniquePassword,
    options: {
      data: {
        username: 'Test Sadhaka'
      }
    }
  });

  expect(signUpError).toBeNull();
  expect(signUpData.user).not.toBeNull();
  const userId = signUpData.user!.id;

  // 2. Query the profiles table for this userId (using anon client)
  // Since RLS is not yet enabled, we can query it directly.
  // But since the trigger is not yet installed, this profile row should not exist!
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  expect(profileError).toBeNull();
  expect(profile).not.toBeNull();
  expect(profile?.username).toBe('Test Sadhaka');
});
