import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

test('Sadhana routines catalog permits public reads but blocks guest writes via RLS', async () => {
  // 1. Verify we can select from the routines table (should succeed, even if empty)
  const { data: selectData, error: selectError } = await supabase
    .from('sadhana_routines')
    .select('*')
    .limit(1);

  expect(selectError).toBeNull();

  // 2. Verify that a guest cannot insert into the routines table
  const dummyRoutineId = '00000000-0000-0000-0000-000000000001';
  const { data: insertData, error: insertError } = await supabase
    .from('sadhana_routines')
    .insert({
      id: dummyRoutineId,
      title: 'Hacked Routine',
      description: 'Should be blocked by RLS policies',
      duration_minutes: 10,
      category: 'asana',
      is_premium: false,
      thumbnail_url: 'http://example.com/thumb.jpg',
      media_url: 'http://example.com/media.mp4'
    })
    .select();

  // Since RLS is not yet enabled/configured, this insert will SUCCEED, and error will be NULL.
  // We expect it to FAIL (insertError is not null) under RLS protection.
  expect(insertError).not.toBeNull();
  expect(insertError?.code).toBe('42501'); // Postgres RLS permission denied code
});
