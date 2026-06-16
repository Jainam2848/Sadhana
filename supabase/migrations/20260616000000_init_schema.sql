-- Initialize Sadhana Database Schema

-- 1. Profiles Table
CREATE TABLE public.profiles (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username varchar(100),
    avatar_url text,
    premium boolean NOT NULL DEFAULT false,
    monthly_ad_count integer NOT NULL DEFAULT 0 CHECK (monthly_ad_count >= 0),
    karma_coins integer NOT NULL DEFAULT 0 CHECK (karma_coins >= 0),
    last_ad_reset timestamptz NOT NULL DEFAULT now(),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- 2. Onboarding Responses Table
CREATE TABLE public.onboarding_responses (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    goals text[] NOT NULL,
    tightness text[] NOT NULL,
    experience_level varchar(20) NOT NULL CHECK (experience_level IN ('beginner', 'intermediate', 'advanced')),
    habit_anchor text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_onboarding_user_id ON public.onboarding_responses(user_id);

-- 3. Sadhana Routines (Catalog) Table
CREATE TABLE public.sadhana_routines (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title varchar(150) NOT NULL,
    description text NOT NULL,
    duration_minutes integer NOT NULL CHECK (duration_minutes > 0),
    category varchar(30) NOT NULL CHECK (category IN ('asana', 'pranayama', 'dhyana', 'philosophy')),
    is_premium boolean NOT NULL DEFAULT false,
    thumbnail_url text NOT NULL,
    media_url text NOT NULL,
    sanskrit_terms jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_routines_category_premium ON public.sadhana_routines(category, is_premium);

-- 4. Sadhana Plans Table
CREATE TABLE public.sadhana_plans (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    asana_routine_id uuid REFERENCES public.sadhana_routines(id) ON DELETE SET NULL,
    pranayama_routine_id uuid REFERENCES public.sadhana_routines(id) ON DELETE SET NULL,
    dhyana_routine_id uuid REFERENCES public.sadhana_routines(id) ON DELETE SET NULL,
    day_of_week integer NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
    created_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT unique_user_day UNIQUE (user_id, day_of_week)
);

CREATE INDEX idx_plans_user_day ON public.sadhana_plans(user_id, day_of_week);

-- 5. Session Logs Table
CREATE TABLE public.session_logs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    routine_id uuid REFERENCES public.sadhana_routines(id) ON DELETE SET NULL,
    completed_at timestamptz NOT NULL DEFAULT now(),
    duration_practiced integer NOT NULL CHECK (duration_practiced > 0)
);

CREATE INDEX idx_logs_user_date ON public.session_logs(user_id, completed_at);

-- 6. User Streaks Table
CREATE TABLE public.user_streaks (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    current_streak integer NOT NULL DEFAULT 0 CHECK (current_streak >= 0),
    longest_streak integer NOT NULL DEFAULT 0 CHECK (longest_streak >= 0),
    last_completed_date date,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- 7. Rewards Milestones Table
CREATE TABLE public.rewards_milestones (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    milestone_tier integer NOT NULL CHECK (milestone_tier IN (1, 2, 3)),
    unlocked_at timestamptz NOT NULL DEFAULT now(),
    reward_type varchar(30) NOT NULL,
    claimed boolean NOT NULL DEFAULT false,
    CONSTRAINT unique_user_month_tier UNIQUE (user_id, milestone_tier, unlocked_at)
);

-- 8. Karma Coin Transactions Table
CREATE TABLE public.karma_coin_transactions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    amount integer NOT NULL,
    transaction_type varchar(30) NOT NULL CHECK (transaction_type IN ('earn_ad', 'redeem_discount', 'redeem_donation')),
    description text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);
