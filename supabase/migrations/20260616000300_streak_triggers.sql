-- Triggers to automatically calculate daily streaks on session log insertions

CREATE OR REPLACE FUNCTION public.update_user_streak()
RETURNS TRIGGER AS $$
DECLARE
    today DATE;
    yesterday DATE;
    last_date DATE;
    streak_count INTEGER;
    max_streak INTEGER;
BEGIN
    -- Extract timezone-adjusted date from user insertion
    today := (NEW.completed_at AT TIME ZONE 'UTC')::DATE;
    yesterday := today - INTERVAL '1 day';
    
    -- Fetch current streak record
    SELECT last_completed_date, current_streak, longest_streak 
    INTO last_date, streak_count, max_streak
    FROM public.user_streaks
    WHERE user_id = NEW.user_id;
    
    IF last_date IS NULL THEN
        -- First session ever
        streak_count := 1;
        max_streak := GREATEST(max_streak, streak_count);
    ELSIF last_date = today THEN
        -- Already completed a session today, no streak increment
        RETURN NEW;
    ELSIF last_date = yesterday THEN
        -- Completed yesterday, increment streak
        streak_count := streak_count + 1;
        max_streak := GREATEST(max_streak, streak_count);
    ELSE
        -- Streak broken
        streak_count := 1;
    END IF;
    
    -- Update streak values
    UPDATE public.user_streaks
    SET current_streak = streak_count,
        longest_streak = max_streak,
        last_completed_date = today,
        updated_at = now()
    WHERE user_id = NEW.user_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_session_completed
    AFTER INSERT ON public.session_logs
    FOR EACH ROW EXECUTE FUNCTION public.update_user_streak();
