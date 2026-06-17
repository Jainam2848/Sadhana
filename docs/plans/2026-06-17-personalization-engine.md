# Personalized Sadhana Routines Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Research and implement a personalized daily routine generator (*Sadhana*) for Premium users. Completing the onboarding quiz dynamically compiles 7 custom daily plans in the database matching the user's experience level, rotating targeted tightness focus areas, and filtering wellness goals. Free users are restricted to the static "Global Daily Sadhana" (where `user_id` is null).

**Architecture:** 
1. Database-level trigger on `onboarding_responses` insertion/update that automatically executes a secure PL/pgSQL function `generate_user_plans(auth_user_id uuid)`.
2. Alter `sadhana_routines` table to include `experience_level`, `goals` and `tightness` arrays.
3. Update `seed_data.json` and `seed.js` to seed 18+ rich, traditional routines with corresponding target tightness/goals.
4. Wire frontend registration/onboarding quiz submission to write directly to `onboarding_responses` table.
5. Create failing tests in `tests/personalization.test.ts` to assert trigger correctness and custom plan generation before implementation.

**Tech Stack:** React Native, Expo Router, Supabase, PostgreSQL, Jest.

---

## Proposed Changes

### Database & Seeding

#### [NEW] [20260617000600_personalization_engine.sql](file:///d:/Desktop/Fitness/supabase/migrations/20260617000600_personalization_engine.sql)
Create a new migration to:
- Add `experience_level`, `goals`, and `tightness` columns to `sadhana_routines`.
- Create PL/pgSQL function `generate_user_plans(auth_user_id uuid)` that deletes existing plans and rotates matching routines for the 7 days of the week.
- Create trigger `on_onboarding_completed` on `onboarding_responses`.

#### [MODIFY] [seed_data.json](file:///d:/Desktop/Fitness/supabase/seed_data.json)
- Expand routines list to 18 items (Asana, Pranayama, Dhyana) covering beginner, intermediate, and advanced levels, all target tightness areas, and all goals.
- Replace video/audio links with public CDN URLs for interactive testing in staging:
  - Video loops: `https://vjs.zencdn.net/v/oceans.mp4`
  - Audio guides: `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3`

### Frontend Connections

#### [MODIFY] [register.tsx](file:///d:/Desktop/Fitness/app/(auth)/register.tsx)
- After successful signup, fetch onboarding state from `settingsStore` or `useAuthStore` and write responses to `onboarding_responses` table.

#### [MODIFY] [home.tsx](file:///d:/Desktop/Fitness/app/(tabs)/home.tsx)
- Query custom plans from `sadhana_plans` where `user_id = auth.uid()`. If empty or user is free-tier, fall back to global fallback plans.

---

## Verification Plan

### Automated Tests
- Create `tests/personalization.test.ts` to verify database trigger behavior.

**Command to run tests:**
```bash
node d:\Desktop\Fitness\tests\node_modules\jest\bin\jest.js --config d:\Desktop\Fitness\tests\jest.config.js tests/personalization.test.ts
```

### Manual Verification
- Walk through onboarding questionnaire in the simulator.
- Log in and check that `sadhana_plans` contains exactly 7 custom plans matching the level and focus selections.
- Verify video loops and audio players play successfully on home dashboard.
