import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';
import { useTheme } from '@/hooks/useTheme';
import { useOnboardingResponses, useUpdateOnboardingResponses } from '@/hooks/api';
import { ChevronLeft, Check, Sun, Sunset, Moon, AlarmClock } from 'lucide-react-native';
import { Heading, Subheading, Body, Micro } from '@/components/ui/Typography';
import { MandalaThread } from '@/components/ui/MandalaThread';
import { PressableAnimated } from '@/components/ui/PressableAnimated';
import * as Haptics from 'expo-haptics';

export default function PersonalizationScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  // Fetch current database personalization options
  const { data: responses, isLoading, isError, refetch } = useOnboardingResponses(user?.id);
  const updateMutation = useUpdateOnboardingResponses();

  // Local state for edits
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [selectedExperience, setSelectedExperience] = useState<string | null>(null);
  const [selectedSchedule, setSelectedSchedule] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);

  // Populate local state when query completes
  useEffect(() => {
    if (responses) {
      setSelectedGoal(responses.goals?.[0] || 'stress');
      setSelectedExperience(responses.experience_level || 'beginner');
      setSelectedSchedule(responses.preferred_time || 'morning');
      setSelectedDuration(responses.preferred_duration || 15);
    }
  }, [responses]);

  const handleSave = async () => {
    if (!user || !selectedGoal || !selectedExperience || !selectedSchedule || !selectedDuration) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      await updateMutation.mutateAsync({
        userId: user.id,
        goals: [selectedGoal],
        experience_level: selectedExperience,
        preferred_time: selectedSchedule,
        preferred_duration: selectedDuration,
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Sanctuary Updated', 'Your daily practice plan has been personalized with your new preferences.', [
        { text: 'Okay', onPress: () => router.back() }
      ]);
    } catch (error: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Update Failed', error.message || 'An error occurred while saving your preferences. Please try again.');
    }
  };

  const isFormValid = selectedGoal && selectedExperience && selectedSchedule && selectedDuration;
  const isSaving = updateMutation.isPending;

  if (isLoading) {
    return (
      <View className="flex-1 bg-background justify-center items-center">
        <ActivityIndicator size="large" color="#C44B22" />
        <Body className="text-secondary-text mt-4">Loading your profile sanctuary...</Body>
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 bg-background justify-center items-center px-6">
        <Heading className="text-center mb-4">Error loading personalization</Heading>
        <PressableAnimated
          haptic="light"
          className="px-6 py-2.5 bg-accent-terracotta rounded-full active:opacity-90"
          onPress={() => refetch()}
        >
          <Text className="text-white font-sans font-bold text-sm">Retry</Text>
        </PressableAnimated>
      </View>
    );
  }

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
          Edit Personalization
        </Heading>
        <View className="w-10" />
      </View>

      <ScrollView className="flex-1 px-6 pt-6" contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Goals Selection */}
        <View className="mb-8">
          <Micro className="text-secondary-text mb-3 uppercase tracking-widest">Wellness Focus</Micro>
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
                  className={`w-full p-4 rounded-xl border flex-row justify-between items-center transition-all duration-200 ${
                    isSelected
                      ? 'bg-warm-highlight border-accent-terracotta'
                      : 'bg-surface border-surface-border'
                  }`}
                  onPress={() => setSelectedGoal(option.id)}
                  haptic="light"
                  scaleTo={0.99}
                  accessibilityLabel={`Goal option: ${option.label}`}
                  accessibilityState={{ selected: isSelected }}
                >
                  <View className="flex-1 pr-3">
                    <Body className="text-primary-text font-bold text-sm">{option.label}</Body>
                    <Text className="mt-1 font-sans text-xs text-secondary-text leading-4">
                      {option.detail}
                    </Text>
                  </View>
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

        {/* Experience Level Selection */}
        <View className="mb-8">
          <Micro className="text-secondary-text mb-3 uppercase tracking-widest">Experience Level</Micro>
          <View className="flex-row gap-2.5">
            {['Beginner', 'Intermediate', 'Advanced'].map((option) => {
              const val = option.toLowerCase();
              const isSelected = selectedExperience === val;
              return (
                <PressableAnimated
                  key={option}
                  className={`flex-1 py-3 rounded-xl border items-center justify-center ${
                    isSelected
                      ? 'bg-accent-terracotta border-accent-terracotta'
                      : 'bg-surface border-surface-border'
                  }`}
                  onPress={() => setSelectedExperience(val)}
                  haptic="light"
                  scaleTo={0.95}
                  accessibilityLabel={`Experience level: ${option}`}
                  accessibilityState={{ selected: isSelected }}
                >
                  <Text
                    className={`font-sans text-xs font-bold ${
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

        {/* Practice Time Selection */}
        <View className="mb-8">
          <Micro className="text-secondary-text mb-3 uppercase tracking-widest">Practice Schedule</Micro>
          <View className="flex-row gap-2.5">
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
                  className={`flex-1 py-3 rounded-xl border flex-row items-center justify-center gap-1.5 ${
                    isSelected
                      ? 'bg-accent-terracotta border-accent-terracotta'
                      : 'bg-surface border-surface-border'
                  }`}
                  onPress={() => setSelectedSchedule(option.id)}
                  haptic="light"
                  scaleTo={0.95}
                  accessibilityLabel={`Practice schedule: ${option.label}`}
                  accessibilityState={{ selected: isSelected }}
                >
                  <IconComponent
                    size={14}
                    color={isSelected ? '#FFF' : colors.secondaryText}
                  />
                  <Text
                    className={`font-sans text-xs font-bold ${
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

        {/* Practice Duration Selection */}
        <View className="mb-12">
          <Micro className="text-secondary-text mb-3 uppercase tracking-widest">Daily Duration</Micro>
          <View className="flex-row gap-2.5">
            {[10, 15, 20, 30].map((option) => {
              const isSelected = selectedDuration === option;
              return (
                <PressableAnimated
                  key={option}
                  className={`flex-1 py-3 rounded-xl border flex-row items-center justify-center gap-1.5 ${
                    isSelected
                      ? 'bg-accent-terracotta border-accent-terracotta'
                      : 'bg-surface border-surface-border'
                  }`}
                  onPress={() => setSelectedDuration(option)}
                  haptic="light"
                  scaleTo={0.95}
                  accessibilityLabel={`Daily practice duration: ${option} minutes`}
                  accessibilityState={{ selected: isSelected }}
                >
                  <AlarmClock
                    size={14}
                    color={isSelected ? '#FFF' : colors.secondaryText}
                  />
                  <Text
                    className={`font-sans text-xs font-bold ${
                      isSelected ? 'text-white' : 'text-secondary-text'
                    }`}
                  >
                    {option}m
                  </Text>
                </PressableAnimated>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Save Button */}
      <View className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background via-background to-transparent z-50 items-center">
        <PressableAnimated
          className={`w-full max-w-md h-12 rounded-full flex-row items-center justify-center gap-2 ${
            isFormValid && !isSaving ? 'bg-accent-terracotta' : 'bg-accent-terracotta/40'
          }`}
          disabled={!isFormValid || isSaving}
          onPress={handleSave}
          haptic={isFormValid && !isSaving ? 'medium' : 'none'}
          accessibilityLabel="Save your practice preferences"
        >
          {isSaving && <ActivityIndicator size="small" color="#FFFFFF" />}
          <Text className="text-white font-sans font-bold text-sm">
            {isSaving ? 'Saving Changes...' : 'Save Preferences'}
          </Text>
        </PressableAnimated>
      </View>
    </View>
  );
}
