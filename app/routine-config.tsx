import React, { useMemo, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, ScrollView } from '@/tw';
import { useTheme } from '@/hooks/useTheme';
import { useTodayPlan, useProfile, useRoutines } from '@/hooks/api';
import { useAuthStore } from '@/stores/authStore';
import { Heading, Caption, Micro } from '@/components/ui/Typography';
import { MandalaThread } from '@/components/ui/MandalaThread';
import { PressableAnimated } from '@/components/ui/PressableAnimated';
import { SkeletonLoader } from '@/components/ui/Skeletons';
import { ErrorState } from '@/components/ui/ErrorState';
import { ArrowLeft, Download, Lock, Moon, Move, Play, Wind } from 'lucide-react-native';
import { Alert, StyleSheet, Switch } from 'react-native';
import * as Haptics from 'expo-haptics';

function SequenceLine({
  icon: Icon,
  phase,
  title,
  duration,
  active,
  color,
}: {
  icon: React.ComponentType<{ size: number; color: string; strokeWidth?: number }>;
  phase: string;
  title: string;
  duration: number;
  active?: boolean;
  color: string;
}) {
  return (
    <View style={styles.sequenceRow}>
      <View style={[styles.sequenceRail, active && { backgroundColor: color }]} />
      <View style={[styles.sequenceIcon, { borderColor: active ? color : 'rgba(166,149,128,0.22)' }]}>
        <Icon size={18} color={active ? color : '#A69580'} strokeWidth={1.8} />
      </View>
      <View style={styles.sequenceCopy}>
        <Text className="font-sans text-[11px] uppercase tracking-[1.4px] text-secondary-text">
          {phase}
        </Text>
        <Text className="font-sans font-bold text-[15px] text-primary-text mt-1" numberOfLines={1}>
          {title}
        </Text>
      </View>
      <Text className="font-mono text-[16px] text-secondary-text">{duration}</Text>
    </View>
  );
}

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

  const { data: profile } = useProfile(user?.id);
  const isPremium = profile?.premium || user?.premium || false;
  const [offlineEnabled, setOfflineEnabled] = useState(false);

  const today = new Date().getDay();
  const { data: plan, isLoading, isError, refetch } = useTodayPlan(user?.id, isPremium, today);
  const { data: allRoutines } = useRoutines();

  const resolvedAsana = useMemo(() => {
    if (asanaId && allRoutines) return allRoutines.find((r) => r.id === asanaId);
    return plan?.asana;
  }, [asanaId, allRoutines, plan?.asana]);

  const resolvedPranayama = useMemo(() => {
    if (pranayamaId && allRoutines) return allRoutines.find((r) => r.id === pranayamaId);
    return plan?.pranayama;
  }, [pranayamaId, allRoutines, plan?.pranayama]);

  const resolvedDhyana = useMemo(() => {
    if (dhyanaId && allRoutines) return allRoutines.find((r) => r.id === dhyanaId);
    return plan?.dhyana;
  }, [dhyanaId, allRoutines, plan?.dhyana]);

  const asanaDuration = resolvedAsana?.duration_minutes || 5;
  const pranayamaDuration = resolvedPranayama?.duration_minutes || 4;
  const dhyanaDuration = resolvedDhyana?.duration_minutes || 3;
  const totalDuration = asanaDuration + pranayamaDuration + dhyanaDuration;

  const handleStartPractice = () => {
    if (!resolvedAsana) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push({
      pathname: '/active-routine',
      params: {
        planId: planId || plan?.id,
        asanaId: resolvedAsana.id,
        asanaDuration: resolvedAsana.duration_minutes?.toString(),
        pranayamaId: resolvedPranayama?.id,
        pranayamaDuration: resolvedPranayama?.duration_minutes?.toString(),
        dhyanaId: resolvedDhyana?.id,
        dhyanaDuration: resolvedDhyana?.duration_minutes?.toString(),
      },
    });
  };

  const handleOfflineToggle = (value: boolean) => {
    if (!isPremium) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert(
        'Offline is premium',
        'Download rituals for travel, retreats, and low-signal mornings with Sadhana Premium.',
        [
          { text: 'Later', style: 'cancel' },
          { text: 'See Premium', onPress: () => router.push('/(auth)/paywall') },
        ]
      );
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setOfflineEnabled(value);
  };

  return (
    <View className="flex-1 bg-background relative">
      <MandalaThread />

      <View className="pt-12 px-6 pb-2 flex-row items-center justify-between">
        <PressableAnimated
          haptic="light"
          className="w-11 h-11 -ml-3 items-center justify-center rounded-full"
          onPress={() => router.back()}
          accessibilityLabel="Go back"
        >
          <ArrowLeft size={20} color={colors.primaryText} />
        </PressableAnimated>
        <Micro className="text-secondary-text">PREPARE</Micro>
        <View className="w-11" />
      </View>

      {isError ? (
        <ErrorState onRetry={refetch} />
      ) : isLoading ? (
        <View className="flex-1 px-6 pt-8 gap-4">
          <SkeletonLoader height={92} />
          <SkeletonLoader height={92} />
          <SkeletonLoader height={92} />
        </View>
      ) : (
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.heroBlock}>
            <Heading className="text-primary-text text-[36px] leading-[38px]">
              Enter gently.
            </Heading>
            <Caption className="text-secondary-text text-[15px] leading-6 mt-3 max-w-[310px]">
              Your practice opens with movement, settles into breath, and closes in quiet attention.
            </Caption>
          </View>

          <View style={[styles.durationBand, { borderColor: colors.border }]}>
            <View>
              <Text className="font-mono text-primary-text text-[44px] leading-[48px]">{totalDuration}</Text>
              <Caption className="text-secondary-text -mt-1">minutes total</Caption>
            </View>
            <View style={styles.phaseDots}>
              {[0, 1, 2].map((item) => (
                <View key={item} style={[styles.phaseDot, { backgroundColor: item === 0 ? colors.accent : colors.border }]} />
              ))}
            </View>
          </View>

          <View style={styles.sequenceList} accessibilityLabel="Today's practice sequence">
            {resolvedAsana && (
              <SequenceLine
                icon={Move}
                phase="Asana"
                title={resolvedAsana.title}
                duration={asanaDuration}
                active
                color={colors.accent}
              />
            )}
            {resolvedPranayama && (
              <SequenceLine
                icon={Wind}
                phase="Pranayama"
                title={resolvedPranayama.title}
                duration={pranayamaDuration}
                color={colors.accent}
              />
            )}
            {resolvedDhyana && (
              <SequenceLine
                icon={Moon}
                phase="Dhyana"
                title={resolvedDhyana.title}
                duration={dhyanaDuration}
                color={colors.accent}
              />
            )}
          </View>

          <View style={[styles.offlineRow, { borderColor: colors.border }]}>
            <View className="flex-row items-center gap-3 flex-1">
              <View style={[styles.downloadIcon, { backgroundColor: colors.highlight }]}>
                {isPremium ? <Download size={17} color={colors.accent} /> : <Lock size={17} color={colors.secondaryText} />}
              </View>
              <View className="flex-1">
                <Text className="font-sans font-bold text-primary-text text-[14px]">Make available offline</Text>
                <Caption className="text-secondary-text text-[12px] mt-1">
                  Best for travel, retreats, and early mornings.
                </Caption>
              </View>
            </View>
            <Switch
              value={offlineEnabled}
              onValueChange={handleOfflineToggle}
              trackColor={{ false: colors.border, true: colors.growth }}
              thumbColor="#FFFFFF"
              accessibilityRole="switch"
              accessibilityLabel="Download practice for offline use"
            />
          </View>
        </ScrollView>
      )}

      <View style={[styles.stickyCta, { backgroundColor: colors.background }]}>
        <PressableAnimated
          haptic="medium"
          scaleTo={0.98}
          style={[styles.startButton, { backgroundColor: colors.accent }]}
          onPress={handleStartPractice}
          accessibilityLabel="Start today's Sadhana practice"
        >
          <Text className="text-white font-sans font-bold text-[15px]">Start Ritual</Text>
          <Play size={17} color="#FFFFFF" fill="#FFFFFF" />
        </PressableAnimated>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 132,
  },
  heroBlock: {
    paddingTop: 18,
    paddingBottom: 26,
  },
  durationBand: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingVertical: 20,
    marginBottom: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  phaseDots: {
    flexDirection: 'row',
    gap: 7,
  },
  phaseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  sequenceList: {
    gap: 18,
    marginBottom: 30,
  },
  sequenceRow: {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sequenceRail: {
    width: 3,
    alignSelf: 'stretch',
    borderRadius: 2,
    backgroundColor: 'rgba(166,149,128,0.18)',
  },
  sequenceIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sequenceCopy: {
    flex: 1,
    minWidth: 0,
  },
  offlineRow: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  downloadIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stickyCta: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 24,
    paddingTop: 14,
    paddingBottom: 28,
  },
  startButton: {
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    shadowColor: '#C44B22',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 5,
  },
});
