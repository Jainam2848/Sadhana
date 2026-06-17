import React from 'react';
import { View, Text, ScrollView, Image } from '@/tw';
import { useAuthStore } from '@/stores/authStore';
import { useTheme } from '@/hooks/useTheme';
import { router } from 'expo-router';
import { useProfile, useTodayPlan } from '@/hooks/api';
import { Display, Heading, Caption, Micro } from '@/components/ui/Typography';
import { MandalaThread } from '@/components/ui/MandalaThread';
import { PressableAnimated } from '@/components/ui/PressableAnimated';
import { HomeSkeleton } from '@/components/ui/Skeletons';
import { ErrorState } from '@/components/ui/ErrorState';
import { Flame, Lock } from 'lucide-react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';

const AnimatedView = Animated.createAnimatedComponent(View);

export default function HomeScreen() {
  const { colors } = useTheme();
  const user = useAuthStore((state) => state.user);
  
  // Current date formatting
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
  
  const dayOfWeek = today.getDay(); // 0 is Sunday, 6 is Saturday

  // Fetch dynamic profile data & streak count from Supabase
  const { 
    data: profile, 
    isLoading: isProfileLoading, 
    isError: isProfileError, 
    refetch: refetchProfile 
  } = useProfile(user?.id);
  
  const isPremium = profile?.premium || user?.premium || false;

  // Fetch today's plan (personalized or fallback global daily)
  const { 
    data: plan, 
    isLoading: isPlanLoading, 
    isError: isPlanError, 
    refetch: refetchPlan 
  } = useTodayPlan(
    user?.id,
    isPremium,
    dayOfWeek
  );

  const handleRetry = () => {
    refetchProfile();
    refetchPlan();
  };

  const handlePrepareRoutine = () => {
    if (!plan) return;
    // Route to config with routine details
    router.push({
      pathname: '/routine-config',
      params: {
        planId: plan.id,
        asanaId: plan.asana?.id,
        pranayamaId: plan.pranayama?.id,
        dhyanaId: plan.dhyana?.id,
      },
    });
  };

  const currentStreak = 12; // fallback mock or retrieved via streaks hook
  
  // Mock recent sessions matching Stitch layout
  const recentSessions = [
    { label: 'Yesterday', title: 'Evening Wind Down', duration: '15 min' },
    { label: 'Sat, 14 June', title: 'Core Awakening', duration: '20 min' },
    { label: 'Fri, 13 June', title: 'Restorative Silence', duration: '10 min' },
  ];

  const isLoading = isPlanLoading || isProfileLoading;
  const isError = isProfileError || isPlanError;

  return (
    <View className="flex-1 bg-background relative">
      <MandalaThread />

      {/* Top App Bar */}
      <View className="w-full border-b border-surface-border bg-background/80 pt-12 pb-3 px-6 flex-row justify-between items-center z-40">
        <View>
          <Caption className="text-secondary-text font-medium text-xs">{formattedDate}</Caption>
        </View>
        <PressableAnimated
          haptic="light"
          onPress={() => router.push('/(tabs)/profile')}
          accessibilityLabel="Go to Profile"
        >
          <Image
            className="w-8 h-8 rounded-full border border-surface-border"
            source={{ uri: profile?.avatar_url || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBrAl_zKTL9OiLVa9-jHCoySEV_pUD7I6QvG5gF4J3mlvXyS8_Nhw4CxICGcU9549eIwfDeAWr7kbsevtoYKfPKNxXf5Bds77-kr-t-Nys-TyWG6GIziFygfOl2920G4_P3xP5luwbNQjcVPM7N3cMkg_r8XwudeWbVB5_fkJVeBYEfs3VzzCCdLN4-IJI1f8gBFX2XEfM0fpn8kbKoFUeZu6zKctHbMpkAZF2Lwy80ijBZdIo7VuGhDowE_BH3meU_nuJYKDeeKA' }}
            accessibilityLabel="User avatar"
          />
        </PressableAnimated>
      </View>

      {/* Main Content Container */}
      {isError ? (
        <ErrorState onRetry={handleRetry} />
      ) : isLoading ? (
        <HomeSkeleton />
      ) : (
        <ScrollView className="flex-1 px-6 pt-6" contentContainerStyle={{ paddingBottom: 100 }}>
          {/* Greetings Section */}
          <View className="mb-8">
            <Display className="mb-1">
              Hari Om, {profile?.username || user?.name || 'Seeker'}
            </Display>
            <View className="flex-row items-center gap-1.5 mt-2" accessibilityLabel={`${currentStreak} day streak`}>
              <Flame size={18} color={colors.accent} fill={colors.accent} />
              <Text className="font-sans font-bold text-sm text-primary-text">
                {currentStreak}-day streak
              </Text>
            </View>
          </View>

          {/* Today's Sadhana Plan Card */}
          {isPremium ? (
            <View className="bg-surface rounded-xl border border-surface-border p-5 mb-8 relative">
              {/* Personalized Badge */}
              <View className="absolute top-5 right-5 bg-warm-highlight px-2 py-1 rounded-full">
                <Micro className="text-secondary-text text-[10px]">
                  Personalized
                </Micro>
              </View>

              <Heading className="text-on-background mb-4 pr-24 font-serif text-xl">
                Morning Sanctuary
              </Heading>

              {/* Segment Chips */}
              <View className="flex-row flex-wrap gap-2 mb-4">
                {plan?.asana && (
                  <View className="bg-warm-highlight/50 border border-accent-terracotta/20 px-3 py-1.5 rounded-full">
                    <Text className="font-sans text-xs text-accent-terracotta font-medium">
                      Asana {plan.asana.duration_minutes} min
                    </Text>
                  </View>
                )}
                {plan?.pranayama && (
                  <View className="bg-warm-highlight/50 border border-accent-terracotta/20 px-3 py-1.5 rounded-full">
                    <Text className="font-sans text-xs text-accent-terracotta font-medium">
                      Pranayama {plan.pranayama.duration_minutes} min
                    </Text>
                  </View>
                )}
                {plan?.dhyana && (
                  <View className="bg-warm-highlight/50 border border-accent-terracotta/20 px-3 py-1.5 rounded-full">
                    <Text className="font-sans text-xs text-accent-terracotta font-medium">
                      Dhyana {plan.dhyana.duration_minutes} min
                    </Text>
                  </View>
                )}
              </View>

              {/* Total Duration Details */}
              <Caption className="text-secondary-text mb-6">
                {((plan?.asana?.duration_minutes || 0) +
                  (plan?.pranayama?.duration_minutes || 0) +
                  (plan?.dhyana?.duration_minutes || 0)) || 12}{' '}
                minutes total • Calm pace
              </Caption>

              {/* Prepare Action CTA */}
              <PressableAnimated
                haptic="medium"
                className="w-full h-12 bg-accent-terracotta text-on-primary rounded-full items-center justify-center active:opacity-90"
                onPress={handlePrepareRoutine}
                accessibilityLabel="Prepare today's Sadhana routine"
              >
                <Text className="text-white font-sans font-bold text-sm">
                  Prepare today's Sadhana
                </Text>
              </PressableAnimated>
            </View>
          ) : (
            <View className="gap-6 mb-8">
              {/* Fallback Unlocked Card */}
              <View className="bg-surface rounded-xl border border-surface-border p-5">
                <View className="flex-row justify-between items-center mb-4">
                  <Heading className="text-on-background font-serif text-xl">
                    Global Daily Sadhana
                  </Heading>
                  <View className="bg-warm-highlight px-2 py-1 rounded-full">
                    <Micro className="text-secondary-text text-[10px]">
                      Global Fallback
                    </Micro>
                  </View>
                </View>

                <View className="flex-row flex-wrap gap-2 mb-4">
                  {plan?.asana && (
                    <View className="bg-warm-highlight/50 border border-accent-terracotta/20 px-3 py-1.5 rounded-full">
                      <Text className="font-sans text-xs text-accent-terracotta font-medium">
                        Asana {plan.asana.duration_minutes} min
                      </Text>
                    </View>
                  )}
                  {plan?.pranayama && (
                    <View className="bg-warm-highlight/50 border border-accent-terracotta/20 px-3 py-1.5 rounded-full">
                      <Text className="font-sans text-xs text-accent-terracotta font-medium">
                        Pranayama {plan.pranayama.duration_minutes} min
                      </Text>
                    </View>
                  )}
                  {plan?.dhyana && (
                    <View className="bg-warm-highlight/50 border border-accent-terracotta/20 px-3 py-1.5 rounded-full">
                      <Text className="font-sans text-xs text-accent-terracotta font-medium">
                        Dhyana {plan.dhyana.duration_minutes} min
                      </Text>
                    </View>
                  )}
                </View>

                <Caption className="text-secondary-text mb-6">
                  {((plan?.asana?.duration_minutes || 0) +
                    (plan?.pranayama?.duration_minutes || 0) +
                    (plan?.dhyana?.duration_minutes || 0)) || 12}{' '}
                  minutes total • Standard Daily Sequence
                </Caption>

                <PressableAnimated
                  haptic="medium"
                  className="w-full h-12 bg-accent-terracotta text-on-primary rounded-full items-center justify-center active:opacity-90"
                  onPress={handlePrepareRoutine}
                  accessibilityLabel="Prepare today's fallback routine"
                >
                  <Text className="text-white font-sans font-bold text-sm">
                    Prepare today's Sadhana
                  </Text>
                </PressableAnimated>
              </View>

              {/* Locked Premium Teaser Card */}
              <View className="bg-surface rounded-xl border border-surface-border p-5 relative overflow-hidden">
                <View className="opacity-40">
                  <Heading className="text-on-background mb-4 font-serif text-xl">
                    Morning Sanctuary
                  </Heading>
                  <View className="flex-row gap-2 mb-4">
                    <View className="bg-warm-highlight/50 border border-accent-terracotta/20 px-3 py-1.5 rounded-full">
                      <Text className="font-sans text-xs text-accent-terracotta font-medium">Asana 25 min</Text>
                    </View>
                    <View className="bg-warm-highlight/50 border border-accent-terracotta/20 px-3 py-1.5 rounded-full">
                      <Text className="font-sans text-xs text-accent-terracotta font-medium">Pranayama 10 min</Text>
                    </View>
                  </View>
                  <Caption className="text-secondary-text mb-6">
                    35 minutes total • Personalized for your energy profile
                  </Caption>
                  <View className="w-full h-12 bg-accent-terracotta/50 rounded-full items-center justify-center">
                    <Text className="text-white font-sans font-bold text-sm">Prepare today's Sadhana</Text>
                  </View>
                </View>

                {/* Absolute Overlay with Lock Icon */}
                <View className="absolute inset-0 bg-background/65 items-center justify-center p-4">
                  <View className="bg-surface border border-surface-border p-3 rounded-full mb-2 shadow-sm">
                    <Lock size={20} color={colors.accent} />
                  </View>
                  <Heading className="text-sm font-serif text-primary-text mb-1 text-center">
                    Personalized Sadhana
                  </Heading>
                  <Caption className="text-[11px] text-secondary-text text-center mb-3">
                    Unlock tailored practices matching your daily dosha & energy.
                  </Caption>
                  <PressableAnimated
                    haptic="medium"
                    className="bg-accent-terracotta px-4 py-2 rounded-full active:opacity-90"
                    onPress={() => router.push('/(auth)/paywall')}
                    accessibilityLabel="Unlock Premium personalized plans"
                  >
                    <Text className="text-white font-sans font-bold text-xs">
                      Unlock Premium
                    </Text>
                  </PressableAnimated>
                </View>
              </View>
            </View>
          )}

          {/* Recent Completed Sessions Section */}
          <View>
            <Micro className="text-secondary-text font-bold mb-4">
              Recent Sessions
            </Micro>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="-mx-6 px-6"
              contentContainerStyle={{ gap: 12, paddingRight: 32 }}
            >
              {recentSessions.map((session, index) => (
                <AnimatedView
                  entering={FadeInRight.delay(index * 100)}
                  key={index}
                  className="w-[140px] h-[86px] bg-surface border border-surface-border rounded-xl p-3 flex-col justify-between"
                  accessibilityLabel={`${session.title}, completed ${session.label}, duration ${session.duration}`}
                >
                  <Caption className="text-[10px] text-secondary-text">{session.label}</Caption>
                  <View>
                    <Text className="font-sans font-bold text-[12px] text-primary-text truncate">
                      {session.title}
                    </Text>
                    <View className="flex-row items-center gap-1.5 mt-1">
                      <View className="w-1.5 h-1.5 rounded-full bg-accent-terracotta" />
                      <Caption className="text-[10px] text-secondary-text">{session.duration}</Caption>
                    </View>
                  </View>
                </AnimatedView>
              ))}
            </ScrollView>
          </View>
        </ScrollView>
      )}
    </View>
  );
}
