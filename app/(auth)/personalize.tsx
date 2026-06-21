import React, { useState, useRef } from 'react';
import { router } from 'expo-router';
import { View, Text, ScrollView } from '@/tw';
import { useAuthStore } from '@/stores/authStore';
import { useTheme } from '@/hooks/useTheme';
import { ArrowLeft, Check, Sun, Sunset, Moon, AlarmClock } from 'lucide-react-native';
import { Heading, Subheading, Body } from '@/components/ui/Typography';
import { MandalaThread } from '@/components/ui/MandalaThread';
import { PressableAnimated } from '@/components/ui/PressableAnimated';
import Animated, { FadeInDown, useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useWindowDimensions } from 'react-native';

// Animated Checkbox Component with spring feedback
function AnimatedCheckbox({ isSelected }: { isSelected: boolean }) {
  const scale = useSharedValue(isSelected ? 1 : 0);
  const opacity = useSharedValue(isSelected ? 1 : 0);

  React.useEffect(() => {
    scale.value = withSpring(isSelected ? 1 : 0, { damping: 15 });
    opacity.value = withTiming(isSelected ? 1 : 0, { duration: 150 });
  }, [isSelected]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <View
      className={`w-6 h-6 rounded-full border items-center justify-center ${
        isSelected
          ? 'bg-accent-terracotta border-accent-terracotta'
          : 'border-secondary-text'
      }`}
    >
      <Animated.View style={animatedStyle}>
        <Check size={14} color="#FFF" />
      </Animated.View>
    </View>
  );
}

export default function PersonalizeScreen() {
  const { colors } = useTheme();
  const updateAnswers = useAuthStore((state) => state.updateOnboardingAnswers);
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const isSmallDevice = height < 750;

  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [selectedExperience, setSelectedExperience] = useState<string | null>(null);
  const [selectedSchedule, setSelectedSchedule] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);

  const scrollViewRef = useRef<any>(null);

  const handleSelectGoal = (goal: string) => {
    setSelectedGoal(goal);
  };

  const handleSelectExperience = (exp: string) => {
    setSelectedExperience(exp);
  };

  const handleSelectSchedule = (sched: string) => {
    setSelectedSchedule(sched);
  };

  const handleSelectDuration = (duration: number) => {
    setSelectedDuration(duration);
  };

  const handleContinue = () => {
    if (!selectedGoal || !selectedExperience || !selectedSchedule || !selectedDuration) return;

    updateAnswers({
      goal: selectedGoal,
      experience: selectedExperience,
      schedule: selectedSchedule,
      duration: selectedDuration,
    });

    router.push('/(auth)/breathing-space');
  };

  const isComplete = selectedGoal && selectedExperience && selectedSchedule && selectedDuration;

  return (
    <View className="flex-1 bg-background relative">
      <MandalaThread />

      {/* Top Header Bar */}
      <View
        style={{ paddingTop: Math.max(insets.top, 16) }}
        className="w-full bg-background border-b border-surface-border z-40 pb-2"
      >
        <View className="flex-row justify-between items-center px-6 py-2">
          <PressableAnimated
            className="w-10 h-10 -ml-2 items-center justify-center rounded-full active:bg-surface-border/20"
            onPress={() => router.back()}
            haptic="light"
            accessibilityLabel="Go back"
          >
            <ArrowLeft size={20} color={colors.primaryText} />
          </PressableAnimated>
          <Heading className="text-accent-terracotta tracking-tight text-center">
            Sadhana
          </Heading>
          <View className="w-10" />
        </View>
        
        {/* Progress Bar (20%) */}
        <View className="w-full h-1 bg-surface-border/20">
          <View className="h-full bg-accent-terracotta" style={{ width: '20%' }} />
        </View>
      </View>

      {/* Scrollable Questionnaire */}
      <ScrollView
        ref={scrollViewRef}
        className="flex-1 px-6"
        contentContainerStyle={{
          paddingTop: isSmallDevice ? 16 : 24,
          paddingBottom: Math.max(insets.bottom + 100, 140),
        }}
      >
        {/* Question 1: Goals */}
        <View className={isSmallDevice ? 'mb-8' : 'mb-12'}>
          <Subheading className="mb-3 text-on-surface">
            What brings you to your mat?
          </Subheading>
          <Body className="mb-6 text-secondary-text">
            Your intention becomes the compass for each plan, shaping whether Sadhana leans toward nervous-system care, mobility, or deeper yogic study.
          </Body>
          
          <View className="gap-3">
            {[
              { id: 'stress', label: 'Relieve stress and anxiety', detail: 'For calming breathwork, grounding movement, and steadier sleep.' },
              { id: 'mobility', label: 'Improve joint mobility and flexibility', detail: 'For daily relief in the areas that feel tight or overworked.' },
              { id: 'philosophy', label: 'Connect with yogic philosophy', detail: 'For practices that include reflective and meditative depth.' },
            ].map((option) => {
              const isSelected = selectedGoal === option.id;
              return (
                <PressableAnimated
                  key={option.id}
                  className={`w-full ${isSmallDevice ? 'p-3.5' : 'p-4'} rounded-xl border flex-row justify-between items-center transition-all duration-200 ${
                    isSelected
                      ? 'bg-warm-highlight border-accent-terracotta'
                      : 'bg-surface border-surface-border'
                  }`}
                  onPress={() => handleSelectGoal(option.id)}
                  haptic="light"
                  scaleTo={0.99}
                  accessibilityLabel={`Goal option: ${option.label}`}
                  accessibilityState={{ selected: isSelected }}
                >
                  <View className="flex-1 pr-3">
                    <Body className="text-primary-text">{option.label}</Body>
                    <Text className="mt-1 font-sans text-xs text-secondary-text leading-4">
                      {option.detail}
                    </Text>
                  </View>
                  <AnimatedCheckbox isSelected={isSelected} />
                </PressableAnimated>
              );
            })}
          </View>
        </View>

        {/* Question 2: Experience */}
        {selectedGoal && (
          <Animated.View entering={FadeInDown.duration(400)} className={isSmallDevice ? 'mb-8' : 'mb-12'}>
            <Subheading className="mb-3 text-on-surface">
              How would you describe your experience?
            </Subheading>
            <Body className="mb-4 text-secondary-text">
              This keeps today safe and useful. As your streak grows, Sadhana can gently introduce the next level without rushing your body.
            </Body>
            
            <View className="flex-row flex-wrap gap-2">
              {['Beginner', 'Intermediate', 'Advanced'].map((option) => {
                const isSelected = selectedExperience === option.toLowerCase();
                return (
                  <PressableAnimated
                    key={option}
                    className={`px-6 py-3 rounded-full border ${
                      isSelected
                        ? 'bg-accent-terracotta border-accent-terracotta'
                        : 'bg-background border-surface-border'
                    }`}
                    onPress={() => handleSelectExperience(option.toLowerCase())}
                    haptic="light"
                    scaleTo={0.95}
                    accessibilityLabel={`Experience level: ${option}`}
                    accessibilityState={{ selected: isSelected }}
                  >
                    <Text
                      className={`font-sans text-sm font-medium ${
                        isSelected ? 'text-white' : 'text-secondary-text'
                      }`}
                    >
                      {option}
                    </Text>
                  </PressableAnimated>
                );
              })}
            </View>
          </Animated.View>
        )}

        {/* Question 3: Schedule */}
        {selectedExperience && (
          <Animated.View entering={FadeInDown.duration(400)} className={isSmallDevice ? 'mb-8' : 'mb-12'}>
            <Subheading className="mb-3 text-on-surface">
              When will you practice daily?
            </Subheading>
            <Body className="mb-4 text-secondary-text">
              Time of day changes what your practice should ask of you: brighter, energizing sequences in the morning and softer recovery in the evening.
            </Body>
            
            <View className="flex-row flex-wrap gap-2">
              {[
                { id: 'morning', label: 'Morning', icon: Sun },
                { id: 'afternoon', label: 'Afternoon', icon: Sunset },
                { id: 'evening', label: 'Evening', icon: Moon },
              ].map((option) => {
                const isSelected = selectedSchedule === option.id;
                const IconComponent = option.icon;
                return (
                  <PressableAnimated
                    key={option.id}
                    className={`px-6 py-3 rounded-full border flex-row items-center gap-2 ${
                      isSelected
                        ? 'bg-accent-terracotta border-accent-terracotta'
                        : 'bg-background border-surface-border'
                    }`}
                    onPress={() => handleSelectSchedule(option.id)}
                    haptic="light"
                    scaleTo={0.95}
                    accessibilityLabel={`Practice schedule: ${option.label}`}
                    accessibilityState={{ selected: isSelected }}
                  >
                    <IconComponent
                      size={16}
                      color={isSelected ? '#FFF' : colors.secondaryText}
                    />
                    <Text
                      className={`font-sans text-sm font-medium ${
                        isSelected ? 'text-white' : 'text-secondary-text'
                      }`}
                    >
                      {option.label}
                    </Text>
                  </PressableAnimated>
                );
              })}
            </View>
          </Animated.View>
        )}

        {/* Question 4: Duration */}
        {selectedSchedule && (
          <Animated.View entering={FadeInDown.duration(400)} className={isSmallDevice ? 'mb-8' : 'mb-12'}>
            <Subheading className="mb-3 text-on-surface">
              How long is your daily practice?
            </Subheading>
            <Body className="mb-4 text-secondary-text">
              Pick the amount you can actually protect. We proportion it across movement, breath, and meditation so your care feels complete, not crammed.
            </Body>

            <View className="flex-row flex-wrap gap-2">
              {[10, 15, 20, 30].map((option) => {
                const isSelected = selectedDuration === option;
                return (
                  <PressableAnimated
                    key={option}
                    className={`px-6 py-3 rounded-full border flex-row items-center gap-2 ${
                      isSelected
                        ? 'bg-accent-terracotta border-accent-terracotta'
                        : 'bg-background border-surface-border'
                    }`}
                    onPress={() => handleSelectDuration(option)}
                    haptic="light"
                    scaleTo={0.95}
                    accessibilityLabel={`Daily practice duration: ${option} minutes`}
                    accessibilityState={{ selected: isSelected }}
                  >
                    <AlarmClock
                      size={16}
                      color={isSelected ? '#FFF' : colors.secondaryText}
                    />
                    <Text
                      className={`font-sans text-sm font-medium ${
                        isSelected ? 'text-white' : 'text-secondary-text'
                      }`}
                    >
                      {option} min
                    </Text>
                  </PressableAnimated>
                );
              })}
            </View>
          </Animated.View>
        )}
      </ScrollView>

      {/* Sticky Bottom Continue Button */}
      <View
        style={{
          paddingBottom: Math.max(insets.bottom, 24),
          paddingTop: 16,
        }}
        className="absolute bottom-0 left-0 right-0 px-6 bg-gradient-to-t from-background via-background to-transparent z-50 items-center"
      >
        <PressableAnimated
          className={`w-full max-w-md h-12 rounded-full flex-row items-center justify-center gap-2 ${
            isComplete ? 'bg-accent-terracotta' : 'bg-accent-terracotta/40'
          }`}
          disabled={!isComplete}
          onPress={handleContinue}
          haptic={isComplete ? 'medium' : 'none'}
          accessibilityLabel="Continue to breathing space screen"
        >
          <Text className="text-white font-sans font-medium text-sm">Continue</Text>
        </PressableAnimated>
      </View>
    </View>
  );
}
