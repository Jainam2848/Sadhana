-- Auth Triggers to automatically provision profile and streak rows

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, username, avatar_url, premium)
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'username', 'Sadhaka'),
        new.raw_user_meta_data->>'avatar_url',
        false
    );
    
    INSERT INTO public.user_streaks (user_id, current_streak, longest_streak)
    VALUES (new.id, 0, 0);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users table in the auth schema
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
