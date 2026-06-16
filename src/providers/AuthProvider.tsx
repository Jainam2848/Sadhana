import React, { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const segments = useSegments();
  const router = useRouter();

  // Run on mount to load persisted tokens
  useEffect(() => {
    initializeAuth();
  }, []);

  // Protect routes and handle navigation flow
  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!user && !inAuthGroup) {
      // Direct guest or unauthenticated user to welcome
      router.replace('/(auth)/welcome');
    } else if (user && inAuthGroup) {
      // Authenticated user belongs in tabs
      router.replace('/(tabs)/home');
    }
  }, [user, segments, isLoading]);

  return <>{children}</>;
}
