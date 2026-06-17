import React from 'react';
import { View, Text, ScrollView } from '@/tw';
import { useTheme } from '@/hooks/useTheme';
import { useRouter } from 'expo-router';
import { useSettingsStore } from '@/stores/settingsStore';
import { Heading, Micro } from '@/components/ui/Typography';
import { MandalaThread } from '@/components/ui/MandalaThread';
import { ChevronLeft, Moon, Sun, Bell } from 'lucide-react-native';
import { Switch } from 'react-native';
import { Slider } from '@/components/ui/Compat';
import * as Haptics from 'expo-haptics';
import { PressableAnimated } from '@/components/ui/PressableAnimated';

export default function PreferencesScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  // Load configuration details from Zustand Settings store
  const {
    fontSizeScale,
    notificationsEnabled,
    reminderTime,
    themeMode,
    setFontSizeScale,
    setNotificationsEnabled,
    setThemeMode,
  } = useSettingsStore();

  const handleSliderChange = (value: number) => {
    // Round to 1 decimal place to prevent jitter
    const rounded = Math.round(value * 10) / 10;
    setFontSizeScale(rounded);
  };

  const handleSliderComplete = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleNotificationsToggle = (value: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setNotificationsEnabled(value);
  };

  const handleThemeToggle = () => {
    const nextTheme = themeMode === 'light' ? 'dark' : themeMode === 'dark' ? 'system' : 'light';
    setThemeMode(nextTheme);
  };

  const accentColorString = typeof colors.accent === 'string' ? colors.accent : '#C44B22';
  const borderColorString = typeof colors.border === 'string' ? colors.border : '#2a1f16';
  const growthColorString = typeof colors.growth === 'string' ? colors.growth : '#4CAF50';

  return (
    <View className="flex-1 bg-background relative">
      <MandalaThread />

      {/* Header bar */}
      <View className="pt-12 pb-3 px-6 z-40 bg-background/80 flex-row justify-between items-center border-b border-surface-border">
        <PressableAnimated
          className="w-10 h-10 -ml-2 items-center justify-center rounded-full active:bg-surface-border/20"
          onPress={() => router.back()}
          haptic="light"
          accessibilityLabel="Go back"
        >
          <ChevronLeft size={20} color={colors.primaryText} />
        </PressableAnimated>
        <Heading className="text-on-background text-center flex-1 font-serif">
          Preferences
        </Heading>
        <View className="w-10" />
      </View>

      <ScrollView className="flex-1 px-6 pt-6" contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Reading Size Accessibility Slider */}
        <View className="mb-6">
          <Micro className="text-secondary-text mb-3">Accessibility</Micro>
          <View className="bg-surface rounded-xl border border-surface-border p-5 gap-4">
            <View className="flex-row justify-between items-center">
              <Text className="font-sans font-medium text-sm text-secondary-text">Reading Size</Text>
              <Text className="font-sans font-bold text-xs text-accent-terracotta uppercase">
                {Math.round(fontSizeScale * 100)}%
              </Text>
            </View>

            {/* Range Slider */}
            <View className="flex-row items-center gap-4">
              <Text className="font-sans font-medium text-xs text-secondary-text" accessibilityElementsHidden={true} importantForAccessibility="no">A</Text>
              <Slider
                style={{ flex: 1, height: 40 }}
                minimumValue={0.8}
                maximumValue={1.6}
                value={fontSizeScale}
                onValueChange={handleSliderChange}
                onSlidingComplete={handleSliderComplete}
                minimumTrackTintColor={accentColorString}
                maximumTrackTintColor={borderColorString}
                thumbTintColor={accentColorString}
                accessibilityLabel="Adjust text reading size"
                accessibilityValue={{
                  now: Math.round(fontSizeScale * 100),
                  min: 80,
                  max: 160,
                  text: `${Math.round(fontSizeScale * 100)}%`
                }}
              />
              <Text className="font-sans font-medium text-lg text-secondary-text" accessibilityElementsHidden={true} importantForAccessibility="no">A</Text>
            </View>

            {/* Typography Live Preview Card */}
            <View className="p-4 bg-background border border-surface-border rounded-xl items-center justify-center">
              <Text
                className="font-serif text-primary-text text-center text-lg leading-relaxed"
                style={{ fontSize: Math.round(18 * fontSizeScale) }}
              >
                Start your morning with stillness
              </Text>
            </View>
          </View>
        </View>

        {/* Display Settings Section */}
        <View className="mb-6">
          <Micro className="text-secondary-text mb-3">Display</Micro>
          <View className="bg-surface rounded-xl border border-surface-border overflow-hidden">
            <PressableAnimated
              className="flex-row justify-between items-center p-4 active:bg-surface-border/10"
              onPress={handleThemeToggle}
              haptic="light"
              accessibilityLabel="Switch theme mode"
              accessibilityHint="Toggles between Light, Dark and System theme modes"
            >
              <View className="flex-row items-center gap-3">
                {themeMode === 'light' ? (
                  <Sun size={18} color={colors.secondaryText} />
                ) : (
                  <Moon size={18} color={colors.secondaryText} />
                )}
                <Text className="font-sans font-medium text-sm text-secondary-text">Theme Mode</Text>
              </View>
              <Text className="font-sans font-bold text-xs text-accent-terracotta uppercase">
                {themeMode}
              </Text>
            </PressableAnimated>
          </View>
        </View>

        {/* Notifications Section */}
        <View className="mb-8">
          <Micro className="text-secondary-text mb-3">Notifications</Micro>
          <View className="bg-surface rounded-xl border border-surface-border overflow-hidden">
            <View className="flex-row justify-between items-center p-4 border-b border-surface-border/50">
              <View className="flex-row items-center gap-3">
                <Bell size={18} color={colors.secondaryText} />
                <Text className="font-sans font-medium text-sm text-secondary-text">
                  Daily Reminders
                </Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={handleNotificationsToggle}
                trackColor={{ false: borderColorString, true: growthColorString }}
                thumbColor="#FFFFFF"
                accessibilityLabel="Toggle daily reminders"
              />
            </View>

            <View className="flex-row justify-between items-center p-4">
              <Text className="font-sans font-medium text-sm text-secondary-text">Reminder Time</Text>
              <Text className="font-sans font-bold text-sm text-primary-text">
                {reminderTime} AM
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
