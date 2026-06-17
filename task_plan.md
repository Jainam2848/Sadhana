# Task Plan — Sadhana

> **Skill:** `planning-with-files` — This is your persistent working memory.
> **Rule:** Update after every phase transition. Re-read before every major decision.
> **Project Root:** `D:\Desktop\Fitness`

---

## Current Phase

**Phase 7: UX Polish** — `in_progress`

---

## Phase Progress

| Phase | Status | Started | Completed |
|-------|--------|---------|-----------|
| Phase 0: Project Bootstrap | `completed` | 2026-06-15 | 2026-06-15 |
| Phase 1: Discovery & Strategy | `completed` | 2026-06-15 | 2026-06-15 |
| Phase 2: UX Research & IA | `completed` | 2026-06-15 | 2026-06-15 |
| Phase 3: Design System & UI | `completed` | 2026-06-15 | 2026-06-15 |
| Phase 4: Architecture & Backend | `completed` | 2026-06-15 | 2026-06-16 |
| Phase 5: Frontend Build | `completed` | 2026-06-16 | 2026-06-16 |
| Phase 6: Monetization | `completed` | 2026-06-16 | 2026-06-17 |
| Phase 7: UX Polish | `in_progress` | 2026-06-17 | — |
| Phase 8: Testing & QA | `not_started` | — | — |
| Phase 9: Deployment | `not_started` | — | — |
| Phase 10: Post-Launch | `not_started` | — | — |

---

## Current Phase Tasks

### Phase 4: Architecture & Backend

- [x] Write ADR-001: Tech Stack Selection (Supabase)
- [x] Write ADR-002: Auth Strategy (Email/Password + OAuth)
- [x] Write ADR-003: State Management (Zustand + React Query)
- [x] Write `docs/architecture/DATABASE_SCHEMA.md` with ERD and SQL schemas
- [x] Write `docs/architecture/API_SPEC.md` with endpoint JSON specs and error models
- [x] Write `docs/architecture/ARCHITECTURE.md` with system and sync diagrams
- [x] Update findings.md and progress.md
- [x] Initialize backend project (Supabase local environment config)
- [x] Implement database migrations (Supabase tables, triggers, and RLS policies)
- [x] Set up Supabase Storage buckets and security policies
- [x] Connect client environment config with Supabase tokens







### Phase 5: Frontend Build & Integration

- [x] Initialize Expo project and configure strict typescript path aliases
- [x] Set up NativeWind and Tailwind CSS v4 styling rules
- [x] Create ThemeProvider and useTheme hooks
- [x] Set up Expo Router Bottom Tab navigation and onboarding stack
- [x] Write ADR-004 Navigation Pattern decision
- [x] Implement Zustand stores (authStore, settingsStore) and React Query client with offline caching
- [x] Create reusable base components (Button, Card, Input, Typography, SafeAreaWrapper, LoadingSpinner/SkeletonLoader)
- [x] Run TypeScript compilation checks and confirm build cleanliness

### Phase 6: Monetization & Payments

- [x] Write ADR-005: Billing and Monetization Strategy (Local Mock Billing + Web Stripe + Production RevenueCat Architecture)
- [x] Implement Mock Billing Service (`src/services/billing.ts`) linked to authStore
- [x] Implement onboarding Paywall Screen (`app/(auth)/paywall.tsx`)
- [x] Integrate subscription gating logic in the application
- [x] Set up mock rewarded ads with countdown timer in Rewards tab
- [x] Connect ad completion callback to Supabase `increment_ad_views` RPC
- [x] Code reward milestone unlocks and Karma Coins accruing logic
- [x] Write unit tests for mock billing and subscription state updates

---

## Key Decisions Made

| Decision | Phase | Rationale |
|----------|-------|-----------|
| 10-phase waterfall with feedback loops | 0 | Provides structure while allowing iteration |
| `subagent-driven-development` for code phases | 0 | Fresh context per task + two-stage review |
| `planning-with-files` for persistence | 0 | Survives context window resets |
| Approved Name: **Sadhana** | 1 | Traditional Sanskrit for "dedicated daily practice", reframes exercise |
| Branding Vibe: **Earth Premium** | 1 | Terracotta, Cream, Olive, and Charcoal. Grounding tactile warmth |
| Monetization: Freemium + Rewards | 1 | Interstitial ads for free users; Karma Coins/donations for premium |

---

## Blockers

*None currently.*

---

## Notes

- Phase 1 completed successfully and approved.
- Phase 2 (UX Research & IA) completed successfully and logged.
- Next: Transition to Phase 3: Design System & UI Generation (Google Stitch).

