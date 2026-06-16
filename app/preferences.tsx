import React from 'react';
import { View, Text, Pressable, ScrollView } from '@/tw';
import { useTheme } from '@/hooks/useTheme';
import { useRouter } from 'expo-router';
import { useSettingsStore } from '@/stores/settingsStore';
import { Heading, Subheading, Body, Caption, Micro } from '@/components/ui/Typography';
import { MandalaThread } from '@/components/ui/MandalaThread';
import { ChevronLeft, Sliders, Moon, Sun, Bell, Volume2 } from 'lucide-react-native';
import { Switch, StyleSheet } from 'react-native';
import { Slider } from '@/components/ui/Compat';
import * as Haptics from 'expo-haptics';

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
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const nextTheme = themeMode === 'light' ? 'dark' : themeMode === 'dark' ? 'system' : 'light';
    setThemeMode(nextTheme);
  };

  return (
    <View className="flex-1 bg-background relative">
      <MandalaThread />

      {/* Header bar */}
      <View className="pt-12 pb-3 px-6 z-40 bg-background/80 flex-row justify-between items-center border-b border-surface-border">
        <Pressable
          className="w-10 h-10 -ml-2 items-center justify-center rounded-full active:bg-surface-border/20"
          onPress={() => router.back()}
        >
          <ChevronLeft size={20} color={colors.primaryText} />
        </Pressable>
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
              <Text className="font-sans font-medium text-xs text-secondary-text">A</Text>
              <Slider
                style={{ flex: 1, height: 40 }}
                minimumValue={0.8}
                maximumValue={1.6}
                value={fontSizeScale}
                onValueChange={handleSliderChange}
                onSlidingComplete={handleSliderComplete}
                minimumTrackTintColor={colors.accent}
                maximumTrackTintColor={colors.border}
                thumbTintColor={colors.accent}
              />
              <Text className="font-sans font-medium text-lg text-secondary-text">A</Text>
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
            <Pressable
              className="flex-row justify-between items-center p-4 active:bg-surface-border/10"
              onPress={handleThemeToggle}
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
            </Pressable>
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
                trackColor={{ false: colors.border, true: colors.growth }}
                thumbColor="#FFFFFF"
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
