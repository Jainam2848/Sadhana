import React from 'react';
import { router } from 'expo-router';
import { View, Text } from '@/tw';
import { useAuthStore } from '@/stores/authStore';
import { useTheme } from '@/hooks/useTheme';
import { Heading, Body } from '@/components/ui/Typography';
import { MandalaThread } from '@/components/ui/MandalaThread';
import { PressableAnimated } from '@/components/ui/PressableAnimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useWindowDimensions } from 'react-native';

export default function PrimingScreen() {
  const { colors } = useTheme();
  const onboardingAnswers = useAuthStore((state) => state.onboardingAnswers);
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const isSmallDevice = height < 750;

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
    // Request mock notification permissions and then transition to paywall
    setTimeout(() => {
      router.push('/(auth)/paywall');
    }, 500);
  };

  // Generate boxes for a 5x7 grid (35 days total)
  const renderCalendarGrid = () => {
    const grid = [];
    const todayIndex = 18; // Day 19 (0-indexed) represents today
    const boxSizeClass = isSmallDevice ? 'w-3.5 h-3.5 m-0.5' : 'w-4 h-4 m-0.5';
    
    for (let i = 0; i < 35; i++) {
      if (i < todayIndex) {
        // Past completed days
        grid.push(
          <View
            key={i}
            className={`${boxSizeClass} bg-warm-highlight border border-accent-terracotta/40 rounded-sm`}
          />
        );
      } else if (i === todayIndex) {
        // Today (with streak flame icon)
        grid.push(
          <View
            key={i}
            className={`${boxSizeClass} bg-surface border border-accent-terracotta rounded-sm items-center justify-center`}
          >
            <Text className={`leading-none ${isSmallDevice ? 'text-[8px]' : 'text-[10px]'}`}>🔥</Text>
          </View>
        );
      } else {
        // Future days
        grid.push(
          <View
            key={i}
            className={`${boxSizeClass} bg-surface border border-surface-border rounded-sm`}
          />
        );
      }
    }
    return grid;
  };

  return (
    <View
      style={{
        paddingTop: Math.max(insets.top, 24),
        paddingBottom: Math.max(insets.bottom, 24),
      }}
      className="flex-1 bg-background relative px-6 justify-center items-center"
    >
      <MandalaThread />

      {/* Main Content Canvas */}
      <View className={`w-full max-w-md items-center text-center z-10 ${isSmallDevice ? 'gap-6' : 'gap-12'}`}>
        
        {/* Center Grid Graphic */}
        <View className="items-center">
          <View
            className={`flex-row flex-wrap justify-center border border-surface-border/40 rounded-xl bg-surface/50 ${
              isSmallDevice ? 'w-36 p-1.5' : 'w-44 p-2'
            }`}
            accessibilityLabel="Mock practice log showing streak building"
          >
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
        <View className="w-full gap-6 pt-2 items-center">
          <PressableAnimated
            className="w-full max-w-[280px] h-12 bg-accent-terracotta rounded-full items-center justify-center active:opacity-90"
            onPress={handleEnableReminders}
            haptic="medium"
            accessibilityLabel="Enable reminders and proceed"
          >
            <Text className="text-white font-sans font-bold text-sm">
              Enable reminders
            </Text>
          </PressableAnimated>

          <PressableAnimated
            className="active:opacity-75"
            onPress={() => router.push('/(auth)/paywall')}
            haptic="light"
            accessibilityLabel="Skip reminders setup for now"
          >
            <Text className="text-secondary-text font-sans font-medium text-sm underline underline-offset-4 decoration-surface-border">
              Skip for now
            </Text>
          </PressableAnimated>
        </View>
      </View>
    </View>
  );
}
