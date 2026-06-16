import React from 'react';
import { router } from 'expo-router';
import { View, Text, Pressable } from '@/tw';
import { useAuthStore } from '@/stores/authStore';
import { useTheme } from '@/hooks/useTheme';
import { Heading, Body, Caption, Micro } from '@/components/ui/Typography';
import { MandalaThread } from '@/components/ui/MandalaThread';
import * as Haptics from 'expo-haptics';

export default function PrimingScreen() {
  const { colors } = useTheme();
  const onboardingAnswers = useAuthStore((state) => state.onboardingAnswers);

  const getHabitAnchorText = () => {
    const schedule = onboardingAnswers.schedule || 'morning';
    switch (schedule) {
      case 'afternoon':
        return 'before your lunch break';
      case 'evening':
        return 'before you go to sleep';
      case 'morning':
      default:
        return 'after your morning coffee';
    }
  };

  const handleEnableReminders = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Request mock notification permissions and then transition to paywall
    setTimeout(() => {
      router.push('/(auth)/paywall');
    }, 500);
  };

  // Generate boxes for a 5x7 grid (35 days total)
  const renderCalendarGrid = () => {
    const grid = [];
    const todayIndex = 18; // Day 19 (0-indexed) represents today
    for (let i = 0; i < 35; i++) {
      if (i < todayIndex) {
        // Past completed days
        grid.push(
          <View
            key={i}
            className="w-4 h-4 m-0.5 bg-warm-highlight border border-accent-terracotta/40 rounded-sm"
          />
        );
      } else if (i === todayIndex) {
        // Today (with streak flame icon)
        grid.push(
          <View
            key={i}
            className="w-4 h-4 m-0.5 bg-surface border border-accent-terracotta rounded-sm items-center justify-center"
          >
            <Text className="text-[10px] leading-none">🔥</Text>
          </View>
        );
      } else {
        // Future days
        grid.push(
          <View
            key={i}
            className="w-4 h-4 m-0.5 bg-surface border border-surface-border rounded-sm"
          />
        );
      }
    }
    return grid;
  };

  return (
    <View className="flex-1 bg-background relative px-6 py-12 justify-center items-center">
      <MandalaThread />

      {/* Main Content Canvas */}
      <View className="w-full max-w-md items-center text-center gap-12 z-10">
        
        {/* Center Grid Graphic */}
        <View className="items-center">
          <View className="w-44 flex-row flex-wrap justify-center p-2 border border-surface-border/40 rounded-xl bg-surface/50">
            {renderCalendarGrid()}
          </View>
        </View>

        {/* Text Details */}
        <View className="gap-4 px-4 items-center">
          <Heading className="text-on-surface text-center">
            Build Your Daily Ritual
          </Heading>
          <Body className="text-secondary-text text-center leading-relaxed max-w-[320px]">
            We'll send a single quiet reminder <Text className="font-bold text-accent-terracotta">{getHabitAnchorText()}</Text> to help you anchor your Sadhana. No spam, ever.
          </Body>
        </View>

        {/* Action Panel */}
        <View className="w-full gap-6 pt-4 items-center">
          <Pressable
            className="w-full max-w-[280px] h-12 bg-accent-terracotta rounded-full items-center justify-center active:opacity-90"
            onPress={handleEnableReminders}
          >
            <Text className="text-white font-sans font-bold text-sm">
              Enable reminders
            </Text>
          </Pressable>

          <Pressable
            className="active:opacity-75"
            onPress={() => router.push('/(auth)/paywall')}
          >
            <Text className="text-secondary-text font-sans font-medium text-sm underline underline-offset-4 decoration-surface-border">
              Skip for now
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
