# Skill Quick-Reference — When to Use What

> **Skill Used:** `documentation-templates` — Cheatsheet format.
> **Purpose:** Fast lookup table so agents invoke the right skill at the right time.
> **Rule:** Always read the skill's SKILL.md before first use. This table is a quick-ref, not a replacement.

---

## Orchestration Skills (Use in Every Phase)

| Skill | One-Liner | Trigger |
|-------|-----------|---------|
| `planning-with-files` | Persistent working memory on disk | Starting any session or complex task |
| `writing-plans` | Bite-sized TDD task breakdowns | Before starting any code phase |
| `executing-plans` | Batch execution with human checkpoints | When running a plan in a parallel session |
| `subagent-driven-development` | Fresh subagent per task + 2-stage review | When tasks are independent (Phase 4, 5, 6) |
| `concise-planning` | Quick atomic checklists | Small tasks that don't need full plans |
| `wiki-architect` | Documentation catalogue generation | Phase 0, Phase 9, any doc restructuring |
| `documentation-templates` | Standard formats: ADR, README, changelog, llms.txt | Creating any standardized document |
| `ask-questions-if-underspecified` | Clarify before committing | Whenever requirements are ambiguous |
| `systematic-debugging` | Structured bug investigation | When encountering ANY bug or test failure |
| `debugger` | Debugging specialist | When stuck on unexpected behavior |

---

## Phase 1: Discovery & Product Strategy

| Skill | One-Liner | Trigger |
|-------|-----------|---------|
| `product-manager-toolkit` | PRD, MoSCoW, market analysis | Writing the Product Requirements doc |
| `deep-research` | Autonomous multi-step research | Competitive analysis, market research |
| `content-creator` | Brand voice, naming, taglines | App naming and brand identity |

---

## Phase 2: UX Research & Information Architecture

| Skill | One-Liner | Trigger |
|-------|-----------|---------|
| `mobile-design` | Mobile-first, touch-first principles | Any mobile UX decision |
| `hig-foundations` | Apple HIG design foundations | iOS design rules |
| `hig-patterns` | Apple HIG interaction patterns | iOS interaction patterns |
| `hig-platforms` | Platform-specific considerations | iOS vs Android differences |
| `hig-components-layout` | Layout and navigation components | Navigation structure design |
| `onboarding-psychologist` | Conversion-optimized onboarding | Onboarding flow design |
| `onboarding-cro` | Onboarding conversion optimization | Onboarding metrics and A/B tests |
| `ui-ux-pro-max` | Premium UX flow design | User flow mapping |
| `jobs-to-be-done-analyst` | Deep user motivation analysis | User persona creation |
| `customer-psychographic-profiler` | Psychographic profiling | Understanding target audience deeply |

---

## Phase 3: Design System & UI Generation

| Skill | One-Liner | Trigger |
|-------|-----------|---------|
| `design-md` | Semantic design system → DESIGN.md | Creating the design system document |
| `stitch-loop` | Autonomous Stitch generation loop | Generating UI screens iteratively |
| `stitch-ui-design` | Stitch-specific design patterns | Configuring Stitch for screen gen |
| `frontend-design` | Premium visual design (not layouts) | Visual design decisions |
| `design-spells` | Micro-interactions and magic details | Adding premium feel |
| `iconsax-library` | Premium icon selection | Choosing icons for UI |
| `magic-ui-generator` | Multiple component variations | Comparing design options |
| `unsplash-integration` | High-quality free photography | Placeholder and marketing images |

---

## Phase 4: Architecture & Backend

| Skill | One-Liner | Trigger |
|-------|-----------|---------|
| `backend-architect` | Scalable API and service design | Architecture decisions |
| `database-design` | Schema, indexing, ORM selection | Database design |
| `database-architect` | Cloud DB architecture, reliability | Database scaling decisions |
| `api-patterns` | REST/GraphQL, pagination, versioning | API design |
| `auth-implementation-patterns` | Secure auth flows | Implementing authentication |
| `secrets-management` | Secure env var handling | Managing API keys and secrets |
| `tdd-workflow` | Red-green-refactor | Writing backend tests |

---

## Phase 5: Frontend Build & Integration

| Skill | One-Liner | Trigger |
|-------|-----------|---------|
| `react-native-architecture` | RN best practices and patterns | Project setup, architecture |
| `expo-tailwind-setup` | Tailwind + NativeWind in Expo | Styling setup |
| `react-patterns` | Modern React hooks and composition | Component design |
| `zustand-store-ts` | Type-safe Zustand stores | State management setup |
| `react-component-performance` | Diagnose and fix slow components | Performance issues |

---

## Phase 6: Monetization & Payments

| Skill | One-Liner | Trigger |
|-------|-----------|---------|
| `stripe-integration` | Stripe payment integration | Payment setup (uses MCP Server) |
| `paywall-upgrade-cro` | Conversion-optimized paywalls | Paywall design |
| `price-psychology-strategist` | Pricing presentation psychology | Price point decisions |
| `popup-cro` | Upgrade modal optimization | Paywall/upgrade modals |
| `loss-aversion-designer` | Loss aversion in messaging | Paywall copy |
| `scarcity-urgency-psychologist` | Urgency and scarcity tactics | Trial expiration, limited offers |

---

## Phase 7: UX Polish & Micro-Interactions

| Skill | One-Liner | Trigger |
|-------|-----------|---------|
| `design-spells` | Curated micro-interactions | Adding premium polish |
| `animejs-animation` | Complex, performant animations | Screen transitions, effects |
| `ux-feedback` | Loading, empty, error states | State management UI |
| `ux-copy` | Microcopy for buttons, toasts, errors | UI copy review |
| `screen-reader-testing` | Accessibility with screen readers | Accessibility audit |
| `wcag-audit-patterns` | WCAG 2.2 AA compliance | Accessibility verification |

---

## Phase 8: Testing & QA

| Skill | One-Liner | Trigger |
|-------|-----------|---------|
| `tdd-workflow` | Red-green-refactor discipline | All test writing |
| `test-driven-development` | TDD methodology | Writing tests first |
| `e2e-testing` | End-to-end test patterns | E2E test creation |
| `vibe-code-auditor` | Audit AI-generated code quality | Code quality gate |
| `security-scanning-security-dependencies` | Dependency vulnerability scan | Security audit |

---

## Phase 9: Deployment & Launch

| Skill | One-Liner | Trigger |
|-------|-----------|---------|
| `app-store-optimization` | ASO keywords and metadata | App store listing |
| `expo-deployment` | Expo build and submit | Build and deploy |
| `expo-dev-client` | TestFlight distribution | iOS testing builds |
| `app-store-changelog` | Release notes from git history | Changelog generation |

---

## Phase 10: Post-Launch & Iteration

| Skill | One-Liner | Trigger |
|-------|-----------|---------|
| `analytics-tracking` | Reliable analytics systems | Event tracking setup |
| `ab-test-setup` | Structured A/B testing | Experiment setup |

---

## Cross-Cutting Skills (Use When Relevant)

| Skill | One-Liner | Trigger |
|-------|-----------|---------|
| `gdpr-data-handling` | GDPR compliance | Handling EU user data |
| `performance-profiling` | Bundle size, startup, memory | Performance optimization |
| `code-reviewer` | Elite code review | Code quality checks |
| `requesting-code-review` | Code review template | Before merging |
| `simplify-code` | Review diffs for safe simplifications | After complex implementations |

---

## Decision Tree: Which Execution Skill?

```
Have an implementation plan?
├── YES → Are tasks mostly independent?
│   ├── YES → Stay in this session?
│   │   ├── YES → Use `subagent-driven-development`
│   │   └── NO  → Use `executing-plans`
│   └── NO (tightly coupled) → Execute manually or use `concise-planning`
└── NO → Use `writing-plans` to create one first
```
