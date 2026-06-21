import React, { useEffect, useCallback, useMemo, useState } from 'react';
import { View, ScrollView, StyleSheet, Platform, AccessibilityInfo } from 'react-native';
import { useAuthStore } from '@/stores/authStore';
import { useTheme } from '@/hooks/useTheme';
import { router } from 'expo-router';
import { useProfile, useTodayPlan, useRoutines } from '@/hooks/api';
import * as Haptics from 'expo-haptics';
import { Text } from '@/components/ui/Text';
import { MandalaThread } from '@/components/ui/MandalaThread';
import { PressableAnimated } from '@/components/ui/PressableAnimated';
import { HomeSkeleton } from '@/components/ui/Skeletons';
import { ErrorState } from '@/components/ui/ErrorState';
import { PracticeIcon } from '@/components/ui/PracticeIcon';
import { FlatList } from 'react-native';
import { StatusBar } from 'expo-status-bar';

// 1. Memoized list item to prevent re-renders on parent state changes
interface SessionItem {
  label: string;
  title: string;
  duration: string;
}

const RecentSessionCard = React.memo(({ session }: { session: SessionItem }) => {
  const { colors } = useTheme();

  return (
    <View 
      style={[styles.recentCard, { borderColor: colors.border, backgroundColor: colors.surface }]}
      accessibilityRole="button"
      accessibilityLabel={`Previous session: ${session.title}, completed ${session.label}, duration ${session.duration}`}
    >
      <Text variant="body" weight="medium" style={[styles.recentLabel, { color: colors.secondaryText }]}>
        {session.label}
      </Text>
      <View>
        <Text variant="body" weight="bold" style={[styles.recentTitle, { color: colors.primaryText }]} numberOfLines={1}>
          {session.title}
        </Text>
        <View style={styles.recentMeta}>
          <View style={[styles.metaDot, { backgroundColor: colors.accent }]} />
          <Text variant="body" style={[styles.recentDuration, { color: colors.secondaryText }]}>
            {session.duration}
          </Text>
        </View>
      </View>
    </View>
  );
});

RecentSessionCard.displayName = 'RecentSessionCard';

export default function HomeScreen() {
  const { colors, dark } = useTheme();
  const user = useAuthStore((state) => state.user);
  const dailyCheckIn = useAuthStore((state) => state.dailyCheckIn);
  const submitDailyCheckIn = useAuthStore((state) => state.submitDailyCheckIn);
  const clearDailyCheckIn = useAuthStore((state) => state.clearDailyCheckIn);

  // Check-in state
  const [energyCheck, setEnergyCheck] = useState<'high' | 'low'>('high');
  const [bodyCheck, setBodyCheck] = useState<'clear' | 'tight'>('clear');
  const [mindCheck, setMindCheck] = useState<'steady' | 'restless'>('steady');

  const today = useMemo(() => new Date(), []);
  const formattedDate = useMemo(() => {
    return today.toLocaleDateString('en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  }, [today]);

  const dayOfWeek = today.getDay();

  // API Hooks
  const { data: profile, isLoading: isProfileLoading, isError: isProfileError, refetch: refetchProfile } = useProfile(user?.id);
  const isPremium = profile?.premium || user?.premium || false;
  const { data: allRoutines } = useRoutines();
  const { data: planData, isLoading: isPlanLoading, isError: isPlanError, refetch: refetchPlan } = useTodayPlan(user?.id, isPremium, dayOfWeek);

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const isCheckedInToday = dailyCheckIn && dailyCheckIn.date === todayStr;

  // 2. Memoized swaps for today's routine matching energy checks
  const plan = useMemo(() => {
    if (!planData) return null;
    if (isCheckedInToday && planData && allRoutines) {
      const userLevel = planData.asana?.experience_level || 'beginner';
      
      // Asana Swap
      let asanas = allRoutines.filter((r) => r.category === 'asana');
      if (!isPremium) asanas = asanas.filter((r) => !r.is_premium);
      asanas = asanas.filter((r) => r.experience_level === userLevel || r.experience_level === 'beginner');
      if (dailyCheckIn.energy === 'low') {
        asanas = asanas.filter((r) => r.goals?.includes('stress') || r.goals?.includes('mobility'));
      } else {
        asanas = asanas.filter((r) => r.goals?.includes('strength') || r.goals?.includes('focus') || r.goals?.includes('mobility'));
      }
      const selectedAsana = asanas[dayOfWeek % asanas.length] || planData.asana;

      // Pranayama Swap
      let pranayamas = allRoutines.filter((r) => r.category === 'pranayama');
      if (!isPremium) pranayamas = pranayamas.filter((r) => !r.is_premium);
      if (dailyCheckIn.mind === 'restless') {
        pranayamas = pranayamas.filter((r) => r.goals?.includes('stress') || r.goals?.includes('sleep'));
      }
      const selectedPranayama = pranayamas[dayOfWeek % pranayamas.length] || planData.pranayama;

      // Dhyana Swap
      let dhyanas = allRoutines.filter((r) => r.category === 'dhyana');
      if (!isPremium) dhyanas = dhyanas.filter((r) => !r.is_premium);
      const selectedDhyana = dhyanas[dayOfWeek % dhyanas.length] || planData.dhyana;

      return {
        ...planData,
        asana: selectedAsana,
        pranayama: selectedPranayama,
        dhyana: selectedDhyana,
      };
    }
    return planData;
  }, [planData, dailyCheckIn, isCheckedInToday, allRoutines, isPremium, dayOfWeek]);

  // 3. useCallback handlers to prevent child component re-renders
  const handleRetry = useCallback(() => {
    refetchProfile();
    refetchPlan();
  }, [refetchProfile, refetchPlan]);

  const handlePrepareRoutine = useCallback(() => {
    if (!plan) return;
    router.push({
      pathname: '/routine-config',
      params: {
        planId: plan.id,
        asanaId: plan.asana?.id,
        pranayamaId: plan.pranayama?.id,
        dhyanaId: plan.dhyana?.id,
      },
    });
  }, [plan]);

  const handleCheckInSubmit = useCallback(() => {
    submitDailyCheckIn(energyCheck, bodyCheck, mindCheck);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, [energyCheck, bodyCheck, mindCheck, submitDailyCheckIn]);

  const handleResetCheckIn = useCallback(() => {
    clearDailyCheckIn();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [clearDailyCheckIn]);

  // Static Data
  const recentSessions: SessionItem[] = useMemo(() => [
    { label: 'Yesterday', title: 'Evening Wind Down', duration: '15 min' },
    { label: 'Sat, 14 June', title: 'Core Awakening', duration: '20 min' },
    { label: 'Fri, 13 June', title: 'Restorative Silence', duration: '10 min' },
  ], []);

  const renderRecentItem = useCallback(({ item }: { item: SessionItem }) => (
    <RecentSessionCard session={item} />
  ), []);

  const keyExtractor = useCallback((_: SessionItem, index: number) => index.toString(), []);

  // Compute pillar completeness
  const pillarsProgress = useMemo(() => {
    // Simulated values for daily pillar checklist completion
    return {
      asana: 0.8,
      pranayama: 1.0,
      dhyana: 0.3,
      overall: 0.7, // Overall progress drives the MandalaThread
    };
  }, []);

  const isLoading = isPlanLoading || isProfileLoading;
  const isError = isProfileError || isPlanError;

  if (isError) return <ErrorState onRetry={handleRetry} />;
  if (isLoading) return <HomeSkeleton />;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={dark ? 'light' : 'dark'} />
      <MandalaThread progress={pillarsProgress.overall} />

      {/* TOP 60% - Main Sadhana Sanctuary Hero */}
      <ScrollView 
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Date and Header */}
        <View style={styles.header}>
          <Text variant="body" weight="medium" style={{ color: colors.secondaryText }}>
            {formattedDate}
          </Text>
        </View>

        {/* DOMINANT HERO CARD (Sanctuary details, streaks, and progress) */}
        <View style={[styles.heroCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {/* Card Header: Diya Streak indicator */}
          <View style={styles.heroCardHeader}>
            <View>
              <Text variant="body" weight="bold" style={{ color: colors.accent, letterSpacing: 1.5 }}>
                DAILY PILGRIMAGE
              </Text>
              <Text variant="display" weight="bold" style={[styles.heroTitle, { color: colors.primaryText }]}>
                {plan?.asana ? 'Morning Sanctuary' : 'Sadhana Sanctuary'}
              </Text>
            </View>
            <View 
              style={styles.streakBadge}
              accessibilityRole="text"
              accessibilityLabel="12 Day Meditation Streak"
            >
              <PracticeIcon type="diya" size={24} streakIntensity={0.8} />
              <Text variant="stat" weight="bold" style={[styles.streakNumber, { color: colors.primaryText }]}>
                12
              </Text>
            </View>
          </View>

          {/* 3 Pillar Progress Bars */}
          <View style={styles.pillarsContainer}>
            <Text variant="body" weight="bold" style={[styles.pillarsHeader, { color: colors.secondaryText }]}>
              DAILY MEDITATION PILLARS
            </Text>
            
            {/* Pillar 1: Asana */}
            <View style={styles.pillarRow}>
              <View style={styles.pillarInfo}>
                <PracticeIcon type="asana" size={16} />
                <Text variant="body" style={[styles.pillarLabel, { color: colors.primaryText }]}>Asana (Posture)</Text>
              </View>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${pillarsProgress.asana * 100}%`, backgroundColor: colors.accent }]} />
              </View>
            </View>

            {/* Pillar 2: Pranayama */}
            <View style={styles.pillarRow}>
              <View style={styles.pillarInfo}>
                <PracticeIcon type="pranayama" size={16} />
                <Text variant="body" style={[styles.pillarLabel, { color: colors.primaryText }]}>Pranayama (Breath)</Text>
              </View>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${pillarsProgress.pranayama * 100}%`, backgroundColor: colors.accent }]} />
              </View>
            </View>

            {/* Pillar 3: Dhyana */}
            <View style={styles.pillarRow}>
              <View style={styles.pillarInfo}>
                <PracticeIcon type="dhyana" size={16} />
                <Text variant="body" style={[styles.pillarLabel, { color: colors.primaryText }]}>Dhyana (Stillness)</Text>
              </View>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${pillarsProgress.dhyana * 100}%`, backgroundColor: colors.accent }]} />
              </View>
            </View>
          </View>

          {/* Routine Duration Info */}
          <Text variant="body" style={[styles.durationText, { color: colors.secondaryText }]}>
            {((plan?.asana?.duration_minutes || 0) +
              (plan?.pranayama?.duration_minutes || 0) +
              (plan?.dhyana?.duration_minutes || 0)) || 15}{' '}
            mins total • Calming flow
          </Text>

          {/* Primary Action Button */}
          <PressableAnimated
            haptic="medium"
            style={[styles.primaryButton, { backgroundColor: colors.accent }]}
            onPress={handlePrepareRoutine}
            accessibilityRole="button"
            accessibilityLabel="Begin Daily Sadhana Pilgrimage"
            accessibilityHint="Navigates to the routine setup page to prepare your posture, breathing and meditation sequence."
          >
            <Text variant="body" weight="bold" style={styles.primaryButtonText}>
              Enter Practice Sanctuary
            </Text>
          </PressableAnimated>
        </View>

        {/* Dynamic Vibe / Check-In tuning panel */}
        <View style={[styles.tuningPanel, { borderColor: colors.border, backgroundColor: colors.surface }]}>
          {!isCheckedInToday ? (
            <View>
              <Text variant="body" weight="bold" style={[styles.tuningTitle, { color: colors.primaryText }]}>
                Tune Today's Sequence
              </Text>
              <Text variant="body" style={[styles.tuningDesc, { color: colors.secondaryText }]}>
                Adjust the practices to your current body & mind levels.
              </Text>
              <View style={styles.toggleRow}>
                <Text variant="body" weight="medium" style={{ color: colors.secondaryText }}>Energy:</Text>
                <View style={styles.toggleGroup}>
                  <PressableAnimated
                    style={[styles.toggleBtn, energyCheck === 'high' && { backgroundColor: colors.accent, borderColor: colors.accent }]}
                    onPress={() => setEnergyCheck('high')}
                    haptic="light"
                  >
                    <Text variant="body" weight="bold" style={[styles.toggleText, energyCheck === 'high' && styles.textWhite]}>Active</Text>
                  </PressableAnimated>
                  <PressableAnimated
                    style={[styles.toggleBtn, energyCheck === 'low' && { backgroundColor: colors.accent, borderColor: colors.accent }]}
                    onPress={() => setEnergyCheck('low')}
                    haptic="light"
                  >
                    <Text variant="body" weight="bold" style={[styles.toggleText, energyCheck === 'low' && styles.textWhite]}>Gentle</Text>
                  </PressableAnimated>
                </View>
              </View>
              <PressableAnimated
                haptic="medium"
                style={[styles.submitCheckInBtn, { borderColor: colors.accent }]}
                onPress={handleCheckInSubmit}
              >
                <Text variant="body" weight="bold" style={{ color: colors.accent }}>Update Sequence</Text>
              </PressableAnimated>
            </View>
          ) : (
            <View style={styles.checkedInRow}>
              <Text variant="body" style={[styles.checkedInText, { color: colors.primaryText }]}>
                Sanctuary tuned for: <Text weight="bold">{energyCheck === 'high' ? '⚡ Active' : '🌙 Gentle'}</Text>
              </Text>
              <PressableAnimated haptic="light" style={styles.resetBtn} onPress={handleResetCheckIn}>
                <Text variant="body" weight="bold" style={{ color: colors.accent }}>Reset</Text>
              </PressableAnimated>
            </View>
          )}
        </View>

        {/* BOTTOM 40% - Receding Secondary Elements */}
        <View style={styles.recedingContainer}>
          <Text variant="body" weight="bold" style={[styles.sectionHeader, { color: colors.secondaryText }]}>
            RECENT DEVOTIONS
          </Text>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={recentSessions}
            keyExtractor={keyExtractor}
            renderItem={renderRecentItem}
            contentContainerStyle={styles.recentListContent}
            // Performance optimizations for 60fps scrolling
            removeClippedSubviews={Platform.OS === 'android'}
            maxToRenderPerBatch={3}
            windowSize={5}
            initialNumToRender={3}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  header: {
    marginTop: Platform.OS === 'ios' ? 60 : 40,
    marginBottom: 16,
  },
  heroCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
    marginBottom: 20,
  },
  heroCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  heroTitle: {
    fontSize: 28,
    marginTop: 4,
    lineHeight: 34,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(196, 75, 34, 0.06)',
    gap: 6,
  },
  streakNumber: {
    fontSize: 16,
  },
  pillarsContainer: {
    marginBottom: 20,
  },
  pillarsHeader: {
    fontSize: 10,
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  pillarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  pillarInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pillarLabel: {
    fontSize: 13,
  },
  progressBarBg: {
    width: 80,
    height: 4,
    backgroundColor: 'rgba(0,0,0,0.06)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  durationText: {
    fontSize: 12,
    marginBottom: 24,
  },
  primaryButton: {
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#C44B22',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    letterSpacing: 0.5,
  },
  tuningPanel: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    marginBottom: 24,
  },
  tuningTitle: {
    fontSize: 14,
    marginBottom: 4,
  },
  tuningDesc: {
    fontSize: 11,
    marginBottom: 12,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  toggleGroup: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    borderRadius: 20,
    overflow: 'hidden',
  },
  toggleBtn: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderWidth: 0,
  },
  toggleText: {
    fontSize: 11,
    color: '#6B5A41',
  },
  textWhite: {
    color: '#FFFFFF',
  },
  submitCheckInBtn: {
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkedInRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  checkedInText: {
    fontSize: 12,
  },
  resetBtn: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  recedingContainer: {
    opacity: 0.8,
  },
  sectionHeader: {
    fontSize: 10,
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  recentListContent: {
    gap: 12,
    paddingBottom: 8,
  },
  recentCard: {
    width: 150,
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
    justifyContent: 'space-between',
    height: 90,
  },
  recentLabel: {
    fontSize: 10,
  },
  recentTitle: {
    fontSize: 12,
  },
  recentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  metaDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  recentDuration: {
    fontSize: 10,
  },
});
