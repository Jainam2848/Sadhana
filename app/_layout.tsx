import React from 'react';
import { Stack } from 'expo-router';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { QueryProvider } from '@/providers/QueryProvider';
import { AuthProvider } from '@/providers/AuthProvider';
import { OfflineBanner } from '@/components/ui/OfflineBanner';
// @ts-ignore
import '@/global.css';

export default function RootLayout() {
  return (
    <QueryProvider>
      <ThemeProvider>
        <AuthProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
          </Stack>
          <OfflineBanner />
        </AuthProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}
