# ADR-001: Tech Stack Selection

## Status
Accepted

## Context
The **Sadhana** app requires a robust, scalable backend that can support a 3-week MVP timeline, maintain low operational costs at scale, offer seamless authentication, manage media storage (audio and video files), and handle relational data (e.g., user profiles, streaks, onboarding questionnaire responses, and rewards tracking). 

We compared three primary architectural patterns for the backend:
1. **Firebase (Google's NoSQL BaaS)**
2. **Custom Node.js + PostgreSQL API Server**
3. **Supabase (Open-Source SQL BaaS)**

### Decision Criteria
*   **Cost at Scale:** Running expenses as the user base grows from prototype (100 users) to production scale (100K+ users).
*   **Real-time Capabilities:** Syncing client state with minimal lag if real-time features are introduced.
*   **Authentication & Authorization:** Complexity of setting up email/password, social logins, and secure database-level permissions.
*   **Offline Support:** Native caching capability and robustness when handling offline downloads and local records.
*   **Developer Experience (DX) & Velocity:** Speed of schema updates, API generation, TypeScript typing integration, and client SDK usability within a 3-week target.

---

## Comparison of Alternatives

### 1. Firebase (NoSQL BaaS)
*   **Pros:**
    *   Best-in-class offline SDK persistence (`@react-native-firebase` integrates directly with iOS/Android offline stores).
    *   Out-of-the-box OAuth configuration and authentication.
    *   Generous free tier.
*   **Cons:**
    *   **NoSQL Limitations:** Hard to construct complex relational queries (e.g., matching user streaks, tracking rewards milestones based on monthly ad views, and generating personalized Sadhana plans using multi-criteria quiz answers).
    *   **Cost at Scale:** Firestore scales on read/write quantities. High-frequency queries (such as analytics, streak verification, or catalog browsers) can lead to runaway costs at 100K+ users.
    *   **Vendor Lock-in:** Proprietary API. Migrating away from Firebase requires a complete rewrite.

### 2. Custom Node.js (Express/NestJS) + PostgreSQL
*   **Pros:**
    *   Maximum flexibility and zero vendor lock-in.
    *   Complete control over middleware, custom business logic, and API protocols.
    *   Standard PostgreSQL relational capabilities for complex data models.
*   **Cons:**
    *   **Low Velocity:** Requires building user auth, rate limiting, connection pooling, media storage upload handlers, and API endpoints from scratch. Impossible to ship in a 3-week MVP window.
    *   **Operational Overhead:** Requires provisioning, securing, and maintaining servers, database hosting (e.g., AWS RDS), CI/CD pipelines, and scale monitoring.
    *   **Higher Initial Cost:** Server hosting lacks a zero-cost hobby tier comparable to BaaS platforms.

### 3. Supabase (Open-Source Postgres BaaS)
*   **Pros:**
    *   **True Relational Power:** Built on PostgreSQL. Supports joins, foreign keys, triggers, constraints, and views. Crucial for managing the Sadhana rewards system, streaks, and personalization plans.
    *   **Instant APIs:** Automatically reflects the database schema into a REST and GraphQL API, reducing backend development time to near zero.
    *   **Row-Level Security (RLS):** Allows defining fine-grained security policies directly on tables based on the user's JWT, protecting data at the engine layer.
    *   **Unified Services:** Built-in GoTrue authentication, S3-compatible Storage buckets with CDN caching, and Postgres-native database services in one ecosystem.
    *   **No Vendor Lock-in:** Open-source. The entire stack can be self-hosted on Docker/Kubernetes or migrated to a standard PostgreSQL cluster (e.g. Neon, AWS RDS) if needed.
    *   Generous free tier with predictable pricing models.
*   **Cons:**
    *   Offline syncing is not built into the client SDK by default (requires custom client-side caching using Zustand and React Query).
    *   Requires writing PostgreSQL triggers and row-level functions for complex server-side hooks instead of traditional Node.js middleware.

---

## Decision
We selected **Supabase** as the primary backend provider for the **Sadhana** mobile application. 

### Justification
Supabase provides the ideal balance of Postgres relational integrity, accelerated development speed, and modern security. Its auto-generated APIs allow us to focus entirely on the React Native frontend to meet the tight 3-week timeline, while its PostgreSQL core easily accommodates our relational query needs (streaks, ad milestone counters, coin wallets) without the high scaling costs associated with document-based NoSQL engines.

---

## Consequences
*   **Client Caching Architecture:** Since Supabase doesn't support automatic offline-first sync (unlike Firestore), the React Native frontend must handle offline state caching. We will implement Zustand with storage persistence for local state, and TanStack React Query for caching, offline mutation syncing, and background refetching.
*   **Database-Driven Logic:** Operations such as streak calculations on log submission and reward triggers on ad increments will be managed via PostgreSQL functions and triggers rather than custom Node.js middleware. This ensures data consistency and security.
*   **TypeScript Generation:** We will run `npx supabase gen types typescript` to generate schema types, ensuring end-to-end type safety between the database and the Expo client.
