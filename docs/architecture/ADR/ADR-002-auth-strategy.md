# ADR-002: Auth Strategy

## Status
Accepted

## Context
The **Sadhana** mobile application requires a secure, frictionless, and scalable authentication model. User registration is soft-gated: users can explore the app and access free tier content as anonymous guests, but account creation is required to start a subscription trial, make a purchase, sync progress, or earn premium rewards. 

We need to select the login methods and establish session persistence, token refresh policies, and secure storage mechanisms for the mobile client.

### Decision Criteria
*   **User Friction:** Ease of login for professionals and seniors (target >70% onboarding completion).
*   **Mobile Suitability:** Reliability of the auth flow on iOS/Android (network drops, deep linking).
*   **App Store Compliance:** Adherence to Apple/Google guidelines (e.g., Apple Sign-In requirement).
*   **Implementation Complexity:** Integration effort with Supabase GoTrue Auth.
*   **Security:** Safeguarding tokens from interception or device compromises.

---

## Comparison of Auth Methods

### 1. Email & Password
*   **Pros:** Standard, universal fallback, does not rely on third-party accounts.
*   **Cons:** High friction (users must type email, create and remember password).

### 2. Social OAuth (Apple & Google Sign-In)
*   **Pros:**
    *   Frictionless 1-tap onboarding using native biometric or account flows.
    *   Eliminates passwords completely.
    *   Google OAuth caters to Android (Michael/Elena) and Apple Sign-In caters to iOS (Sarah).
*   **Cons:**
    *   Requires configuring developer credentials and handling native redirect URIs.
    *   Apple mandates implementing Apple Sign-In if any other third-party social provider is used.

### 3. Magic Links (Email OTP)
*   **Pros:** Passwordless, relatively secure.
*   **Cons:** Extremely high friction on mobile. Users must leave the app, open their email client, tap a link, and rely on mobile OS deep-linking to route back to the app, which frequently fails due to browser settings or network issues.

### 4. Phone OTP (SMS Verification)
*   **Pros:** High conversion, fast passwordless access.
*   **Cons:** Significant ongoing cost due to SMS gateway fees (especially for international users in the US, Canada, and EU). Susceptible to SIM-swapping and SMS delivery delays.

---

## Decision
We decided on a hybrid authentication strategy consisting of **Email & Password + Native Social OAuth (Google & Apple Sign-In)**, powered by **Supabase GoTrue Auth**.

### Implementation Details

#### 1. Registration & Login Flow
*   **Guest Access:** Initial login is deferred. Guest users are assigned a local anonymous state.
*   **Upgrade Trigger:** When upgrading or attempting to claim premium rewards, users must register via Apple Sign-In, Google Sign-In, or Email/Password.
*   **Account Association:** Supabase automatically links accounts sharing the same verified email address.

#### 2. Session Management & Tokens
*   **Stateless JWTs:** Upon authentication, Supabase issues a standard JWT payload:
    *   `access_token`: Short-lived (1 hour expiry) token containing user ID, metadata, and role claims. Automatically sent in the `Authorization: Bearer` header on API requests.
    *   `refresh_token`: Long-lived, single-use token used to obtain a new access token when expired.
*   **Token Refresh:** The Expo application client listens to token expiration and performs silent background refreshes. If a refresh fails (e.g., due to token revocation or deletion), the user session is cleared, and they are routed back to the onboarding stack.

#### 3. Secure Storage on Device
*   Mobile applications do not have standard browser Cookie stores, and `AsyncStorage` is unencrypted and vulnerable on rooted/jailbroken devices.
*   We will store the session credentials (`access_token`, `refresh_token`, and user metadata) using **`expo-secure-store`**.
    *   **iOS:** Uses keychain services (encrypted and isolated per app).
    *   **Android:** Uses Keystore system (encrypted on disk using hardware-backed keys when available).

---

## Consequences
*   **Apple Developer Account Requirement:** Requires configuring active Apple Developer credentials to enable Apple Sign-In in production builds.
*   **Deep Link Configuration:** Must set up native deep link routing schemas (`sadhana://` and universal links) to handle OAuth redirect callbacks from external Google/Apple browsers back into the Expo app.
*   **GDPR Alignment:** This auth strategy aligns with GDPR data safety since users can request deletion inside settings. A PostgreSQL trigger will handle cascading deletion: deleting the profile in the public schema triggers deletion of the auth user in the Supabase `auth.users` system table.
