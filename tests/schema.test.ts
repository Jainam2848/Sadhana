import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

test('Database tables profiles and sadhana_routines exist', async () => {
  const { data: profiles, error: pError } = await supabase.from('profiles').select('*').limit(1);
  const { data: routines, error: rError } = await supabase.from('sadhana_routines').select('*').limit(1);

  // Since the tables do not exist, these requests should fail with code 42P01 (relation does not exist)
  expect(pError).toBeNull();
  expect(rError).toBeNull();
});
