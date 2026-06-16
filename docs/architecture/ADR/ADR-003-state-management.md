# ADR-003: State Management

## Status
Accepted

## Context
The **Sadhana** mobile application needs to manage three kinds of state:
1.  **Client UI State:** Modals, visual toggles, transient onboarding answers, active player configurations (scrubbing position, Sanskrit tooltips).
2.  **Server Cache State:** User profiles, streak counts, routines library lists, customized daily plans, and coin transaction logs fetched from Supabase.
3.  **Persisted Offline State:** Settings preferences (accessibility font size), offline media download registers, and cached daily streaks that need to work without internet connectivity.

We need a lightweight, high-performance state architecture that integrates cleanly with React Native/Expo, has minimal bundle size impact, and provides robust caching and offline support.

### Decision Criteria
*   **Bundle Size:** Crucial for mobile performance, download speed, and memory foot-print.
*   **Developer Experience (DX):** Complexity of writing, reading, and debugging state actions.
*   **Separation of Concerns:** Distinct handling of client-only UI state versus backend API cache.
*   **Offline/Cache Support:** Ability to persist state across sessions and handle offline mutations gracefully.

---

## Comparison of Alternatives

### 1. Redux Toolkit (RTK) + RTK Query
*   **Pros:** Extremely mature, strong debugging tools (Redux DevTools), rigid structure suitable for very large teams.
*   **Cons:** High boilerplate (actions, reducers, store configuration, selector files). Heavy bundle size. Overkill for the Sadhana MVP.

### 2. Jotai (Atomic State)
*   **Pros:** Minimalist API, atomic updates (re-renders only changed components), great for highly granular UI updates.
*   **Cons:** Harder to model complex relational domain states (e.g. tracking multiple variables in an active workout session). Less native tooling for caching remote API requests compared to React Query.

### 3. Zustand (Client UI) + TanStack React Query (Server Cache)
*   **Pros:**
    *   **Zustand:** Microscopic bundle size (~2KB), zero-boilerplate, hook-based, direct hook integration. Features built-in persist middleware to automatically sync UI selections (like font sizing or notification preferences) to `AsyncStorage` with one line of code.
    *   **React Query:** Best-in-class server-state caching. Handles fetching, stale-while-revalidate, automatic retry on connection loss, and background updates natively. Built-in query key management avoids redundant API requests.
*   **Cons:** Separate libraries mean managing two state concepts (client vs. server), but this aligns with modern architectural separation of concerns.

---

## Decision
We decided on **Zustand (client-state)** and **TanStack React Query (server-state)** as the state management architecture.

### Implementation Details

#### 1. Server-State Caching (React Query)
*   **Data Fetching:** React Query handles all remote calls to Supabase.
*   **Stale Time Config:** We configure a global `staleTime` of 5 minutes for general resources (e.g., routines library) and 0 seconds for real-time critical resources (like streaks, ad counts, and wallets) to ensure data is always fresh when entering screens.
*   **Offline Support:** React Query is configured with `persistQueryClient` using an AsyncStorage adapter. This caches API responses locally, allowing immediate layout renders (such as loading the dashboard from cache when the app is launched in an offline state).

```typescript
// Proposed query client layout
import { QueryClient } from '@tanstack/react-query';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // Keep in garbage collection cache for 24 hours
      staleTime: 1000 * 60 * 5,    // Data is stale after 5 minutes
      networkMode: 'offlineFirst', // Serve from cache first if offline
    },
  },
});

export const persister = createAsyncStoragePersister({
  storage: AsyncStorage,
  key: 'SADHANA_OFFLINE_CACHE',
});
```

#### 2. Client UI & Local Persistence (Zustand)
*   **Settings & Preferences Store:** Manages user configuration (font size scale, dark mode toggle, notification time). Persisted to disk via Zustand's `persist` middleware.
*   **Active Player Store:** Tracks state of the active Asana/Pranayama/Dhyana player. Not persisted (resets if app is closed).
*   **Onboarding Store:** Tracks user answers during the questionnaire before account registration.

```typescript
// Proposed store layout
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface PreferenceState {
  fontSizeScale: number;
  notificationsEnabled: boolean;
  reminderTime: string;
  setFontSizeScale: (scale: number) => void;
}

export const usePreferenceStore = create<PreferenceState>()(
  persist(
    (set) => ({
      fontSizeScale: 1.0,
      notificationsEnabled: false,
      reminderTime: '07:00',
      setFontSizeScale: (scale) => set({ fontSizeScale: scale }),
    }),
    {
      name: 'sadhana-user-preferences',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
```

---

## Consequences
*   **Separate State Rules:** Developers must not duplicate server data in Zustand stores. If it comes from the API (Supabase), it belongs in a React Query `useQuery` hook. Zustand stores are reserved purely for local, client-only configurations and UI states.
*   **Cache Invalidation:** Actions that modify server data (such as completing a routine or viewing an ad) must call React Query's `queryClient.invalidateQueries` to force a refetch and update UI counters (like streak flame or coin wallets) automatically.
