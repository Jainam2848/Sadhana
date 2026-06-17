import React, { useState } from 'react';
import { router } from 'expo-router';
import { View, Text } from '@/tw';
import { useTheme } from '@/hooks/useTheme';
import { Heading, Body, Caption } from '@/components/ui/Typography';
import { Switch, StyleSheet } from 'react-native';
import { PressableAnimated } from '@/components/ui/PressableAnimated';

export default function GDPRScreen() {
  const { colors } = useTheme();
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);

  const handleAgreeAll = () => {
    // Save consent (both essential and performance analytics)
    router.push('/(auth)/priming');
  };

  const handleSaveOptions = () => {
    // Save only options currently toggled
    router.push('/(auth)/priming');
  };

  const borderColorString = typeof colors.border === 'string' ? colors.border : '#2a1f16';
  const growthColorString = typeof colors.growth === 'string' ? colors.growth : '#4CAF50';

  return (
    <View className="flex-1 bg-background relative justify-end">
      {/* Blurred Backdrop Mockup */}
      <View className="absolute inset-0 z-0 p-6 opacity-30 justify-start pt-16">
        <Heading className="text-primary-text mb-6">Sadhana</Heading>
        <View className="bg-surface border border-surface-border p-5 rounded-2xl mb-4 h-28" />
        <View className="bg-surface border border-surface-border p-5 rounded-2xl mb-4 h-36" />
      </View>

      {/* Dark overlay behind bottom sheet */}
      <View style={styles.darkOverlay} />

      {/* Bottom Sheet Container */}
      <View
        className="bg-background-bone rounded-t-[28px] px-6 pt-4 pb-12 border-t border-surface-border w-full max-w-md mx-auto z-10"
        style={styles.bottomSheet}
      >
        {/* Drag Handle */}
        <View className="w-12 h-1 bg-surface-border/40 rounded-full mx-auto mb-6" />

        {/* Title */}
        <Heading className="text-on-background mb-4">How we handle your data</Heading>

        {/* Content paragraphs */}
        <View className="mb-8 gap-4">
          <Body className="text-secondary-text text-sm leading-relaxed">
            We use session data to understand your practice patterns and build a personalized routine that adapts to your evolving needs.
          </Body>
          <Body className="text-secondary-text text-sm leading-relaxed">
            We never sell your data to third parties. Your personal reflections, progress, and rituals are kept secure and entirely private.
          </Body>
        </View>

        <View className="h-[1px] bg-surface-border/20 w-full mb-6" />

        {/* Consent Toggles */}
        <View className="gap-6 mb-8">
          {/* Essential toggle */}
          <View className="flex-row justify-between items-center">
            <View className="flex-1 pr-4">
              <Text className="font-sans font-bold text-sm text-primary-text">
                Essential (required)
              </Text>
              <Caption className="text-xs text-secondary-text mt-0.5">
                Core app functionality
              </Caption>
            </View>
            <Switch
              value={true}
              disabled={true}
              trackColor={{ false: borderColorString, true: growthColorString }}
              accessibilityLabel="Essential cookies (Required)"
            />
          </View>

          {/* Performance Analytics Toggle */}
          <View className="flex-row justify-between items-center">
            <View className="flex-1 pr-4">
              <Text className="font-sans font-bold text-sm text-primary-text">
                Performance analytics
              </Text>
              <Caption className="text-xs text-secondary-text mt-0.5">
                Help us improve Sadhana
              </Caption>
            </View>
            <Switch
              value={analyticsEnabled}
              onValueChange={setAnalyticsEnabled}
              trackColor={{ false: borderColorString, true: growthColorString }}
              thumbColor="#FFFFFF"
              accessibilityLabel="Performance Analytics Consent Toggle"
            />
          </View>
        </View>

        {/* Actions Button Bar */}
        <View className="gap-3 mt-auto">
          <PressableAnimated
            className="w-full bg-accent-terracotta py-4 rounded-full items-center active:opacity-90"
            onPress={handleAgreeAll}
            haptic="medium"
            accessibilityLabel="Agree to all GDPR consents"
          >
            <Text className="text-white font-sans font-bold text-sm">
              Agree to All
            </Text>
          </PressableAnimated>

          <PressableAnimated
            className="w-full py-2 items-center active:opacity-70"
            onPress={handleSaveOptions}
            haptic="light"
            accessibilityLabel="Save current selected GDPR preferences"
          >
            <Text className="text-secondary-text font-sans font-medium text-sm underline underline-offset-4 decoration-surface-border">
              Save current preferences
            </Text>
          </PressableAnimated>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  darkOverlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(28, 20, 9, 0.4)',
    zIndex: 5,
  },
  bottomSheet: {
    shadowColor: '#1C1409',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
  },
});
