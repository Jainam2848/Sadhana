# ADR-005: Billing and Monetization Strategy

## Status
Accepted

## Context
Sadhana implements a freemium subscription model (Monthly at $5.99/mo; Annual at $49.00/yr with a 7-day trial) and an ad-supported points reward system.

Apple App Store Guideline 3.1.1 and Google Play Store Billing policies mandate that all digital content consumed within mobile apps (including premium yoga classes, meditations, and custom routine plans) must be purchased via native In-App Purchases (IAP). 

However, integrating and testing native IAPs with the RevenueCat React Native SDK requires:
1. Active Apple Developer Account ($99/year) and Google Play Developer Console ($25 one-time fee).
2. Registering in-app products in App Store Connect and Google Play Console.
3. Setting up store certificates and JSON service keys.

To keep local development and staging testing costs at $0, and to avoid developer account blockers during the build phase, we require a clean mechanism to simulate payments, paywalls, and content gating.

## Decision
We will implement a local **Mock Billing Service** (`src/services/billing.ts`) for development and staging environments.

1. **Local Mock Service:**
   - Define clear billing signatures: `purchasePlan(planId)`, `restorePurchases()`, and `getActiveEntitlements()`.
   - The mock service will simulate network latency (using delays) and dynamically toggle the user's `premium` subscription state in the Zustand `authStore`.
   - All gated screens and premium features will read this state to enforce access checks.
2. **Production RevenueCat Integration:**
   - The `@revenuecat/purchases-react-native` SDK will be integrated during the final production release and store submission phase.
   - The SDK calls will replace the mock functions directly inside `src/services/billing.ts` as a drop-in replacement, avoiding any modification to screens or store files.
3. **Stripe Billing Scope:**
   - Stripe will be restricted solely to optional web-checkout subscriptions or future physical wellness merchandise.
   - Any web entitlements purchased via Stripe will sync to the Supabase backend and update the user's profile database row, which will be read by the client.

## Consequences
- **Cost Savings:** Local/staging environments are 100% free ($0) to run, test, and verify.
- **Independence:** Developers do not need sandbox credentials or developer accounts to verify paywall transitions.
- **Architectural Isolation:** All payment logic remains fully isolated in `src/services/billing.ts`, facilitating a simple, low-risk swap to the production RevenueCat SDK later.
- **Offline Reliability:** Mock billing operates locally on the device, allowing offline premium testing without requiring network connectivity.
