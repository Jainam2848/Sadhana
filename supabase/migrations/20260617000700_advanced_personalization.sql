-- Advanced personalization preferences and plan ranking.

ALTER TABLE public.onboarding_responses
    ADD COLUMN IF NOT EXISTS preferred_time varchar(20) NOT NULL DEFAULT 'morning'
        CHECK (preferred_time IN ('morning', 'afternoon', 'evening')),
    ADD COLUMN IF NOT EXISTS preferred_duration integer NOT NULL DEFAULT 15
        CHECK (preferred_duration IN (10, 15, 20, 30));

CREATE INDEX IF NOT EXISTS idx_onboarding_preferred_time
    ON public.onboarding_responses(preferred_time);

CREATE OR REPLACE FUNCTION public.generate_user_plans(auth_user_id uuid)
RETURNS void AS $$
DECLARE
    user_level varchar(20);
    user_goals text[];
    user_tightness text[];
    user_preferred_time varchar(20);
    user_preferred_duration integer;
    streak_count integer;
    effective_duration integer;
    allowed_levels text[];

    active_tightness text;
    tightness_count integer;
    asana_target integer;
    pranayama_target integer;
    dhyana_target integer;

    selected_asana uuid;
    selected_pranayama uuid;
    selected_dhyana uuid;

    day_idx integer;
BEGIN
    SELECT
        experience_level,
        goals,
        tightness,
        preferred_time,
        preferred_duration
    INTO
        user_level,
        user_goals,
        user_tightness,
        user_preferred_time,
        user_preferred_duration
    FROM public.onboarding_responses
    WHERE user_id = auth_user_id;

    IF NOT FOUND THEN
        RETURN;
    END IF;

    SELECT COALESCE(current_streak, 0)
    INTO streak_count
    FROM public.user_streaks
    WHERE user_id = auth_user_id;

    streak_count := COALESCE(streak_count, 0);
    user_level := COALESCE(user_level, 'beginner');
    user_goals := COALESCE(user_goals, '{}'::text[]);
    user_tightness := COALESCE(user_tightness, '{}'::text[]);
    user_preferred_time := COALESCE(user_preferred_time, 'morning');
    user_preferred_duration := COALESCE(user_preferred_duration, 15);

    effective_duration := CASE
        WHEN streak_count >= 5 THEN LEAST(30, user_preferred_duration + 5)
        ELSE user_preferred_duration
    END;

    allowed_levels := CASE
        WHEN streak_count >= 10 AND user_level = 'beginner'
            THEN ARRAY['beginner', 'intermediate']
        WHEN streak_count >= 10 AND user_level = 'intermediate'
            THEN ARRAY['intermediate', 'advanced']
        ELSE ARRAY[user_level::text]
    END;

    asana_target := GREATEST(1, ROUND(effective_duration * 0.60)::integer);
    pranayama_target := GREATEST(1, ROUND(effective_duration * 0.20)::integer);
    dhyana_target := GREATEST(1, effective_duration - asana_target - pranayama_target);
    tightness_count := COALESCE(array_length(user_tightness, 1), 0);

    DELETE FROM public.sadhana_plans WHERE user_id = auth_user_id;

    FOR day_idx IN 0..6 LOOP
        selected_asana := NULL;
        selected_pranayama := NULL;
        selected_dhyana := NULL;

        active_tightness := NULL;
        IF tightness_count > 0 THEN
            -- day_of_week follows JavaScript getDay(): 0 Sunday, 1 Monday.
            -- Rotate the first selected tightness area onto Monday.
            active_tightness := user_tightness[((day_idx + tightness_count - 1) % tightness_count) + 1];
        END IF;

        WITH asana_candidates AS (
            SELECT
                r.id,
                r.duration_minutes,
                (
                    ABS(r.duration_minutes - asana_target) * 4
                    + CASE
                        WHEN active_tightness IS NOT NULL AND r.tightness @> ARRAY[active_tightness] THEN 0
                        WHEN r.tightness && user_tightness THEN 3
                        ELSE 8
                      END
                    + CASE WHEN r.goals && user_goals THEN 0 ELSE 4 END
                    + CASE
                        WHEN user_preferred_time = 'morning'
                             AND (r.title || ' ' || r.description) ~* '(sun|solar|energ|awaken|vinyasa|flow|strength|core|heat)'
                            THEN 0
                        WHEN user_preferred_time = 'morning'
                             AND (r.title || ' ' || r.description) ~* '(restorative|sleep|nidra|relax|soothing|cooling|release)'
                            THEN 7
                        WHEN user_preferred_time = 'evening'
                             AND (r.title || ' ' || r.description) ~* '(restorative|sleep|nidra|relax|soothing|cooling|release|gentle)'
                            THEN 0
                        WHEN user_preferred_time = 'evening'
                             AND (r.title || ' ' || r.description) ~* '(energ|awaken|vinyasa|strength|core|heat|power)'
                            THEN 7
                        ELSE 2
                      END
                ) AS score
            FROM public.sadhana_routines r
            WHERE r.category = 'asana'
              AND COALESCE(r.experience_level, 'beginner')::text = ANY(allowed_levels)
            ORDER BY score, r.id
            LIMIT 12
        ),
        pranayama_candidates AS (
            SELECT
                r.id,
                r.duration_minutes,
                (
                    ABS(r.duration_minutes - pranayama_target) * 4
                    + CASE WHEN r.goals && user_goals THEN 0 ELSE 4 END
                    + CASE
                        WHEN user_preferred_time = 'morning'
                             AND (r.title || ' ' || r.description) ~* '(kapalabhati|energ|invigor|skull|solar)'
                            THEN 0
                        WHEN user_preferred_time = 'evening'
                             AND (r.title || ' ' || r.description) ~* '(nadi|alternate|cooling|sheetali|calm|soothing|relax)'
                            THEN 0
                        ELSE 2
                      END
                ) AS score
            FROM public.sadhana_routines r
            WHERE r.category = 'pranayama'
              AND (
                COALESCE(r.experience_level, 'beginner')::text = ANY(allowed_levels)
                OR COALESCE(r.experience_level, 'beginner')::text = 'beginner'
              )
            ORDER BY score, r.id
            LIMIT 12
        ),
        dhyana_candidates AS (
            SELECT
                r.id,
                r.duration_minutes,
                (
                    ABS(r.duration_minutes - dhyana_target) * 4
                    + CASE WHEN r.goals && user_goals THEN 0 ELSE 4 END
                    + CASE
                        WHEN user_preferred_time = 'morning'
                             AND (r.title || ' ' || r.description) ~* '(focus|gazing|clarity|mantra|chakra)'
                            THEN 0
                        WHEN user_preferred_time = 'evening'
                             AND (r.title || ' ' || r.description) ~* '(nidra|sleep|relax|silence|calm|release)'
                            THEN 0
                        ELSE 2
                      END
                ) AS score
            FROM public.sadhana_routines r
            WHERE r.category = 'dhyana'
              AND (
                COALESCE(r.experience_level, 'beginner')::text = ANY(allowed_levels)
                OR COALESCE(r.experience_level, 'beginner')::text = 'beginner'
              )
            ORDER BY score, r.id
            LIMIT 12
        )
        SELECT a.id, p.id, d.id
        INTO selected_asana, selected_pranayama, selected_dhyana
        FROM asana_candidates a
        CROSS JOIN pranayama_candidates p
        CROSS JOIN dhyana_candidates d
        ORDER BY
            ABS((a.duration_minutes + p.duration_minutes + d.duration_minutes) - effective_duration) * 20,
            a.score + p.score + d.score,
            ABS(a.duration_minutes - asana_target) * 3
                + ABS(p.duration_minutes - pranayama_target) * 2
                + ABS(d.duration_minutes - dhyana_target) * 2,
            a.id,
            p.id,
            d.id
        LIMIT 1;

        INSERT INTO public.sadhana_plans (
            user_id,
            asana_routine_id,
            pranayama_routine_id,
            dhyana_routine_id,
            day_of_week
        )
        VALUES (
            auth_user_id,
            selected_asana,
            selected_pranayama,
            selected_dhyana,
            day_idx
        )
        ON CONFLICT (user_id, day_of_week) DO UPDATE
        SET asana_routine_id = EXCLUDED.asana_routine_id,
            pranayama_routine_id = EXCLUDED.pranayama_routine_id,
            dhyana_routine_id = EXCLUDED.dhyana_routine_id;
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.on_user_streak_changed()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR NEW.current_streak IS DISTINCT FROM OLD.current_streak THEN
        PERFORM public.generate_user_plans(NEW.user_id);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_user_streak_changed ON public.user_streaks;
CREATE TRIGGER trg_user_streak_changed
    AFTER INSERT OR UPDATE OF current_streak ON public.user_streaks
    FOR EACH ROW EXECUTE FUNCTION public.on_user_streak_changed();
