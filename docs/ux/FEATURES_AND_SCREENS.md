# Features & Screens Specification — Sadhana

> **Phase:** 2 (UX Research & Information Architecture)
> **Skills Applied:** `ui-ux-pro-max`, `mobile-design`, `brand-perception-psychologist`
> **Last Updated:** 2026-06-15
> **Status:** Completed

---

## 1. Finalized Feature List (MVP Scope)

These features represent the finalized scope for the Sadhana MVP, detailing which features are Premium-only vs. Free:

### 1.1 Core Content & Playback
*   **Integrated Sadhana Player:** Plays the daily morning/evening sequence of physical stretching (Asana), breathwork (Pranayama), and meditation (Dhyana). (Free: static Global plan. Premium: personalized plan).
*   **Media Player Controls:** Video playback (Asana) supporting landscape orientation; background audio playback (Pranayama/Dhyana) supporting lock-screen notification controls.
*   **Sanskrit Tooltip Overlays:** Tapping traditional terms (e.g. *Pranayama*, *Ujjayi*) slides up a bottom sheet with Devanagari script, translation, and neuroscientific benefits. (Available to all users).
*   **Offline Media Downloader (Premium Only):** Local encrypted download utility allowing playback without network access.

### 1.2 Personalization & habit Loops
*   **Personalized Routine Planner (Premium Only):** Evaluates onboarding quiz responses (goals, flexibility, pacing preference) to dynamically assemble a custom sequence. (Free users are locked out and receive the "Global Daily Sadhana of the Day").
*   **Habit & Streak Tracker:** Visual streak flame and interactive monthly calendar heat map recording completed sessions. (Available to all users).
*   **Local Notification Reminders:** Custom reminder times set during onboarding to trigger local push notifications. (Available to all users).

### 1.3 Monetization & Rewards
*   **Soft-Gated Onboarding Paywall:** Serving subscription and trial starts immediately after personalization questions, with a skip option for Free tier users.
*   **Full-Screen Interstitial Ads (Free Only):** Played upon session completion or tab transition (capped at 1 per 15 minutes), displaying a mandatory **10-second countdown timer** before enabling the skip button.
*   **Sadhana Rewards (Free Tier):** Milestone tracking for monthly ad views. Reaching 10, 30, or 50 views unlocks premium sessions, guided courses, or a 24-hour ad-free pass for the current month.
*   **Karma Coins (Premium Only):** Earning points via optional rewarded ads, saved in a permanent wallet to redeem for subscription discounts, wellness gear, or Indian heritage charity donations.

---

## 2. Screen Inventory & Component Breakdown

This numbered inventory lists all 19 screens in the Sadhana application, mapping their purpose and interactive elements:

### Navigation Stack A: Onboarding Stack
1.  **Welcome Screen**
    *   *Purpose:* Introduce brand tagline and visual tone.
    *   *Parent:* Root App Controller (modal).
    *   *Components:* Horizontal swiping card carousel, Terracotta logo icon, "Begin Journey" button, "Log In" link, dynamic testimonial slider.
2.  **Personalization Screen (Questionnaire)**
    *   *Purpose:* Collect user focus, experience, and flexibility.
    *   *Parent:* Welcome Screen.
    *   *Components:* Top progress bar, multi-select goal blocks, skill level selector buttons, "Continue" CTA.
3.  **GDPR Consent Screen**
    *   *Purpose:* Manage tracking opt-in for EU regulatory compliance.
    *   *Parent:* Personalization Screen.
    *   *Components:* Legal disclosure body, "Agree to All" primary button, "Manage Options" toggle links.
4.  **Permission Priming Screen**
    *   *Purpose:* Contextualize alert utility (streaks) to increase notification opt-in rates.
    *   *Parent:* GDPR Consent Screen.
    *   *Components:* Animated calendar flame-streak mock graphic, "Allow Reminders" button, "Skip" text link.
5.  **Auth / Register Screen**
    *   *Purpose:* Create or access user account.
    *   *Parent:* Permission Priming Screen.
    *   *Components:* Email text input, secure password field, "Sign Up" button, "Sign In" toggle, "Skip (Guest)" link.

### Navigation Stack B: Home Tab Stack
6.  **Sadhana Dashboard (Home Screen)**
    *   *Purpose:* Central hub showing streak status, daily routine, and recent sessions.
    *   *Parent:* Tab Bar Navigator.
    *   *Components:* Animated Streak Flame counter (🔥), Today's Sadhana Card (Personalized for Premium; locked/Global for Free), "Recent Sessions" carousel, dynamic greeting text ("Hari Om, [Name]").
7.  **Routine Config Screen**
    *   *Purpose:* Review and configure routine segments.
    *   *Parent:* Sadhana Dashboard.
    *   *Components:* Asana/Pranayama/Dhyana segment preview blocks, total duration metadata, offline download/cache toggle (Premium only), "Start Practice" primary button.
8.  **Active Routine Player Screen**
    *   *Purpose:* Play physical yoga videos and breathing/meditation audio guides.
    *   *Parent:* Routine Config Screen.
    *   *Components:* HD video viewport (Asana), static artwork container (Pranayama/Dhyana), ambient audio visualizer, play/pause buttons, seek track, Sanskrit tooltip triggers.
9.  **Session Completed Screen**
    *   *Purpose:* Congratulate user, present stats, and trigger reward milestones or ads.
    *   *Parent:* Active Routine Player Screen.
    *   *Components:* Confetti animation, stats board (duration, streak), "Claim Rewards" button, Full-screen ad interstitial container (Free only, with 10s skip block).

### Navigation Stack C: Library Tab Stack
10. **Library Browser Screen**
    *   *Purpose:* Explore individual yoga, breathing, and meditation classes.
    *   *Parent:* Tab Bar Navigator.
    *   *Components:* Filter chips (Asana, Pranayama, Dhyana, Philosophy), search input, horizontal featured lists, course grid layout.
11. **Course Detail Screen**
    *   *Purpose:* Review course syllabus and details.
    *   *Parent:* Library Browser Screen.
    *   *Components:* Hero image, instructor profile card, course description, vertical course syllabus list (showing locked premium icons), "Enroll / Play" CTA.
12. **Single Media Player Screen**
    *   *Purpose:* Standalone player for single library sessions.
    *   *Parent:* Course Detail Screen.
    *   *Components:* Playback controls, loop button, background audio configuration, "Mark as Complete" trigger.

### Navigation Stack D: Rewards Tab Stack
13. **Rewards Dashboard Screen**
    *   *Purpose:* Track ad-milestone unlocks and wallet points.
    *   *Parent:* Tab Bar Navigator.
    *   *Components:* Monthly ad count progress indicator (milestones at 10, 30, 50), Karma Coins Wallet card (Premium only), "Watch Rewarded Ad" button, unlock selector cards.
14. **Karma Coins Redemption Screen**
    *   *Purpose:* Exchange wallet points for discounts or donations.
    *   *Parent:* Rewards Dashboard Screen.
    *   *Components:* Wallet balance, renewal discount coupons, partner shop discount card, "Indian Script Preservation Donation" button, confirmation sheet.

### Navigation Stack E: Profile & Settings Stack
15. **Profile Dashboard Screen**
    *   *Purpose:* Review lifetime stats, calendar history, and access settings.
    *   *Parent:* Tab Bar Navigator.
    *   *Components:* User avatar card, lifetime minutes statistic, calendar heatmap grid, "Settings" gear button, "Upgrade to Premium" banner.
16. **Settings Screen**
    *   *Purpose:* Central preferences portal.
    *   *Parent:* Profile Dashboard Screen.
    *   *Components:* Menu links (Account Details, Preferences, Privacy, Billing).
17. **Preferences Screen**
    *   *Purpose:* Modify app and accessibility configurations.
    *   *Parent:* Settings Screen.
    *   *Components:* Accessibility typography text-scale slider (for Elena), dynamic language selector, push notification time picker.
18. **GDPR & Privacy Screen**
    *   *Purpose:* Manage data safety and privacy options.
    *   *Parent:* Settings Screen.
    *   *Components:* Analytics opt-in toggles, "Request Data Export" button, "Delete Account" button.
19. **Account Deletion Screen**
    *   *Purpose:* Confirm permanent profile removal.
    *   *Parent:* GDPR & Privacy Screen.
    *   *Components:* Warning text banner, confirmation text input ("DELETE"), primary "Confirm Account Deletion" button, "Cancel" button.
20. **Paywall Screen**
    *   *Purpose:* Gate premium packages and manage subscription transactions.
    *   *Parent:* Profile Screen (and modal triggers across locked sessions).
    *   *Components:* Subscription plan grid (Monthly vs Annual), features comparison matrix, "Start 7-Day Free Trial" button, "Restore Purchase" text link.

---

## 3. Google Stitch Generation Prompts (Phase 3 Integration)

To ensure that Google Stitch generates high-fidelity, unified frontend code in Phase 3 that complies with the **Earth Premium** styling and incorporates fluid, micro-interactive design details, use these exact prompts:

### 3.1 Onboarding & Quiz Prompts (Screens 1 & 2)
```text
Generate a premium, mobile-first onboarding slide and personalization screen for a wellness app named 'Sadhana'.
Layout: Vertical stack, centered alignment.
Color Palette (Earth Premium): Background #FDFEFE (Cream), Primary text #2C3E50 (Charcoal), Accent colors #D35400 (Terracotta) for active states and #1E8449 (Olive) for progress states.
Typography: Headings set to Lora serif (font-family: 'Lora', serif), body text set to Raleway (font-family: 'Raleway', sans-serif).
Screen 1: Welcome slide with a centered terracotta logo icon (use an SVG flower/lotus glyph), a Lora heading "Your Daily Mind-Body Sanctuary" (font-size: 28px, font-weight: 600, color: #2C3E50), a Raleway body text, and a primary action button with background color #D35400, text color #FDFEFE, and height 48px with cursor-pointer. Include a subtle scrolling text container at the bottom displaying client feedback quotes.
Micro-Interactions & Motions (Screen 1): The welcome title must have a subtle, delayed slide-up entrance effect (100px vertical displacement over 600ms, using ease-out). The swipe indicators (carousel dots) must animate with a fluid width expansion (from 8px circle to a 20px pill) when active. Include a gentle, repeating bounce animation on a down-chevron icon at the very bottom of the viewport to indicate scrolling potential.
Screen 2: Personalization questionnaire. Include a top progress bar with olive background. Display a Lora heading "What is your primary goal?" followed by three clickable single-select card components: 1. "Relieve Stress & Anxiety", 2. "Improve Joint Mobility", 3. "Connect with Philosophy". Each card should have background #FDFEFE, border 1px solid #2C3E50/15, height 56px, and dynamic haptic-ready hover states that change background to #ECFDF5 and border to #1E8449.
Micro-Interactions & Motions (Screen 2): The top progress bar should have a continuous, horizontal shimmer/sheen animation that sweeps from left to right every 3 seconds to indicate vitality. Tapping any goal card triggers a 150ms transform: scale(0.97) spring-squeeze animation, and overlays a thin, hand-drawn outline transition around the card border (duration 200ms) with a fade-in checkmark indicator.
All interactive elements must have a cursor-pointer class and aria-labels for accessibility.
```

### 3.2 Home Dashboard & Routine Player Prompts (Screens 6, 7 & 8)
```text
Generate a mobile-first dashboard and routine config layout for the 'Sadhana' home tab.
Style: Earth Premium theme. 
Screen 6 Dashboard: Display a dynamic greeting "Hari Om, Sarah" (Lora, 24px) next to an animated orange flame icon showing a streak count "5 Days 🔥". Place a large, floating "Today's Sadhana" Card container (background: #FDFEFE, box-shadow: 0 4px 6px rgba(44,62,80,0.05), border-radius: 12px, border: 1px solid #2C3E50/10). Inside the card, display routine title "Morning Sanctuary Sadhana", duration "12 min", and segments list: 1. Asana (Stretching), 2. Pranayama (Breathing), 3. Dhyana (Meditation) in terracotta tags. Add a primary CTA button: "Prepare Sadhana" (background: #D35400, width: 100%).
Micro-Interactions & Motions (Screen 6): The streak flame icon (🔥) must animate with a slow, breathing pulse glow effect (opacity shifting from 0.8 to 1.0, and a drop shadow filter expanding from 2px to 8px in a terracotta shade, repeating every 2.5 seconds). The "Today's Sadhana" card must float upwards slightly (transform: translateY(-4px) and shadow deepening) when focused or hovered.
Screen 7 Routine Config: Detail the three segments. Show an offline download toggle switch (use custom SVG toggle, color: #1E8449 when active). Add a "Start Practice" button (height: 48px, background: #D35400).
Micro-Interactions & Motions (Screen 7): The segment list items should fade in sequentially (staggered delay of 100ms per card). The custom SVG download toggle switch must animate with a smooth 250ms left-to-right slider translation, changing background color from slate-200 to olive-green (#1E8449).
Ensure all touch targets are at least 44px in height. No emojis used as icons; utilize SVG paths for play/pause/download symbols.
```

### 3.3 Active Media Player Prompt (Screen 8)
```text
Generate an immersive, full-screen mobile media player for the 'Sadhana' app's active sessions.
Theme: Minimalist dark-leaning Earth Premium.
Visual layout: Center viewport displays a high-definition video frame (active for Asana stretches) or fades to a static cream-and-olive mandala artwork container with a pulsing visualizer overlay (active for Pranayama breathwork).
Controls (Bottom): Large terracotta Play/Pause button (diameter 56px, background: #D35400, color: #FDFEFE), surrounded by previous/next segment skip buttons (SVG paths). Include a horizontal track slider showing elapsed time vs total time.
Micro-Interactions & Motions (Active Player): For Pranayama/Dhyana, the mandala artwork visualizer should have three concentric SVG circle paths that slowly expand and fade in opacity, synchronized to a relaxed breathing pattern: expanding outwards for 4 seconds (inhale), remaining static and slightly glowing for 4 seconds (hold), and contracting/fading back for 4 seconds (exhale). The main play/pause button should scale up to 1.08 and trigger a light concentric ripple wave when clicked.
Sanskrit Tooltip overlay: Include a small button "Sanskrit Glossary". Tapping it slides up a modal bottom sheet (background: #FDFEFE, padding: 20px) displaying terms like "Ujjayi Pranayama" in Lora bold, Sanskrit letters "उज्जायी प्राणायाम", and scientific benefits in Raleway.
Micro-Interactions & Motions (Glossary Sheet): The bottom glossary sheet must slide up smoothly from the bottom margin (0ms to 300ms, using cubic-bezier(0.16, 1, 0.3, 1)) accompanied by a frosted glass backdrop filter (backdrop-filter: blur(12px)) blurring out the player layout behind it.
Ensure the layout is responsive, respects safe areas, and has no horizontal overflow.
```

### 3.4 Soft-Gated Paywall Prompt (Screen 20)
```text
Generate a high-converting, premium mobile paywall screen for 'Sadhana'.
Theme: Earth Premium (Cream background #FDFEFE, charcoal text #2C3E50, terracotta accents #D35400).
Header: Display Lora heading "Elevate Your Daily Sadhana" (font-size: 28px) and a subhead "Access your personalized morning sequences, advanced pranayama libraries, and offline downloads."
Subscription Cards: Display two plan cards side-by-side or stacked:
1. "Monthly Pass" - $14.99/month, simple border.
2. "Annual Sanctuary Pass" - $89.99/year (50% savings). Highlight this card with a terracotta border (2px solid #D35400), a small gold accent badge "Best Value", and background color #ECFDF5.
Benefit checklist: 5 items with olive-green checkmarks (SVG) showing Free vs. Premium features (e.g. Personalized Routine, Offline Downloads, Karma Coins).
Primary CTA: A large, pulsing button "Start 7-Day Free Trial" (background: #D35400, text: #FDFEFE, font-weight: 600, height: 52px).
Cancel link: In the top right corner, place a clear "Skip / Try Free" text link (Raleway, color: #2C3E50/60) to allow free users to access the standard non-customized dashboard.
Micro-Interactions & Motions (Paywall): The highlighted "Annual Sanctuary Pass" card outline must display a slow, subtle color-shifting metallic gradient animation that sweeps around its border. Tapping a plan card triggers a micro-contraction (scale(0.97)) and a 150ms checkmark transition. The main "Start 7-Day Free Trial" CTA button must possess a slow breathing glow and a horizontal text reflection sheen that sweeps across the text every 4 seconds. The top-right "Skip" option should fade in slowly with a 2-second delay after paywall entrance to encourage users to review the premium options first.
```

### 3.5 GDPR Consent & Permission Priming Prompts (Screens 3 & 4)
```text
Generate a mobile-first privacy consent and alert priming flow for the 'Sadhana' app.
Theme: Earth Premium (Cream background #FDFEFE, charcoal text #2C3E50).
Screen 3 GDPR Consent: Display a centered legal disclosure layout with the Lora heading "Your Privacy Sanctuary". Include a descriptive body detailing analytics tracking in Raleway, two toggles (essential vs. performance tracking) in slate-gray, a primary button "Agree to All" (terracotta #D35400), and a link "Manage Options".
Micro-Interactions & Motions (Screen 3): The consent panel must slide up from the bottom with a 300ms transition. The switches must toggle with a smooth 200ms slide and a color transition from slate-200 to olive-green (#1E8449) when enabled.
Screen 4 Permission Priming: Display an illustrative interface contextualizing why notifications matter (streak tracking). Show a Lora heading "Cultivate the Habit", a graphic of an animated calendar with a streak flame, a primary button "Enable Reminders" (terracotta #D35400), and a "Skip" link.
Micro-Interactions & Motions (Screen 4): The calendar flame graphic should pulse gently (transform: scale(1.03) every 2 seconds). Clicking "Enable Reminders" triggers a double-ripple expansion effect from the button center before presenting the native OS prompt.
```

### 3.6 Auth & Register Prompt (Screen 5)
```text
Generate a clean, mobile-first registration and login portal for 'Sadhana'.
Theme: Earth Premium (Cream background #FDFEFE, charcoal text #2C3E50, terracotta accents #D35400).
Layout: Top-right "Skip to Guest" link (color: #2C3E50/60). Center Lora title "Begin Your Practice". Two text inputs (Email and Secure Password) with a 1px border. A primary "Create Account" button and a togglable link at the bottom "Already have an account? Sign In".
Micro-Interactions & Motions (Auth Screen): Tapping the "Sign In" toggle link must trigger a seamless 250ms horizontal cross-fade animation between the registration and login input forms. Form fields must display a border-color transition to terracotta and a soft inner shadow upon focus. The "Skip to Guest" link should fade in slowly with a 1.5-second delay to incentivize registration first.
```

### 3.7 Session Completed & Interstitial Ads Prompt (Screen 9)
```text
Generate a congratulatory session completion screen with ad-gating for 'Sadhana'.
Theme: Earth Premium (Cream background #FDFEFE, charcoal text #2C3E50, terracotta accents #D35400).
Screen Layout: Large centered circular graphic displaying "Sadhana Complete!". Below, show a statistics dashboard card displaying Session Duration "15 mins" and Streak Counter "5 Days 🔥". Place a primary button "Claim Rewards" (olive-green #1E8449). Include a full-screen interstitial ad container (Free tier only).
Micro-Interactions & Motions (Completion Screen): Upon screen load, a 1-second confetti canvas overlay should fire, cascading colored terracotta, cream, and olive petals downward with varying rotational speeds. The Streak Flame must scale up with a spring bounce.
Ad Countdown Timer: The full-screen interstitial ad overlay must display a prominent countdown badge in the top right corner. The badge displays a 10-second countdown with a circular progress stroke that drains slowly. The "Skip / Close" button remains completely hidden, fading in with a 200ms ease-in transition only when the counter reaches 0.
```

### 3.8 Library Browser, Course Detail & Single Media Player Prompts (Screens 10, 11 & 12)
```text
Generate a mobile-first course browser, details dashboard, and standalone media player stack for the 'Sadhana' Library tab.
Theme: Earth Premium.
Screen 10 Library Browser: Search bar at top. Horizontal category chips: "Asana Stretches", "Pranayama Breath", "Dhyana Meditation", "Philosophy". Vertical scroll list of featured course cards (displaying small lock symbols for premium courses).
Micro-Interactions & Motions (Screen 10): Tapping a category chip scales it up (1.05) and changes background color from cream to terracotta with a 150ms ease-out transition. Locked course cards trigger a brief side-to-side shake animation and highlight a brief paywall tooltip if clicked by a guest.
Screen 11 Course Detail: Hero banner image with a parallax scroll offset. Lora title "Roots of Pranayama". Syllabus vertical list of sessions (showing play buttons for free sessions, lock badges for premium). Primary CTA button "Begin Course" at the bottom.
Micro-Interactions & Motions (Screen 11): Scrolling must trigger a parallax scale displacement on the hero image. Session cards expand slightly on hover.
Screen 12 Single Player: Center vinyl-style artwork container, media play/pause controls, loop toggle, and "Mark as Complete" CTA.
Micro-Interactions & Motions (Screen 12): Tapping play triggers a rotating spin animation on the central artwork (speed: 1 rotation per 12 seconds, easing to stop on pause).
```

### 3.9 Rewards Dashboard & Karma Coins Redemption Prompts (Screens 13 & 14)
```text
Generate a rewards dashboard and points redemption shop for the 'Sadhana' Rewards tab.
Theme: Earth Premium.
Screen 13 Rewards Dashboard: Monthly milestones tracking card (progress bar displaying unlocks at 10, 30, and 50 ad views). Karma Coins wallet card displaying balance "120 Coins". Primary CTA "Watch Rewarded Ad (+10 Coins)". List of unlockable rewards below.
Micro-Interactions & Motions (Screen 13): The milestone progress bar must fill with a smooth liquid wave animation when views are recorded. Watching an ad triggers a spin transition on the coin balance card, animating the text counts scroll-ticking upwards (e.g. 110 to 120).
Screen 14 Redemption Shop: Grid of wellness coupons and a donation card "Indian Heritage Script Preservation". A confirmation bottom sheet.
Micro-Interactions & Motions (Screen 14): Tapping a coupon triggers a spring squeeze scale(0.96). Confirming a redemption triggers a stamp-lock success animation (a circular green stamp "REDEEMED" overlaying the card with a firm spring bounce) and a coin reduction counter animation.
```

### 3.10 Profile Dashboard & Preferences Prompts (Screens 15, 16, 17, 18)
```text
Generate a user profile dashboard, preferences panel, and data privacy portal for 'Sadhana'.
Theme: Earth Premium.
Screen 15 Profile Dashboard: User avatar card, lifetime statistics grid, and streak heatmap calendar (showing a grid of colored dates). Top-right settings gear icon.
Micro-Interactions & Motions (Screen 15): Heatmap calendar cells fade in sequentially in a grid-wave entrance. Lifetime statistics counters animate counting up from 0 on entry.
Screen 17 Preferences: Typography accessibility slider ( Elena's preview ) and notifications time selector.
Micro-Interactions & Motions (Screen 17): Adjusting the typography scale slider must dynamically scale a sample text paragraph in real-time with a fluid, elastic resize transition.
```

### 3.11 Account Deletion Prompt (Screen 19)
```text
Generate a destructive account deletion confirmation screen for 'Sadhana'.
Theme: Earth Premium (Cream background #FDFEFE, primary text #2C3E50).
Layout: Warning callout box with terracotta background and cream warning text. Instruction: "To confirm deletion, type DELETE in the box below". Input field. Primary button "Confirm Account Deletion" (red #C0392B, disabled state: background #BDC3C7).
Micro-Interactions & Motions (Screen 19): Tapping the "Confirm Account Deletion" button while it is disabled triggers a rapid triple horizontal shake animation on the form and triggers a red error glow around the input field. Typing the exact word "DELETE" activates the button with a smooth 200ms opacity and border-color transition to solid red.
```
