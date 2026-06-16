import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

test('Verify custom RPC backend functions are registered and secure', async () => {
  // 1. Calling increment_ad_views without auth should trigger 'Not authenticated' exception
  const { data: adData, error: adError } = await supabase.rpc('increment_ad_views');
  expect(adError).not.toBeNull();
  expect(adError?.message).toContain('Not authenticated');

  // 2. Calling redeem_karma_coins without auth should trigger 'Not authenticated' exception
  const { data: redeemData, error: redeemError } = await supabase.rpc('redeem_karma_coins', {
    amount: 10,
    transaction_type: 'redeem_discount',
    description: 'Test discount'
  });
  expect(redeemError).not.toBeNull();
  expect(redeemError?.message).toContain('Not authenticated');

  // 3. Calling delete_user_account without auth should trigger 'Not authenticated' exception
  const { data: deleteData, error: deleteError } = await supabase.rpc('delete_user_account');
  expect(deleteError).not.toBeNull();
  expect(deleteError?.message).toContain('Not authenticated');
});
