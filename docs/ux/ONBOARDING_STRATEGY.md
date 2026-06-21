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

To maximize retention and trial starts, the sequence is structured as a progressive journey before the first full session. The GDPR consent check is handled at initial app boot to avoid mid-funnel friction.

```
[GDPR Consent Check (App Boot)] ──> [Screen 1: Welcome] ──> [Screen 2: Personalization & Habit Anchoring] ──> [Screen 3: Breathing Space Demo] ──> [Screen 4: Permission Priming & Intentions] ──> [Screen 5: Onboarding Paywall] ──> [Screen 6: Auth (Gated/Deferred)] ──> [Value Moment]
```

### Initial Boot: GDPR Consent
*   **Concept:** Explicit analytical opt-in for EU regulatory compliance, presented as a trust-building system prompt on very first app opening.
*   **Components:** Descriptive consent terms, permanent Essential toggle, and interactive Performance Analytics toggle (defaulted to off). This prevents a compliance context switch during active onboarding.

### Screen 1: Welcome & Brand Sanctity
*   **Aesthetic:** Immersive *Earth Premium* background (cream `#FDFAF5` base, terracotta `#C44B22` logo), high-contrast readable text (Cormorant Garamond font for heading, DM Sans for body). No generic illustrations; clean, premium typography and testimonials.
*   **Copy:** *"Your Daily Mind-Body Sanctuary. Authentic yoga, breathwork, and meditation, integrated into simple daily rituals."*
*   **Social Proof Integration:** A rolling testimonial element at the bottom: *"Over 10,000 seekers practicing daily. 'Sadhana changed how I start my mornings.' — Sarah J."*
*   **Primary CTA:** Prominent, touch-friendly primary button: **"Begin Your Journey"** (min height 48px, trigger light haptic on tap).
*   **Secondary CTA:** *"Already practicing? Log in"* (redirects to authentication immediately for returning users).

### Screen 2: Personalization & Habit Anchoring
*   **Aesthetic:** Clear progress bar at the top (Sage green `#1E8449` fill) to show users progress and reduce exit friction.
*   **Interaction:** Large, finger-friendly button blocks (min 48dp height) with visible selected states. Single-choice or multi-select cards.
*   **Questions Asked:**
    1.  *What is your primary wellness goal today?* (Options: Relieve Stress & Anxiety, Improve Joint Mobility, Master Breathwork/Pranayama, Connect with Yoga Philosophy).
    2.  *What is your experience level?* (Options: Beginner - "Learn the basics", Intermediate - "Grow my practice", Advanced - "Deepen my connection").
    3.  *Habit Anchor Choice (Optional):* **"When will you practice daily?"** (Options: "After waking up", "After brushing my teeth", "After my morning coffee/tea", "Before going to sleep").
*   **Behavioral Note:** The habit anchor choice is optional and defaults to "After waking up" if skipped, allowing the primary Goal + Experience selections alone to unlock the "Continue" CTA to reduce quiz drop-offs.
*   **Copy Tone:** Respectful and encouraging. Avoid clinical or overly athletic terms.

### Screen 3: The "Aha Moment" (Breathing Space Demo)
*   **Concept:** Bring immediate value *before* pitching paywalls or requiring registrations. Rather than explaining the app, we let them experience its sensory design instantly.
*   **Interaction:** A short, interactive, 30-second guided breathing cycle.
*   **Mechanics:** concentric SVG circle guide expands and contracts (inhale/exhale), synchronized with a soft ambient background audio wave. Sanskrit subtitles (*Pranayama*) slide up, showing a tooltip detailing neuroscientific benefits (vagus nerve stimulation) on tap.
*   **Benefit:** Delivers a somatic "micro-win" (calming the nervous system) in seconds, showing the tactile and premium quality of the app.

### Screen 4: Permission Priming & Intentions
*   **Timing:** Triggered immediately after Screen 3.
*   **Psychological Framing (Implementation Intentions):**
    *   *Copy:* *"Consistency builds the habit. We will send a quiet reminder at your chosen time to anchor your Sadhana [Chosen Routine Anchor, e.g. after brushing your teeth]."*
*   **Primary CTA:** **"Enable Reminders"** (Triggers native iOS/Android notification alert permissions).
*   **Secondary CTA:** *"Skip for now" (allows proceeding without notifications).*

### Screen 5: Soft-Gated Onboarding Paywall
*   **Timing:** Triggered immediately after notification setup. A clean, custom loading animation is shown for 1.5 seconds: *"Assembling your customized Sadhana sequence..."* to leverage the labor-investment (IKEA) effect.
*   **Aesthetic:** Elegant layout with Cormorant Garamond headings and comparison matrices.
*   **Subscription Offerings:** Clear monthly ($5.99) and annual ($49.00) options. A prominent **"Start 7-Day Free Trial"** primary button.
*   **Autonomy Preservation:** A clear **"Skip / Try Free Version"** text link fades in after a 1.8-second delay.
*   **Branching Logic:**
    *   *If User Subscribes:* Routes to Screen 6 (Registration) to secure the purchase.
    *   *If User Skips:* Launches a soft-gated guest email capture modal (Screen 6 Alternate), then routes to the Home Dashboard with a Free Guest Session.

### Screen 6: Authentication & Registration (Gated / Post-Paywall)
*   **Timing:** Required for users starting a trial/purchase. For guest users who skip, it opens a soft-gated "Save Your Streak" email-only capture prompt before loading the Home Dashboard.
*   **Aesthetic:** Clean input fields with floating labels, autofill configuration, and inline verification errors.
*   **Copy:** *"Create your sanctuary account to secure your premium trial benefits."* (Or for guests: *"Enter your email to preserve your streak history and personalized plan."*)
*   **CTAs:** "Create Account" (Email/Apple/Google) and "Skip Registration" (returns/proceeds to guest mode).

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
| **Immediate Aha Moment (Demo)** | Instant activation & premium feel | 5 | 5 | 5 | 5 | 2 | **+18 (Cap 15)** | Implement Screen 3 |
| **Habit Stacking (Anchoring)** | Increase long-term user retention | 4 | 5 | 4 | 5 | 1 | **+17 (Cap 15)** | Include in quiz |
| **Autonomy (Deferred Registration)**| Reduce upfront sign-up drop-offs | 5 | 5 | 5 | 5 | 1 | **+19 (Cap 15)** | Skip signup forms for guests |
| **Sunk Cost (Quiz Questions)** | Increase trial starts | 4 | 5 | 4 | 4 | 2 | **+15** | Implement quiz |
| **Reciprocity (First Session Free)** | Build trust for post-trial conversions | 5 | 5 | 3 | 5 | 2 | **+16 (Cap 15)** | Enable global routines |
| **Default Effect (Annual selected)**| Increase average order value (AOV) | 4 | 4 | 5 | 4 | 1 | **+16 (Cap 15)** | Highlight annual tier |

---

## 5. Conversion Funnel & Cohort Metrics

To audit and optimize the onboarding flow, the application tracks the following funnel events:

### Funnel Steps (Logged to Amplitude/Mixpanel):
1.  `onboarding_start` (User opens Screen 1)
2.  `quiz_question_answered` (Tracked per question with selected options)
3.  `habit_anchor_selected` (Anchor event selected in Screen 2)
4.  `quiz_completed` (User finishes Screen 2)
5.  `onboarding_demo_viewed` (User enters interactive Breathing Demo)
6.  `onboarding_demo_completed` (User completes the 30s demo session)
7.  `permission_priming_viewed` (User sees notification explanation in Screen 5)
8.  `permission_priming_accepted` (User taps "Allow")
9.  `paywall_viewed` (User sees Screen 6 Paywall)
10. `subscription_trial_started` (User starts Apple/Google premium trial)
11. `registration_completed` (User creates account)
12. `guest_session_initialized` (User bypasses paywall and registration)
13. `first_session_started` (User taps Play on first Sadhana)
14. `first_session_completed` (User completes the 12-min session - **Value Moment Achieved**)

### Core Retention Metrics:
*   **Onboarding Completion Rate:** Target **>78%** (`registration_completed` or `guest_session_initialized` / `onboarding_start`).
*   **Onboarding Paywall Conversion Rate:** Target **>18%** (`subscription_trial_started` / `paywall_viewed`).
*   **D1 Retention:** Target **>32%** (Users who complete onboarding returning on Day 1, boosted by habit anchoring).
*   **Trial-to-Paid Conversion Rate:** Target **>40%** (Users whose 7-day trial rolls into active subscriptions).
*   **Ad-Churn Rate:** Target **<10%** (Free users who drop off immediately upon seeing the post-session ad).eeing the post-session ad).
