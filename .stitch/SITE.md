# Site Sitemap: Sadhana

## 1. Project Vision
Sadhana is an authentic Indian wellness mobile app that integrates daily physical stretching (Asana), breathwork (Pranayama), and meditation (Dhyana) into a cohesive morning and evening routine. It uses the "Earth Premium" design system (terracotta, cream, olive, and charcoal slate) to present a calming, premium, and grounding digital sanctuary.

## 2. Target Device
*   **Device Type:** MOBILE
*   **Dimensions:** 390px width (edge-to-edge layout, iPhone 15 Pro standard)

## 3. Stitch Project ID
*   **Project ID:** `669110078172882916`

---

## 4. Sitemap Index

Below is the checklist tracking screen generation. Update these as you create the screens in Google Stitch.

### Navigation Stack A: Onboarding Stack
- [x] Welcome Screen (Welcome — Sadhana: `e8320b9ce8e14d2b81b9ca5fb99818f0`, Enhanced: `5c17d558dd59458cb74ee4f2f72bb561`, Animated: `c5039954cebb48b0b4b43f51945d77d7`)
- [x] Personalization Screen (Questionnaire) (Personalization — Sadhana: `09dc0cd0a7cf4bbbb3f96dbd92b03e87`)
- [x] Onboarding Demo / Breathing Space Screen (Breathing Space — Sadhana: `5bf104c13e05434aa44d1fb6bfe4eb0f`)
- [x] GDPR Consent Screen (Data Transparency — Sadhana: `ac47b14d9dc448c6b980f0f35e87d511`)
- [x] Permission Priming Screen (Permission Priming — Sadhana: `d16906c6216745dfbf1c22c2754bcc7a`)
- [x] Onboarding Paywall Screen (Onboarding Paywall — Sadhana: `3a6a198e51314fff8b3d84a3c591a987`, Gated: `13a4e0ca0d2d4c69a6b54b195f34624e`)
- [x] Auth / Register Screen (Auth / Register — Sadhana: `6c13033848dc4c148c4182ad207f1cfe`)

### Navigation Stack B: Home Tab Stack
- [x] Sadhana Dashboard (Home Screen) (Home Dashboard — Sadhana: `22e5a1e08a7e43219b2707d1b0ac4679`)
- [x] Routine Config Screen (Routine Config — Sadhana: `f8d4ab4b369f4966b1d4a1629840349d`)
- [x] Active Routine Player Screen (Active Routine — Asana: `b5403c80a5f049b2bfe757f496b49e32`, Meditation: `16c66bda11ba4e47a85bc8fa32c8529e`)
- [x] Session Completed Screen (Session Completed — Sadhana (Enhanced Ritual): `288701e5f71f4d778a0fc28198039f95`)

### Navigation Stack C: Library Tab Stack
- [x] Library Browser Screen (Library Browser — Sadhana: `2db922205e7e4de2a076dfec8938acbb`)
- [x] Course Detail Screen (Course Detail — Sadhana: `25d316c92fcb48dc9a6fc810b5ad3b81`)
- [x] Single Media Player Screen (Single Media Player — Sadhana: `258338cf01864fe28725c2954e3c41c4`)

### Navigation Stack D: Rewards Tab Stack
- [x] Rewards Dashboard Screen (Rewards Dashboard — Sadhana: `7b87746e7a0e4897867c3b5130b6ad76`)
- [x] Karma Coins Redemption Screen (Karma Coins Redemption — Sadhana: `7fc2b9a2363d47dcb3b46eea2a73919e`)

### Navigation Stack E: Profile & Settings Stack
- [x] Profile Dashboard Screen (Profile & Settings — Sadhana (Full): `14908112e63a49c18e14031876c6ee0a`)
- [x] Settings Screen (Profile & Settings — Sadhana (Full): `14908112e63a49c18e14031876c6ee0a` / Settings Substack)
- [x] Preferences Screen (Profile & Settings — Sadhana (Full): `14908112e63a49c18e14031876c6ee0a` / Settings Substack)
- [x] GDPR & Privacy Screen (Your Data — Sadhana: `3335869662124ca5ac3623ba5ed42473`)
- [x] Account Deletion Screen (Account Deletion — Sadhana: `29c6afd72dc04ea0849543c8981941ea`)

---

## 5. Screen Generation Roadmap

Generate screens in this order to test user journeys logically:

1.  **Welcome Screen** (First touchpoint, logo, scroll testimonials)
2.  **Personalization Screen** (Goal questionnaire, experience level, habit anchor selection)
3.  **Onboarding Demo / Breathing Space Screen** (30s interactive breathing, concentric wave circles)
4.  **GDPR Consent Screen** (Regulatory tracking controls)
5.  **Permission Priming Screen** (Notification streak alignment)
6.  **Onboarding Paywall Screen** (Subscription options, Best Value annual savings badge)
7.  **Auth / Register Screen** (Purchase verification credential fields)
8.  **Sadhana Dashboard** (Home screen greeting, streak flame, daily routine cards)
9.  **Active Routine Player Screen** (Asana media player and Pranayama concentric visualizer)
10. **Session Completed Screen** (Confetti animation, JS count-up stats, interstitial ad overlay)
11. **Rewards Dashboard Screen** (Milestones progress indicator, Karma coins wallet)
12. **Preferences Screen** (Text scaling preview and slider)
13. **Account Deletion Screen** (Strict confirmation dialog and input check)

---

## 6. Design Constraints for Prompts

When crafting prompts in Stitch:
*   Copy the full contents of `.stitch/DESIGN.md` into the prompt setup for style context.
*   Enforce a **minimum touch target height/width of 44px** for buttons.
*   Require **Lora Serif** for Indian wellness headings and Sanskrit text blocks, and **Raleway Sans-Serif** for details and form configurations.
*   Ensure all templates are mobile-responsive with no horizontal overflows.
