import React from 'react';
import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="welcome" />
      <Stack.Screen name="personalize" />
      <Stack.Screen name="breathing-space" />
      <Stack.Screen name="gdpr" />
      <Stack.Screen name="priming" />
      <Stack.Screen name="paywall" />
      <Stack.Screen name="register" />
    </Stack>
  );
}
