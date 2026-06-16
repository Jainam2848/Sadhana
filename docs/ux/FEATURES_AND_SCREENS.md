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

This numbered inventory lists all 21 screens in the Sadhana application, mapping their purpose and interactive elements:

### Navigation Stack A: Onboarding Stack
1.  **Welcome Screen**
    *   *Purpose:* Introduce brand tagline and visual tone.
    *   *Parent:* Root App Controller (modal).
    *   *Components:* Horizontal swiping card carousel, Terracotta logo icon, "Begin Journey" button, "Log In" link, dynamic testimonial slider.
2.  **Personalization Screen (Questionnaire & Anchoring)**
    *   *Purpose:* Collect user focus, experience, and habit anchors.
    *   *Parent:* Welcome Screen.
    *   *Components:* Top progress bar, multi-select goal blocks, skill level selector buttons, habit stacking trigger options, "Continue" CTA.
3.  **Onboarding Demo / Breathing Space Screen**
    *   *Purpose:* Present immediate value with a short 30-second interactive guided breathing preview.
    *   *Parent:* Personalization Screen.
    *   *Components:* Concentric circles, respiratory animation timer, Sanskrit terms overlay link, neuroscientific benefit sheets.
4.  **GDPR Consent Screen**
    *   *Purpose:* Manage tracking opt-in for EU regulatory compliance.
    *   *Parent:* Onboarding Demo Screen.
    *   *Components:* Legal disclosure body, "Agree to All" primary button, "Manage Options" toggle links.
5.  **Permission Priming Screen**
    *   *Purpose:* Contextualize reminders based on chosen habit anchor to boost streak opt-ins.
    *   *Parent:* GDPR Consent Screen.
    *   *Components:* Animated calendar flame-streak graphic, custom reminder priming copy (referencing chosen anchor), "Allow Reminders" button, "Skip" text link.
6.  **Onboarding Paywall Screen**
    *   *Purpose:* Gate premium packages and manage subscription transactions during onboarding.
    *   *Parent:* Permission Priming Screen.
    *   *Components:* Subscription plan grid (Monthly vs Annual), features comparison matrix, "Start 7-Day Free Trial" button, delayed "Skip / Try Free" link.
7.  **Auth / Register Screen**
    *   *Purpose:* Create or access user account (only prompted on purchase, or optional deferred login/guest route).
    *   *Parent:* Onboarding Paywall Screen.
    *   *Components:* Email text input, secure password field, "Sign Up" button, Apple/Google social CTAs, "Skip Registration" guest link.

### Navigation Stack B: Home Tab Stack
8.  **Sadhana Dashboard (Home Screen)**
    *   *Purpose:* Central hub showing streak status, daily routine, and recent sessions.
    *   *Parent:* Tab Bar Navigator.
    *   *Components:* Animated Streak Flame counter (🔥), Today's Sadhana Card (Personalized for Premium; locked/Global for Free), "Recent Sessions" carousel, dynamic greeting text ("Hari Om, [Name]").
9.  **Routine Config Screen**
    *   *Purpose:* Review and configure routine segments.
    *   *Parent:* Sadhana Dashboard.
    *   *Components:* Asana/Pranayama/Dhyana segment preview blocks, total duration metadata, offline download/cache toggle (Premium only), "Start Practice" primary button.
10. **Active Routine Player Screen**
    *   *Purpose:* Play physical yoga videos and breathing/meditation audio guides.
    *   *Parent:* Routine Config Screen.
    *   *Components:* HD video viewport (Asana), static artwork container (Pranayama/Dhyana), ambient audio visualizer, play/pause buttons, seek track, Sanskrit tooltip triggers.
11. **Session Completed Screen**
    *   *Purpose:* Congratulate user, present stats, and trigger reward milestones or ads.
    *   *Parent:* Active Routine Player Screen.
    *   *Components:* Confetti animation, stats board (duration, streak), "Claim Rewards" button, Full-screen ad interstitial container (Free only, with 10s skip block).

### Navigation Stack C: Library Tab Stack
12. **Library Browser Screen**
    *   *Purpose:* Explore individual yoga, breathing, and meditation classes.
    *   *Parent:* Tab Bar Navigator.
    *   *Components:* Filter chips (Asana, Pranayama, Dhyana, Philosophy), search input, horizontal featured lists, course grid layout.
13. **Course Detail Screen**
    *   *Purpose:* Review course syllabus and details.
    *   *Parent:* Library Browser Screen.
    *   *Components:* Hero image, instructor profile card, course description, vertical course syllabus list (showing locked premium icons), "Enroll / Play" CTA.
14. **Single Media Player Screen**
    *   *Purpose:* Standalone player for single library sessions.
    *   *Parent:* Course Detail Screen.
    *   *Components:* Playback controls, loop button, background audio configuration, "Mark as Complete" trigger.

### Navigation Stack D: Rewards Tab Stack
15. **Rewards Dashboard Screen**
    *   *Purpose:* Track ad-milestone unlocks and wallet points.
    *   *Parent:* Tab Bar Navigator.
    *   *Components:* Monthly ad count progress indicator (milestones at 10, 30, 50), Karma Coins Wallet card (Premium only), "Watch Rewarded Ad" button, unlock selector cards.
16. **Karma Coins Redemption Screen**
    *   *Purpose:* Exchange wallet points for discounts or donations.
    *   *Parent:* Rewards Dashboard Screen.
    *   *Components:* Wallet balance, renewal discount coupons, partner shop discount card, "Indian Script Preservation Donation" button, confirmation sheet.

### Navigation Stack E: Profile & Settings Stack
17. **Profile Dashboard Screen**
    *   *Purpose:* Review lifetime stats, calendar history, and access settings.
    *   *Parent:* Tab Bar Navigator.
    *   *Components:* User avatar card, lifetime minutes statistic, calendar heatmap grid, "Settings" gear button, "Upgrade to Premium" banner.
18. **Settings Screen**
    *   *Purpose:* Central preferences portal.
    *   *Parent:* Profile Dashboard Screen.
    *   *Components:* Menu links (Account Details, Preferences, Privacy, Billing).
19. **Preferences Screen**
    *   *Purpose:* Modify app and accessibility configurations.
    *   *Parent:* Settings Screen.
    *   *Components:* Accessibility typography text-scale slider, dynamic language selector, push notification time picker.
20. **GDPR & Privacy Screen**
    *   *Purpose:* Manage data safety and privacy options.
    *   *Parent:* Settings Screen.
    *   *Components:* Analytics opt-in toggles, "Request Data Export" button, "Delete Account" button.
21. **Account Deletion Screen**
    *   *Purpose:* Confirm permanent profile removal.
    *   *Parent:* GDPR & Privacy Screen.
    *   *Components:* Warning text banner, confirmation text input ("DELETE"), primary "Confirm Account Deletion" button, "Cancel" button.

---

## 3. Sadhana — Google Stitch Generation Prompts

> **Phase:** 3 (Frontend Code Generation)
> **Last Updated:** 2026-06-15

---

## DESIGN SYSTEM PRIMER
*Read this before all screen prompts. Every screen inherits these rules — do not redefine them per screen.*

**App:** Sadhana — a daily morning/evening yogic practice companion (Asana → Pranayama → Dhyana sequence). Audience: spiritually curious urban adults who practise yoga, breathwork, or meditation. The app must feel like a **serious, daily-use ritual tool**, not a generic wellness brand.

**Visual Identity: Earth Ritual**
- Background: `#FDFAF5` (warm bone — not pure cream, not white)
- Surface (cards, sheets): `#FFFFFF` with `1px solid rgba(42,29,10,0.08)` border
- Primary text: `#1C1409` (near-black warm)
- Secondary text: `#6B5A41` (warm umber)
- Accent — Terracotta: `#C44B22` (one shade darker than the default D35400 — feels hand-made, not brand-kit)
- Growth — Ashoka green: `#1A6B3A`
- Warm highlight: `#F5E6C8` (sandstone — for active states, tags, selected items)
- Danger / destructive: `#991F1F`

**Typography**
- Display headings: `Cormorant Garamond`, serif — weight 600, letter-spacing -0.02em. Use for screen titles, session names, and anything the user reads once and acts on.
- Body / UI copy: `DM Sans`, sans-serif — weight 400/500. Use for labels, descriptions, stats, button text.
- Sanskrit terms: `Noto Serif Devanagari`, fallback to serif — weight 500. Use only inside Sanskrit tooltip overlays.
- Do not mix more than two of these on any single screen.

**Layout Grammar**
- Mobile canvas: 390px wide, safe-area-aware (`padding: env(safe-area-inset-*)`)
- Border radius: 8px for chips/tags, 12px for cards, 20px for modal bottom sheets, 28px for primary CTA buttons
- Touch targets: minimum 48px height — no exception
- Tab bar: 5 tabs, 56px height, sticky bottom
- Typography scale: 11px (micro label) / 13px (caption) / 15px (body) / 18px (subheading) / 24px (heading) / 32px (display)

**Motion Hierarchy — Three Tiers Only**
- Tier 1 — Screen transitions: 280ms ease-out. Used for screen pushes, modal entrance (slide-up from translateY +100%).
- Tier 2 — Component feedback: 150ms ease-out. Used for button press (scale 0.97), card tap, chip selection, toggle.
- Tier 3 — Ambient / atmospheric: 2000ms–4000ms ease-in-out infinite. Used sparingly, maximum one ambient animation visible at a time. Always use `prefers-reduced-motion: no-preference` guard.

**Signature Visual Element (Mandatory on all screens)**
Every screen must include exactly one instance of the **Mandala thread** — an extremely thin SVG circular arc (0.5px stroke, opacity 0.08, `#C44B22`) in the top-right corner of the screen background, partially cropped. This is the unifying ambient detail across all screens. It is never interactive.

---

## PROMPT 3.1 — Welcome & Personalization (Screens 1 & 2)

```text
You are generating mobile UI for 'Sadhana', a daily yogic practice app. Load the Design System Primer above before writing any code.

SCREEN 1 — WELCOME

Layout: Full-viewport vertical stack. Safe areas observed on top and bottom.

Background: #FDFAF5. Place the Mandala thread SVG arc (0.5px, opacity 0.06, #C44B22) bleeding off the top-right corner.

Top section (40% of viewport):
- Center-aligned SVG lotus glyph, 48×48px, stroke-only, #C44B22, 1px stroke. No fill. Paths should suggest a blooming lotus — 7 petals, not a generic flower.
- Below: Cormorant Garamond 32px / 600 / #1C1409 / line-height 1.1 / letter-spacing -0.02em heading: "Your Morning Begins Here"
- Below: DM Sans 15px / 400 / #6B5A41 body: "A guided daily sequence of posture, breath, and stillness."

Mid section — Testimonials (scrolling, not static):
- A horizontally auto-scrolling strip (CSS marquee / animation: scroll linear infinite 30s) of short testimonials in DM Sans 13px italic / #6B5A41, separated by a centered dot. Example items: "20 minutes that changed my morning — Priya, Bengaluru" · "Finally a pranayama sequence I can maintain — Arjun, London" · "It doesn't feel like an app, it feels like a ritual — Sofia, NYC"
- No card border around this strip. Just text on the background.

Bottom section — CTAs:
- Primary button: "Begin Your Journey" — 48px height, full-width minus 24px horizontal padding, border-radius 28px, background #C44B22, DM Sans 15px/500/#FFFFFF, no shadow
- Below: DM Sans 13px / #6B5A41 link: "Already practicing? Log in"

ENTRANCE ANIMATIONS (guard with prefers-reduced-motion: no-preference):
- Lotus glyph: strokeDashoffset reveal, 600ms, ease-out, 200ms delay
- Heading: translateY(16px) → 0, opacity 0→1, 500ms ease-out, 300ms delay
- Body text: same, 100ms additional delay
- "Begin" button: opacity 0→1 only, 400ms, 600ms delay — no movement
- Testimonials strip: begins immediately, no entrance animation

---

SCREEN 2 — PERSONALIZATION QUESTIONNAIRE

Layout: Full-viewport. Top progress bar. Scrollable question area. Sticky "Continue" at bottom.

Top progress bar:
- 4px height, full-width, background rgba(42,29,10,0.08)
- Filled portion: #C44B22, width animated to 15% for step 1
- No shimmer. Static. Progress itself is the signal.

Question heading: Cormorant Garamond 24px / 600 / #1C1409: "What brings you to your mat?"
Sub-label: DM Sans 13px / #6B5A41: "Choose all that apply"

Goal cards (3 options, vertical stack, 12px gap):
Each card:
- Background #FFFFFF, border 1px solid rgba(42,29,10,0.08), border-radius 12px, height 64px, horizontal padding 16px
- Left: 20px DM Sans 500 / #1C1409 label. Right: 20px circle selection indicator (unchecked: 1px border #C44B22/40, checked: filled #C44B22 with white checkmark inside)
- Options: "Relieve stress and anxiety" / "Improve joint mobility and flexibility" / "Connect with yogic philosophy"

Selected state: background #F5E6C8, border 1px solid #C44B22, right indicator filled

Tier 2 motion on tap: scale(0.97) 150ms, then spring back. Checkbox fills in 150ms.

Below cards: second question appears after at least one goal card is selected (fade-in, no layout shift):
"How would you describe your experience?"
Three pill chips in a row: "New to this" / "Some practice" / "Regular practitioner"
Pill style: 36px height, border-radius 20px, DM Sans 13px. Default: #FFFFFF border. Selected: #F5E6C8 background, #C44B22 border.

Below chips: third question appears (fade-in 200ms) after experience chip is selected:
"When will you practice daily?"
Four pill chips for habit stacking: "After waking up" / "After brushing my teeth" / "After my morning coffee" / "Before going to sleep"
Pill style identical to experience chips.

Sticky bottom: "Continue" button identical to Welcome CTA. Disabled (opacity 0.4, not clickable) until at least one goal card, one experience chip, and one habit anchor chip are selected. Transition to enabled: 200ms opacity change.
```

---

## PROMPT 3.2 — Onboarding Demo / Breathing Space (Screen 3)

```text
Sadhana app. Load the Design System Primer above before writing any code.

SCREEN 3 — ONBOARDING DEMO / BREATHING SPACE

Layout: Full viewport, centered content. Background: #FDFAF5. Mandala thread SVG arc top-right.

Top Section (15% height):
- Progress bar at 30% width (#C44B22)
- DM Sans 11px / uppercase / letter-spacing 0.08em / #6B5A41 section: "EXPERIENCE STILLNESS"
- Cormorant Garamond 24px / 600 / #1C1409: "A 30-Second Breathing Space"

Center Visualizer (50% height):
- 3 concentric SVG circle paths, stroke-only, #C44B22, strokes at 1.5px / 1px / 0.5px. Initial radii: 60px / 90px / 120px.
- Breathing cycle animation runs automatically on load (one complete cycle = 10s, loop):
  - 0–4s (inhale): all circles expand outward (+25px radius) and opacity increases 0.3→0.8.
  - 4–6s (hold): no transform, circles hold static, emit a very subtle opacity pulse 0.8→0.6→0.8.
  - 6–10s (exhale): circles contract back to baseline, opacity 0.8→0.2.
- Center text within circles: DM Sans 11px / uppercase / letter-spacing 0.1em / #C44B22: "Inhale" / "Hold" / "Exhale" switching with 300ms crossfade.
- Haptic Feedback: Trigger a short vibration (navigator.vibrate(50) where supported) on each inhale/exhale transition.
- Guard entire breathing animation with prefers-reduced-motion. Fallback: static concentric circles, no animation.

Interactive Sanskrit Overlay:
- Below visualizer circles: DM Sans 13px / #C44B22 text link: "Sanskrit: Pranayama प्राणायाम (What is this?)"
- Tapping this link slides up a miniature bottom sheet:
  - Noto Serif Devanagari 20px / #C44B22: प्राणायाम (Pranayama)
  - DM Sans 13px / #6B5A41: "Prana (breath/life force) + Ayama (extension). Regulates energy, calms active thought, and triggers the parasympathetic nervous system."

Bottom section — CTA:
- Primary button: "Continue" identical to Screen 1 CTA.
- The button is hidden (opacity 0, pointer-events none) for the first 10 seconds (one breathing cycle) to ensure the user experiences the value. At 10s, it fades in (opacity 0→1, 400ms ease-in).
```

---

## PROMPT 3.3 — GDPR Consent & Permission Priming (Screens 4 & 5)

```text
Sadhana app. Load the Design System Primer above before writing any code.

SCREEN 4 — GDPR CONSENT

Treat this as a trust moment, not a legal wall. Tone must feel like the app explaining itself, not lawyers speaking.

Layout: Modal bottom sheet that covers 75% of screen height. The bottom 25% shows the blurred screen behind.
Sheet: background #FDFAF5, border-radius 20px top corners only, 24px horizontal padding
Backdrop: backdrop-filter: blur(8px), background rgba(28,20,9,0.3)

Sheet content:
- Heading: Cormorant Garamond 22px / 600 / #1C1409: "How we handle your data"
- Body: DM Sans 15px / 400 / #6B5A41, two short paragraphs. First: what is collected and why (session data to build your personalized routine). Second: no sale to third parties, data stays safe.
- Divider: 1px solid rgba(42,29,10,0.08)
- Two toggle rows (48px each):
  Row 1: Label "Essential (required)" / DM Sans 13px / #6B5A41, right: toggle in permanently-on state, #1A6B3A, not interactive
  Row 2: Label "Performance analytics" / DM Sans 13px / #6B5A41, right: interactive toggle, default off. Toggle thumb slide animation: 200ms linear, color #1A6B3A when on
- Primary: "Agree to All" button, full-width, #C44B22, 48px
- Link: "Manage my options" DM Sans 13px / #6B5A41, centered, below button

Sheet entrance: slide up from translateY(100%) to 0, 280ms cubic-bezier(0.16, 1, 0.3, 1)

---

SCREEN 5 — PERMISSION PRIMING

Reframes reminders based on the daily habit anchor selected in Screen 2.

Layout: Full viewport. Vertically centered content. No scroll.

Center graphic area (SVG, 200×160px):
- Draw a simple 5-week calendar grid (5 rows × 7 columns of small squares, 12px each, 4px gap)
- Squares representing "past 18 days of practice": fill #F5E6C8, border 1px #C44B22
- Squares representing "today and future": fill #FFFFFF, border 1px rgba(42,29,10,0.12)
- On top of "today" square: a small flame icon SVG (terracotta, 16px), with a gentle scale(1.04) breathing pulse on infinite loop, 2000ms ease-in-out, guarded by prefers-reduced-motion

Heading: Cormorant Garamond 24px / 600 / #1C1409: "Build Your Daily Ritual"
Body: DM Sans 15px / #6B5A41: "We'll send a single quiet reminder [e.g. after your morning coffee] to help you anchor your Sadhana. No spam, ever."
(Note: Dynamically insert selected daily anchor trigger text from Screen 2, defaulting to "at your chosen time" if skipped.)

Primary: "Enable reminders" — same CTA style, #C44B22
Link: "Skip for now" — DM Sans 13px / #6B5A41, 16px below button

On button tap: scale(0.97) spring, then 150ms, then trigger native OS permission dialog.
```

---

## PROMPT 3.4 — Onboarding Paywall (Screen 6)

```text
Sadhana app. Load the Design System Primer above before writing any code.

SCREEN 6 — ONBOARDING PAYWALL

The paywall is a decision screen. Clarity wins over salesmanship. Do not over-animate.

Background: #FDFAF5. Mandala thread arc top-right.

Top-right: "Skip · Try Free" — DM Sans 13px/#6B5A41, fades in after 1800ms delay (opacity 0→0.7 only, no movement). This delay is intentional — give the user a moment to see the plan.

Heading: Cormorant Garamond 28px/600/#1C1409/letter-spacing -0.02em: "Go deeper in your practice"
Sub-copy: DM Sans 14px/#6B5A41: "Personalized sequences, offline access, and no interruptions."

Plan cards (stacked vertically, 12px gap):

Card A — Monthly:
- #FFFFFF background, border 1px rgba(42,29,10,0.12), border-radius 12px, padding 20px
- DM Sans 15px/500/#1C1409 "Monthly" + right-aligned DM Sans 15px/500/#1C1409 "$14.99/month"
- DM Sans 13px/#6B5A41 "Billed monthly · Cancel anytime"
- Selection indicator: empty circle right side, 20px, border 1px rgba(42,29,10,0.3)

Card B — Annual (default selected state):
- Same card structure
- Border: 2px solid #C44B22 (the one place 2px is used)
- Small badge top-right corner of card: DM Sans 11px/500/#C44B22 on #F5E6C8 background, border-radius 8px, "Best value · 50% off"
- DM Sans 15px/500/#1C1409 "Annual" + right: DM Sans 15px/500/#1C1409 "$89.99/year" with DM Sans 11px/#6B5A41 strikethrough "$179.88"
- Selection indicator: filled circle #C44B22 with white center dot

Card border animation on Card B ONLY: the 2px border has a very slow hue rotation — #C44B22 → a slightly warmer orange (#D4621F) → back, 4s linear infinite. Use a CSS animation on border-color with 2 stops. This is the ONLY ambient animation on this screen.

Tapping Card A: Card B deselects (border returns to 1px), Card A gets 2px #C44B22 border, selection indicators swap. 150ms transition.

Feature comparison (below cards):
5 rows. Each: a left SVG checkmark (12px) in #1A6B3A / DM Sans 13px/#1C1C09 feature name / right: either checkmark (both plans) or "Creator+" label in DM Sans 11px/#C44B22 on #F5E6C8 bg
Features: Personalized daily routine / Offline downloads / Karma Coins / Advanced library / Ad-free experience

Primary CTA: "Start 7-day free trial" — #C44B22, 48px, full-width, border-radius 28px, DM Sans 15px/500/#FFFFFF
Breathing glow on CTA: filter drop-shadow(0 0 6px rgba(196,75,34,0.3))→drop-shadow(0 0 2px rgba(196,75,34,0.1)), 2500ms ease-in-out infinite, guarded by prefers-reduced-motion.

Below CTA: DM Sans 11px/#6B5A41/centered "No payment until trial ends. Cancel anytime before Day 7."

BRANCHING NAVIGATION:
- Tapping "Start 7-day free trial" pushes to Screen 7 (Registration) to capture credentials.
- Tapping "Skip · Try Free" sets premium state = false, initializes a Free Guest Session, and redirects straight to Screen 8 (Home Dashboard).
```

---

## PROMPT 3.5 — Auth / Register Screen (Screen 7)

```text
Sadhana app. Load the Design System Primer above before writing any code.

SCREEN 7 — AUTH / REGISTER

Gated account registration to secure billing/subscription details. Bypassed for free guest users.

Layout: Full viewport, keyboard-aware (content shifts up when keyboard appears). Safe area on top.

Top: DM Sans 13px / #6B5A41 link "Skip Registration" — right-aligned, 20px from top, 24px from right (navigates to guest dashboard).

Center content:
- Cormorant Garamond 28px / 600 / #1C1409 / letter-spacing -0.02em: "Secure your trial benefits"
- DM Sans 13px / #6B5A41: "Create an account to preserve your personalized daily routine and daily streak."

Form fields (2 total):
Each field:
- Height 52px, border-radius 12px, border 1px solid rgba(42,29,10,0.15), background #FFFFFF
- DM Sans 15px placeholder (#6B5A41/50)
- Focus state: border-color #C44B22, inner box-shadow 0 0 0 3px rgba(196,75,34,0.08) — no glow effect
- Password field: right-side eye toggle button (SVG eye/eye-off path, 20px, #6B5A41)
- Labels: DM Sans 11px / #6B5A41 / uppercase / letter-spacing 0.08em — float above when filled

Primary: "Create account" — full-width, #C44B22, 48px, border-radius 28px

Toggle link below: DM Sans 13px / #6B5A41: "Already have an account?" + an underlined "Sign in" in #C44B22
Clicking "Sign in" swaps fields to login.

Social auth divider: 1px horizontal rule with "or" centered in DM Sans 11px / #6B5A41 text
Below: Two side-by-side outlined buttons, "Continue with Google" and "Continue with Apple", each 48px, border-radius 12px, DM Sans 13px / #1C1409, 1px border rgba(42,29,10,0.15). SVG logos inline.
```8px, border-radius 12px, DM Sans 13px / #1C1409, 1px border rgba(42,29,10,0.15). SVG logos inline.
```

---

## PROMPT 3.6 — Home Dashboard (Screen 8)

```text
Sadhana app. Load the Design System Primer above before writing any code.

This is the primary daily screen. It will be seen every morning. Design for calm confidence, not excitement.

Layout: ScrollView. Sticky top header (48px) + Tab bar at bottom.

Header: DM Sans 13px / #6B5A41: "Monday, 16 June". Right: avatar circle 32px.
Below header: Cormorant Garamond 24px / 600 / #1C1409 greeting: "Hari Om, Jainam" with 4px below: DM Sans 13px / #6B5A41: "Day 12 of your practice"

Streak row (below greeting):
- Inline: small flame SVG (20px, #C44B22) + DM Sans 15px / 500 / #1C1409 "12-day streak"
- Flame has a slow ambient glow: filter drop-shadow(0 0 4px rgba(196,75,34,0.4)) pulsing to drop-shadow(0 0 8px rgba(196,75,34,0.15)) over 2500ms infinite — guard with prefers-reduced-motion
- No numeric badge overlaid on flame. The label does the work.

Today's Sadhana card:
- Background #FFFFFF, border 1px solid rgba(42,29,10,0.08), border-radius 12px, padding 20px
- Top-right: DM Sans 11px / #6B5A41 / uppercase / letter-spacing 0.08em tag: "PERSONALIZED" on #F5E6C8 background, border-radius 8px, 4px 8px padding
- Heading: Cormorant Garamond 20px / 600 / #1C1409: "Morning Sanctuary" (session name)
- Row below: three inline terracotta tags (DM Sans 11px / #C44B22 / #F5E6C8 bg / border-radius 8px): "Asana 5 min" · "Pranayama 4 min" · "Dhyana 3 min"
- Stat row: DM Sans 13px / #6B5A41: "12 minutes total · Moderate pace"
- Primary CTA: "Prepare today's Sadhana" — full-width, #C44B22, 48px, border-radius 28px

Card hover/press: translateY(-2px) and border-color to rgba(42,29,10,0.14), 150ms — no shadow.

Recent sessions section:
- DM Sans 13px / #6B5A41 / uppercase / letter-spacing 0.08em section label: "RECENT SESSIONS"
- Horizontal scroll row of compact session cards (width 140px each, height 80px, background #FFFFFF, border 1px rgba(42,29,10,0.08), border-radius 12px)
  Each card: DM Sans 11px / #6B5A41 date at top, DM Sans 13px / 500 / #1C1409 session name, small terracotta dot + "12 min" at bottom
- No "See all" CTA. The scroll affordance is sufficient.

Mandala thread: SVG arc, 120px radius, 0.5px stroke, opacity 0.05, #C44B22, top-right, cropped by screen edge.
```

---

## PROMPT 3.7 — Routine Config & Active Player (Screens 9 & 10)

```text
Sadhana app. Load the Design System Primer above before writing any code.

SCREEN 7 — ROUTINE CONFIG

This is the last screen before practice begins. Reduce cognitive load — user should see what they're about to do and tap start.

Layout: Full viewport. Header with back chevron + title "Morning Sanctuary". ScrollView content. Sticky "Start Practice" at bottom (84px total including safe area).

Segment cards (3 total, vertical stack, 8px gap):
Each: #FFFFFF card, border-radius 12px, border 1px solid rgba(42,29,10,0.08), 16px padding, height 72px
Content: Left — a small custom SVG icon (body stretch for Asana, lungs/wave for Pranayama, lotus/stillness for Dhyana) in #C44B22 on #F5E6C8 circle background (32px). Center column: DM Sans 15px / 500 / #1C1409 name + DM Sans 13px / #6B5A41 description below. Right: DM Sans 13px / #6B5A41 duration.

Entrance animation: three cards stagger in with opacity 0→1 and translateY(8px)→0, 100ms apart, starting at 150ms total delay. Guard with prefers-reduced-motion.

Below segment cards:
- Divider 1px rgba(42,29,10,0.08)
- Row: offline download toggle — DM Sans 13px / #1C1409 "Download for offline" left, right: custom SVG toggle (36px × 20px). Off state: background rgba(42,29,10,0.12), thumb #FFFFFF. On state: background #1A6B3A. Thumb slides left-to-right 250ms linear. Premium-only — if Free user: toggle is grayed (opacity 0.4) and tapping shows a small tooltip "Available on Creator plan"

Total stats row: DM Sans 13px / #6B5A41 "12 minutes · 3 segments"

Sticky bottom: "Start Practice" button — #C44B22, full-width, 48px, border-radius 28px. On tap: scale(0.97) 150ms then screen push to Screen 8.

---

SCREEN 8 — ACTIVE ROUTINE PLAYER

The player has two visual states. Generate both. The screen background for both is #0D0A06 (near-black warm).

STATE A — ASANA (Video):
- Full-bleed video viewport (16:9 safe zone in portrait, centered), below it controls.
- Sanskrit overlay trigger: small pill button bottom-center "Sanskrit Glossary" — DM Sans 13px / #FDFAF5/80, background rgba(255,255,255,0.1), border-radius 20px, 32px height. Tapping opens the glossary bottom sheet.
- Controls (below video):
  - Seek bar: full-width, 3px height, background rgba(255,255,255,0.2), filled portion #C44B22, thumb 12px circle #C44B22
  - Time labels: DM Sans 11px / #FDFAF5/60 left (elapsed) and right (total)
  - Button row: back-15s SVG / Play-Pause large (56px circle, #C44B22 background, #FDFAF5 icon) / forward-15s SVG / next-segment SVG

Play/Pause tap: scale(1.06) spring, 200ms. A single concentric ripple ring (circle SVG, opacity 0.3, expands from 56px to 90px, fades out, 400ms total) — only one ring, not multiple.

STATE B — PRANAYAMA / DHYANA (Audio):
Replace video viewport with a mandala breathing visualizer (square container, centered):
- 3 concentric SVG circle paths, stroke-only, #C44B22, strokes at 1.5px / 1px / 0.5px, initial radii 60px / 90px / 120px
- Breathing cycle animation (one complete cycle = 12s, loop):
  - 0–4s (inhale): all circles expand outward (+30px radius) and opacity increases 0.3→0.8
  - 4–8s (hold): no transform. Circles emit a very subtle opacity pulse 0.8→0.6→0.8, once, 4s
  - 8–12s (exhale): circles contract back, opacity 0.8→0.2
- Centered text during cycle: DM Sans 11px / uppercase / letter-spacing 0.1em / #FDFAF5/60 — "Inhale" / "Hold" / "Exhale" switching with 300ms crossfade
- Guard entire breathing animation with prefers-reduced-motion. Fallback: static concentric circles, no animation.

SANSKRIT GLOSSARY BOTTOM SHEET (shared across both states):
Sheet: background #FDFAF5, border-radius 20px top corners, 24px padding, 60% screen height max
Backdrop: backdrop-filter: blur(12px), background rgba(13,10,6,0.5)
Entrance: translateY(100%)→0, 300ms cubic-bezier(0.16, 1, 0.3, 1)
Content:
- Sheet drag handle: 4px × 32px rounded pill, #1C1409/20, centered top
- Term row layout: DM Sans 15px/500/#1C1409 romanization, right-aligned: Noto Serif Devanagari 18px/500/#C44B22 Devanagari script
- Below term row: DM Sans 13px/#6B5A41 definition in 1-2 sentences
- Divider 1px rgba(42,29,10,0.08) between terms
- Show 3 terms: Pranayama (प्राणायाम) / Ujjayi (उज्जायी) / Dhyana (ध्यान)
```

---

## PROMPT 3.8 — Session Completed & Interstitial Ad (Screen 11)

```text
You are generating mobile UI for 'Sadhana', a daily yogic practice app. Load the Design System Primer above before writing any code.

SCREEN 11 — SESSION COMPLETED

Layout: Full-viewport vertical stack. Safe areas observed on top and bottom. Prevent any vertical overflow.
Background: #FDFAF5 with a radiating, whisper-soft background glow centered behind the lotus logo: radial-gradient(circle, rgba(245,230,200,0.25) 0%, rgba(253,250,245,0) 75%).
Mandala Thread: Place three nested cropped SVG concentric arcs in the top-right corner (stroke widths 0.6px, 0.4px, 0.2px; color #C44B22; opacities 0.08, 0.05, 0.03).

On Screen Load — Marigold Petal Confetti:
- Render a canvas overlay covering the full screen. Generate 70-80 falling confetti particles.
- Particles must be styled as organic marigold petals/teardrops (varying sizes 6-12px, colors: #C44B22 terracotta, #F5E6C8 sandstone, #1A6B3A Ashoka green).
- Physics: Fall with a gentle gravity (0.2), slight horizontal sway, and 3D rotational spin. Fade out slowly near the bottom of the viewport. No bounces. Canvas is pointer-events: none, z-index: 10. Guard with prefers-reduced-motion.

Celebration Header & Symbol:
- Centered container with a premium entrance animation: translateY(12px) -> 0, opacity 0 -> 1, 600ms ease-out.
- Success Icon — Blooming Lotus Checkmark:
  * A 72×72px custom SVG blooming lotus at the top center. 1.5px stroke-width. No fill. Color: #1A6B3A (Ashoka green).
  * Petals draw in sequentially on load using strokeDashoffset animations (600ms).
  * Once the petals unfold, a fine-line success checkmark at the center of the lotus fades in (opacity 0 -> 1, 300ms delay).
- Heading: Cormorant Garamond 28px / 600 / #1C1409 / letter-spacing -0.01em: "Sadhana Complete" (enters with 300ms delay).
- Subtitle: DM Sans 15px / 400 / #6B5A41: "You showed up for yourself today."

Stats Card (Glassmorphism):
- A full-width card container (horizontal padding 24px, vertical 20px), border-radius 12px.
- Styling: background rgba(255, 255, 255, 0.45); backdrop-filter: blur(12px); border: 1px solid rgba(42, 29, 10, 0.08).
- Layout: Two equal-width columns separated by a vertical 1px divider (rgba(42, 29, 10, 0.08)) that stands 32px tall.
  * Left Column (Duration): DM Sans 11px uppercase letter-spacing 0.08em #6B5A41 label "DURATION" at top. Below: Cormorant Garamond 32px / 600 / #1C1409 number "12" with inline DM Sans 13px / #6B5A41 unit "min".
  * Right Column (Streak): DM Sans 11px uppercase letter-spacing 0.08em #6B5A41 label "DAILY STREAK" with inline terracotta flame icon (12px, #C44B22). Below: Cormorant Garamond 32px / 600 / #C44B22 number "12" with inline DM Sans 13px / #6B5A41 unit "days".
- Micro-Animation: Stat numbers "12" count up from 0 to 12 over 800ms on card entrance. Guard with prefers-reduced-motion.
- Flame icon has a slow, warm glow: filter: drop-shadow(0 0 3px rgba(196, 75, 34, 0.35)) pulsing to drop-shadow(0 0 7px rgba(196, 75, 34, 0.15)) over 2500ms infinite loop.

Action Buttons:
- Primary CTA: "Claim Your Reward" — 48px height, border-radius 28px, background #1A6B3A, DM Sans 15px/500/#FFFFFF. Include a small gift glyph on the right.
  * Continuous Warm Pulse Shadow: box-shadow: 0 0 0 0 rgba(26, 107, 58, 0.25) -> animated to 0 0 12px 6px rgba(26, 107, 58, 0) over 2000ms infinite.
  * Tapping scales the button down to 0.97 (150ms).
- Secondary CTA: "Return Home" — 48px height, border-radius 28px, border 1px solid rgba(42, 29, 10, 0.12), background #FFFFFF, DM Sans 15px/500/#6B5A41. Hover/Press: background transitions to #F5E6C8.

Footer Meta:
- Centered DM Sans 13px / #6B5A41: "Next session in: 16 hours 40 min"

---

INTERSTITIAL AD (Free tier only — full-screen overlay):

The overlay covers the Session Completed screen entirely. Z-index: 50.
Background: solid #0D0A06 (near-black warm).

Top Header Bar:
- Left: "Sponsor Advertisement" in DM Sans 11px / uppercase / letter-spacing 0.08em / rgba(255,255,255,0.4).
- Right: Timer Countdown Circle:
  * 44×44px circular container.
  * Background: rgba(255, 255, 255, 0.06).
  * Overlay: An SVG circle stroke (radius 18px, width 2.5px, stroke #C44B22) that drains clockwise over 10 seconds (using CSS stroke-dashoffset animation).
  * Center: DM Sans 15px / 500 / #FDFAF5 text rendering the counting seconds (10 -> 0).
  * At 0s, the countdown circle stroke transitions to #1A6B3A (Ashoka green).

Skip Button:
- Positioned next to the timer (20px from top, 80px from right).
- Hidden initially (opacity 0, pointer-events none). At 10s, it fades in (opacity 0 -> 1, 200ms ease-in).
- Style: DM Sans 13px / 500 / #FDFAF5, "Skip ✕", background rgba(255, 255, 255, 0.08), border-radius 20px, height 32px, padding 0 12px.

Ad Showcase Card:
- Center of the screen, taking up 65% of viewport height. Max width 340px.
- Glassmorphism Ad frame: background rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 16px; overflow: hidden.
- Ad Image Area (Top 65% of card): High-fidelity, cinematic image (e.g. premium organic meditation cushion) with rich umber shadows and dramatic warm studio lighting.
- Ad Copy Area (Bottom 35% of card):
  * Left-aligned padding 20px.
  * Title: Cormorant Garamond 20px / 600 / #FDFAF5: "Elevate Your Practice"
  * Sub-text: DM Sans 14px / 400 / rgba(253,250,245,0.7): "Premium organic cotton meditation cushions."
  * CTA Button: "Learn More" — 44px height, background #FDFAF5, color #0D0A06, DM Sans 14px/500, border-radius 22px.
```

---

## PROMPT 3.9 — Library Browser, Course Detail & Single Player (Screens 12, 13 & 14)

```text
Sadhana app. Load the Design System Primer above before writing any code.

SCREEN 10 — LIBRARY BROWSER

Header: Cormorant Garamond 22px / 600 / #1C1409 "Library" left-aligned. Right: search icon (SVG, 20px, #6B5A41).

Search bar: DM Sans 13px, 44px height, border-radius 12px, background #FFFFFF, border 1px rgba(42,29,10,0.08), placeholder "Search postures, breath, meditation..." — only visible when search icon is tapped (slides down with height 0→44px, 200ms ease-out).

Category chips (horizontal scroll, no scroll bar visible):
5 chips: "All" / "Asana" / "Pranayama" / "Dhyana" / "Philosophy"
Default chip: DM Sans 13px / #6B5A41, background #FFFFFF, border 1px rgba(42,29,10,0.12), border-radius 20px, 36px height, 12px 16px padding
Selected chip: background #F5E6C8, border-color #C44B22, color #C44B22
Selection transition: 150ms ease-out background + border-color + color change. No scale on chip — chips don't bounce.
Locked premium chips show a small inline lock SVG (12px, #6B5A41) before the label.

Featured list — "Start Here" (horizontal scroll of 3 course cards):
Each card: 160px × 200px, border-radius 12px, background #FFFFFF, border 1px rgba(42,29,10,0.08), overflow hidden
Top 50% of card: colored background area — Asana: #F5E6C8, Pranayama: #E8F0E8, Dhyana: #F5E6C8 — with a centered 36px SVG icon in the matching accent color
Bottom 50%: 12px padding, DM Sans 13px/500/#1C1409 title, DM Sans 11px/#6B5A41 "6 sessions · 45 min"

Main grid (below featured list):
CSS grid, 2 columns. Each course tile: border-radius 12px, #FFFFFF background, border 1px rgba(42,29,10,0.08)
Locked course tiles: same layout, but a lock SVG overlaid in the top-right of the card's image area (12px, #6B5A41 on rgba(245,230,200,0.8) circular background). Tapping a locked tile triggers a lateral 3px shake (±3px, 3 oscillations, 300ms total) and a tooltip above the card: DM Sans 11px / #FDFAF5 / #1C1409 background / border-radius 8px: "Unlock on Creator plan". Tooltip fades out after 1500ms. Guard shake with prefers-reduced-motion.

---

SCREEN 11 — COURSE DETAIL

Layout: ScrollView. No header — back chevron floats over hero image (32px circle, rgba(255,255,255,0.7) background, chevron SVG #1C1409, 20px from top-left within safe area).

Hero area: 240px height, background #F5E6C8, centered 64px SVG course icon in #C44B22.
As the user scrolls down, apply: hero scale(1.0)→scale(1.05) parallax on scrollY (applied via transform). Stays within its container (overflow hidden). Linear, no easing.

Course metadata (below hero, 20px horizontal padding):
- Cormorant Garamond 24px / 600 / #1C1409 course title: "Roots of Pranayama"
- Instructor row: 28px avatar circle (initials) + DM Sans 13px / #6B5A41: "With Ananda Shekhar · 8 sessions"
- Stat pills: two inline chips (DM Sans 11px / #6B5A41 / #F5E6C8 bg / border-radius 8px): "Intermediate" · "4 hours total"
- Description: DM Sans 15px / 400 / #6B5A41, 3 lines max with "Read more" link inline.

Syllabus section label: DM Sans 11px / uppercase / letter-spacing 0.08em / #6B5A41 "COURSE SESSIONS"

Session list items (each 56px height, no card wrapper — separated by 1px dividers):
Row layout: Left — session number in DM Sans 11px/#6B5A41; Center — DM Sans 14px/500/#1C1409 session name; Right — either play SVG (#C44B22) for free sessions or lock SVG (#6B5A41) for premium.

Sticky bottom: "Begin Course" button — #C44B22, full-width, 48px, 24px horizontal margin, border-radius 28px. If premium-gated: button text changes to "Unlock Course" and color to #1A6B3A.

---

SCREEN 12 — SINGLE MEDIA PLAYER

Background: #0D0A06 (same dark mode as Active Routine Player).

Center artwork: 200×200px square, border-radius 16px, #1C1409 background with a concentric mandala SVG pattern (#C44B22 stroke, very thin, 0.5px). No album art — the mandala IS the artwork.

When playing: artwork rotates at 1 rotation per 16s, ease-linear, infinite. On pause: rotation eases to stop over 800ms (use JS to capture current rotation and remove animation class, letting CSS transition handle the ease-out). Guard with prefers-reduced-motion — if reduced: no rotation, static mandala.

Controls layout (same as Screen 8 control row): back-15 / Play-Pause 56px / forward-15 / loop toggle SVG
Loop toggle active state: icon tints to #C44B22.

Bottom: "Mark as complete" — outlined button, border 1px #C44B22, color #C44B22, 44px, border-radius 28px, DM Sans 13px. On tap: border and color transition to #1A6B3A, icon shifts from circle to checkmark, 200ms. A brief haptic should be triggered (navigator.vibrate(50) where supported).
```

---

## PROMPT 3.10 — Rewards Dashboard & Karma Coins Redemption (Screens 15 & 16)

```text
Sadhana app. Load the Design System Primer above before writing any code.

SCREEN 13 — REWARDS DASHBOARD

Header: Cormorant Garamond 22px / 600 / #1C1409 "Rewards" left-aligned.

Monthly milestone card:
- #FFFFFF card, border-radius 12px, border 1px rgba(42,29,10,0.08), 20px padding
- Heading: DM Sans 13px / uppercase / letter-spacing 0.08em / #6B5A41 "THIS MONTH"
- Subhead: DM Sans 15px/500/#1C1409 "7 of 10 sessions watched" (framing as sessions, not ads, is intentional — less transactional)
- Progress bar: 8px height, border-radius 4px, background rgba(42,29,10,0.08), filled #C44B22 at 70%
  - Progress fill animation: width 0→70%, 800ms ease-out, on card mount. Guard with prefers-reduced-motion.
  - Three milestone tick marks at 10 (100%), 30 (100%), 50 (100%) position — tiny 8×12px rectangles on the bar. At milestone: tick background #1A6B3A, lock SVG replaced by checkmark.
- Milestone reward chips below bar: three inline chips — "Unlock session" / "Guided course" / "24hr ad-free". Active (reached): #1A6B3A text + border. Pending: #6B5A41 text + rgba border.

Karma Coins wallet card (Premium only):
- Same card style, but with a very subtle terracotta border (1px #C44B22/30)
- Left: DM Sans 13px/uppercase/#6B5A41 "KARMA COINS" + DM Sans 28px/500/#1C1409 balance "120"
- Right: a custom SVG coin glyph (24px, stroke-only #C44B22 — not a generic dollar sign; design a simple Om symbol ॐ or lotus inside a circle)
- Balance counter animation: on mount, count up from 0 to 120 over 600ms, ease-out. Guard with prefers-reduced-motion.
- On reward ad completion (simulated): JS counter increments +10 over 400ms, ease-out.

Primary CTA: "Watch a session · Earn 10 coins" — #C44B22, 48px, full-width, border-radius 28px
Below: DM Sans 11px / #6B5A41 / centered "Rewarded — not required. Always your choice."

---

SCREEN 14 — KARMA COINS REDEMPTION

Header: Cormorant Garamond 22px / 600 / #1C1409 "Redeem" left-aligned. Right: DM Sans 13px / #C44B22 "120 coins"

Redemption grid (2 columns):
Each redemption tile: #FFFFFF card, border-radius 12px, border 1px rgba(42,29,10,0.08), padding 16px, min-height 120px
- Top: SVG icon (discount tag / wellness leaf / heritage script icon) in #C44B22, 24px
- DM Sans 13px/500/#1C1409 reward name
- DM Sans 11px/#6B5A41 cost: "50 coins"
- Bottom: outlined "Redeem" button, 36px, border-radius 20px, border 1px #C44B22, color #C44B22, DM Sans 13px

Special tile: "Indian Heritage Script Preservation" — full-width, background #F5E6C8 (not white), border 1px #C44B22, left-side accent bar 3px #C44B22. Treat this as a featured row.

On tile tap: scale(0.97) spring, 150ms.

On "Redeem" confirm (via confirmation bottom sheet):
- Sheet contains: "Confirm redemption — 50 coins for [reward]", "Your balance: 120 → 70 coins", two buttons "Confirm" (#C44B22) and "Cancel" (text link).
- On confirm: a circular stamp animation overlays the tile — SVG circle expanding from 0 to 56px radius, filled #1A6B3A/80, white checkmark centered, spring easing (overshoot slightly), 400ms. Text inside stamp: "Redeemed" DM Sans 11px/500/#FFFFFF. Stays visible on tile for rest of session (tile becomes inert, opacity 0.6).
- Coin balance counter in header decrements over 400ms.
```

---

## PROMPT 3.11 — Profile, Settings & Preferences (Screens 17–20)

```text
Sadhana app. Load the Design System Primer above before writing any code.

SCREEN 15 — PROFILE DASHBOARD

Header: Right-aligned gear icon SVG (20px, #6B5A41) — taps into Screen 16.

User avatar area:
- 64px circle, background #F5E6C8, DM Sans 24px/500/#C44B22 initials (or user photo if available)
- Below: Cormorant Garamond 20px/600/#1C1409 display name, DM Sans 13px/#6B5A41 join date "Practising since March 2025"

Lifetime stats row (3 columns):
Each: DM Sans 22px/500/#1C1409 stat number + DM Sans 11px/uppercase/#6B5A41 label below
Stats: "142 sessions" / "28 hours" / "14-day best streak"
On mount: all three counters animate from 0 over 1000ms ease-out. Guard with prefers-reduced-motion.

Streak heatmap calendar:
6-week grid × 7 days. Each cell: 16px × 16px, 3px gap, border-radius 3px.
Cell fill states:
- No session: rgba(42,29,10,0.05)
- Session completed: #F5E6C8 (light practice) to #C44B22 (full practice) depending on duration — 3 tiers
- Today: 1px border #C44B22, fill based on whether completed

On mount: cells fade in in a left-to-right wave (each column fades in 30ms after previous). Guard with prefers-reduced-motion.

Day-of-week labels: DM Sans 11px / #6B5A41 / uppercase above the grid: M T W T F S S

Month label: DM Sans 11px / #6B5A41 / uppercase below: "JUNE 2025"

Bottom banner (if Free tier): #F5E6C8 banner, border-radius 12px, border 1px rgba(196,75,34,0.3), padding 16px horizontal
DM Sans 13px/500/#1C1409 "Unlock your full practice history with Creator" + right-aligned chevron SVG in #C44B22

---

SCREEN 16 — SETTINGS

Navigation list only. Clean, no card wrappers — dividers separate groups.

Cormorant Garamond 22px/600/#1C1409 "Settings" header.

Group 1: Account
- "Account details" → chevron
- "Email & password" → chevron

Divider 1px rgba(42,29,10,0.08) + 8px spacer

Group 2: Practice
- "Notification reminders" → shows current time "6:30 AM" in DM Sans 13px/#6B5A41
- "Language" → shows "English"

Divider + spacer

Group 3: Legal & Privacy
- "Privacy & data" → chevron
- "Terms of use" → external link SVG (12px, #6B5A41)

Each row: 52px height, horizontal padding 24px, DM Sans 15px/400/#1C1409 label, right content as described.
Row tap: 100ms background flash to rgba(42,29,10,0.04), then screen push transition.

---

SCREEN 17 — PREFERENCES

Header: back chevron + Cormorant Garamond 20px/600/#1C1409 "Preferences"

Section 1 — Accessibility:
Label row: DM Sans 13px/uppercase/#6B5A41 "READING SIZE"
Below: A live preview paragraph — Cormorant Garamond / #1C1409 / adjustable size — showing: "Start your morning with stillness." Size adjusts in real time as slider moves.
Below: custom range slider, 4px track, #C44B22 filled portion, #FDFAF5 thumb with #C44B22 border, 5 stops (XS/S/M/L/XL). As slider moves, font-size transition on preview: 150ms ease-out. No abrupt jump.

Section 2 — Notifications:
Label: DM Sans 13px/uppercase/#6B5A41 "MORNING REMINDER"
Time picker row: DM Sans 15px/500/#1C1409 "6:30 AM" with a chevron tap-target (full row 48px). Tapping opens a native time picker (use HTML input type="time" and style it minimally, or open iOS/Android native picker via the framework).
Toggle row: "Evening reminder" with off-state toggle.

---

SCREEN 18 — GDPR & PRIVACY

Header: back chevron + Cormorant Garamond 20px/600/#1C1409 "Your Data"

Introductory body: DM Sans 15px/400/#6B5A41, one short paragraph confirming no sale of data.

Toggle group (same style as Screen 3):
- "Essential cookies" — locked on
- "Analytics & improvement" — toggleable, default off
- "Personalisation data" — toggleable, default on (for personalized routines)

Action rows (below a divider):
- "Download my data" — DM Sans 15px/#1A6B3A + right chevron
- "Delete my account" — DM Sans 15px/#991F1F + right chevron (destructive color, no bold)

DM Sans 11px/#6B5A41 footer: "Data export takes 24–48 hours and is delivered to your registered email."
```

---

## PROMPT 3.12 — Account Deletion (Screen 21)

```text
Sadhana app. Load the Design System Primer above before writing any code.

This screen must feel serious and unhurried. Do not use aggressive red everywhere — only for the final destructive action.

Background: #FDFAF5. Header: back chevron (large 48px tap target) + DM Sans 13px/500/#6B5A41 "Account Deletion" — not Cormorant here, intentionally plain.

Warning callout box:
- Border-radius 12px, background #FDF0EE (very light red-warm), border 1px rgba(153,31,31,0.15), padding 16px
- No red background — this is not a panic state, it is information
- DM Sans 13px/500/#1C1409 heading: "This cannot be undone"
- DM Sans 13px/400/#6B5A41 body: "Your sessions, streak history, and Karma Coins will be permanently removed. Subscriptions are not automatically cancelled — manage billing separately."

Below callout: DM Sans 15px/400/#1C1409 "To confirm, type DELETE below:"

Text input:
- 52px height, border-radius 12px, DM Sans 15px, #1C1409 text on #FFFFFF background
- Default border: 1px rgba(42,29,10,0.15)
- Focus: 1px rgba(42,29,10,0.30)
- When value matches "DELETE" exactly: border transitions to 1px #991F1F, 200ms

Confirm button:
- Disabled state: background rgba(153,31,31,0.25), color #FDFAF5/50, pointer-events none. NOT just grayed — keep the red hue to signal what this button does.
- Enabled state (only after input === "DELETE"): background #991F1F, color #FDFAF5. Transition: 200ms opacity + background.
- Button text: "Permanently delete my account" — DM Sans 14px/500, not all caps

On tap of disabled button: horizontal shake — translateX oscillating ±4px × 4 cycles, 300ms total. Simultaneously, input border pulses to 1px #991F1F and back over 300ms. Guard with prefers-reduced-motion: on reduced motion, skip shake, instead briefly flash input border only.

Cancel link: DM Sans 13px/#6B5A41 "Take me back", centered, below button, 16px gap. Taps pop back without any animation drama.
```

---

## PROMPT 3.13 — Reusable Paywall Screen Trigger (Screen 6 Reentry)

```text
Sadhana app. Load the Design System Primer above before writing any code.

SCREEN 6 REENTRY — PAYWALL FOR GATED SESSIONS / UPGRADES

Layout: Identical to Screen 6 (Onboarding Paywall), except:
1. In the header, replace the top-right "Skip · Try Free" text link with a back chevron SVG (20px, #6B5A41) in the top-left, within the safe area.
2. The comparison matrix features and plan cards (Monthly vs Annual) remain exactly the same.
3. The primary CTA button "Start 7-day free trial" operates on the active payment flow. If the transaction completes, close the modal paywall and update global Zustand client state to premium = true, triggering the success haptics.
4. Tapping the back chevron pops the modal off the navigation stack, returning the user to their previous screen without upgrading.
```
