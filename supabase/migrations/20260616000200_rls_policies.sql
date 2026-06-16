-- Enable Row-Level Security on all database tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sadhana_routines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sadhana_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rewards_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.karma_coin_transactions ENABLE ROW LEVEL SECURITY;

-- 1. profiles Policies
CREATE POLICY "Allow users to read own profile" ON public.profiles 
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Allow users to update own profile fields" ON public.profiles 
    FOR UPDATE USING (auth.uid() = id) 
    WITH CHECK (auth.uid() = id);

-- 2. onboarding_responses Policies
CREATE POLICY "Allow users to manage own onboarding responses" ON public.onboarding_responses 
    FOR ALL USING (auth.uid() = user_id) 
    WITH CHECK (auth.uid() = user_id);

-- 3. sadhana_plans Policies
CREATE POLICY "Allow read for owned plans or global plans" ON public.sadhana_plans 
    FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Allow users to modify owned plans" ON public.sadhana_plans 
    FOR ALL USING (auth.uid() = user_id) 
    WITH CHECK (auth.uid() = user_id);

-- 4. session_logs Policies
CREATE POLICY "Allow users to manage own session logs" ON public.session_logs 
    FOR ALL USING (auth.uid() = user_id) 
    WITH CHECK (auth.uid() = user_id);

-- 5. user_streaks Policies
CREATE POLICY "Allow users to read own streak" ON public.user_streaks 
    FOR SELECT USING (auth.uid() = user_id);

-- 6. rewards_milestones Policies
CREATE POLICY "Allow users to manage own rewards milestones" ON public.rewards_milestones 
    FOR ALL USING (auth.uid() = user_id) 
    WITH CHECK (auth.uid() = user_id);

-- 7. karma_coin_transactions Policies
CREATE POLICY "Allow users to read own transaction history" ON public.karma_coin_transactions 
    FOR SELECT USING (auth.uid() = user_id);

-- 8. sadhana_routines Policies (Global catalog)
CREATE POLICY "Allow authenticated or guest users to read all routines" ON public.sadhana_routines 
    FOR SELECT USING (true);
