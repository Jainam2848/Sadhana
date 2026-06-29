import React, { useEffect } from 'react';
import { useRouter, useSegments, useRootNavigationState } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const onboardingAnswers = useAuthStore((state) => state.onboardingAnswers);
  const segments = useSegments() as string[];
  const router = useRouter();
  const rootNavigationState = useRootNavigationState();

  // Run on mount to load persisted tokens
  useEffect(() => {
    initializeAuth();
  }, []);

  // Protect routes and handle navigation flow
  useEffect(() => {
    const isNavigationReady = rootNavigationState?.key != null;
    if (isLoading || !isNavigationReady) return;

    const inAuthGroup = segments[0] === '(auth)';
    const onPaywallScreen = segments[1] === 'paywall';
    const hasOnboardingData = Object.keys(onboardingAnswers).length > 0;

    if (!user && !inAuthGroup) {
      // Direct guest or unauthenticated user to welcome
      router.replace('/(auth)/welcome');
    } else if (user && inAuthGroup) {
      if (hasOnboardingData && !onPaywallScreen) {
        // Redirect to paywall after onboarding registration
        router.replace('/(auth)/paywall');
      } else if (!onPaywallScreen) {
        // Authenticated user belongs in tabs
        router.replace('/(tabs)/home');
      }
    }
  }, [user, segments, isLoading, rootNavigationState, onboardingAnswers]);

  return <>{children}</>;
}

