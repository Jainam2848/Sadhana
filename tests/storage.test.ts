import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

test('Supabase storage media bucket is public and blocks unauthorized uploads', async () => {
  // 1. Verify the 'media' bucket exists and is public
  const { data: bucket, error: bucketError } = await supabase
    .storage
    .getBucket('media');
    
  // Since the bucket doesn't exist yet, this should return an error.
  expect(bucketError).toBeNull();
  expect(bucket).toBeDefined();
  expect(bucket?.public).toBe(true);

  // 2. Verify guest uploads are blocked by policy
  const fileBody = Buffer.from('dummy audio content');
  const { data: uploadData, error: uploadError } = await supabase
    .storage
    .from('media')
    .upload('test_meditation.mp3', fileBody, {
      contentType: 'audio/mpeg',
      upsert: true
    });

  expect(uploadError).not.toBeNull();
});
