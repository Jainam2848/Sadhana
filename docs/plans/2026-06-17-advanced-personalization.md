# Advanced Personalization Engine Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement 4 advanced personalization features to enhance the daily Sadhana user experience:
1. **Time-of-Day Tailoring**: Align pose characteristics with preferred practice times (Morning = active/energizing, Evening = restorative/relaxing).
2. **Progressive Difficulty & Duration Scaling**: Dynamically expand allowed experience levels (e.g. allowing intermediate routines for beginner users) when the user builds a streak >= 10 days, and scale duration targets for streaks >= 5 days.
3. **Flexible Duration Customization**: Allow users to configure session lengths (10, 15, 20, 30 min) and dynamically proportion durations (Asana 60%, Pranayama 20%, Dhyana 20%).
4. **Targeted Relief Rotation**: Rotate physical tightness focus areas daily (e.g. Lower Back on Mondays, Hips on Tuesdays) based on the user's questionnaire selections.

**Architecture:**
- **Database Migrations**: Add columns `preferred_time` and `preferred_duration` to `onboarding_responses`. Rewrite `generate_user_plans` SQL function to rank matching routines based on duration proximity, active tightness of the day, time-of-day suitability, and streak stats. Add trigger on `user_streaks` updates to automatically regenerate plans.
- **Frontend Changes**: Update `personalize.tsx` to include Question 4 for practice duration. Update `register.tsx` to save the new preferences to Supabase.
- **Testing**: Add tests in `tests/personalization.test.ts` to assert trigger updates, duration mapping accuracy, time-of-day ranking suitability, and streak difficulty expansion.

**Tech Stack:** React Native (Expo Router), Supabase (PostgreSQL), Jest.

---

## User Review Required

> [!IMPORTANT]
> The database migrations will apply automatically to the local/staging Supabase instance. Since the new fields have defaults (`morning` and `15`), they will not break existing users or prior test suites.

---

## Proposed Changes

### Database & Migrations

#### [NEW] [20260617000700_advanced_personalization.sql](file:///d:/Desktop/Fitness/supabase/migrations/20260617000700_advanced_personalization.sql)
Create migration to:
- Alter `onboarding_responses` table adding `preferred_time` and `preferred_duration` columns.
- Re-declare `generate_user_plans(auth_user_id uuid)` with advanced personalization ranking, streak evaluations, daily tightness rotation, and duration matching.
- Create trigger `trg_user_streak_changed` on `user_streaks` to automatically regenerate plans when a user's streak increments or resets.

### Frontend Forms & Signup

#### [MODIFY] [personalize.tsx](file:///d:/Desktop/Fitness/app/(auth)/personalize.tsx)
- Add Question 4: "How long is your daily practice?" with options `10 min`, `15 min`, `20 min`, and `30 min`.
- Collect and pass `selectedDuration` in the `updateAnswers` store action.

#### [MODIFY] [register.tsx](file:///d:/Desktop/Fitness/app/(auth)/register.tsx)
- Map `onboardingAnswers.duration` to `preferred_duration` when inserting the user's onboarding responses.

### Testing

#### [MODIFY] [personalization.test.ts](file:///d:/Desktop/Fitness/tests/personalization.test.ts)
- Add new test blocks to assert that:
  - Duration targets match (10 min onboarding produces 10 min plans, 30 min onboarding produces 30 min plans).
  - Poses rotate tightness areas daily.
  - Streaks (current_streak >= 10) trigger difficulty scaling, allowing higher tier routines to enter the plan rotation.

---

## Verification Plan

### Automated Tests
Run the personalization test suite:
```bash
node d:\Desktop\Fitness\tests\node_modules\jest\bin\jest.js --config d:\Desktop\Fitness\tests\jest.config.js tests/personalization.test.ts
```

### Manual Verification
1. Start Onboarding inside the simulator, select Evening, 20 mins, and verify the questionnaire completes smoothly.
2. Check the user's created plans in Supabase and verify the categories sum to ~20 minutes.
