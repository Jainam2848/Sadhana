# Phase Prompts Guide — Copy-Paste Prompts for Antigravity

> **Purpose:** Exact prompts to paste into Antigravity at each phase start, mid-point, and completion.
> **How to use:** Copy the prompt verbatim, fill in the `[PLACEHOLDERS]`, and paste into a new Antigravity session or subagent.
> **Skills mentioned:** Each prompt explicitly tells the agent which skills to read and follow.

---

## Table of Contents

1. [Phase 0: Project Bootstrap](#phase-0-project-bootstrap)
2. [Phase 1: Discovery & Product Strategy](#phase-1-discovery--product-strategy)
3. [Phase 2: UX Research & Information Architecture](#phase-2-ux-research--information-architecture)
4. [Phase 3: Design System & UI Generation (Google Stitch)](#phase-3-design-system--ui-generation-google-stitch)
5. [Phase 4: Architecture & Backend](#phase-4-architecture--backend)
6. [Phase 5: Frontend Build & Integration](#phase-5-frontend-build--integration)
7. [Phase 6: Monetization & Payments](#phase-6-monetization--payments)
8. [Phase 7: UX Polish & Micro-Interactions](#phase-7-ux-polish--micro-interactions)
9. [Phase 8: Testing & QA](#phase-8-testing--qa)
10. [Phase 9: Deployment & Store Submission](#phase-9-deployment--store-submission)
11. [Phase 10: Post-Launch & Iteration](#phase-10-post-launch--iteration)

---

## Phase 0: Project Bootstrap

### PROMPT 0.1 — Initialize Project Scaffold

```text
I'm using the planning-with-files skill to initialize persistent working memory,
the wiki-architect skill to create the documentation catalogue, and the
documentation-templates skill for standardized document formats.

Read these skills first:
- C:\Users\jaina\.gemini\config\skills\planning-with-files\SKILL.md
- C:\Users\jaina\.gemini\config\skills\wiki-architect\SKILL.md
- C:\Users\jaina\.gemini\config\skills\documentation-templates\SKILL.md

Then do the following:

1. Read docs/playbook/00_MASTER_PLAYBOOK.md to understand Phase 0 requirements.
2. Create the full directory scaffold defined in Phase 0 of the playbook.
3. Initialize task_plan.md, findings.md, and progress.md in the project root
   using the planning-with-files templates.
4. Create llms.txt following the documentation-templates AI-friendly format.
5. Update task_plan.md marking all Phase 0 tasks as complete.
6. Update progress.md with this session's work log.

Project root: D:\Desktop\Fitness
```

---

## Phase 1: Discovery & Product Strategy

### PROMPT 1.1 — Market Research & Competitive Analysis

```text
I'm using the deep-research skill for autonomous competitive research,
the product-manager-toolkit skill for market analysis frameworks, and the
planning-with-files skill for persisting findings.

Read these skills first:
- C:\Users\jaina\.gemini\config\skills\deep-research\SKILL.md
- C:\Users\jaina\.gemini\config\skills\product-manager-toolkit\SKILL.md
- C:\Users\jaina\.gemini\config\skills\planning-with-files\SKILL.md

Context (read these files first):
- docs/playbook/00_MASTER_PLAYBOOK.md (Phase 1 section)
- task_plan.md (current state)

The app concept is: [DESCRIBE YOUR APP IN 2-3 SENTENCES]
Target audience: [DESCRIBE YOUR TARGET USERS]
Competitors to analyze: [LIST 3-5 COMPETITOR APPS]

Do the following:

1. Research each competitor deeply — analyze their App Store listings, feature sets,
   monetization models, user reviews (top complaints and praises), and design style.
2. Identify 3-5 market gaps where competitors are underserving users.
3. Write the full analysis to docs/research/COMPETITIVE_ANALYSIS.md using a structured
   format: per-competitor breakdown, SWOT analysis, and market gap summary.
4. After every 2 research operations, save key findings to findings.md (2-action rule).
5. Update task_plan.md marking this task as complete.
6. Update progress.md with session work log.
```

### PROMPT 1.2 — App Naming & Brand Identity

```text
I'm using the content-creator skill for brand voice and naming generation.

Read this skill first:
- C:\Users\jaina\.gemini\config\skills\content-creator\SKILL.md

Context (read these files first):
- docs/research/COMPETITIVE_ANALYSIS.md (know our positioning)
- findings.md (accumulated research)

The app concept is: [DESCRIBE YOUR APP]
Target audience: [DESCRIBE YOUR USERS]
Brand personality I want: [e.g., professional, playful, premium, minimal, bold]

Do the following:

1. Generate 10+ app name candidates. For each, evaluate:
   - Memorability and pronunciation
   - Domain availability likelihood (.com, .app, .io)
   - App Store searchability (avoid generic words)
   - Trademark conflict risk
   - Cultural sensitivity across markets
2. Generate a tagline (8 words or fewer) for the top 3 names.
3. Define the brand voice in 3 adjectives with examples.
4. Write everything to docs/research/BRAND_NAMING.md.
5. Update findings.md with the top 3 name candidates.
6. Update progress.md.
```

### PROMPT 1.3 — Write Product Requirements Document (PRD)

```text
I'm using the product-manager-toolkit skill for PRD authoring and MoSCoW
prioritization, and the concise-planning skill for scope definition.

Read these skills first:
- C:\Users\jaina\.gemini\config\skills\product-manager-toolkit\SKILL.md
- C:\Users\jaina\.gemini\config\skills\concise-planning\SKILL.md
- C:\Users\jaina\.gemini\config\skills\ask-questions-if-underspecified\SKILL.md

Context (read these files first):
- docs/playbook/00_MASTER_PLAYBOOK.md (Phase 1 requirements)
- docs/research/COMPETITIVE_ANALYSIS.md
- docs/research/BRAND_NAMING.md
- findings.md

App details:
- Name: [CHOSEN APP NAME]
- Concept: [ONE SENTENCE]
- Audience: [TARGET USERS]
- Monetization: [STRATEGY — e.g., Freemium with subscription]
- Platforms: [iOS + Android / iOS-first / Android-first]
- MVP timeline: [WEEKS/MONTHS]

Do the following:

1. Write a complete PRD to docs/PRODUCT_REQUIREMENTS.md with these sections:
   - Executive Summary (problem, solution, target user, value prop)
   - User Stories (As a [user], I want to [action] so that [benefit])
   - Feature List with MoSCoW classification (Must/Should/Could/Won't for MVP)
   - MVP Scope (in/out boundary)
   - Monetization Model (free tier features, premium features, pricing)
   - Success Metrics (KPIs: DAU, retention, conversion, revenue)
   - Risks & Assumptions
   - V2 Roadmap (features deferred from MVP)
2. If any requirement is ambiguous, use ask-questions-if-underspecified skill
   to ask me before guessing.
3. Update task_plan.md — mark Phase 1 as complete, Phase 2 as in_progress.
4. Update progress.md with session work log.

STOP after writing the PRD and ask me to review and approve before proceeding.
```

---

## Phase 2: UX Research & Information Architecture

### PROMPT 2.1 — User Personas & Jobs-to-be-Done

```text
I'm using the mobile-design skill for mobile-first UX principles,
the jobs-to-be-done-analyst skill for deep user motivation analysis, and the
customer-psychographic-profiler skill for psychographic profiling.

Read these skills first:
- C:\Users\jaina\.gemini\config\skills\mobile-design\SKILL.md
- C:\Users\jaina\.gemini\config\skills\jobs-to-be-done-analyst\SKILL.md
- C:\Users\jaina\.gemini\config\skills\customer-psychographic-profiler\SKILL.md

Context (read these files first):
- docs/PRODUCT_REQUIREMENTS.md (approved PRD)
- docs/research/COMPETITIVE_ANALYSIS.md
- findings.md

Do the following:

1. Create 2-3 user personas in docs/ux/USER_PERSONAS.md. For each persona:
   - Name, age, occupation, location, tech comfort level
   - Photo description (for generate_image tool to create later)
   - Goals (what they want to achieve with the app)
   - Frustrations (current pain points without the app)
   - Jobs-to-be-Done (functional, emotional, social jobs)
   - A "Day in the Life" scenario showing when/where/why they'd use the app
   - Device preferences (iPhone/Android, screen size)
2. Create a Jobs-to-be-Done matrix mapping each persona to their top 3 jobs.
3. Update findings.md with persona summaries.
4. Update progress.md.
```

### PROMPT 2.2 — User Flows & Screen Inventory

```text
I'm using the ui-ux-pro-max skill for premium UX flow design and the
mobile-design skill for mobile navigation patterns.

Read these skills first:
- C:\Users\jaina\.gemini\config\skills\ui-ux-pro-max\SKILL.md
- C:\Users\jaina\.gemini\config\skills\mobile-design\SKILL.md

Context (read these files first):
- docs/PRODUCT_REQUIREMENTS.md
- docs/ux/USER_PERSONAS.md
- findings.md

Do the following:

1. Create docs/ux/USER_FLOWS.md with Mermaid flow diagrams for these journeys:
   a. First-time user onboarding (install → value moment)
   b. Primary action flow (the core thing users do daily)
   c. Purchase/upgrade flow (free → premium conversion)
   d. Return user flow (app open → engagement)
   e. Settings & account management
2. Create a complete SCREEN INVENTORY — a numbered list of every screen in the app:
   - Screen name, purpose, navigation parent, key components
   - Group by navigation section (e.g., Tab 1, Tab 2, Settings stack)
3. Create a NAVIGATION MAP showing the tab bar structure and stack hierarchy.
4. Use Mermaid diagrams for all flows and maps.
5. Update findings.md and progress.md.
```

### PROMPT 2.3 — Onboarding Strategy & Platform Rules

```text
I'm using the onboarding-psychologist skill for conversion-optimized onboarding,
the hig-foundations skill for Apple HIG, and the hig-patterns skill for
iOS interaction patterns.

Read these skills first:
- C:\Users\jaina\.gemini\config\skills\onboarding-psychologist\SKILL.md
- C:\Users\jaina\.gemini\config\skills\hig-foundations\SKILL.md
- C:\Users\jaina\.gemini\config\skills\hig-patterns\SKILL.md
- C:\Users\jaina\.gemini\config\skills\hig-platforms\SKILL.md
- C:\Users\jaina\.gemini\config\skills\hig-components-layout\SKILL.md

Context (read these files first):
- docs/PRODUCT_REQUIREMENTS.md
- docs/ux/USER_PERSONAS.md
- docs/ux/USER_FLOWS.md
- findings.md

Do the following:

1. Create docs/ux/ONBOARDING_STRATEGY.md:
   - Onboarding type: progressive disclosure (not wall-of-forms)
   - Screen-by-screen breakdown (max 4-5 screens before value moment)
   - Permission priming strategy (when and how to ask for notifications,
     camera, location — always AFTER showing value, never on first launch)
   - Skip logic (what can users skip?)
   - Personalization questions (if any)
   - Social proof elements during onboarding
   - Conversion funnel metrics to track

2. Create docs/PLATFORM_RULES.md with two sections:
   
   iOS Rules (from Apple HIG):
   - Navigation patterns (tab bar, navigation controller, sheets)
   - Safe areas (status bar, home indicator, dynamic island)
   - Typography (SF Pro system font or custom)
   - Button styles and minimum touch targets (44pt)
   - Haptic feedback guidelines
   - Dark mode requirements
   
   Android Rules (Material 3):
   - Navigation patterns (bottom nav, navigation drawer)
   - Edge-to-edge display
   - Typography (Roboto or Material You)
   - FAB placement and behavior
   - System back gesture handling
   - Dynamic color (Material You)

3. Update task_plan.md — mark Phase 2 complete.
4. Update findings.md and progress.md.

STOP and ask me to review before proceeding to Phase 3.
```

---

## Phase 3: Design System & UI Generation (Google Stitch)

> **CRITICAL:** This phase uses Google Stitch MCP Server to generate high-fidelity
> mobile UI screens. Stitch produces HTML/CSS that we later convert to React Native.

### PROMPT 3.1 — Create Design System & Stitch Config

```text
I'm using the design-md skill to synthesize a semantic design system into
DESIGN.md format that Google Stitch understands, and the frontend-design skill
for premium visual design principles.

Read these skills first:
- C:\Users\jaina\.gemini\config\skills\design-md\SKILL.md
- C:\Users\jaina\.gemini\config\skills\frontend-design\SKILL.md
- C:\Users\jaina\.gemini\config\skills\stitch-ui-design\SKILL.md

Context (read these files first):
- docs/PRODUCT_REQUIREMENTS.md (brand identity, target audience)
- docs/research/BRAND_NAMING.md (brand personality)
- docs/ux/USER_FLOWS.md (screen inventory)
- docs/PLATFORM_RULES.md (iOS/Android constraints)
- findings.md

App details:
- App name: [APP NAME]
- Brand personality: [e.g., premium, minimal, warm, bold]
- Color preference: [e.g., deep purple with gold accents, or "surprise me"]
- Dark mode: [Required / Optional / Not needed]

Do the following:

1. Create docs/design/DESIGN_SYSTEM.md with:
   - Color Palette: Primary, secondary, accent, surface, background, error colors
     with exact hex codes — BOTH light mode and dark mode variants
   - Typography Scale: Font family, sizes for H1-H6, body, caption, button
   - Spacing Scale: 4px base unit (4, 8, 12, 16, 20, 24, 32, 48, 64)
   - Border Radius: Small (8px), medium (12px), large (16px), pill (9999px)
   - Elevation/Shadow: 3 levels (subtle, medium, prominent)
   - Component Specs: Button (primary, secondary, ghost), Card, Input, Badge, Avatar

2. Create .stitch/DESIGN.md following the design-md skill format:
   - Section 1: Visual Theme & Atmosphere (evocative description)
   - Section 2: Color Palette & Roles (descriptive names + hex codes)
   - Section 3: Typography Rules
   - Section 4: Component Stylings (buttons, cards, inputs)
   - Section 5: Layout Principles
   - This file will be copied into EVERY Stitch prompt for visual consistency.

3. Create .stitch/SITE.md with:
   - Section 1: Project Vision (one paragraph)
   - Section 2: Target Device: MOBILE (390px width)
   - Section 3: Stitch Project ID: [will be filled after project creation]
   - Section 4: Sitemap — list ALL screens from the screen inventory with [ ] status
   - Section 5: Roadmap — ordered list of screens to generate
   - Section 6: Creative Freedom — design notes for Stitch prompts

4. Update findings.md and progress.md.
```

### PROMPT 3.2 — Pull Down Designed Screens from Google Stitch

```text
I'm using the stitch-ui-design skill to pull down, organize, and verify high-fidelity screens from my user-designed Google Stitch project.

Read these skills first:
- C:\Users\jaina\.gemini\config\skills\stitch-ui-design\SKILL.md
- C:\Users\jaina\.gemini\config\skills\design-md\SKILL.md

Context (read these files first):
- docs/ux/FEATURES_AND_SCREENS.md (finalized features and screen inventory)
- .stitch/DESIGN.md (design rules)
- .stitch/SITE.md (sitemap)

Stitch Project details:
- Project ID: https://stitch.withgoogle.com/projects/669110078172882916

Do the following:

1. DISCOVER the Stitch MCP Server namespace by running list_tools (or find available Stitch tools).
2. GET PROJECT DETAILS: Call the get_project tool using the Project ID. Save the list of screens, screen IDs, and project metadata to .stitch/metadata.json.
3. UPDATE .stitch/SITE.md with the Project ID and map each of the core screens in our sitemap to its corresponding screen ID from Stitch.
4. PULL DOWN ALL CORE SCREENS: For each screen in the project:
   - Call the get_screen or equivalent tool to retrieve screen details (including HTML and CSS).
   - Save the HTML content to .stitch/designs/{screen-name}.html.
   - Save the screen screenshot to .stitch/designs/{screen-name}.png. (If downloading screenshots from URLs, append =w1000 or similar width to get full resolution).
   - Mark the screen as [x] (completed/synced) in the .stitch/SITE.md sitemap.
5. VERIFY INTEGRITY: Verify that all files from the sitemap are successfully pulled down. Confirm they are valid layouts ready for Phase 5 frontend conversion.
6. Update task_plan.md — mark Phase 3 screen design as complete.
7. Update findings.md and progress.md.
```

### PROMPT 3.3 — Generate App Icon & Splash Screen

```text
I'm using the generate_image tool to create app assets.

Context (read these files first):
- docs/design/DESIGN_SYSTEM.md (color palette)
- docs/research/BRAND_NAMING.md (brand identity)
- .stitch/DESIGN.md (visual atmosphere)

Do the following:

1. Generate app icons for both iOS and Android:
   - iOS App Icon (1024x1024): Solid background (no transparency), no rounded corners, no text (Apple guideline). Must look clean and recognizable at 60x60px.
   - Android Adaptive Icon:
     - Foreground image (512x512 with transparent background): Contains the logo/icon graphic. Ensure all critical visual elements fit within a central 66% safe area circle.
     - Background image/color (solid color or visual pattern, no transparent background).
   - Play Store Web Listing Icon (512x512): High-fidelity icon (can have a shadow or corner treatment, but keep it clean).

2. Generate splash screens:
   - Centered app icon/logo on the brand background color.
   - For iOS: Light and dark mode variants, set up as universal storyboard assets.
   - For Android: Standard centered splash screen, and configure the Android 12+ Splash Screen API assets (a vector drawable icon ≤288dp with transparent background, centered on a solid color background).

3. Save all assets to assets/images/ directory.
4. Update progress.md.

STOP and show me the generated icons and splash screens for approval before Phase 4.
```

---

## Phase 4: Architecture & Backend

### PROMPT 4.1 — Tech Stack Selection & Architecture Design

```text
I'm using the backend-architect skill for scalable architecture design,
the database-design skill for schema design, the api-patterns skill for
API design, and the documentation-templates skill for ADR format.

Read these skills first:
- C:\Users\jaina\.gemini\config\skills\backend-architect\SKILL.md
- C:\Users\jaina\.gemini\config\skills\database-design\SKILL.md
- C:\Users\jaina\.gemini\config\skills\api-patterns\SKILL.md
- C:\Users\jaina\.gemini\config\skills\documentation-templates\SKILL.md

Context (read these files first):
- docs/PRODUCT_REQUIREMENTS.md (features and requirements)
- docs/ux/USER_FLOWS.md (data needs per screen)
- findings.md

App constraints:
- Platforms: [iOS + Android via Expo/React Native]
- Offline requirements: [Yes/No — if yes, describe what works offline]
- Real-time features: [Chat, live updates, etc. — or "none"]
- Expected scale: [100 users, 10K users, 100K+ users at launch]
- Budget constraints: [Free tier preferred / Budget for services]

Do the following:

1. Write ADR-001: Tech Stack Selection to docs/architecture/ADR/ADR-001-tech-stack-selection.md
   - Compare: Supabase vs Firebase vs Custom Node.js + PostgreSQL
   - Decision criteria: cost at scale, real-time needs, auth, offline, DX
   - Recommend one with clear justification

2. Write ADR-002: Auth Strategy to docs/architecture/ADR/ADR-002-auth-strategy.md
   - Compare: Email/password + social, Magic link, Phone OTP
   - Include: session management, token refresh, secure storage

3. Write ADR-003: State Management to docs/architecture/ADR/ADR-003-state-management.md
   - Compare: Zustand + React Query vs Redux Toolkit + RTK Query vs Jotai
   - Decision criteria: bundle size, DX, caching, offline

4. Write docs/architecture/DATABASE_SCHEMA.md with:
   - ERD diagram (Mermaid)
   - All tables/collections with columns, types, constraints
   - Relationships (foreign keys, indexes)
   - Row-Level Security (RLS) policies if using Supabase

5. Write docs/architecture/API_SPEC.md with:
   - All MVP endpoints (method, path, request body, response, auth required)
   - Error response format
   - Pagination pattern
   - Rate limiting strategy

6. Write docs/architecture/ARCHITECTURE.md with:
   - System architecture diagram (Mermaid)
   - Data flow diagram
   - Infrastructure components
   - Security considerations

7. Update findings.md with key architecture decisions.
8. Update progress.md.

STOP and ask me to review all ADRs and architecture docs before building.
```

### PROMPT 4.2 — Build the Backend

```text
I'm using the subagent-driven-development skill for task execution with
two-stage review, the writing-plans skill for bite-sized task breakdown,
and the tdd-workflow skill for test-driven development.

Read these skills first:
- C:\Users\jaina\.gemini\config\skills\subagent-driven-development\SKILL.md
- C:\Users\jaina\.gemini\config\skills\writing-plans\SKILL.md
- C:\Users\jaina\.gemini\config\skills\tdd-workflow\SKILL.md
- C:\Users\jaina\.gemini\config\skills\auth-implementation-patterns\SKILL.md
- C:\Users\jaina\.gemini\config\skills\secrets-management\SKILL.md

Context (read these files — ALL of them):
- docs/architecture/ARCHITECTURE.md (system design)
- docs/architecture/API_SPEC.md (endpoint contracts)
- docs/architecture/DATABASE_SCHEMA.md (schema)
- docs/architecture/ADR/ADR-001-tech-stack-selection.md
- docs/architecture/ADR/ADR-002-auth-strategy.md
- task_plan.md

Do the following using subagent-driven-development:

1. First, use writing-plans to break the backend into bite-sized tasks:
   - Task 1: Initialize backend project (Supabase/Firebase/Node.js)
   - Task 2: Set up database schema and migrations
   - Task 3: Implement auth (signup, login, logout, refresh)
   - Task 4: Build CRUD endpoints for [PRIMARY ENTITY]
   - Task 5: Build CRUD endpoints for [SECONDARY ENTITY]
   - Task 6: Implement file upload (if needed)
   - Task 7: Write integration tests for all endpoints
   - Task 8: Deploy to staging

2. For EACH task, follow the subagent-driven-development protocol:
   a. Dispatch implementer subagent with full task text
   b. Implementer follows tdd-workflow: write failing test → implement → pass
   c. Implementer commits with conventional commit message
   d. Dispatch spec reviewer subagent → verify code matches API_SPEC.md
   e. Dispatch code quality reviewer subagent → ensure production quality
   f. Mark task complete in task_plan.md

3. Use secrets-management skill — NO hardcoded API keys, passwords, or secrets.
4. Update progress.md after each completed task.
```

---

## Phase 5: Frontend Build & Integration

### PROMPT 5.1 — Initialize Expo Project & Design System

```text
I'm using the react-native-architecture skill for RN best practices,
the expo-tailwind-setup skill for styling, and the zustand-store-ts skill
for state management.

Read these skills first:
- C:\Users\jaina\.gemini\config\skills\react-native-architecture\SKILL.md
- C:\Users\jaina\.gemini\config\skills\expo-tailwind-setup\SKILL.md
- C:\Users\jaina\.gemini\config\skills\zustand-store-ts\SKILL.md
- C:\Users\jaina\.gemini\config\skills\react-patterns\SKILL.md

Context (read these files first):
- docs/PRODUCT_REQUIREMENTS.md
- docs/architecture/ARCHITECTURE.md
- docs/architecture/ADR/ADR-003-state-management.md
- docs/architecture/ADR/ADR-004-navigation-pattern.md (create if not exists)
- docs/design/DESIGN_SYSTEM.md (color, typography, spacing tokens)
- docs/ux/USER_FLOWS.md (screen inventory)

Do the following:

1. Initialize Expo project:
   - npx create-expo-app@latest ./ --template blank-typescript
   - Configure tsconfig.json with strict mode
   - Set up path aliases (@/components, @/screens, @/hooks, @/lib, @/stores)

2. Set up NativeWind (Tailwind CSS for React Native):
   - Follow expo-tailwind-setup skill instructions exactly
   - Configure tailwind.config.js with design system tokens

3. Create the theme provider:
   - Translate ALL tokens from DESIGN_SYSTEM.md into code
   - Colors (light + dark mode), typography, spacing, border-radius
   - Theme context with useColorScheme hook

4. Set up navigation (Expo Router):
   - Create app/ directory structure matching screen inventory
   - Tab bar layout with proper icons
   - Stack navigators for sub-screens
   - Write ADR-004 for navigation pattern decision

5. Set up state management:
   - Zustand stores following zustand-store-ts patterns
   - React Query for server state (API calls)
   - Auth store, user store, app settings store

6. Create reusable base components:
   - Button (primary, secondary, ghost, loading state)
   - Card
   - Input (with validation states)
   - Typography (H1-H6, Body, Caption)
   - SafeAreaWrapper
   - LoadingSpinner / SkeletonLoader

7. Update task_plan.md and progress.md.
```

### PROMPT 5.2 — Build Screens from Stitch Designs

```text
I'm using the subagent-driven-development skill to build each screen
independently with two-stage review.

Read these skills first:
- C:\Users\jaina\.gemini\config\skills\subagent-driven-development\SKILL.md
- C:\Users\jaina\.gemini\config\skills\react-patterns\SKILL.md
- C:\Users\jaina\.gemini\config\skills\react-component-performance\SKILL.md
- C:\Users\jaina\.gemini\config\skills\tdd-workflow\SKILL.md
- C:\Users\jaina\.gemini\config\skills\vibe-code-auditor\SKILL.md
- C:\Users\jaina\.gemini\config\skills\ask-questions-if-underspecified\SKILL.md

Context (read ALL of these):
- docs/design/DESIGN_SYSTEM.md (tokens)
- docs/ux/USER_FLOWS.md (screen inventory and flow logic)
- docs/architecture/API_SPEC.md (endpoints to call)
- .stitch/designs/ directory (HTML/CSS from Google Stitch)
- .stitch/DESIGN.md (visual reference)

For EACH screen in the screen inventory:

1. Read the Stitch-generated HTML/CSS from .stitch/designs/{screen}.html
2. Read the Stitch screenshot from .stitch/designs/{screen}.png for visual reference
3. Convert the HTML/CSS layout to React Native components:
   - Map HTML elements to RN equivalents (div→View, p→Text, img→Image)
   - Convert CSS to NativeWind/Tailwind classes
   - Use design system tokens for colors, spacing, typography
   - Ensure the coded screen matches the Stitch screenshot visually
4. Wire the screen to the backend API using React Query hooks.
   - For the Rewards screen, connect to Sadhana Rewards endpoints to display the user's monthly ad count, streaking progress, and points balance.
5. Write component tests.
6. Run spec review (does it match the design?) and quality review.
   - Run the `vibe-code-auditor` skill on the completed code to scan for unhandled exceptions, memory leaks, and logic gaps.
   - STRICT QUALITY GUARDRAIL: No placeholder code (e.g., '// TODO: implement', '// UI here'). All layouts, loadings, errors, and functionalities must be 100% complete. If stuck on requirements, stop and ask questions immediately using the `ask-questions-if-underspecified` skill.

Build screens in this order (dependencies first):
a. Auth screens (Login, Signup, Forgot Password)
b. Onboarding screens (if separate from auth)
c. Main tab screens (Home, [Tab2], [Tab3], Rewards, Profile)
d. Detail/modal screens
e. Settings screens

Update task_plan.md and progress.md after each screen.
```

---

## Phase 6: Monetization & Payments

### PROMPT 6.1 — Payment & Sadhana Rewards Integration

```text
I'm using the subagent-driven-development skill to execute monetization and reward features, the paywall-upgrade-cro skill for premium paywall design, and the vibe-code-auditor skill for secure code checks.

Read these skills first:
- C:\Users\jaina\.gemini\config\skills\subagent-driven-development\SKILL.md
- C:\Users\jaina\.gemini\config\skills\paywall-upgrade-cro\SKILL.md
- C:\Users\jaina\.gemini\config\skills\price-psychology-strategist\SKILL.md
- C:\Users\jaina\.gemini\config\skills\vibe-code-auditor\SKILL.md
- C:\Users\jaina\.gemini\config\skills\ask-questions-if-underspecified\SKILL.md

Context (read these files first):
- docs/PRODUCT_REQUIREMENTS.md (monetization model, pricing, and rewards details)
- docs/design/DESIGN_SYSTEM.md (for paywall & rewards styling tokens)
- docs/PLATFORM_RULES.md (platform payment rules)
- docs/architecture/DATABASE_SCHEMA.md (rewards schema details)

Billing Strategy (Staging & Local Dev):
- To support local development and staging testing without requiring paid Apple ($99) or Google ($25) developer accounts, we will implement a local mock billing system instead of initializing the live RevenueCat SDK.
- The actual RevenueCat SDK integration will be deferred to the production deployment and app submission phase.
- We will write a clean billing service (src/services/billing.ts) with standard API signatures (purchaseMonthly, purchaseAnnual, restorePurchases, getActiveEntitlements).
- This service will mock network delays and dynamically update the Zustand authStore (toggling user.premium state to true/false) so that all gated content, ad visibility, and rewards logic are fully functional and easily testable.

Do the following:

1. Write ADR-005: Billing and Monetization Strategy to docs/architecture/ADR/ADR-005-payment-provider.md
   - Document the payment architecture. State the decision to use a mock billing service locally to support developer workflows without active store accounts.
   - Detail the architecture of the mock service (src/services/billing.ts) and explain how it will be replaced by the `@revenuecat/purchases-react-native` SDK during the final production build phase.
   - Restrict Stripe's role to optional web checkout or future merchandise, syncing status to the mobile client via Supabase.

2. Implement Mock Billing Service:
   - Create [src/services/billing.ts](file:///d:/Desktop/Fitness/src/services/billing.ts) exporting functions to fetch offerings (Monthly and Annual plans), trigger purchase requests, and restore purchases.
   - Connect the success callbacks to update the Zustand `authStore` to toggle the user's `premium` subscription flag.

3. Build the Paywall Screen:
   - Port [paywall.tsx](file:///d:/Desktop/Fitness/app/(auth)/paywall.tsx) to match the onboarding paywall design.
   - Apply price-psychology-strategist principles (price anchoring: monthly $14.99 vs annual $89.99 selected by default).
   - Use paywall-upgrade-cro patterns: list key premium features, show testimonials, and include a functioning "Restore Purchases" button that triggers the mock billing service restore logic.
   - Enforce the **Earth Ritual** tokens (Bone background, Terracotta primary buttons, Ashoka Green unlocks).

4. Implement Gating Logic in the App:
   - Check the Zustand `authStore.user.premium` state across the screens.
   - Enforce paywall redirections or lock overlays on premium courses in the Library tab and personalized daily plans on the Home tab.

5. Implement Sadhana Rewards & Ad Mocking:
   - Integrate mock rewarded ads inside the Rewards dashboard tab.
   - Provide a "Watch Rewarded Ad" button that opens a mock full-screen ad overlay with a visible 10-second countdown timer. On countdown completion, trigger the secure Supabase mutation (`useIncrementAdViews`) to increment the user's ad count in the database.
   - Implement the reward unlock actions: Free users unlock premium courses (milestone logic), and Premium users accrue permanent Karma Coins in their profile wallets.
   - Verify that monthly cron or RPC triggers correctly reset counts to 0 at the start of each month.

6. Testing & Validation:
   - Write unit tests in [tests/billing.test.ts](file:///d:/Desktop/Fitness/tests/billing.test.ts) to verify that mock purchases and restores correctly update subscription states.
   - Run typescript checking and codebase audits using `vibe-code-auditor` to ensure zero placeholder code or fragile logic.
```

---

## Phase 7: UX Polish & Micro-Interactions

### PROMPT 7.1 — Premium Polish Pass

```text
I'm using the design-spells skill for micro-interactions, the ux-feedback skill
for loading/empty/error states, the ux-copy skill for microcopy, and the
wcag-audit-patterns skill for accessibility.

Read these skills first:
- C:\Users\jaina\.gemini\config\skills\design-spells\SKILL.md
- C:\Users\jaina\.gemini\config\skills\ux-feedback\SKILL.md
- C:\Users\jaina\.gemini\config\skills\ux-copy\SKILL.md
- C:\Users\jaina\.gemini\config\skills\animejs-animation\SKILL.md
- C:\Users\jaina\.gemini\config\skills\screen-reader-testing\SKILL.md
- C:\Users\jaina\.gemini\config\skills\wcag-audit-patterns\SKILL.md
- C:\Users\jaina\.gemini\config\skills\react-component-performance\SKILL.md

Context (read these files first):
- docs/design/DESIGN_SYSTEM.md
- docs/PLATFORM_RULES.md
- docs/ux/USER_FLOWS.md (every screen in the app)

Go through EVERY screen in the app and add:

1. SKELETON LOADERS (ux-feedback):
   - Shimmer effect on all data-loading screens
   - Match the layout shape of the content being loaded
   - Skeleton → real content transition should be smooth (fade)

2. MICRO-ANIMATIONS (design-spells + animejs-animation):
   - Screen transitions: smooth push/pop with shared element transitions
   - Button press: subtle scale-down (0.97) + haptic on iOS
   - List items: staggered fade-in on first load
   - Pull-to-refresh: custom branded animation
   - Tab bar: icon bounce on tap
   - Card: subtle parallax tilt on scroll
   - ALL animations must run at 60fps — use react-component-performance to verify

3. EMPTY STATES (ux-feedback):
   - Every list/feed that could be empty needs an illustrated empty state
   - Include: illustration, headline, description, CTA button
   - Use generate_image tool to create custom illustrations

4. ERROR STATES (ux-feedback + ux-copy):
   - Friendly error messages (not "Error 500")
   - Retry button on all network errors
   - Offline banner when connectivity lost

5. HAPTIC FEEDBACK (PLATFORM_RULES.md):
   - iOS: Taptic Engine on primary actions (submit, delete, toggle)
   - Android: Vibration API equivalent
   - NEVER on scroll or passive actions

6. DARK MODE AUDIT:
   - Switch to dark mode and verify EVERY screen
   - Check contrast ratios (WCAG 2.2 AA: 4.5:1 for text, 3:1 for large text)
   - Fix any color issues

7. ACCESSIBILITY AUDIT (wcag-audit-patterns + screen-reader-testing):
   - All images have alt text
   - All buttons have accessible labels
   - Touch targets ≥ 44pt × 44pt
   - Correct heading hierarchy
   - Screen reader navigation works logically

8. UX MICROCOPY REVIEW (ux-copy):
   - Review every button label, placeholder, toast, error message
   - Ensure consistent voice and tone
   - Remove jargon, be human

9. Update progress.md with all changes.
```

---

## Phase 8: Testing & QA

### PROMPT 8.1 — Comprehensive Testing

```text
I'm using the tdd-workflow skill for test methodology, the e2e-testing skill
for end-to-end tests, and the systematic-debugging skill for any bugs found.

Read these skills first:
- C:\Users\jaina\.gemini\config\skills\tdd-workflow\SKILL.md
- C:\Users\jaina\.gemini\config\skills\test-driven-development\SKILL.md
- C:\Users\jaina\.gemini\config\skills\e2e-testing\SKILL.md
- C:\Users\jaina\.gemini\config\skills\systematic-debugging\SKILL.md
- C:\Users\jaina\.gemini\config\skills\vibe-code-auditor\SKILL.md
- C:\Users\jaina\.gemini\config\skills\security-scanning-security-dependencies\SKILL.md

Context (read these files first):
- docs/PRODUCT_REQUIREMENTS.md (what must work)
- docs/architecture/API_SPEC.md (API contracts)
- docs/ux/USER_FLOWS.md (user journeys to test E2E)

Do the following:

1. UNIT TESTS (Jest):
   - All utility functions
   - All custom hooks
   - All Zustand store logic
   - All API service functions
   - Target: ≥ 80% code coverage

2. COMPONENT TESTS (React Native Testing Library):
   - All screen components render without crashing
   - Form validation works correctly
   - Loading/error/empty states render correctly
   - Navigation between screens works

3. E2E TESTS (Detox or Maestro):
   - Onboarding flow: fresh install → complete onboarding → land on home
   - Primary action flow: [DESCRIBE CORE USER ACTION]
   - Purchase flow: tap upgrade → select plan → complete purchase (sandbox)
   - Auth flow: signup → logout → login → forgot password

4. API INTEGRATION TESTS:
   - All endpoints return correct responses
   - Auth-protected endpoints reject unauthenticated requests
   - Validation rejects malformed input
   - Edge cases: empty arrays, null values, max-length strings

5. SECURITY AUDIT:
   - Run dependency vulnerability scan (npm audit)
   - Check for hardcoded secrets
   - Verify HTTPS-only API calls
   - Check token storage security

6. PERFORMANCE AUDIT:
   - Bundle size analysis
   - Startup time measurement
   - Memory usage profiling
   - Frame rate during animations

7. Write docs/TESTING_STRATEGY.md documenting all test protocols.

8. If ANY bugs found, use systematic-debugging skill:
   - Diagnose root cause
   - Fix the bug
   - Add a regression test
   - Log in progress.md

9. Update task_plan.md — mark Phase 8 complete.
```

---

## Phase 9: Deployment & Store Submission

### PROMPT 9.1 — App Store & Google Play Store Metadata & Assets

```text
I'm using the app-store-optimization skill for ASO and the
content-creator skill for marketing copy.

Read these skills first:
- C:\Users\jaina\.gemini\config\skills\app-store-optimization\SKILL.md
- C:\Users\jaina\.gemini\config\skills\content-creator\SKILL.md

Context (read these files first):
- docs/PRODUCT_REQUIREMENTS.md
- docs/research/BRAND_NAMING.md
- docs/research/COMPETITIVE_ANALYSIS.md

Do the following:

1. KEYWORD RESEARCH:
   - Research 20+ keywords for the app category
   - Score by: search volume, competition, relevance
   - Select top 10 for Apple keyword field (100 chars, comma-separated, no spaces)
   - Identify top 5 for Google Play description keyword density

2. Write APP STORE METADATA for Apple App Store:
   - Title: ≤30 chars (include top keyword)
   - Subtitle: ≤30 chars (secondary keyword)
   - Promotional Text: ≤170 chars (can be updated without app submission)
   - Description: ≤4,000 chars (feature highlights, social proof, CTA)
   - Keywords: 100 chars (comma-separated, no spaces, no plurals)
   - What's New: ≤4,000 chars
   - Category: Primary + Secondary
   - Age Rating: Select appropriate rating
   - Privacy Policy URL: [YOUR PRIVACY POLICY URL]

3. Write PLAY STORE METADATA for Google Play Store:
   - Title: ≤50 chars
   - Short Description: ≤80 chars
   - Full Description: ≤4,000 chars (front-load keywords naturally)
   - Category + Tags
   - Data Safety Declaration details: Document what data (e.g. location, user profile, analytics, crash logs) is collected/transmitted.
   - Privacy Policy URL: [YOUR PRIVACY POLICY URL] (must contain Android-specific declarations if sensitive permissions are used)

4. Generate MARKETING SCREENSHOTS & GRAPHICS:
   - For Apple App Store: 6 screenshots for each size: 6.7" (iPhone 15/16 Pro Max), 6.5", 5.5"
   - For Google Play Store:
     - Phone: 6-8 screenshots (16:9 or 9:16, e.g. 1080x1920)
     - 7" Tablet: 4-6 screenshots (minimum 320px width, recommended 1200x1920 or similar)
     - 10" Tablet: 4-6 screenshots (minimum 320px width, recommended 1200x1920 or similar)
     - Google Play Feature Graphic (1024x500 PNG): A promotional banner with the app logo, title, and key feature visual. Important: Keep key text and visuals in the center safe area (roughly 800x400 centered).
     - Google Play App Icon (512x512 PNG, no transparency): Used as the listing icon on the Google Play website/app.
   - Each screenshot: app screen inside a high-quality device frame + clear text overlay explaining the feature.
   - Screenshot order: best feature first → secondary features → social proof/pricing.

5. Write everything to docs/launch/STORE_ASSETS.md
6. Update progress.md.
```

### PROMPT 9.2 — Build, Submit & Store Submission Checklists

```text
I'm using the expo-deployment skill for building and submitting,
the expo-dev-client skill for TestFlight, and the documentation-templates
skill for the deployment runbook.

Read these skills first:
- C:\Users\jaina\.gemini\config\skills\expo-deployment\SKILL.md
- C:\Users\jaina\.gemini\config\skills\expo-dev-client\SKILL.md
- C:\Users\jaina\.gemini\config\skills\documentation-templates\SKILL.md
- C:\Users\jaina\.gemini\config\skills\app-store-changelog\SKILL.md

Context (read these files first):
- docs/launch/STORE_ASSETS.md (metadata ready)
- docs/TESTING_STRATEGY.md (all tests passing)

Do the following:

1. CONFIGURE EAS BUILD:
   - Run: npx eas-cli@latest init
   - Create eas.json with profiles:
     - "preview": for internal testing (simulator builds)
     - "production": for store submission (signed builds)
   - Configure app.json/app.config.js:
     - Bundle identifier: com.[company].[appname]
     - Version: 1.0.0
     - Build number: 1
     - Required permissions with usage descriptions
     - Splash screen configuration
     - App icon paths
     - Scheme for deep linking

2. RUN THE APPLE APP STORE SUBMISSION CHECKLIST:

   Pre-Build:
   - [ ] Apple Developer Account ($99/year) is active
   - [ ] Bundle ID registered in Apple Developer Portal
   - [ ] App ID created in App Store Connect
   - [ ] Signing certificates and provisioning profiles configured
   - [ ] Push notification entitlement configured (if using push)
   
   Build:
   - [ ] Run: eas build --platform ios --profile production
   - [ ] Build succeeds without errors
   - [ ] Binary size is acceptable (< 200MB recommended)
   
   App Store Connect:
   - [ ] App name is unique and not taken
   - [ ] All metadata uploaded (title, subtitle, description, keywords)
   - [ ] Screenshots uploaded for ALL required sizes (6.7", 6.5", 5.5")
   - [ ] App icon uploaded (1024x1024, no alpha channel, no rounded corners)
   - [ ] Privacy policy URL is valid and accessible
   - [ ] Age rating questionnaire completed
   - [ ] App pricing and availability set
   - [ ] In-App Purchase products created and approved (if applicable)
   - [ ] App Review Information filled in (demo account credentials if needed)
   - [ ] Contact information for reviewer provided
   
   Submit:
   - [ ] Run: eas submit --platform ios
   - [ ] Build appears in App Store Connect
   - [ ] Select build for review
   - [ ] Submit for App Review
   
   Post-Submission:
   - [ ] Monitor review status (typically 24-48 hours)
   - [ ] Respond to any reviewer questions immediately
   - [ ] If rejected: read reason, fix, resubmit

3. RUN THE GOOGLE PLAY STORE SUBMISSION CHECKLIST:

   Pre-Build:
   - [ ] Google Play Developer Account ($25 one-time) is active
   - [ ] App created in Google Play Console
   - [ ] Signing credentials configured (Google Play App Signing enabled or custom upload keystore)
   
   Build:
   - [ ] Run: eas build --platform android --profile production
   - [ ] Build produces signed .aab file (Android App Bundle, required for Play Store)
   - [ ] Bundle size is acceptable (max 200MB compressed AAB)
   
   Google Play Console:
   - [ ] Store listing complete:
     - [ ] Title (≤50 chars)
     - [ ] Short description (≤80 chars)
     - [ ] Full description (≤4,000 chars)
     - [ ] Screenshots uploaded: Phone (min 2, max 8), 7" tablet (min 2, max 8), 10" tablet (min 2, max 8)
     - [ ] Feature graphic (1024x500 PNG)
     - [ ] App icon (512x512 PNG, no transparency)
   - [ ] Content rating questionnaire completed
   - [ ] Target audience and content declared (if targeting children, comply with families policy)
   - [ ] Privacy policy URL provided and matches app declarations
   - [ ] Data safety section completed:
     - [ ] Declarations match your analytics, crash reporting (Sentry), and database collection
     - [ ] Data types collected declared (e.g., location, email, financial info, device IDs)
     - [ ] Data sharing practices declared
     - [ ] Data deletion request URL provided (mandatory for account-creating apps)
   - [ ] Declared Foreground Services / Sensitive Permissions (if applicable)
   - [ ] App pricing set (free or paid)
   - [ ] Country/region availability selected
   - [ ] In-app products created (if applicable, ensure Play billing matches pricing model)
   
   Testing & Mandatory Verification Tracks:
   - [ ] For personal developer accounts (created after Nov 2023): closed testing with 20+ testers opted-in active for 14+ consecutive days completed and approved by Google before production request
   - [ ] Upload build to Internal Testing track first
   - [ ] Add internal testers and verify build on multiple physical Android devices/emulators
   - [ ] Promote build to Closed Testing (closed beta) track if needed
   
   Submit to Production:
   - [ ] Run: eas submit --platform android
   - [ ] Upload .aab to Production track
   - [ ] Set rollout percentage (start at 10-20% to monitor crashes)
   - [ ] Submit for production review
   
   Post-Submission:
   - [ ] Google review typically takes 1 to 7 days
   - [ ] Monitor Play Console Inbox and email for policy alerts or rejections
   - [ ] Gradually increase rollout percentage (20% → 50% → 100%) as stability is confirmed

4. Write docs/DEPLOYMENT_RUNBOOK.md with:
   - Step-by-step release process for future updates
   - OTA update process (eas update)
   - Rollback procedure
   - Version numbering strategy

5. Generate CHANGELOG.md from git history using app-store-changelog skill.
6. Write README.md using documentation-templates format.
7. Update task_plan.md — mark Phase 9 complete.
```

---

## Phase 10: Post-Launch & Iteration

### PROMPT 10.1 — Post-Launch Setup

```text
I'm using the analytics-tracking skill for event tracking and the
ab-test-setup skill for experimentation.

Read these skills first:
- C:\Users\jaina\.gemini\config\skills\analytics-tracking\SKILL.md
- C:\Users\jaina\.gemini\config\skills\ab-test-setup\SKILL.md

Context (read these files first):
- docs/PRODUCT_REQUIREMENTS.md (success metrics / KPIs)

Do the following:

1. SET UP CRASH REPORTING:
   - Integrate Sentry (or Bugsnag) for crash tracking
   - Configure source maps for readable stack traces
   - Set up alert rules for new crashes

2. SET UP ANALYTICS:
   - Track these events minimum:
     - app_open, onboarding_started, onboarding_completed
     - signup, login, logout
     - [PRIMARY_ACTION]_started, [PRIMARY_ACTION]_completed
     - paywall_viewed, subscription_started, subscription_cancelled
     - screen_view (with screen name parameter)
   - Set up funnels: Onboarding → Activation → Retention → Revenue
   - Track daily/weekly/monthly active users

3. SET UP A/B TESTING:
   - Use ab-test-setup skill with a proper hypothesis:
   - First test: Onboarding variant (3 screens vs 5 screens)
   - Define: hypothesis, primary metric, sample size, duration

4. CREATE MONITORING DASHBOARD:
   - Key metrics at a glance: DAU, retention (D1/D7/D30),
     crash-free rate, revenue, conversion rate

5. Plan V2 roadmap:
   - Review deferred features from PRD "Won't" list
   - Analyze user feedback from app store reviews
   - Prioritize with MoSCoW for V2

6. Update docs/PRODUCT_REQUIREMENTS.md with V2 roadmap section.
7. Final update to task_plan.md — mark Phase 10 as in_progress (ongoing).
```

---

## Quick Reference: Which Prompt When

| Situation | Prompt to Use |
|-----------|--------------|
| Starting from scratch | 0.1 → 1.1 → 1.2 → 1.3 |
| Approved PRD, need UX | 2.1 → 2.2 → 2.3 |
| Approved UX, need designs | 3.1 → 3.2 → 3.3 |
| Approved designs, need backend | 4.1 → 4.2 |
| Backend done, need frontend | 5.1 → 5.2 |
| Frontend done, need payments | 6.1 |
| Working app, needs polish | 7.1 |
| Polished app, needs testing | 8.1 |
| Tested app, ready to ship | 9.1 → 9.2 |
| App is live | 10.1 |
| Resuming after a break | Re-read task_plan.md, findings.md, progress.md first |
| Something broke | Use `systematic-debugging` skill |
| Stuck on a decision | Use `ask-questions-if-underspecified` skill |
