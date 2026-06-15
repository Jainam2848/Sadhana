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

To ensure that Google Stitch generates high-fidelity, unified frontend code in Phase 3 that complies with the **Earth Premium** styling, use these exact, detailed prompts:

### 3.1 Onboarding & Quiz Prompts (Screens 1 & 2)
```text
Generate a premium, mobile-first onboarding slide and personalization screen for a wellness app named 'Sadhana'.
Layout: Vertical stack, centered alignment.
Color Palette (Earth Premium): Background #FDFEFE (Cream), Primary text #2C3E50 (Charcoal), Accent colors #D35400 (Terracotta) for active states and #1E8449 (Olive) for progress states.
Typography: Headings set to Lora serif (font-family: 'Lora', serif), body text set to Raleway (font-family: 'Raleway', sans-serif).
Screen 1: Welcome slide with a centered terracotta logo icon (use an SVG flower/lotus glyph), a Lora heading "Your Daily Mind-Body Sanctuary" (font-size: 28px, font-weight: 600, color: #2C3E50), a Raleway body text, and a primary action button with background color #D35400, text color #FDFEFE, and height 48px with cursor-pointer. Include a subtle scrolling text container at the bottom displaying client feedback quotes.
Screen 2: Personalization questionnaire. Include a top progress bar with olive background. Display a Lora heading "What is your primary goal?" followed by three clickable single-select card components: 1. "Relieve Stress & Anxiety", 2. "Improve Joint Mobility", 3. "Connect with Philosophy". Each card should have background #FDFEFE, border 1px solid #2C3E50, height 56px, and dynamic haptic-ready hover states that change background to #ECFDF5 and border to #1E8449.
All interactive elements must have a cursor-pointer class and aria-labels for accessibility.
```

### 3.2 Home Dashboard & Routine Player Prompts (Screens 6, 7 & 8)
```text
Generate a mobile-first dashboard and routine config layout for the 'Sadhana' home tab.
Style: Earth Premium theme. 
Screen 6 Dashboard: Display a dynamic greeting "Hari Om, Sarah" (Lora, 24px) next to an animated orange flame icon showing a streak count "5 Days 🔥". Place a large, floating "Today's Sadhana" Card container (background: #FDFEFE, box-shadow: 0 4px 6px rgba(44,62,80,0.05), border-radius: 12px, border: 1px solid #2C3E50/10). Inside the card, display routine title "Morning Sanctuary Sadhana", duration "12 min", and segments list: 1. Asana (Stretching), 2. Pranayama (Breathing), 3. Dhyana (Meditation) in terracotta tags. Add a primary CTA button: "Prepare Sadhana" (background: #D35400, width: 100%).
Screen 7 Routine Config: Detail the three segments. Show an offline download toggle switch (use custom SVG toggle, color: #1E8449 when active). Add a "Start Practice" button (height: 48px, background: #D35400).
Ensure all touch targets are at least 44px in height. No emojis used as icons; utilize SVG paths for play/pause/download symbols.
```

### 3.3 Active Media Player Prompt (Screen 8)
```text
Generate an immersive, full-screen mobile media player for the 'Sadhana' app's active sessions.
Theme: Minimalist dark-leaning Earth Premium.
Visual layout: Center viewport displays a high-definition video frame (active for Asana stretches) or fades to a static cream-and-olive mandala artwork container with a pulsing visualizer overlay (active for Pranayama breathwork).
Controls (Bottom): Large terracotta Play/Pause button (diameter 56px, background: #D35400, color: #FDFEFE), surrounded by previous/next segment skip buttons (SVG paths). Include a horizontal track slider showing elapsed time vs total time.
Sanskrit Tooltip overlay: Include a small button "Sanskrit Glossary". Tapping it slides up a modal bottom sheet (background: #FDFEFE, padding: 20px) displaying terms like "Ujjayi Pranayama" in Lora bold, Sanskrit letters "उज्जायी प्राणायाम", and scientific benefits in Raleway.
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
```
