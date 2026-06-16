import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

// TypeScript interfaces matching Database schema
export interface Profile {
  id: string;
  username: string | null;
  avatar_url: string | null;
  premium: boolean;
  monthly_ad_count: number;
  karma_coins: number;
  created_at: string;
}

export interface Routine {
  id: string;
  title: string;
  description: string;
  duration_minutes: number;
  category: 'asana' | 'pranayama' | 'dhyana' | 'philosophy';
  is_premium: boolean;
  thumbnail_url: string | null;
  media_url: string | null;
  sanskrit_terms: Record<string, string> | null;
}

export interface SadhanaPlan {
  id: string;
  user_id: string | null;
  asana_routine_id: string | null;
  pranayama_routine_id: string | null;
  dhyana_routine_id: string | null;
  day_of_week: number;
  asana?: Routine;
  pranayama?: Routine;
  dhyana?: Routine;
}

// 1. Fetch Profile hook
export function useProfile(userId: string | undefined) {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User ID is required');
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data as Profile;
    },
    enabled: !!userId,
  });
}

// 2. Fetch routines catalog
export function useRoutines(category?: string) {
  return useQuery({
    queryKey: ['routines', category],
    queryFn: async () => {
      let query = supabase.from('sadhana_routines').select('*');
      if (category) {
        query = query.eq('category', category);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data as Routine[];
    },
  });
}

// 2b. Fetch single routine by ID
export function useRoutine(routineId: string | undefined) {
  return useQuery({
    queryKey: ['routine', routineId],
    queryFn: async () => {
      if (!routineId) throw new Error('Routine ID is required');
      const { data, error } = await supabase
        .from('sadhana_routines')
        .select('*')
        .eq('id', routineId)
        .single();
      if (error) throw error;
      return data as Routine;
    },
    enabled: !!routineId,
  });
}


// 3. Fetch today's plan
export function useTodayPlan(userId: string | undefined, isPremium: boolean, dayOfWeek: number) {
  return useQuery({
    queryKey: ['today_plan', userId, isPremium, dayOfWeek],
    queryFn: async () => {
      // Query plans with nested routines loaded (via joins)
      let query = supabase
        .from('sadhana_plans')
        .select(`
          id,
          user_id,
          day_of_week,
          asana:asana_routine_id(*),
          pranayama:pranayama_routine_id(*),
          dhyana:dhyana_routine_id(*)
        `);

      if (isPremium && userId) {
        // Premium users get their personalized plan
        query = query.eq('user_id', userId).eq('day_of_week', dayOfWeek);
      } else {
        // Free users get the global fallback (user_id is null)
        query = query.is('user_id', null).eq('day_of_week', dayOfWeek);
      }

      const { data, error } = await query.maybeSingle();
      if (error) throw error;
      return data as SadhanaPlan | null;
    },
    // Run if dayOfWeek is valid; premium status is required to decide path
    enabled: dayOfWeek >= 0 && dayOfWeek <= 6,
  });
}

// 4. Log completed session
export function useSubmitSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ routineId, durationPracticed }: { routineId: string; durationPracticed: number }) => {
      const { data, error } = await supabase
        .from('session_logs')
        .insert({
          routine_id: routineId,
          duration_practiced: durationPracticed,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data, variables) => {
      // Invalidate streak query, profile query to fetch updated stats
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['streaks'] });
    },
  });
}

// 5. Increment ad views (RPC)
export function useIncrementAdViews() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.rpc('increment_ad_views');
      if (error) throw error;
      return data as {
        success: boolean;
        updated_ad_count: number;
        milestone_unlocked: boolean;
        karma_coins_added: number;
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}

// 6. Redeem Karma Coins (RPC)
export function useRedeemCoins() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ amount, type, description }: { amount: number; type: string; description: string }) => {
      const { data, error } = await supabase.rpc('redeem_karma_coins', {
        amount,
        transaction_type: type,
        description,
      });
      if (error) throw error;
      return data as {
        success: boolean;
        remaining_balance: number;
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}

// 7. Request Account Deletion (RPC)
export function useDeleteAccount() {
  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase.rpc('delete_user_account');
      if (error) throw error;
    },
  });
}
