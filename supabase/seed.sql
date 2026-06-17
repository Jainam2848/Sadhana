-- Seed Sadhana Routines and Daily Plans
-- This script populates authentic Indian yoga (Asana), breathwork (Pranayama), and meditation (Dhyana) sessions,
-- and links them to global daily fallback plans for each day of the week.

-- 1. Insert/Update Sadhana Routines
-- We use static UUIDs so they can be reliably referenced by plans and updated without duplicating rows.
INSERT INTO public.sadhana_routines (
    id, 
    title, 
    description, 
    duration_minutes, 
    category, 
    is_premium, 
    thumbnail_url, 
    media_url, 
    sanskrit_terms
) VALUES 
-- ASANA (Yoga Postures)
(
    'a1111111-1111-1111-1111-111111111111',
    'Surya Namaskar (Sun Salutations)',
    'A traditional sequence of 12 powerful yoga postures designed to awaken vital energy, improve circulation, and build physical flexibility. Excellent for morning practice.',
    10,
    'asana',
    false,
    'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600',
    'https://example.com/media/surya_namaskar.mp4',
    '{"Surya Namaskar": "Sun Salutations", "Pranamasana": "Prayer Pose", "Hastauttanasana": "Raised Arms Pose", "Padahastasana": "Hand to Foot Pose", "Ashwa Sanchalanasana": "Equestrian Pose"}'::jsonb
),
(
    'a2222222-2222-2222-2222-222222222222',
    'Spinal Alignment & Awakening',
    'Focuses on gentle spinal twists, cat-cow stretches, and chest openers to release stiffness from desk work, correct posture, and ground the nervous system.',
    15,
    'asana',
    false,
    'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=600',
    'https://example.com/media/spinal_alignment.mp4',
    '{"Marjariasana": "Cat Pose", "Bitilasana": "Cow Pose", "Adho Mukha Svanasana": "Downward Facing Dog", "Sukhasana": "Easy Pose"}'::jsonb
),
(
    'a3333333-3333-3333-3333-333333333333',
    'Gentle Joint Mobilization (Sukshma Vyayama)',
    'A slow, therapeutic practice targeting joint mobility and energy flow. Focuses on neck rolls, shoulder openers, wrist flexions, and ankle rotations to improve fluid circulation.',
    12,
    'asana',
    false,
    'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?q=80&w=600',
    'https://example.com/media/joint_mobilization.mp4',
    '{"Sukshma Vyayama": "Subtle exercise", "Tadasana": "Mountain Pose", "Vrikshasana": "Tree Pose"}'::jsonb
),
(
    'a4444444-4444-4444-4444-444444444444',
    'Vinyasa Flow: Solar Awakening',
    'An energizing, dynamic flow connecting breath and movement to build core stability, leg strength, and internal heat. Recommended for intermediate practitioners.',
    20,
    'asana',
    true, -- Premium
    'https://images.unsplash.com/photo-1510894347713-fc3ed6ecda6e?q=80&w=600',
    'https://example.com/media/vinyasa_flow.mp4',
    '{"Virabhadrasana": "Warrior Pose", "Trikonasana": "Triangle Pose", "Chaturanga Dandasana": "Four-Limbed Staff Pose"}'::jsonb
),

-- PRANAYAMA (Breathwork)
(
    'b1111111-1111-1111-1111-111111111111',
    'Nadi Shodhana (Alternate Nostril Breathing)',
    'A classical pranayama technique to balance the left and right hemispheres of the brain, quiet the mind, reduce anxiety, and purify subtle energy channels.',
    5,
    'pranayama',
    false,
    'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80&w=600',
    'https://example.com/media/nadi_shodhana.mp3',
    '{"Nadi Shodhana": "Channel Purification", "Prana": "Vital Energy", "Ida": "Left channel (lunar)", "Pingala": "Right channel (solar)"}'::jsonb
),
(
    'b2222222-2222-2222-2222-222222222222',
    'Kapalabhati (Skull Shining Breath)',
    'A powerful, invigorating breathing technique utilizing active, rapid exhalations to clear the nasal passages, increase oxygenation, and energize the brain.',
    8,
    'pranayama',
    false,
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=600',
    'https://example.com/media/kapalabhati.mp3',
    '{"Kapalabhati": "Skull Shining Breath", "Rechaka": "Exhalation", "Puraka": "Inhalation"}'::jsonb
),
(
    'b3333333-3333-3333-3333-333333333333',
    'Sheetali (Cooling Breath)',
    'A soothing, cooling pranayama technique helpful for reducing physical body temperature, calming anger, and relieving stress.',
    6,
    'pranayama',
    true, -- Premium
    'https://images.unsplash.com/photo-1518495973542-4542c06a5843?q=80&w=600',
    'https://example.com/media/sheetali.mp3',
    '{"Sheetali": "Cooling Breath", "Kumbhaka": "Breath Retention"}'::jsonb
),

-- DHYANA (Meditation)
(
    'd1111111-1111-1111-1111-111111111111',
    'Trataka (Focused Gazing)',
    'A traditional concentration practice involving steady gazing at a specific point or candle flame to improve mental focus, quiet active thoughts, and stimulate inner vision.',
    8,
    'dhyana',
    false,
    'https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=600',
    'https://example.com/media/trataka.mp3',
    '{"Trataka": "To Look or Gaze", "Dharana": "Concentration"}'::jsonb
),
(
    'd2222222-2222-2222-2222-222222222222',
    'Yoga Nidra (Psychic Sleep)',
    'A guided, deep relaxation practice that induces a state between waking and sleeping. Excellent for releasing physical, mental, and emotional tensions.',
    15,
    'dhyana',
    false,
    'https://images.unsplash.com/photo-1528715471579-d1bcf0ba5e83?q=80&w=600',
    'https://example.com/media/yoga_nidra.mp3',
    '{"Yoga Nidra": "Yogic Sleep", "Pratyahara": "Sensory Withdrawal", "Sankalpa": "Resolve/Intention"}'::jsonb
),
(
    'd3333333-3333-3333-3333-333333333333',
    'Chakra Beeja Mantra Chanting',
    'A meditative chanting session using primordial seed sounds (Lam, Vam, Ram, Yam, Ham, Om) of the energy centers to align body vibration and induce deep silence.',
    10,
    'dhyana',
    true, -- Premium
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600',
    'https://example.com/media/beeja_mantra.mp3',
    '{"Beeja Mantra": "Seed Sound", "Sushumna": "Central Energy Channel", "Kundalini": "Coiled Energy"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    duration_minutes = EXCLUDED.duration_minutes,
    category = EXCLUDED.category,
    is_premium = EXCLUDED.is_premium,
    thumbnail_url = EXCLUDED.thumbnail_url,
    media_url = EXCLUDED.media_url,
    sanskrit_terms = EXCLUDED.sanskrit_terms;

-- 2. Clean existing global fallback plans to avoid key duplicate violations
DELETE FROM public.sadhana_plans WHERE user_id IS NULL;

-- 3. Insert Global Fallback Plans (user_id IS NULL) for all 7 days of the week (0 = Sunday, 6 = Saturday)
INSERT INTO public.sadhana_plans (
    id,
    user_id,
    asana_routine_id,
    pranayama_routine_id,
    dhyana_routine_id,
    day_of_week
) VALUES
-- Sunday
(
    'f0000000-0000-0000-0000-000000000000',
    NULL,
    'a1111111-1111-1111-1111-111111111111', -- Surya Namaskar
    'b1111111-1111-1111-1111-111111111111', -- Nadi Shodhana
    'd2222222-2222-2222-2222-222222222222', -- Yoga Nidra
    0
),
-- Monday
(
    'f0000000-0000-0000-0000-000000000001',
    NULL,
    'a2222222-2222-2222-2222-222222222222', -- Spinal Alignment
    'b2222222-2222-2222-2222-222222222222', -- Kapalabhati
    'd1111111-1111-1111-1111-111111111111', -- Trataka
    1
),
-- Tuesday
(
    'f0000000-0000-0000-0000-000000000002',
    NULL,
    'a3333333-3333-3333-3333-333333333333', -- Joint Mobilization
    'b1111111-1111-1111-1111-111111111111', -- Nadi Shodhana
    'd2222222-2222-2222-2222-222222222222', -- Yoga Nidra
    2
),
-- Wednesday
(
    'f0000000-0000-0000-0000-000000000003',
    NULL,
    'a1111111-1111-1111-1111-111111111111', -- Surya Namaskar
    'b2222222-2222-2222-2222-222222222222', -- Kapalabhati
    'd1111111-1111-1111-1111-111111111111', -- Trataka
    3
),
-- Thursday
(
    'f0000000-0000-0000-0000-000000000004',
    NULL,
    'a2222222-2222-2222-2222-222222222222', -- Spinal Alignment
    'b1111111-1111-1111-1111-111111111111', -- Nadi Shodhana
    'd2222222-2222-2222-2222-222222222222', -- Yoga Nidra
    4
),
-- Friday
(
    'f0000000-0000-0000-0000-000000000005',
    NULL,
    'a3333333-3333-3333-3333-333333333333', -- Joint Mobilization
    'b2222222-2222-2222-2222-222222222222', -- Kapalabhati
    'd1111111-1111-1111-1111-111111111111', -- Trataka
    5
),
-- Saturday
(
    'f0000000-0000-0000-0000-000000000006',
    NULL,
    'a1111111-1111-1111-1111-111111111111', -- Surya Namaskar
    'b1111111-1111-1111-1111-111111111111', -- Nadi Shodhana
    'd2222222-2222-2222-2222-222222222222', -- Yoga Nidra
    6
);
