import React from 'react';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { QueryProvider } from '@/providers/QueryProvider';
import { AuthProvider } from '@/providers/AuthProvider';
import { OfflineBanner } from '@/components/ui/OfflineBanner';
import { HeroBackground } from '@/components/ui/HeroBackground';
import { useTimeOfDayTheme } from '@/hooks/useTimeOfDayTheme';
import { View } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
// @ts-ignore
import '@/global.css';

function AppContent() {
  const timeOfDay = useTimeOfDayTheme();
  const today = new Date();
  const { motion } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: '#0D0A06' }}>
      <HeroBackground
        timeOfDay={timeOfDay}
        hours={today.getHours()}
        reduceMotion={false}
      />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'fade',
          animationDuration: motion.duration.slow, // Meditative transition speed (450ms)
          contentStyle: { backgroundColor: 'transparent' },
        }}
      >
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
      <OfflineBanner />
    </View>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <QueryProvider>
        <ThemeProvider>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </ThemeProvider>
      </QueryProvider>
    </SafeAreaProvider>
  );
}
