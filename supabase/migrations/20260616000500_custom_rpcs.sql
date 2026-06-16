-- Custom SQL procedures for Sadhana business triggers

-- 1. Increment Ad Views & Unlock Milestones
CREATE OR REPLACE FUNCTION public.increment_ad_views()
RETURNS json AS $$
DECLARE
    auth_user_id uuid := auth.uid();
    ad_count integer;
    coins_reward integer := 0;
    milestone_unlocked boolean := false;
    current_tier integer := 0;
    type_reward varchar(30);
BEGIN
    IF auth_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    -- Increment ad count
    UPDATE public.profiles
    SET monthly_ad_count = monthly_ad_count + 1
    WHERE id = auth_user_id
    RETURNING monthly_ad_count INTO ad_count;

    -- Check milestones
    IF ad_count = 10 THEN
        current_tier := 1;
        type_reward := 'premium_single';
    ELSIF ad_count = 30 THEN
        current_tier := 2;
        type_reward := 'course_bundle';
    ELSIF ad_count = 50 THEN
        current_tier := 3;
        type_reward := 'ad_free_pass';
    END IF;

    IF current_tier > 0 THEN
        milestone_unlocked := true;
        -- Insert milestone
        INSERT INTO public.rewards_milestones (user_id, milestone_tier, reward_type)
        VALUES (auth_user_id, current_tier, type_reward)
        ON CONFLICT (user_id, milestone_tier, unlocked_at) DO NOTHING;

        -- If premium, reward with coins
        IF (SELECT premium FROM public.profiles WHERE id = auth_user_id) = true THEN
            IF current_tier = 1 THEN
                coins_reward := 10;
            ELSIF current_tier = 2 THEN
                coins_reward := 30;
            ELSIF current_tier = 3 THEN
                coins_reward := 50;
            END IF;

            -- Update coins and insert transaction log
            IF coins_reward > 0 THEN
                UPDATE public.profiles
                SET karma_coins = karma_coins + coins_reward
                WHERE id = auth_user_id;

                INSERT INTO public.karma_coin_transactions (user_id, amount, transaction_type, description)
                VALUES (auth_user_id, coins_reward, 'earn_ad', 'Earned from ' || ad_count || ' ad views milestone');
            END IF;
        END IF;
    END IF;

    RETURN json_build_object(
        'success', true,
        'updated_ad_count', ad_count,
        'milestone_unlocked', milestone_unlocked,
        'karma_coins_added', coins_reward
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Redeem Karma Coins (Premium Only)
CREATE OR REPLACE FUNCTION public.redeem_karma_coins(amount integer, transaction_type varchar(30), description text)
RETURNS json AS $$
DECLARE
    auth_user_id uuid := auth.uid();
    coins_bal integer;
    is_premium boolean;
BEGIN
    IF auth_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    -- Fetch current coins and premium flag
    SELECT premium, karma_coins INTO is_premium, coins_bal
    FROM public.profiles
    WHERE id = auth_user_id;

    IF NOT is_premium THEN
        RAISE EXCEPTION 'Only premium users can redeem Karma Coins';
    END IF;

    IF coins_bal < amount THEN
        RAISE EXCEPTION 'Insufficient coins balance';
    END IF;

    -- Deduct coins
    UPDATE public.profiles
    SET karma_coins = karma_coins - amount
    WHERE id = auth_user_id
    RETURNING karma_coins INTO coins_bal;

    -- Log transaction
    INSERT INTO public.karma_coin_transactions (user_id, amount, transaction_type, description)
    VALUES (auth_user_id, -amount, transaction_type, description);

    RETURN json_build_object(
        'success', true,
        'remaining_balance', coins_bal
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Delete User Account (GDPR Compliance)
CREATE OR REPLACE FUNCTION public.delete_user_account()
RETURNS void AS $$
DECLARE
    auth_user_id uuid := auth.uid();
BEGIN
    IF auth_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    -- Perform deletion on auth.users which triggers cascade delete on public.profiles etc.
    DELETE FROM auth.users WHERE id = auth_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
