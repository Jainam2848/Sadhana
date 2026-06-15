# Findings — Sadhana

> **Skill:** `planning-with-files` — Store ALL research discoveries here.
> **Rule:** After every 2 view/browser/search operations, IMMEDIATELY save findings here.

---

## Research Discoveries

### Competitive Analysis Summary
*   **The "Workout" vs. "Stress Relief" Split:** Competitors either isolate yoga as fitness (Down Dog, Asana Rebel) or meditation as eyes-closed listening (Calm, Headspace). There is a clear market gap for an integrated daily routine (Asana → Pranayama → Dhyana).
*   **Diluted Teachings:** General wellness apps offer highly secularized, often superficial mindfulness. Seeking individuals want authentic Eastern lineage roots, Sanskrit translations, and traditional context.
*   **Curated Routines:** Users are overwhelmed by option fatigue (e.g. Insight Timer's 150k+ library). Curated, integrated daily wellness rituals are required.

### Competitor Positioning Matrix

| Competitor | Spiritual Depth | Physical Focus | Mind Focus | Curation Level |
|:---|:---|:---|:---|:---|
| **Calm** | Low | None | High | High |
| **Headspace** | Low | Low | High | High |
| **Down Dog** | Minimal | High | Low | Medium |
| **Insight Timer** | High (Varies) | Low | High | Low |
| **Asana Rebel** | None | High | Low | High |
| **Sadhana (Ours)**| **High (Authentic Indian)** | **Medium (Yoga)** | **High (Holistic)** | **High (Curated)** |

---

## Design Decisions

### Approved Brand & Naming
*   **Approved Name:** **Sadhana** (साधन) — meaning "dedicated daily practice" or "spiritual practice" in Sanskrit. It reframes exercise as a grounding self-care ritual.
*   **Brand tagline:** "Your Daily Mind-Body Sanctuary."
*   **Brand Voice:** Authentic (Sanskrit terms defined simply, evidence-based benefits), Premium & Calm (restrained, steady delivery), Practical & Encouraging (supports short sessions, zero guilt).
*   **Branding Theme:** **Earth Premium**.
    *   *Palette:* Terracotta (`#D35400`), Cream (`#FDFEFE`), Olive (`#1E8449`), and Charcoal (`#2C3E50`).
    *   *Atmosphere:* Grounding sanctuary, warm light gradients, tactile glassmorphism, and minimal screen clutter.

### Mobile Accessibility Decisions
*   **Dynamic Typography:** Enforce system-level text scaling (Dynamic Type on iOS / Android text scale) across the entire UI. No hardcoded font sizes.
*   **Touch Targets:** Set absolute minimum touch targets at 44pt (iOS) / 48dp (Android) to avoid accidental taps for users with varying motor skills (e.g. seniors).
*   **Audio Quality Priority:** Optimize audio compression for vocal clarity and crisp narration to facilitate hands-free listening.

### Information Architecture & Flows
*   **Core Flows Mapped:** 1. Onboarding & Permission Priming, 2. Routine Player Session, 3. Paywall Conversion, 4. Returning User App Entry, 5. Preferences & Settings.
*   **Bottom Tab Navigation Structure:**
    - Tab 1: Home Stack (Dashboard, Routine Config, Active Player, Completion Screen)
    - Tab 2: Library Stack (Category Browser, Course Details, Single Player)
    - Tab 3: Rewards Stack (Milestone Progress, Karma Coins Wallet, Redemption Screen)
    - Tab 4: Profile Stack (Lifetime Stats, Settings Sub-stack, Paywall Screen)
*   **Screen Inventory:** Documented 19 distinct screens mapping modal flows, stacks, and tab routes.


---

## Technical Decisions

### Core Architecture
*   **Framework:** React Native + Expo (TypeScript strict mode).
*   **Styling:** NativeWind (Tailwind CSS v4).
*   **State Management:** Zustand (client state) + React Query (server cache).
*   **Secure Storage:** Sensitive data and JWTs saved to iOS Keychain / Android Keystore via `Expo SecureStore`.

### Sadhana Rewards Mechanics
*   **Free Tier:** Ad-viewing counts reset monthly. Milestones at 10, 30, and 50 ads unlock single premium classes, guided course bundles, or a 24-hour ad-free pass respectively.
*   **Paid/Premium Tier:** Reward views accumulate **Karma Coins** in a permanent wallet. Points can be redeemed for subscription renewal discounts, partner wellness gear discounts, or Indian heritage charity donations.

### Personalization & Routine Gating
*   **Premium Users:** Questionnaire outputs dynamically generate a tailored daily routine combining Asana, Pranayama, and Dhyana segments (Personalized Sadhana Plan).
*   **Free Users:** Gated from personalized plans. Bypasses custom routine generation and defaults to a static, non-personalized "Global Daily Sadhana of the Day".

---

## User Persona Summaries

We have mapped three core user personas to guide our design and development:

1.  **Sarah (32, US - Busy Achiever):**
    *   *Dominant Need:* Autonomy & Competence. Startup founder working 60-hour weeks with high stress and desk stiffness.
    *   *Device:* iPhone 15 Pro (iOS). Expects native SF Symbols, edge swipe back, fluid 60fps animations.
    *   *JTBD:* Needs brief (10-15 min) morning stretching & breathing sequences to gain rapid mental clarity and physical release.
2.  **Michael (45, Canada - Authenticity Seeker):**
    *   *Dominant Need:* Self-Actualization & Belonging. High school teacher frustrated by superficial, commercialized fitness yoga.
    *   *Device:* Google Pixel 8 (Android). Relies on system back button/gesture and edge-to-edge layouts.
    *   *JTBD:* Seeks authentic Sanskrit terms, Devanagari script tooltips, and deep philosophical teachings from lineage sources.
3.  **Elena (68, Germany - Restorative Senior):**
    *   *Dominant Need:* Security & Autonomy. Retired librarian looking to preserve joint mobility and prevent falls.
    *   *Device:* Samsung Galaxy A54 (Android). Requires dynamic type scaling, high contrast UI, and large touch targets.
    *   *JTBD:* Follows slow, audio-centric chair yoga sessions with highly descriptive, slow voice pacing. Relies on rewards milestones to access premium courses on a fixed retirement budget.

