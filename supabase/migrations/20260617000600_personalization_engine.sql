-- Add tags to sadhana_routines for experience levels, wellness goals, and tightness
ALTER TABLE public.sadhana_routines ADD COLUMN IF NOT EXISTS experience_level varchar(20) CHECK (experience_level IN ('beginner', 'intermediate', 'advanced'));
ALTER TABLE public.sadhana_routines ADD COLUMN IF NOT EXISTS goals text[] NOT NULL DEFAULT '{}'::text[];
ALTER TABLE public.sadhana_routines ADD COLUMN IF NOT EXISTS tightness text[] NOT NULL DEFAULT '{}'::text[];

-- Create indexes for the new columns
CREATE INDEX IF NOT EXISTS idx_routines_experience ON public.sadhana_routines(experience_level);
CREATE INDEX IF NOT EXISTS idx_routines_goals ON public.sadhana_routines USING gin(goals);
CREATE INDEX IF NOT EXISTS idx_routines_tightness ON public.sadhana_routines USING gin(tightness);

-- Secure plan-generation function
CREATE OR REPLACE FUNCTION public.generate_user_plans(auth_user_id uuid)
RETURNS void AS $$
DECLARE
    user_level varchar(20);
    user_goals text[];
    user_tightness text[];
    
    asana_ids uuid[];
    pranayama_ids uuid[];
    dhyana_ids uuid[];
    
    selected_asana uuid;
    selected_pranayama uuid;
    selected_dhyana uuid;
    
    day_idx integer;
BEGIN
    -- 1. Fetch user onboarding responses
    SELECT experience_level, goals, tightness 
    INTO user_level, user_goals, user_tightness
    FROM public.onboarding_responses
    WHERE user_id = auth_user_id;
    
    IF NOT FOUND THEN
        RETURN;
    END IF;
    
    -- 2. Clear old plans
    DELETE FROM public.sadhana_plans WHERE user_id = auth_user_id;
    
    -- 3. Gather Asana routines matching user level and tightness (rotate if multiple)
    SELECT array_agg(id) INTO asana_ids
    FROM public.sadhana_routines
    WHERE category = 'asana' 
      AND experience_level = user_level 
      AND tightness && user_tightness;
      
    IF asana_ids IS NULL OR array_length(asana_ids, 1) IS NULL THEN
        SELECT array_agg(id) INTO asana_ids
        FROM public.sadhana_routines
        WHERE category = 'asana' 
          AND experience_level = user_level;
    END IF;

    -- 4. Gather Pranayama routines matching goals and user level (or beginner)
    SELECT array_agg(id) INTO pranayama_ids
    FROM public.sadhana_routines
    WHERE category = 'pranayama'
      AND (experience_level = user_level OR experience_level = 'beginner')
      AND goals && user_goals;
      
    IF pranayama_ids IS NULL OR array_length(pranayama_ids, 1) IS NULL THEN
        SELECT array_agg(id) INTO pranayama_ids
        FROM public.sadhana_routines
        WHERE category = 'pranayama'
          AND (experience_level = user_level OR experience_level = 'beginner');
    END IF;

    IF pranayama_ids IS NULL OR array_length(pranayama_ids, 1) IS NULL THEN
        SELECT array_agg(id) INTO pranayama_ids
        FROM public.sadhana_routines
        WHERE category = 'pranayama';
    END IF;

    -- 5. Gather Dhyana routines matching goals and user level (or beginner)
    SELECT array_agg(id) INTO dhyana_ids
    FROM public.sadhana_routines
    WHERE category = 'dhyana'
      AND (experience_level = user_level OR experience_level = 'beginner')
      AND goals && user_goals;
      
    IF dhyana_ids IS NULL OR array_length(dhyana_ids, 1) IS NULL THEN
        SELECT array_agg(id) INTO dhyana_ids
        FROM public.sadhana_routines
        WHERE category = 'dhyana'
          AND (experience_level = user_level OR experience_level = 'beginner');
    END IF;

    IF dhyana_ids IS NULL OR array_length(dhyana_ids, 1) IS NULL THEN
        SELECT array_agg(id) INTO dhyana_ids
        FROM public.sadhana_routines
        WHERE category = 'dhyana';
    END IF;

    -- 6. Insert 7 daily plans rotating routines
    FOR day_idx IN 0..6 LOOP
        selected_asana := NULL;
        IF asana_ids IS NOT NULL AND array_length(asana_ids, 1) > 0 THEN
            selected_asana := asana_ids[(day_idx % array_length(asana_ids, 1)) + 1];
        END IF;

        selected_pranayama := NULL;
        IF pranayama_ids IS NOT NULL AND array_length(pranayama_ids, 1) > 0 THEN
            selected_pranayama := pranayama_ids[(day_idx % array_length(pranayama_ids, 1)) + 1];
        END IF;

        selected_dhyana := NULL;
        IF dhyana_ids IS NOT NULL AND array_length(dhyana_ids, 1) > 0 THEN
            selected_dhyana := dhyana_ids[(day_idx % array_length(dhyana_ids, 1)) + 1];
        END IF;

        INSERT INTO public.sadhana_plans (user_id, asana_routine_id, pranayama_routine_id, dhyana_routine_id, day_of_week)
        VALUES (auth_user_id, selected_asana, selected_pranayama, selected_dhyana, day_idx)
        ON CONFLICT (user_id, day_of_week) DO UPDATE
        SET asana_routine_id = EXCLUDED.asana_routine_id,
            pranayama_routine_id = EXCLUDED.pranayama_routine_id,
            dhyana_routine_id = EXCLUDED.dhyana_routine_id;
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger logic on onboarding completed or updated
CREATE OR REPLACE FUNCTION public.on_onboarding_responses_changed()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM public.generate_user_plans(NEW.user_id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_onboarding_responses_changed ON public.onboarding_responses;
CREATE TRIGGER trg_onboarding_responses_changed
    AFTER INSERT OR UPDATE ON public.onboarding_responses
    FOR EACH ROW EXECUTE FUNCTION public.on_onboarding_responses_changed();
