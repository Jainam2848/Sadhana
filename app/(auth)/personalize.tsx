import React, { useState, useRef } from 'react';
import { router } from 'expo-router';
import { View, Text, ScrollView } from '@/tw';
import { useAuthStore } from '@/stores/authStore';
import { useTheme } from '@/hooks/useTheme';
import { ArrowLeft, Check, Sun, Sunset, Moon } from 'lucide-react-native';
import { Heading, Subheading, Body } from '@/components/ui/Typography';
import { MandalaThread } from '@/components/ui/MandalaThread';
import { PressableAnimated } from '@/components/ui/PressableAnimated';

export default function PersonalizeScreen() {
  const { colors } = useTheme();
  const updateAnswers = useAuthStore((state) => state.updateOnboardingAnswers);

  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [selectedExperience, setSelectedExperience] = useState<string | null>(null);
  const [selectedSchedule, setSelectedSchedule] = useState<string | null>(null);

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

  const handleContinue = () => {
    if (!selectedGoal || !selectedExperience || !selectedSchedule) return;

    updateAnswers({
      goal: selectedGoal,
      experience: selectedExperience,
      schedule: selectedSchedule,
    });

    router.push('/(auth)/breathing-space');
  };

  const isComplete = selectedGoal && selectedExperience && selectedSchedule;

  return (
    <View className="flex-1 bg-background relative">
      <MandalaThread />

      {/* Top Header Bar */}
      <View className="w-full bg-background border-b border-surface-border z-40 pt-12 pb-2">
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
        
        {/* Progress Bar (15%) */}
        <View className="w-full h-1 bg-surface-border/20">
          <View className="h-full bg-accent-terracotta" style={{ width: '15%' }} />
        </View>
      </View>

      {/* Scrollable Questionnaire */}
      <ScrollView
        ref={scrollViewRef}
        className="flex-1 px-6 pt-8 pb-32"
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Question 1: Goals */}
        <View className="mb-12">
          <Subheading className="mb-6 text-on-surface">
            What brings you to your mat?
          </Subheading>
          
          <View className="gap-3">
            {[
              { id: 'stress', label: 'Relieve stress and anxiety' },
              { id: 'mobility', label: 'Improve joint mobility and flexibility' },
              { id: 'philosophy', label: 'Connect with yogic philosophy' },
            ].map((option) => {
              const isSelected = selectedGoal === option.id;
              return (
                <PressableAnimated
                  key={option.id}
                  className={`w-full p-4 rounded-xl border flex-row justify-between items-center transition-all duration-200 ${
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
                  <Body className="text-primary-text">{option.label}</Body>
                  <View
                    className={`w-6 h-6 rounded-full border items-center justify-center ${
                      isSelected
                        ? 'bg-accent-terracotta border-accent-terracotta'
                        : 'border-secondary-text'
                    }`}
                  >
                    {isSelected && <Check size={14} color="#FFF" />}
                  </View>
                </PressableAnimated>
              );
            })}
          </View>
        </View>

        {/* Question 2: Experience */}
        {selectedGoal && (
          <View className="mb-12">
            <Subheading className="mb-4 text-on-surface">
              How would you describe your experience?
            </Subheading>
            
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
          </View>
        )}

        {/* Question 3: Schedule */}
        {selectedExperience && (
          <View className="mb-12">
            <Subheading className="mb-4 text-on-surface">
              When will you practice daily?
            </Subheading>
            
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
          </View>
        )}
      </ScrollView>

      {/* Sticky Bottom Continue Button */}
      <View className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background via-background to-transparent z-50 items-center">
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
