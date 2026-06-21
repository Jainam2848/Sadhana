# Time-of-Day Temperature System Polish Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Refine the time-of-day temperature system with premium aesthetics, implement Tier 4 "Settling" transitions, and add custom signature completion haptics for the timer, while ensuring WCAG AA accessibility and adhering to strict mobile design patterns.

**Architecture:** We will update the global theme definitions to include the new interpolated time-of-day gradients and semantic color maps. We will refactor the home screen and timer components to consume these theme properties, applying Framer Motion / Reanimated for fluid, non-stacking animations (MandalaThread) and high-performance SVG rendering. We will integrate `expo-haptics` (or `react-native-haptic-feedback`) for the custom signature haptics.

**Tech Stack:** React Native / Expo, Reanimated / Framer Motion (depending on current project setup), `expo-haptics`, SVGs.

---

## User Review Required

- **Accessibility (Reduced Motion):** Does the user have a preferred fallback state for the "MandalaThread" animations when `prefers-reduced-motion` is enabled? (Our default will be to disable the animation and show a static, aesthetically pleasing frame).
- **Haptics Integration:** Are we using `expo-haptics` or another library for the haptic feedback? The plan assumes `expo-haptics` for Expo projects.
- **Aesthetic Direction:** Is there a specific dominant tone we are aiming for (e.g., *luxury minimal*, *editorial brutalism*)? The plan assumes a high-end, fluid, *organic minimal* approach.

## Open Questions

- What specific colors or temperature mapping are we using for the time-of-day shifts (e.g., morning -> cool blues/warm yellows, evening -> deep purples/oranges)?
- Which file currently houses the main global theme or color palette?
- Are we using React Native Reanimated, Framer Motion, or Anime.js for animations? (Assuming Reanimated for React Native).

## Proposed Changes

### 1. Theme and Color System Updates

#### [MODIFY] `src/theme/colors.ts` (or equivalent)
- Add the interpolated color maps for the time-of-day temperature system.
- Ensure all new colors meet WCAG AA contrast requirements against their respective backgrounds.

### 2. Time-of-Day Context & Interpolation Logic

#### [MODIFY] `src/hooks/useTimeOfDayTheme.ts` (or equivalent)
- Create or update the hook responsible for managing the coarse interval loop for the theme shift.
- Implement smooth interpolation logic to transition between time-of-day themes without abrupt changes.

### 3. Tier 4 "Settling" Transitions & MandalaThread Animations

#### [MODIFY] `src/components/MandalaThread.tsx` (or equivalent)
- Refactor the component to use efficient SVG rendering and optimized animation libraries (e.g., Reanimated).
- Implement the Tier 4 "Settling" transitions, ensuring they are fluid and performant (60fps+).
- Add strict cleanup logic in `useEffect` to prevent animation stacking or memory leaks between mounts.
- Add `prefers-reduced-motion` checks to disable animations for accessibility.

### 4. Custom Signature Completion Haptics

#### [MODIFY] `src/components/Timer.tsx` (or equivalent)
- Integrate `expo-haptics` to trigger a custom, premium haptic pattern upon timer completion (e.g., `Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)` followed by a light haptic).
- Ensure the haptic feedback feels intentional and not "glitchy."

### 5. Accessibility Audits and Fixes

#### [MODIFY] Various Components
- Ensure all interactive elements have minimum touch targets (44x44px).
- Verify contrast ratios for the new time-of-day color themes.
- Add `aria-label` or `accessibilityLabel` to all new or modified SVGs and interactive elements.

## Verification Plan

### Automated Tests
- Run existing unit tests to ensure no regressions.
- (If applicable) Add new tests for the time-of-day hook logic to verify correct state changes over time.

### Manual Verification
- Deploy to an iOS simulator/device and an Android emulator/device.
- Manually test the timer completion to feel the custom haptics.
- Use accessibility inspector tools (e.g., Xcode Accessibility Inspector, Android Accessibility Scanner) to verify touch targets, contrast, and labels.
- Toggle `prefers-reduced-motion` at the OS level and verify that the MandalaThread animations gracefully fallback to a static state.
- Monitor memory usage to confirm animations are not stacking or leaking over multiple component mounts.
