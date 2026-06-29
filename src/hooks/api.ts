import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';

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
  experience_level?: 'beginner' | 'intermediate' | 'advanced';
  tightness?: string[];
  goals?: string[];
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

// Local in-memory state for demo/sandbox users to simulate DB updates during the app session
const demoProfiles: Record<string, Profile> = {};

function getDemoProfile(userId: string): Profile {
  if (!demoProfiles[userId]) {
    demoProfiles[userId] = {
      id: userId,
      username: userId === 'demo-premium-user-id' ? 'Devendra Nath' : 'Asha Devi',
      avatar_url: null,
      premium: userId === 'demo-premium-user-id',
      monthly_ad_count: 0,
      karma_coins: userId === 'demo-premium-user-id' ? 150 : 20,
      created_at: new Date().toISOString(),
    };
  }
  return demoProfiles[userId];
}

// 1. Fetch Profile hook
export function useProfile(userId: string | undefined) {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User ID is required');

      // Intercept demo sandbox users to return local mock profiles
      if (userId.startsWith('demo-')) {
        return getDemoProfile(userId);
      }

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
      
      // Fallback to local mock routines if DB has no records
      if (!data || data.length === 0) {
        return getLocalMockRoutines(category);
      }
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
        
      if (error) {
        // Fallback to local mock routine if query fails (e.g. not found on remote)
        const mock = getLocalMockRoutineById(routineId);
        if (mock) return mock;
        throw error;
      }
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
      // Intercept demo sandbox users to fetch the global fallback plan (user_id is null)
      if (userId && userId.startsWith('demo-')) {
        const { data, error } = await supabase
          .from('sadhana_plans')
          .select(`
            id,
            user_id,
            day_of_week,
            asana:asana_routine_id(*),
            pranayama:pranayama_routine_id(*),
            dhyana:dhyana_routine_id(*)
          `)
          .is('user_id', null)
          .eq('day_of_week', dayOfWeek)
          .maybeSingle();

        if (error) throw error;
        if (data) return data as unknown as SadhanaPlan;
        return getLocalMockPlan(dayOfWeek);
      }

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
      
      if (data) return data as unknown as SadhanaPlan;
      return getLocalMockPlan(dayOfWeek);
    },
    // Run if dayOfWeek is valid; premium status is required to decide path
    enabled: dayOfWeek >= 0 && dayOfWeek <= 6,
  });
}

// --- LOCAL MOCK FALLBACK DATA ---
const MOCK_ROUTINES: Routine[] = [
  {
    id: 'a1111111-1111-1111-1111-111111111111',
    title: 'Surya Namaskar (Sun Salutations)',
    description: 'A traditional sequence of 12 powerful yoga postures designed to awaken vital energy, improve circulation, and build physical flexibility. Excellent for morning practice.',
    duration_minutes: 10,
    category: 'asana',
    is_premium: false,
    thumbnail_url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600',
    media_url: 'https://example.com/media/surya_namaskar.mp4',
    experience_level: 'beginner',
    tightness: ['hips', 'hamstrings'],
    goals: ['mobility', 'strength'],
    sanskrit_terms: {
      "Surya Namaskar": "Sun Salutations",
      "Pranamasana": "Prayer Pose",
      "Hastauttanasana": "Raised Arms Pose",
      "Padahastasana": "Hand to Foot Pose",
      "Ashwa Sanchalanasana": "Equestrian Pose"
    }
  },
  {
    id: 'a2222222-2222-2222-2222-222222222222',
    title: 'Spinal Alignment & Awakening',
    description: 'Focuses on gentle spinal twists, cat-cow stretches, and chest openers to release stiffness from desk work, correct posture, and ground the nervous system.',
    duration_minutes: 15,
    category: 'asana',
    is_premium: false,
    thumbnail_url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=600',
    media_url: 'https://example.com/media/spinal_alignment.mp4',
    experience_level: 'beginner',
    tightness: ['lower_back', 'shoulders'],
    goals: ['stress', 'mobility'],
    sanskrit_terms: {
      "Marjariasana": "Cat Pose",
      "Bitilasana": "Cow Pose",
      "Adho Mukha Svanasana": "Downward Facing Dog",
      "Sukhasana": "Easy Pose"
    }
  },
  {
    id: 'a3333333-3333-3333-3333-333333333333',
    title: 'Gentle Joint Mobilization (Sukshma Vyayama)',
    description: 'A slow, therapeutic practice targeting joint mobility and energy flow. Focuses on neck rolls, shoulder openers, wrist flexions, and ankle rotations to improve fluid circulation.',
    duration_minutes: 12,
    category: 'asana',
    is_premium: false,
    thumbnail_url: 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?q=80&w=600',
    media_url: 'https://example.com/media/joint_mobilization.mp4',
    experience_level: 'beginner',
    tightness: ['shoulders', 'hips'],
    goals: ['mobility'],
    sanskrit_terms: {
      "Sukshma Vyayama": "Subtle exercise",
      "Tadasana": "Mountain Pose",
      "Vrikshasana": "Tree Pose"
    }
  },
  {
    id: 'a4444444-4444-4444-4444-444444444444',
    title: 'Vinyasa Flow: Solar Awakening',
    description: 'An energizing, dynamic flow connecting breath and movement to build core stability, leg strength, and internal heat. Recommended for intermediate practitioners.',
    duration_minutes: 20,
    category: 'asana',
    is_premium: true,
    thumbnail_url: 'https://images.unsplash.com/photo-1510894347713-fc3ed6ecda6e?q=80&w=600',
    media_url: 'https://example.com/media/vinyasa_flow.mp4',
    experience_level: 'intermediate',
    tightness: ['hips', 'hamstrings'],
    goals: ['strength', 'focus'],
    sanskrit_terms: {
      "Virabhadrasana": "Warrior Pose",
      "Trikonasana": "Triangle Pose",
      "Chaturanga Dandasana": "Four-Limbed Staff Pose"
    }
  },
  {
    id: 'a5555555-5555-5555-5555-555555555555',
    title: 'Deep Hip & Glute Release',
    description: 'A focused, deep stretching sequence targeting the glutes and deep hip rotators to release accumulated lower body tension.',
    duration_minutes: 15,
    category: 'asana',
    is_premium: true,
    thumbnail_url: 'https://images.unsplash.com/photo-1552196563-55cd4e45efb3?q=80&w=600',
    media_url: 'https://vjs.zencdn.net/v/oceans.mp4',
    experience_level: 'intermediate',
    tightness: ['hips', 'lower_back'],
    goals: ['mobility', 'stress'],
    sanskrit_terms: {
      "Eka Pada Rajakapotasana": "Pigeon Pose",
      "Anjaneyasana": "Low Lunge"
    }
  },
  {
    id: 'a6666666-6666-6666-6666-666666666666',
    title: 'Shoulder Openers & Neck Release',
    description: 'Gentle but deep somatic releases for tight shoulders, upper back, and neck, counteracting the effects of prolonged screen time.',
    duration_minutes: 10,
    category: 'asana',
    is_premium: false,
    thumbnail_url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=600',
    media_url: 'https://vjs.zencdn.net/v/oceans.mp4',
    experience_level: 'beginner',
    tightness: ['shoulders'],
    goals: ['mobility', 'stress'],
    sanskrit_terms: {
      "Garudasana": "Eagle Arms",
      "Balasana": "Child's Pose"
    }
  },
  {
    id: 'a7777777-7777-7777-7777-777777777777',
    title: 'Hamstring Sanctuary Flow',
    description: 'A slow-paced stretching routine aiming to safely lengthen the hamstrings and release tension in the posterior chain.',
    duration_minutes: 12,
    category: 'asana',
    is_premium: false,
    thumbnail_url: 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?q=80&w=600',
    media_url: 'https://vjs.zencdn.net/v/oceans.mp4',
    experience_level: 'beginner',
    tightness: ['hamstrings'],
    goals: ['mobility'],
    sanskrit_terms: {
      "Uttanasana": "Standing Forward Fold",
      "Adho Mukha Svanasana": "Downward Dog"
    }
  },
  {
    id: 'a8888888-8888-8888-8888-888888888888',
    title: 'Ashtanga Vinyasa Flow (Advanced)',
    description: 'A highly challenging, continuous physical sequence synchronizing breath and movement. For advanced practitioners with significant arm balance and core strength.',
    duration_minutes: 25,
    category: 'asana',
    is_premium: true,
    thumbnail_url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600',
    media_url: 'https://vjs.zencdn.net/v/oceans.mp4',
    experience_level: 'advanced',
    tightness: ['hips', 'hamstrings', 'shoulders'],
    goals: ['strength', 'focus'],
    sanskrit_terms: {
      "Bakasana": "Crow Pose",
      "Urdhva Dhanurasana": "Upward Bow Pose"
    }
  },
  {
    id: 'b1111111-1111-1111-1111-111111111111',
    title: 'Nadi Shodhana (Alternate Nostril Breathing)',
    description: 'A classical pranayama technique to balance the left and right hemispheres of the brain, quiet the mind, reduce anxiety, and purify subtle energy channels.',
    duration_minutes: 5,
    category: 'pranayama',
    is_premium: false,
    thumbnail_url: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80&w=600',
    media_url: 'https://example.com/media/nadi_shodhana.mp3',
    experience_level: 'beginner',
    tightness: [],
    goals: ['stress', 'focus'],
    sanskrit_terms: {
      "Nadi Shodhana": "Channel Purification",
      "Prana": "Vital Energy",
      "Ida": "Left channel (lunar)",
      "Pingala": "Right channel (solar)"
    }
  },
  {
    id: 'b2222222-2222-2222-2222-222222222222',
    title: 'Kapalabhati (Skull Shining Breath)',
    description: 'A powerful, invigorating breathing technique utilizing active, rapid exhalations to clear the nasal passages, increase oxygenation, and energize the brain.',
    duration_minutes: 8,
    category: 'pranayama',
    is_premium: false,
    thumbnail_url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=600',
    media_url: 'https://example.com/media/kapalabhati.mp3',
    experience_level: 'intermediate',
    tightness: [],
    goals: ['energy', 'focus'],
    sanskrit_terms: {
      "Kapalabhati": "Skull Shining Breath",
      "Rechaka": "Exhalation",
      "Puraka": "Inhalation"
    }
  },
  {
    id: 'b3333333-3333-3333-3333-333333333333',
    title: 'Sheetali (Cooling Breath)',
    description: 'A soothing, cooling pranayama technique helpful for reducing physical body temperature, calming anger, and relieving stress.',
    duration_minutes: 6,
    category: 'pranayama',
    is_premium: true,
    thumbnail_url: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?q=80&w=600',
    media_url: 'https://example.com/media/sheetali.mp3',
    experience_level: 'beginner',
    tightness: [],
    goals: ['stress'],
    sanskrit_terms: {
      "Sheetali": "Cooling Breath",
      "Kumbhaka": "Breath Retention"
    }
  },
  {
    id: 'b4444444-4444-4444-4444-444444444444',
    title: 'Box Breathing (Sama Vritti)',
    description: 'A highly structured equal ratio breathing technique (4s inhale, 4s hold, 4s exhale, 4s hold) used by high performers to regulate the nervous system and build extreme focus.',
    duration_minutes: 6,
    category: 'pranayama',
    is_premium: false,
    thumbnail_url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=600',
    media_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    experience_level: 'beginner',
    tightness: [],
    goals: ['focus', 'stress'],
    sanskrit_terms: {
      "Sama Vritti": "Equal Ratio",
      "Pranayama": "Breath Control"
    }
  },
  {
    id: 'b5555555-5555-5555-5555-555555555555',
    title: 'Bhramari (Humming Bee Breath)',
    description: 'A deep humming vibration practice to trigger the parasympathetic nervous system, release mental tension, and quiet racing thoughts. Ideal for preparing for sleep.',
    duration_minutes: 5,
    category: 'pranayama',
    is_premium: false,
    thumbnail_url: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=600',
    media_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    experience_level: 'beginner',
    tightness: [],
    goals: ['stress', 'sleep'],
    sanskrit_terms: {
      "Bhramari": "Humming Bee",
      "NADA": "Inner Sound vibration"
    }
  },
  {
    id: 'd1111111-1111-1111-1111-111111111111',
    title: 'Trataka (Focused Gazing)',
    description: 'A traditional concentration practice involving steady gazing at a specific point or candle flame to improve mental focus, quiet active thoughts, and stimulate inner vision.',
    duration_minutes: 8,
    category: 'dhyana',
    is_premium: false,
    thumbnail_url: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=600',
    media_url: 'https://example.com/media/trataka.mp3',
    experience_level: 'beginner',
    tightness: [],
    goals: ['focus'],
    sanskrit_terms: {
      "Trataka": "To Look or Gaze",
      "Dharana": "Concentration"
    }
  },
  {
    id: 'd2222222-2222-2222-2222-222222222222',
    title: 'Yoga Nidra (Psychic Sleep)',
    description: 'A guided, deep relaxation practice that induces a state between waking and sleeping. Excellent for releasing physical, mental, and emotional tensions.',
    duration_minutes: 15,
    category: 'dhyana',
    is_premium: false,
    thumbnail_url: 'https://images.unsplash.com/photo-1528715471579-d1bcf0ba5e83?q=80&w=600',
    media_url: 'https://example.com/media/yoga_nidra.mp3',
    experience_level: 'beginner',
    tightness: [],
    goals: ['stress', 'sleep'],
    sanskrit_terms: {
      "Yoga Nidra": "Yogic Sleep",
      "Pratyahara": "Sensory Withdrawal",
      "Sankalpa": "Resolve/Intention"
    }
  },
  {
    id: 'd3333333-3333-3333-3333-333333333333',
    title: 'Chakra Beeja Mantra Chanting',
    description: 'A meditative chanting session using primordial seed sounds (Lam, Vam, Ram, Yam, Ham, Om) of the energy centers to align body vibration and induce deep silence.',
    duration_minutes: 10,
    category: 'dhyana',
    is_premium: true,
    thumbnail_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600',
    media_url: 'https://example.com/media/beeja_mantra.mp3',
    experience_level: 'intermediate',
    tightness: [],
    goals: ['focus', 'stress'],
    sanskrit_terms: {
      "Beeja Mantra": "Seed Sound",
      "Sushumna": "Central Energy Channel",
      "Kundalini": "Coiled Energy"
    }
  },
  {
    id: 'd4444444-4444-4444-4444-444444444444',
    title: 'Anapana (Breath Mindfulness)',
    description: 'Focusing the mind entirely on the natural, unforced breath at the entrance of the nostrils to build stillness, sensory awareness, and mental clarity.',
    duration_minutes: 10,
    category: 'dhyana',
    is_premium: false,
    thumbnail_url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=600',
    media_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    experience_level: 'beginner',
    tightness: [],
    goals: ['focus'],
    sanskrit_terms: {
      "Anapana": "Mindfulness of Breathing",
      "Vipassana": "Insight"
    }
  },
  {
    id: 'd5555555-5555-5555-5555-555555555555',
    title: 'Metta (Loving-Kindness)',
    description: 'A meditation practice expanding unconditional compassion and wishing safety, happiness, and peace to oneself, loved ones, and eventually all living beings.',
    duration_minutes: 10,
    category: 'dhyana',
    is_premium: false,
    thumbnail_url: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?q=80&w=600',
    media_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    experience_level: 'beginner',
    tightness: [],
    goals: ['stress'],
    sanskrit_terms: {
      "Metta": "Loving-Kindness",
      "Bhavana": "Cultivation/Development"
    }
  }
];

function getLocalMockRoutines(category?: string): Routine[] {
  if (!category) return MOCK_ROUTINES;
  return MOCK_ROUTINES.filter(r => r.category === category);
}

function getLocalMockRoutineById(id: string): Routine | undefined {
  return MOCK_ROUTINES.find(r => r.id === id);
}

function getLocalMockPlan(dayOfWeek: number): SadhanaPlan {
  const asanas = MOCK_ROUTINES.filter(r => r.category === 'asana' && !r.is_premium);
  const pranayamas = MOCK_ROUTINES.filter(r => r.category === 'pranayama' && !r.is_premium);
  const dhyanas = MOCK_ROUTINES.filter(r => r.category === 'dhyana' && !r.is_premium);

  const asana = asanas[dayOfWeek % asanas.length];
  const pranayama = pranayamas[dayOfWeek % pranayamas.length];
  const dhyana = dhyanas[dayOfWeek % dhyanas.length];

  return {
    id: `f0000000-0000-0000-0000-00000000000${dayOfWeek % 7}`,
    user_id: null,
    asana_routine_id: asana.id,
    pranayama_routine_id: pranayama.id,
    dhyana_routine_id: dhyana.id,
    day_of_week: dayOfWeek,
    asana,
    pranayama,
    dhyana
  };
}


// 4. Log completed session
export function useSubmitSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ routineId, durationPracticed }: { routineId: string; durationPracticed: number }) => {
      const userId = useAuthStore.getState().user?.id;
      
      // Intercept demo sandbox users to return local mock profiles/responses
      if (userId && userId.startsWith('demo-')) {
        return {
          id: 'mock-session-log-id',
          user_id: userId,
          routine_id: routineId,
          completed_at: new Date().toISOString(),
          duration_practiced: durationPracticed,
        };
      }

      if (!userId) throw new Error('User must be logged in to save session logs.');

      const { data, error } = await supabase
        .from('session_logs')
        .insert({
          user_id: userId,
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
      const userId = useAuthStore.getState().user?.id;
      if (userId && userId.startsWith('demo-')) {
        const profile = getDemoProfile(userId);
        profile.monthly_ad_count += 1;
        const newCount = profile.monthly_ad_count;
        
        let milestoneUnlocked = false;
        let karmaCoinsAdded = 0;
        if (newCount === 10) {
          milestoneUnlocked = true;
          karmaCoinsAdded = 10;
        } else if (newCount === 30) {
          milestoneUnlocked = true;
          karmaCoinsAdded = 30;
        } else if (newCount === 50) {
          milestoneUnlocked = true;
          karmaCoinsAdded = 50;
        }

        profile.karma_coins += karmaCoinsAdded;

        // Optimistically update query client data
        queryClient.setQueryData(['profile', userId], { ...profile });

        return {
          success: true,
          updated_ad_count: newCount,
          milestone_unlocked: milestoneUnlocked,
          karma_coins_added: karmaCoinsAdded,
        };
      }

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
      const userId = useAuthStore.getState().user?.id;
      queryClient.invalidateQueries({ queryKey: ['profile', userId] });
    },
  });
}

// 6. Redeem Karma Coins (RPC)
export function useRedeemCoins() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ amount, type, description }: { amount: number; type: string; description: string }) => {
      const userId = useAuthStore.getState().user?.id;
      if (userId && userId.startsWith('demo-')) {
        const profile = getDemoProfile(userId);
        if (profile.karma_coins < amount) {
          throw new Error('Insufficient Karma Coins');
        }
        profile.karma_coins -= amount;

        // Optimistically update query client data
        queryClient.setQueryData(['profile', userId], { ...profile });

        return {
          success: true,
          remaining_balance: profile.karma_coins,
        };
      }

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
      const userId = useAuthStore.getState().user?.id;
      queryClient.invalidateQueries({ queryKey: ['profile', userId] });
    },
  });
}

// 7. Request Account Deletion (RPC)
export function useDeleteAccount() {
  return useMutation({
    mutationFn: async () => {
      const userId = useAuthStore.getState().user?.id;
      if (userId && userId.startsWith('demo-')) {
        return;
      }
      const { error } = await supabase.rpc('delete_user_account');
      if (error) throw error;
    },
  });
}

// 8. Fetch user personalization (onboarding responses)
export function useOnboardingResponses(userId: string | undefined) {
  return useQuery({
    queryKey: ['onboarding_responses', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User ID is required');

      if (userId.startsWith('demo-')) {
        const authState = useAuthStore.getState();
        const answers = authState.onboardingAnswers;
        return {
          user_id: userId,
          goals: answers.goal ? [answers.goal] : ['stress'],
          experience_level: answers.experience || 'beginner',
          preferred_time: answers.schedule || 'morning',
          preferred_duration: answers.duration || 15,
          tightness: answers.goal === 'mobility'
            ? ['hips', 'hamstrings', 'lower_back', 'shoulders']
            : ['lower_back', 'shoulders'],
          habit_anchor: answers.schedule
            ? `After my ${answers.schedule} routine`
            : 'After my morning tea',
        };
      }

      const { data, error } = await supabase
        .from('onboarding_responses')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        // Fallback default
        return {
          user_id: userId,
          goals: ['stress'],
          experience_level: 'beginner',
          preferred_time: 'morning',
          preferred_duration: 15,
          tightness: ['lower_back', 'shoulders'],
          habit_anchor: 'After my morning tea',
        };
      }
      return data;
    },
    enabled: !!userId,
  });
}

// 9. Update user personalization (onboarding responses)
export function useUpdateOnboardingResponses() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      userId,
      goals,
      experience_level,
      preferred_time,
      preferred_duration,
    }: {
      userId: string;
      goals: string[];
      experience_level: string;
      preferred_time: string;
      preferred_duration: number;
    }) => {
      if (userId.startsWith('demo-')) {
        const updateAnswers = useAuthStore.getState().updateOnboardingAnswers;
        updateAnswers({
          goal: goals[0] || 'stress',
          experience: experience_level,
          schedule: preferred_time,
          duration: preferred_duration,
        });
        return {
          user_id: userId,
          goals,
          experience_level,
          preferred_time,
          preferred_duration,
          tightness: goals.includes('mobility')
            ? ['hips', 'hamstrings', 'lower_back', 'shoulders']
            : ['lower_back', 'shoulders'],
          habit_anchor: `After my ${preferred_time} routine`,
        };
      }

      const tightness = goals.includes('mobility')
        ? ['hips', 'hamstrings', 'lower_back', 'shoulders']
        : ['lower_back', 'shoulders'];

      const habit_anchor = `After my ${preferred_time} routine`;

      const { data, error } = await supabase
        .from('onboarding_responses')
        .upsert(
          {
            user_id: userId,
            goals,
            tightness,
            experience_level,
            preferred_time,
            preferred_duration,
            habit_anchor,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id' }
        )
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['onboarding_responses', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['today_plan', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['profile', variables.userId] });
    },
  });
}
