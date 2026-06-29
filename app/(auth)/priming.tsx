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
import { Svg, Path } from 'react-native-svg';

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
        return 'after you wake up';
    }
  };

  const handleEnableReminders = async () => {
    // Request mock notification permissions and transition to registration vault
    setTimeout(() => {
      router.push('/(auth)/register');
    }, 500);
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
      <View className={`w-full max-w-md items-center text-center z-10 ${isSmallDevice ? 'gap-6' : 'gap-10'}`}>
        
        {/* Sunrise Line Art Illustration */}
        <View className="items-center justify-center py-4">
          <Svg width={120} height={120} viewBox="0 0 100 100" fill="none">
            {/* Sun rise arc */}
            <Path
              d="M 20,70 A 30,30 0 0,1 80,70"
              stroke="#C44B22"
              strokeWidth="2"
              strokeLinecap="round"
            />
            {/* Horizon line */}
            <Path
              d="M 10,70 L 90,70"
              stroke="#A69580"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray="4 4"
            />
            {/* Rays */}
            <Path d="M 50,25 L 50,15" stroke="#C44B22" strokeWidth="2" strokeLinecap="round" />
            <Path d="M 30,35 L 23,28" stroke="#C44B22" strokeWidth="2" strokeLinecap="round" />
            <Path d="M 70,35 L 77,28" stroke="#C44B22" strokeWidth="2" strokeLinecap="round" />
            <Path d="M 18,55 L 8,53" stroke="#C44B22" strokeWidth="2" strokeLinecap="round" />
            <Path d="M 82,55 L 92,53" stroke="#C44B22" strokeWidth="2" strokeLinecap="round" />
          </Svg>
        </View>

        {/* Text Details */}
        <View className="gap-3 px-4 items-center">
          {/* Authentic title + translation/explanation for clarity */}
          <Heading className="text-on-surface text-center">
            Dinacharya
          </Heading>
          <Text className="text-secondary-text text-sm font-sans font-medium text-center uppercase tracking-widest">
            Daily Rhythm & Ritual
          </Text>
          <Body className="text-secondary-text text-center leading-relaxed max-w-[320px] mt-2">
            We will send a single quiet invitation {getHabitAnchorText()} to anchor your practice. No metrics pressure, just a gentle path.
          </Body>
        </View>

        {/* Action Panel */}
        <View className="w-full gap-5 pt-2 items-center">
          <PressableAnimated
            className="w-full max-w-[280px] h-12 bg-accent-terracotta rounded-full items-center justify-center active:opacity-90"
            onPress={handleEnableReminders}
            haptic="medium"
            accessibilityLabel="Enable invitations and proceed"
          >
            <Text className="text-white font-sans font-bold text-sm">
              Receive Invitations
            </Text>
          </PressableAnimated>

          <PressableAnimated
            className="active:opacity-75"
            onPress={() => router.push('/(auth)/register')}
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
