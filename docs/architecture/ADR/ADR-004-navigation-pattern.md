# ADR-004: Navigation Pattern

## Status
Accepted

## Context
The **Sadhana** mobile application needs a robust, performant, and deep-linkable navigation structure to support its multi-screen experience. The UX screen inventory is divided into distinct sections:
1.  **Onboarding Stack (Modal Flow):** A linear progression for welcome slides, personalization, GDPR consent, notification priming, and registration/paywall gating.
2.  **Bottom Tab Navigation (Core App):** A sticky bottom bar layout containing 4 main stack hubs: Home, Library, Rewards, and Profile.
3.  **Nested Stack Navigators:** Sub-screens (such as Routine Configuration, Active Player, Course Details, and Settings pages) nested within the tab screens.

We need a navigation system that integrates cleanly with Expo, supports TypeScript typing natively, reduces boilerplate, and simplifies deep linking for push notifications (e.g. directing a user straight to Today's Sadhana player from a notification).

### Decision Criteria
*   **Boilerplate & Maintenance:** Minimizing manual navigation route declarations, params typing files, and linking configuration objects.
*   **Deep Linking Support:** Out-of-the-box support for routing parameters and deep links.
*   **Platform Alignment:** Conformance with Android back gestures and iOS swipe-to-dismiss behavior.
*   **Expo Integration:** Seamless integration with Expo's tooling and runtime.

---

## Comparison of Alternatives

### 1. React Navigation (Native Stack + Tab Navigators)
*   **Pros:** The industry standard for React Native. Highly customizable, mature, and flexible.
*   **Cons:** Heavy boilerplate. Route params typing requires complex generic declarations. Deep linking requires manually mapping nested configurations in a separate configuration object, which is error-prone.

### 2. Expo Router (File-Based Navigation)
*   **Pros:**
    *   Built on top of React Navigation, retaining its native performance (60fps transition speeds).
    *   Removes route declaration boilerplate: files in the `app/` folder automatically become routes.
    *   Deep linking is enabled automatically for every route by mapping URLs directly to the filesystem layout.
    *   Strong type safety: generates type definitions for link pathways automatically.
    *   Supports path aliases (`@/app`, etc.) and native navigation components out of the box.
*   **Cons:** Relatively new compared to raw React Navigation, but fully mature and recommended as the default in modern Expo SDK releases (v50+).

---

## Decision
We decided to use **Expo Router** as the routing system for the **Sadhana** application.

### Implementation Details

The app directory structure will be set up as follows:
```
app/
├── (auth)/                # Onboarding stack group
│   ├── welcome.tsx        # Slide carousel and entry
│   ├── personalize.tsx    # Questionnaire
│   ├── gdpr.tsx           # GDPR consent controls
│   ├── priming.tsx        # Push notification permission priming
│   ├── register.tsx       # Auth and registration gateway
│   └── _layout.tsx        # Stack layout for auth group
├── (tabs)/                # Main bottom tabs group
│   ├── home.tsx           # Dashboard tab
│   ├── library.tsx        # Browse routines and courses
│   ├── rewards.tsx        # Incentive tracking and Karma Coins
│   ├── profile.tsx        # Streak heatmaps and settings links
│   └── _layout.tsx        # Tabs layout with Lucide icons (56px height)
├── _layout.tsx            # Root layout wrapping global providers (Theme, Query, Auth)
└── index.tsx              # Root entry point directing users to onboarding or tabs
```

### Stack & Modals Layout
- The root layout (`app/_layout.tsx`) exposes a `Stack` router with `headerShown: false`.
- The onboarding group (`(auth)`) uses a slide-from-right native transition stack.
- Transitions between screens and modal overrides (like Settings or custom players) use native modal settings.

---

## Consequences
*   **File-Based Routing Rules:** Every file in the `app/` directory maps to a route. Sub-components or non-page assets must be placed outside the `app/` folder (e.g. in `src/components/`).
*   **Strict Parameter Handling:** Screen parameters will be parsed using Expo Router's `useLocalSearchParams` hook to enforce clean TypeScript parameter contracts.
*   **Deep Linking:** All routes are automatically deep-linkable. A push notification payload containing `sadhana://(tabs)/home` or `sadhana://(tabs)/library` will resolve natively.
