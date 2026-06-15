# Onboarding Strategy & Conversion Funnel — Sadhana

> **Phase:** 2 (UX Research & Information Architecture)
> **Skills Applied:** `onboarding-psychologist`, `marketing-psychology`, `customer-psychographic-profiler`, `mobile-design`
> **Last Updated:** 2026-06-15
> **Status:** Completed

---

## 1. Onboarding Philosophy: The Identity-to-Habit Loop

Traditional onboarding flows fail because they treat first-use as a technical setup (sign up forms) or a catalog tour (swiping through feature guides). Psychologically, this increases cognitive load, delays time-to-value, and triggers user drop-off.

**Sadhana** adopts an **Identity-to-Habit Onboarding** model based on progressive disclosure, user investment, and autonomy. Our strategy is built around five core psychological levers:

1.  **Minimize Upfront Setup:** Users do not want to fill out registration forms or configure settings before experiencing the product. All inputs are delayed or progressive.
2.  **Labor Investment (The "IKEA Effect"):** By having the user answer a few high-value personalization questions, they invest cognitive effort. The resulting personalized plan feels customized to *them*, driving paywall conversion.
3.  **Respect User Autonomy (Reactance Prevention):** Forcing users to subscribe or sign up creates friction. By providing a clear "Skip" path at every gate (including the paywall and authentication), we build brand trust and accommodate different user needs.
4.  **Just-in-Time Permission Priming:** System notifications or tracking requests are never triggered on cold launch. We explain *why* they benefit the user before showing the native system dialog.
5.  **The "First Win" Momentum:** The onboarding flow leads directly to a brief, 12-minute practice session. Completing this session creates immediate physical and mental reinforcement, validating their decision to download.

---

## 2. Screen-by-Screen Breakdown (Onboarding Sequence)

To maximize retention and trial starts, the sequence is limited to **five screens** before the first session starts.

```
[Screen 1: Welcome] ──> [Screen 2: Personalization] ──> [Screen 3: Priming] ──> [Screen 4: Paywall] ──> [Screen 5: Auth] ──> [Value Moment]
```

### Screen 1: Welcome & Brand Sanctity
*   **Aesthetic:** Immersive *Earth Premium* background (cream `#FDFEFE` base, soft terracotta `#D35400` branding icon), high-contrast readable text (Lora font for heading, Raleway for body). No generic illustrations; clean, premium photography of authentic practices.
*   **Copy:** *"Your Daily Mind-Body Sanctuary. Authentic yoga, breathwork, and meditation, integrated into simple daily rituals."*
*   **Social Proof Integration:** A subtle rolling testimonial element at the bottom: *"Over 10,000 seekers practicing daily. 'Sadhana changed how I start my mornings.' — Sarah J., Startup Founder."*
*   **Primary CTA:** Prominent, touch-friendly primary button: **"Begin Your Journey"** (min height 44pt/48dp, trigger light haptic on tap).
*   **Secondary CTA:** *"I already have an account" -> login link.*

### Screen 2: Personalization Questionnaire
*   **Aesthetic:** Clear progress bar at the top (Sage green `#1E8449` fill) to show users progress and reduce exit friction.
*   **Interaction:** Large, finger-friendly button blocks (min 48dp height) with visible selected states. Single-choice or multi-select cards.
*   **Questions Asked:**
    1.  *What is your primary wellness goal today?* (Options: Relieve Stress & Anxiety, Improve Joint Mobility, Master Breathwork/Pranayama, Connect with Yoga Philosophy).
    2.  *What is your experience level?* (Options: Beginner - "Learn the basics", Intermediate - "Grow my practice", Advanced - "Deepen my connection").
    3.  *How tight does your body feel today?* (Options: Very stiff/Desk neck, Moderate tightness, Flexible/No pain).
*   **Copy Tone:** Respectful and encouraging. Avoid clinical or overly athletic terms.

### Screen 3: Permission Priming (Notifications & GDPR)
*   **Timing:** Triggered immediately after the quiz is completed.
*   **Aesthetic:** Animated calendar mockup showing a 5-day streak of burning orange flame icons.
*   **Psychological Framing:**
    *   *Copy:* *"Daily consistency builds mental resilience. We send one gentle reminder at your preferred time to help you maintain your daily Sadhana streak. No marketing spam, ever."*
*   **GDPR (EU Users Only):** Before showing notification triggers, display an explicit privacy toggle: *"I consent to optional anonymous data analytics to improve audio streaming performance."*
*   **Primary CTA:** **"Set My Reminder Time"** (Triggers native iOS/Android notification alert permissions).
*   **Secondary CTA:** *"Skip for now" (allows proceeding without notification permissions).*

### Screen 4: Soft-Gated Onboarding Paywall
*   **Timing:** Triggered immediately after notification setup. A clean, custom loading animation is shown for 1.5 seconds: *"Assembling your customized Sadhana sequence..."* to leverage the labor-investment effect.
*   **Aesthetic:** Elegant layout with Lora serif headings. A clean, two-column checklist contrasting Free vs. Premium.
*   **Subscription Offerings:** Clear monthly ($14.99) and annual ($89.99 - 50% savings) options. A prominent **"Start 7-Day Free Trial"** primary button.
*   **Personalization Lock Logic:**
    *   *Premium Unlock:* Displays their custom plan name based on Screen 2 (e.g., *"Sarah's 12-Min Morning Focus Sadhana - Unlocked"*).
    *   *Free Option:* Below or in the top corner, a clear **"Skip / Try Free Version"** text link is visible.
*   **Gating Warning:** Selecting "Skip" shows a polite toast: *"Your personalized plan will be locked. You will receive the static Global Daily Sadhana instead."*

### Screen 5: Authentication & Session Launch
*   **Aesthetic:** Clean input fields with clear labels, proper keyboard type configuration (autofill enabled), and error validations shown inline.
*   **Copy:** *"Create your sanctuary account to save your daily streak and progress calendar."*
*   ** CTAs:**
    *   "Sign Up with Email" primary button.
    *   "Skip & Explore as Guest" link in the top corner. (Ensures that users who want to try the app immediately do not get blocked by form fields).

---

## 3. The Value Moment: The First Practice Session

Once the onboarding sequence is finished, the app directs the user immediately to **Today's Sadhana** player. 

*   **Pacing:** The routine starts immediately. No complex tutorials or popup tooltips are shown. The teacher's voice begins slowly, welcoming them to the space.
*   **Physical Component (Asana - 4 Mins):** Gentle neck and shoulder stretching. Designed so that even a busy professional (Sarah) or a senior (Elena) feels immediate release of physical tension.
*   **Breathing Component (Pranayama - 4 Mins):** Slow, deep box breathing. Calms the nervous system and lowers heart rate variability (HRV), validating the biological benefit.
*   **Meditation Component (Dhyana - 4 Mins):** Silent reflection with a soft background ambient sitar track.
*   **Completion Screen:** Triggering a confetti animation, updating their streak to "1 Day 🔥", and presenting a congratulatory greeting ("Hari Om").
    *   *Ad Injection (Free Tier):* The ad is only injected *after* this first value moment has concluded, protecting the first-session user experience from monetization frustration.

---

## 4. Onboarding Psychological Leverage & Feasibility Score (PLFS)

Applying the `marketing-psychology` scoring system to our onboarding components ensures we prioritize high-value behavioral adjustments:

| Mental Model / Principle | Target Behavior | Leverage (1-5) | Context Fit (1-5) | Speed to Signal (1-5) | Ethics (1-5) | Cost (1-5) | PLFS Score | Action |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| **Labor Illusion (Quiz Loading)** | Increase paywall conversion | 5 | 5 | 5 | 5 | 1 | **+19 (Cap 15)** | Implement immediately |
| **Autonomy Preservation (Skip Paths)** | Reduce onboarding uninstall rates | 4 | 5 | 5 | 5 | 1 | **+18 (Cap 15)** | Implement immediately |
| **Sunk Cost (Quiz Questions)** | Increase trial starts | 4 | 5 | 4 | 4 | 2 | **+15** | Implement immediately |
| **Reciprocity (First Session Free)** | Build trust for post-trial conversions | 5 | 5 | 3 | 5 | 2 | **+16 (Cap 15)** | Implement immediately |
| **Default Effect (Annual Option Selected)**| Increase average order value (AOV) | 4 | 4 | 5 | 4 | 1 | **+16 (Cap 15)** | Highlight annual tier |

---

## 5. Conversion Funnel & Cohort Metrics

To audit and optimize the onboarding flow, the application tracks the following funnel events:

### Funnel Steps (Logged to Amplitude/Mixpanel):
1.  `onboarding_start` (User opens Screen 1)
2.  `quiz_question_answered` (Tracked per question with selected options)
3.  `quiz_completed` (User finishes Screen 2)
4.  `permission_priming_viewed` (User sees notification explanation)
5.  `permission_priming_accepted` (User taps "Allow")
6.  `paywall_viewed` (User sees Screen 4 Onboarding Paywall)
7.  `subscription_trial_started` (User starts Apple/Google premium trial)
8.  `registration_completed` (User creates account or skips as guest)
9.  `first_session_started` (User taps Play on first Sadhana)
10. `first_session_completed` (User completes the 12-min session - **Value Moment Achieved**)

### Core Retention Metrics:
*   **Onboarding Completion Rate:** Target **>70%** (`registration_completed` / `onboarding_start`).
*   **Onboarding Paywall Conversion Rate:** Target **>15%** (`subscription_trial_started` / `paywall_viewed`).
*   **D1 Retention:** Target **>25%** (Users who complete onboarding returning on Day 1).
*   **Trial-to-Paid Conversion Rate:** Target **>35%** (Users whose 7-day trial rolls into active subscriptions).
*   **Ad-Churn Rate:** Target **<12%** (Free users who drop off immediately upon seeing the post-session ad).
