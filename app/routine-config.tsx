import React, { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, Pressable, ScrollView } from '@/tw';
import { useTheme } from '@/hooks/useTheme';
import { useTodayPlan, useProfile } from '@/hooks/api';
import { useAuthStore } from '@/stores/authStore';
import { Heading, Subheading, Body, Caption, Micro } from '@/components/ui/Typography';
import { MandalaThread } from '@/components/ui/MandalaThread';
import { ArrowLeft, Play, Download, Wind, Move, Moon, Lock } from 'lucide-react-native';
import { Switch, ActivityIndicator, Alert } from 'react-native';
import * as Haptics from 'expo-haptics';

export default function RoutineConfigScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  
  const { planId, asanaId, pranayamaId, dhyanaId } = useLocalSearchParams<{
    planId: string;
    asanaId: string;
    pranayamaId: string;
    dhyanaId: string;
  }>();

  // Load user profile to check premium offline gating
  const { data: profile } = useProfile(user?.id);
  const isPremium = profile?.premium || false;

  const [offlineEnabled, setOfflineEnabled] = useState(false);

  // Load today's plan to fetch nested routines details
  const today = new Date().getDay();
  const { data: plan, isLoading } = useTodayPlan(user?.id, isPremium, today);

  const handleStartPractice = () => {
    if (!plan) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Navigate to active player screen
    router.push({
      pathname: '/active-routine',
      params: {
        planId: plan.id,
        asanaId: plan.asana?.id,
        asanaDuration: plan.asana?.duration_minutes,
        pranayamaId: plan.pranayama?.id,
        pranayamaDuration: plan.pranayama?.duration_minutes,
        dhyanaId: plan.dhyana?.id,
        dhyanaDuration: plan.dhyana?.duration_minutes,
      },
    });
  };

  const handleOfflineToggle = (value: boolean) => {
    if (!isPremium) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert(
        'Premium Gated',
        'Offline downloads are exclusive to Creator+ members. Upgrade in your profile settings.'
      );
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setOfflineEnabled(value);
  };

  const asanaDuration = plan?.asana?.duration_minutes || 5;
  const pranayamaDuration = plan?.pranayama?.duration_minutes || 4;
  const dhyanaDuration = plan?.dhyana?.duration_minutes || 3;
  const totalDuration = asanaDuration + pranayamaDuration + dhyanaDuration;

  return (
    <View className="flex-1 bg-background relative justify-between">
      <MandalaThread />

      {/* Header bar */}
      <View className="pt-12 pb-3 px-6 z-40 bg-background/80 flex-row justify-between items-center border-b border-surface-border">
        <Pressable
          className="w-10 h-10 -ml-2 items-center justify-center rounded-full active:bg-surface-border/20"
          onPress={() => router.back()}
        >
          <ArrowLeft size={20} color={colors.primaryText} />
        </Pressable>
        <Heading className="text-on-background text-center flex-1 font-serif">
          {plan?.asana ? 'Morning Sanctuary' : 'Preparing...'}
        </Heading>
        <View className="w-10" />
      </View>

      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      ) : (
        <ScrollView className="flex-1 px-6 pt-6" contentContainerStyle={{ paddingBottom: 100 }}>
          {/* Segments list */}
          <View className="gap-3 mb-8">
            {/* Segment 1: Asana */}
            {plan?.asana && (
              <View className="bg-surface rounded-xl border border-surface-border p-4 flex-row items-center gap-4">
                <View className="w-12 h-12 rounded-full bg-warm-highlight/50 flex items-center justify-center">
                  <Move size={22} color={colors.accent} />
                </View>
                <View className="flex-1">
                  <Text className="font-sans font-bold text-sm text-primary-text">Asana</Text>
                  <Caption className="text-secondary-text">{plan.asana.title}</Caption>
                </View>
                <Caption className="text-secondary-text font-bold">{asanaDuration} min</Caption>
              </View>
            )}

            {/* Segment 2: Pranayama */}
            {plan?.pranayama && (
              <View className="bg-surface rounded-xl border border-surface-border p-4 flex-row items-center gap-4">
                <View className="w-12 h-12 rounded-full bg-warm-highlight/50 flex items-center justify-center">
                  <Wind size={22} color={colors.accent} />
                </View>
                <View className="flex-1">
                  <Text className="font-sans font-bold text-sm text-primary-text">Pranayama</Text>
                  <Caption className="text-secondary-text">{plan.pranayama.title}</Caption>
                </View>
                <Caption className="text-secondary-text font-bold">{pranayamaDuration} min</Caption>
              </View>
            )}

            {/* Segment 3: Dhyana */}
            {plan?.dhyana && (
              <View className="bg-surface rounded-xl border border-surface-border p-4 flex-row items-center gap-4">
                <View className="w-12 h-12 rounded-full bg-warm-highlight/50 flex items-center justify-center">
                  <Moon size={22} color={colors.accent} />
                </View>
                <View className="flex-1">
                  <Text className="font-sans font-bold text-sm text-primary-text">Dhyana</Text>
                  <Caption className="text-secondary-text">{plan.dhyana.title}</Caption>
                </View>
                <Caption className="text-secondary-text font-bold">{dhyanaDuration} min</Caption>
              </View>
            )}
          </View>

          {/* Configuration Options */}
          <View className="mt-auto border-t border-surface-border/50 pt-6">
            <View className="flex-row justify-between items-center mb-6">
              <View className="flex-row items-center gap-2">
                {!isPremium && <Lock size={14} color={colors.secondaryText} />}
                <Text className="font-sans font-medium text-sm text-primary-text">
                  Download for offline
                </Text>
              </View>
              <Switch
                value={offlineEnabled}
                onValueChange={handleOfflineToggle}
                trackColor={{ false: colors.border, true: colors.growth }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View className="items-center">
              <Caption className="text-secondary-text font-bold">
                {totalDuration} minutes • 3 segments
              </Caption>
            </View>
          </View>
        </ScrollView>
      )}

      {/* Sticky Bottom Play CTA */}
      <View className="p-6 bg-gradient-to-t from-background via-background to-transparent z-50 items-center">
        <Pressable
          className="w-full max-w-md h-12 bg-accent-terracotta rounded-full flex-row items-center justify-center gap-2 active:opacity-90"
          onPress={handleStartPractice}
        >
          <Text className="text-white font-sans font-bold text-sm">Start Practice</Text>
          <Play size={16} color="#FFFFFF" fill="#FFFFFF" />
        </Pressable>
      </View>
    </View>
  );
}
