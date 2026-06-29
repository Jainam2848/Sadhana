# Onboarding Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Redesign Sadhana's onboarding experience into a guided, emotionally meaningful ritual that reduces choice friction and directs users straight into their first practice.

**Architecture:** We will consolidate the personalization quiz from 4 screens/steps down to 2, mapping intention and energy into standard database fields with sensible defaults. We will simplify and retheme the welcome, breathing space, GDPR, permission priming, vault registration, and paywall layouts to rely on elegant, borderless typography, thin dividing lines, and micro-haptics.

**Tech Stack:** React Native, Expo Router, Tailwind CSS (NativeWind), React Native Reanimated, expo-haptics.

---

### Task 1: Redesign Personalization Quiz

**Files:**
- Modify: `app/(auth)/personalize.tsx`

**Step 1: Simplify Questions & Layout**
- Reduce the quiz questions from 4 down to 2:
  1. **Intention**: *"What draws you to the mat?"*
     - "To soothe an active mind" (maps to `stress` goal)
     - "To release structural physical tightness" (maps to `mobility` goal)
     - "To study ancient wisdom & lineage" (maps to `philosophy` goal)
  2. **Current Energy**: *"How does your body feel in this moment?"*
     - "Restless (High energy, active mind)" -> Maps to `experience = 'intermediate'`, defaults `preferred_time = 'morning'`, `preferred_duration = 15`.
     - "Tight (Physical fatigue, stiffness)" -> Maps to `experience = 'beginner'`, defaults `preferred_time = 'evening'`, `preferred_duration = 10`.
     - "Lethargic (Low energy, heavy mind)" -> Maps to `experience = 'advanced'`, defaults `preferred_time = 'morning'`, `preferred_duration = 20`.
- Update the sticky continue button logic to require only these 2 questions.
- Style the option cards with clean borders, warm haptic feedback, and thin dividing lines.

**Step 2: Commit & Verify**
- Commit the change with message: `"feat(onboarding): simplify personalization quiz to 2 questions with authentic copying"`

---

### Task 2: Redesign Welcome Screen

**Files:**
- Modify: `app/(auth)/welcome.tsx`

**Step 1: Simplify Layout & Copy**
- Remove the testimonials/quotes auto-rotation carousel block to prevent cognitive load.
- Reframe page copy to feel more editorial:
  - Display Title: *"Return to still."*
  - Body: *"Sadhana is a quiet space for authentic posture, breath control, and contemplation."*
  - Button text: *"Enter the Sanctuary"*
- Keep the breathing lotus SVG center-screen, ensuring it expands/contracts.

**Step 2: Commit & Verify**
- Commit the change with message: `"feat(onboarding): redesign welcome screen into minimalist breathing lotus entry"`

---

### Task 3: Redesign Breathing Space Screen

**Files:**
- Modify: `app/(auth)/breathing-space.tsx`

**Step 1: Enhance Pranayama Experience**
- Reframe the header text: *"Before we customize your sanctuary, let us share one quiet breath."*
- Ensure the 10-second breathing loop feels atmospheric and triggers soft haptic pulses during phase changes (Inhale, Hold, Exhale).

**Step 2: Commit & Verify**
- Commit the change with message: `"feat(onboarding): enhance 30-second breathing space copy and pranayama flow"`

---

### Task 4: Redesign GDPR Data Philosophy

**Files:**
- Modify: `app/(auth)/gdpr.tsx`

**Step 1: Convert to Full-Screen Philosophy**
- Convert the modal bottom sheet layout into a beautiful, full-screen data declaration: *"A Covenant of Space."*
- Copy: *"In our tradition, practice is private. We hold your metrics locally, encrypt your notes, and sell nothing. Ever."*
- Use clean full-bleed rows and transparent toggles for analytics.

**Step 2: Commit & Verify**
- Commit the change with message: `"feat(onboarding): redesign GDPR screen into full-screen data philosophy covenant"`

---

### Task 5: Redesign Permission Priming

**Files:**
- Modify: `app/(auth)/priming.tsx`

**Step 1: Align Notifications to Dinacharya Daily Rhythm**
- Reframe copy: *"Dinacharya (Daily Rhythm)"*
- Description: *"We will send a single quiet invitation when you wake up to anchor your practice. No metrics pressure, just a gentle path."*
- Replace the calendar grid graphic with a simple sunrise line illustration.

**Step 2: Commit & Verify**
- Commit the change with message: `"feat(onboarding): redesign permission priming screen around Dinacharya daily rhythm"`

---

### Task 6: Redesign Registration Screen

**Files:**
- Modify: `app/(auth)/register.tsx`

**Step 1: Reframe to Secure Vault Creation**
- Reframe header copy: *"Seal the Covenant"*
- Subtitle: *"Create a secure vault to preserve your daily streaks, custom routine durations, and practice history across devices."*
- Keep inputs as weightless lines (no card bounding boxes) with floating labels.

**Step 2: Commit & Verify**
- Commit the change with message: `"feat(onboarding): reframe register screen into secure vault creation"`

---

### Task 7: Redesign Paywall Screen

**Files:**
- Modify: `app/(auth)/paywall.tsx`

**Step 1: Clean up Billing Layout & Navigation**
- Display the paywall immediately *after* vault registration.
- Style the monthly/annual plan cards as clean side-by-side elements with a terracotta highlight.
- Add an immediate close button (`✕`) at the top right to allow users to skip to free practice without delay.

**Step 2: Commit & Verify**
- Commit the change with message: `"feat(onboarding): redesign subscription paywall screen with layout optimizations"`

---

## Verification Plan

### Automated Tests
- Run typecheck: `npm run typecheck`
- Run jest tests: `npm --prefix d:\Desktop\Fitness\tests test`

### Manual Verification
- Walk through the entire onboarding flow in the app to check visual consistency, typography alignment, and transition speeds.
