# Site Sitemap: Sadhana

## 1. Project Vision
Sadhana is an authentic Indian wellness mobile app that integrates daily physical stretching (Asana), breathwork (Pranayama), and meditation (Dhyana) into a cohesive morning and evening routine. It uses the "Earth Premium" design system (terracotta, cream, olive, and charcoal slate) to present a calming, premium, and grounding digital sanctuary.

## 2. Target Device
*   **Device Type:** MOBILE
*   **Dimensions:** 390px width (edge-to-edge layout, iPhone 15 Pro standard)

## 3. Stitch Project ID
*   **Project ID:** `[TBD_PROJECT_ID]`

---

## 4. Sitemap Index

Below is the checklist tracking screen generation. Update these as you create the screens in Google Stitch.

### Navigation Stack A: Onboarding Stack
- [ ] Welcome Screen
- [ ] Personalization Screen (Questionnaire)
- [ ] GDPR Consent Screen
- [ ] Permission Priming Screen
- [ ] Auth / Register Screen

### Navigation Stack B: Home Tab Stack
- [ ] Sadhana Dashboard (Home Screen)
- [ ] Routine Config Screen
- [ ] Active Routine Player Screen
- [ ] Session Completed Screen

### Navigation Stack C: Library Tab Stack
- [ ] Library Browser Screen
- [ ] Course Detail Screen
- [ ] Single Media Player Screen

### Navigation Stack D: Rewards Tab Stack
- [ ] Rewards Dashboard Screen
- [ ] Karma Coins Redemption Screen

### Navigation Stack E: Profile & Settings Stack
- [ ] Profile Dashboard Screen
- [ ] Settings Screen
- [ ] Preferences Screen
- [ ] GDPR & Privacy Screen
- [ ] Account Deletion Screen
- [ ] Paywall Screen

---

## 5. Screen Generation Roadmap

Generate screens in this order to test user journeys logically:

1.  **Welcome Screen** (First touchpoint, logo, scroll review)
2.  **Personalization Screen** (Questionnaire, goals, progress metric inputs)
3.  **Paywall Screen** (Soft-gate subscription options, monthly vs annual comparison)
4.  **Sadhana Dashboard** (Home screen streak flame, personalized vs global card entry points)
5.  **Active Routine Player Screen** (Asana video layout, Pranayama breath visualizer, glossary sheet)
6.  **Session Completed Screen** (Congratulatory screen, ad interstitial countdown trigger)
7.  **Rewards Dashboard Screen** (Ad milestones tracker, coins wallet redemption gateway)
8.  **Preferences Screen** (Text scaling accessibility configurations)
9.  **Account Deletion Screen** (Strict confirmation modal)

---

## 6. Design Constraints for Prompts

When crafting prompts in Stitch:
*   Copy the full contents of `.stitch/DESIGN.md` into the prompt setup for style context.
*   Enforce a **minimum touch target height/width of 44px** for buttons.
*   Require **Lora Serif** for Indian wellness headings and Sanskrit text blocks, and **Raleway Sans-Serif** for details and form configurations.
*   Ensure all templates are mobile-responsive with no horizontal overflows.
