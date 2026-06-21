import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import * as SecureStore from 'expo-secure-store';

export interface User {
  id: string;
  email: string;
  name?: string;
  premium: boolean;
  onboardingCompleted: boolean;
}

export interface DailyCheckIn {
  date: string;
  energy: 'high' | 'low';
  state: 'tight' | 'clear';
  mind: 'restless' | 'steady';
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  onboardingAnswers: Record<string, any>;
  dailyCheckIn: DailyCheckIn | null;
}

export interface AuthActions {
  setSession: (user: User | null, token: string | null) => Promise<void>;
  setUserPremium: (premium: boolean) => void;
  setOnboardingCompleted: (completed: boolean) => void;
  updateOnboardingAnswers: (answers: Record<string, any>) => void;
  submitDailyCheckIn: (energy: 'high' | 'low', state: 'tight' | 'clear', mind: 'restless' | 'steady') => void;
  clearDailyCheckIn: () => void;
  clearSession: () => Promise<void>;
  initializeAuth: () => Promise<void>;
}

export type AuthStore = AuthState & AuthActions;

const AUTH_TOKEN_KEY = 'sadhana-auth-token';
const AUTH_USER_KEY = 'sadhana-auth-user';

export const useAuthStore = create<AuthStore>()(
  subscribeWithSelector((set, get) => ({
    user: null,
    token: null,
    isLoading: true,
    onboardingAnswers: {},
    dailyCheckIn: null,

    setSession: async (user, token) => {
      set({ user, token });
      try {
        if (token) {
          await SecureStore.setItemAsync(AUTH_TOKEN_KEY, token);
          await SecureStore.setItemAsync(AUTH_USER_KEY, JSON.stringify(user));
        } else {
          await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
          await SecureStore.deleteItemAsync(AUTH_USER_KEY);
        }
      } catch (e) {
        console.warn('Failed to persist auth session', e);
      }
    },

    setUserPremium: (premium) => {
      const user = get().user;
      if (user) {
        const updatedUser = { ...user, premium };
        set({ user: updatedUser });
        SecureStore.setItemAsync(AUTH_USER_KEY, JSON.stringify(updatedUser)).catch((e) =>
          console.warn('Failed to update persisted user', e)
        );
      }
    },

    setOnboardingCompleted: (completed) => {
      const user = get().user;
      if (user) {
        const updatedUser = { ...user, onboardingCompleted: completed };
        set({ user: updatedUser });
        SecureStore.setItemAsync(AUTH_USER_KEY, JSON.stringify(updatedUser)).catch((e) =>
          console.warn('Failed to update persisted user', e)
        );
      }
    },

    updateOnboardingAnswers: (answers) => {
      set((state) => ({
        onboardingAnswers: { ...state.onboardingAnswers, ...answers },
      }));
    },

    submitDailyCheckIn: (energy, state, mind) => {
      const today = new Date().toISOString().split('T')[0];
      set({
        dailyCheckIn: {
          date: today,
          energy,
          state,
          mind,
        },
      });
    },

    clearDailyCheckIn: () => {
      set({ dailyCheckIn: null });
    },

    clearSession: async () => {
      set({ user: null, token: null });
      try {
        await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
        await SecureStore.deleteItemAsync(AUTH_USER_KEY);
      } catch (e) {
        console.warn('Failed to clear auth session', e);
      }
    },

    initializeAuth: async () => {
      set({ isLoading: true });
      try {
        const token = await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
        const userStr = await SecureStore.getItemAsync(AUTH_USER_KEY);
        if (token && userStr) {
          const user = JSON.parse(userStr);
          set({ user, token });
        }
      } catch (e) {
        console.warn('Failed to initialize auth state', e);
      } finally {
        set({ isLoading: false });
      }
    },
  }))
);
