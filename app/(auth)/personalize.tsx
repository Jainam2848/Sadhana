import React, { useState, useRef } from 'react';
import { router } from 'expo-router';
import { View, Text, ScrollView } from '@/tw';
import { useAuthStore } from '@/stores/authStore';
import { useTheme } from '@/hooks/useTheme';
import { ArrowLeft, Check, Sun, Sunset, Moon, AlarmClock, Flame, Bone, BookOpen } from 'lucide-react-native';
import { Heading, Body, Caption, Micro } from '@/components/ui/Typography';
import { MandalaThread } from '@/components/ui/MandalaThread';
import { PressableAnimated } from '@/components/ui/PressableAnimated';
import Animated, {
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet, useWindowDimensions } from 'react-native';

// ─── Animated Selection Ring ──────────────────────────────────────────────────
function SelectionDot({ isSelected }: { isSelected: boolean }) {
  const scale = useSharedValue(isSelected ? 1 : 0);
  const opacity = useSharedValue(isSelected ? 1 : 0);

  React.useEffect(() => {
    scale.value = withSpring(isSelected ? 1 : 0, { damping: 14, stiffness: 180 });
    opacity.value = withTiming(isSelected ? 1 : 0, { duration: 120 });
  }, [isSelected]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <View
      style={[
        styles.dotOuter,
        { borderColor: isSelected ? '#C44B22' : 'rgba(166,149,128,0.5)' },
        isSelected && styles.dotOuterActive,
      ]}
    >
      <Animated.View style={[styles.dotInner, animStyle]} />
    </View>
  );
}

// ─── Section Label ────────────────────────────────────────────────────────────
function SectionLabel({ step, label }: { step: string; label: string }) {
  return (
    <View style={styles.sectionLabelRow}>
      <View style={styles.stepBadge}>
        <Text style={styles.stepBadgeText}>{step}</Text>
      </View>
      <Caption className="text-secondary-text text-xs tracking-widest uppercase font-medium">
        {label}
      </Caption>
    </View>
  );
}

// ─── Goal Card (large tappable tile) ─────────────────────────────────────────
interface GoalCardProps {
  id: string;
  label: string;
  sublabel: string;
  icon: React.ComponentType<{ size: number; color: string; strokeWidth?: number }>;
  isSelected: boolean;
  onPress: () => void;
}

function GoalCard({ id, label, sublabel, icon: Icon, isSelected, onPress }: GoalCardProps) {
  return (
    <PressableAnimated
      onPress={onPress}
      haptic="light"
      scaleTo={0.98}
      style={[
        styles.goalCard,
        isSelected ? styles.goalCardSelected : styles.goalCardIdle,
      ]}
      accessibilityLabel={`Goal: ${label}`}
      accessibilityState={{ selected: isSelected }}
    >
      <View style={styles.goalCardInner}>
        <View style={[styles.goalIconWrap, isSelected && styles.goalIconWrapActive]}>
          <Icon
            size={20}
            color={isSelected ? '#FFFFFF' : '#C44B22'}
            strokeWidth={1.75}
          />
        </View>
        <View style={styles.goalText}>
          <Text style={[styles.goalLabel, isSelected && styles.goalLabelActive]}>{label}</Text>
          <Text style={styles.goalSublabel}>{sublabel}</Text>
        </View>
      </View>
      <SelectionDot isSelected={isSelected} />
    </PressableAnimated>
  );
}

// ─── Pill Chip ────────────────────────────────────────────────────────────────
interface PillChipProps {
  label: string;
  isSelected: boolean;
  onPress: () => void;
  icon?: React.ComponentType<{ size: number; color: string }>;
  accessibilityLabel?: string;
}

function PillChip({ label, isSelected, onPress, icon: Icon, accessibilityLabel }: PillChipProps) {
  return (
    <PressableAnimated
      onPress={onPress}
      haptic="light"
      scaleTo={0.96}
      style={[styles.pill, isSelected ? styles.pillSelected : styles.pillIdle]}
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ selected: isSelected }}
    >
      {Icon && (
        <Icon size={14} color={isSelected ? '#FFFFFF' : '#A69580'} />
      )}
      <Text style={[styles.pillText, isSelected && styles.pillTextSelected]}>{label}</Text>
    </PressableAnimated>
  );
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────
function ProgressBar({ step, total }: { step: number; total: number }) {
  const progress = useSharedValue(step / total);
  React.useEffect(() => {
    progress.value = withTiming(step / total, { duration: 500 });
  }, [step]);
  const barStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));
  return (
    <View style={styles.progressTrack}>
      <Animated.View style={[styles.progressFill, barStyle]} />
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function PersonalizeScreen() {
  const { colors } = useTheme();
  const updateAnswers = useAuthStore((state) => state.updateOnboardingAnswers);
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const isSmallDevice = height < 750;
  const scrollViewRef = useRef<any>(null);

  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [selectedExperience, setSelectedExperience] = useState<string | null>(null);
  const [selectedSchedule, setSelectedSchedule] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);

  // Track how many sections are revealed for the progress bar
  const stepsCompleted =
    (selectedGoal ? 1 : 0) +
    (selectedExperience ? 1 : 0) +
    (selectedSchedule ? 1 : 0) +
    (selectedDuration ? 1 : 0);

  const handleSelectGoal = (goal: string) => {
    setSelectedGoal(goal);
    setTimeout(() => scrollViewRef.current?.scrollTo({ y: 200, animated: true }), 300);
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

  const goals = [
    {
      id: 'stress',
      label: 'Soothe an overactive mind',
      sublabel: 'Pranayama (breathwork), slow postures, and restorative calm',
      icon: Flame,
    },
    {
      id: 'mobility',
      label: 'Release physical stiffness',
      sublabel: 'Asana (posture) sequences targeting tight or overworked joints',
      icon: Bone,
    },
    {
      id: 'philosophy',
      label: 'Study traditional yogic lineage',
      sublabel: 'Dhyana (meditation), lineage philosophy, and contemplative depth',
      icon: BookOpen,
    },
  ];

  const experiences = [
    { id: 'beginner', label: 'Approachable (No experience)' },
    { id: 'intermediate', label: 'Steady (Some experience)' },
    { id: 'advanced', label: 'Deepened (Consistent practice)' },
  ];

  const schedules = [
    { id: 'morning', label: 'Morning (Dinacharya start)', icon: Sun },
    { id: 'afternoon', label: 'Afternoon (Midday reset)', icon: Sunset },
    { id: 'evening', label: 'Evening (Night wind-down)', icon: Moon },
  ];

  const durations = [
    { id: 10, label: '10 min (Focused)' },
    { id: 15, label: '15 min (Balanced)' },
    { id: 20, label: '20 min (Full sequence)' },
    { id: 30, label: '30 min (Deep immersion)' },
  ];

  return (
    <View className="flex-1 bg-background">
      <MandalaThread />

      {/* ── Header ── */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) }]}>
        <View style={styles.headerRow}>
          <PressableAnimated
            style={styles.backBtn}
            onPress={() => router.back()}
            haptic="light"
            accessibilityLabel="Go back"
          >
            <ArrowLeft size={20} color={colors.primaryText} />
          </PressableAnimated>

          <Heading className="text-accent-terracotta tracking-tight text-center text-base">
            Sadhana
          </Heading>

          <View style={styles.backBtn} />
        </View>

        <ProgressBar step={stepsCompleted} total={4} />
      </View>

      {/* ── Scrollable Content ── */}
      <ScrollView
        ref={scrollViewRef}
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: isSmallDevice ? 20 : 28,
          paddingBottom: Math.max(insets.bottom + 96, 128),
        }}
      >
        {/* Intro copy */}
        <View style={styles.introBlock}>
          <Text style={styles.introHeading}>Shape your{'\n'}daily practice</Text>
          <Body className="text-secondary-text text-sm leading-relaxed mt-2">
            Four quick answers and Sadhana builds a routine that actually fits your life.
          </Body>
        </View>

        {/* ─ Q1: Goal ─ */}
        <View style={styles.section}>
          <SectionLabel step="01" label="Your intention" />
          <View style={styles.goalList}>
            {goals.map((g) => (
              <GoalCard
                key={g.id}
                {...g}
                isSelected={selectedGoal === g.id}
                onPress={() => handleSelectGoal(g.id)}
              />
            ))}
          </View>
        </View>

        {/* ─ Q2: Experience ─ */}
        {selectedGoal && (
          <Animated.View entering={FadeInDown.duration(350).springify()} style={styles.section}>
            <SectionLabel step="02" label="Experience level" />
            <View style={styles.chipRow}>
              {experiences.map((opt) => (
                <PillChip
                  key={opt.id}
                  label={opt.label}
                  isSelected={selectedExperience === opt.id}
                  onPress={() => setSelectedExperience(opt.id)}
                  accessibilityLabel={`Experience level: ${opt.label}`}
                />
              ))}
            </View>
            {selectedExperience && (
              <Caption className="text-secondary-text text-xs mt-3 leading-relaxed">
                {selectedExperience === 'beginner'
                  ? 'We keep it safe and approachable. No prior yoga needed.'
                  : selectedExperience === 'intermediate'
                  ? 'You\'ll work with breath holds and deeper posture cues.'
                  : 'Advanced sequences and pranayama techniques await.'}
              </Caption>
            )}
          </Animated.View>
        )}

        {/* ─ Q3: Schedule ─ */}
        {selectedExperience && (
          <Animated.View entering={FadeInDown.duration(350).springify()} style={styles.section}>
            <SectionLabel step="03" label="Best time to practice" />
            <View style={styles.chipRow}>
              {schedules.map((s) => (
                <PillChip
                  key={s.id}
                  label={s.label}
                  isSelected={selectedSchedule === s.id}
                  onPress={() => setSelectedSchedule(s.id)}
                  icon={s.icon}
                  accessibilityLabel={`Practice time: ${s.label}`}
                />
              ))}
            </View>
            {selectedSchedule && (
              <Caption className="text-secondary-text text-xs mt-3 leading-relaxed">
                {selectedSchedule === 'morning'
                  ? 'Energising sequences to wake your body with intention.'
                  : selectedSchedule === 'afternoon'
                  ? 'A midday reset to clear tension and sharpen focus.'
                  : 'Soft, wind-down practices to prepare for restful sleep.'}
              </Caption>
            )}
          </Animated.View>
        )}

        {/* ─ Q4: Duration ─ */}
        {selectedSchedule && (
          <Animated.View entering={FadeInDown.duration(350).springify()} style={styles.section}>
            <SectionLabel step="04" label="Session length" />
            <View style={styles.chipRow}>
              {durations.map((opt) => (
                <PillChip
                  key={opt.id}
                  label={opt.label}
                  isSelected={selectedDuration === opt.id}
                  onPress={() => setSelectedDuration(opt.id)}
                  icon={AlarmClock}
                  accessibilityLabel={`${opt.label} daily`}
                />
              ))}
            </View>
            {selectedDuration && (
              <Caption className="text-secondary-text text-xs mt-3 leading-relaxed">
                {selectedDuration <= 10
                  ? 'Even 10 minutes daily creates measurable nervous system change within a week.'
                  : selectedDuration <= 15
                  ? 'A 15-minute session is the most common "habit anchor" for new practitioners.'
                  : selectedDuration <= 20
                  ? '20 minutes allows a full sequence: breathwork, movement, and short meditation.'
                  : 'A 30-minute practice unlocks the full Sadhana experience — deep and complete.'}
              </Caption>
            )}
          </Animated.View>
        )}

        {/* Completion nudge */}
        {isComplete && (
          <Animated.View entering={FadeInDown.duration(400)} style={styles.completionNote}>
            <Micro className="text-accent-terracotta uppercase tracking-widest">
              ✦ Your profile is ready
            </Micro>
          </Animated.View>
        )}
      </ScrollView>

      {/* ── Sticky Continue Button ── */}
      <View
        style={[
          styles.stickyFooter,
          {
            paddingBottom: Math.max(insets.bottom, 20),
            backgroundColor: colors.background,
            borderTopColor: 'rgba(166,149,128,0.1)',
          },
        ]}
      >
        <PressableAnimated
          style={[styles.continueBtn, !isComplete && styles.continueBtnDisabled]}
          disabled={!isComplete}
          onPress={handleContinue}
          haptic={isComplete ? 'medium' : 'none'}
          accessibilityLabel="Continue to breathing space screen"
        >
          <Text style={styles.continueBtnText}>
            {isComplete ? 'Build My Practice →' : 'Answer all 4 to continue'}
          </Text>
        </PressableAnimated>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Header
  header: {
    width: '100%',
    backgroundColor: 'transparent',
    zIndex: 40,
    paddingBottom: 0,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  progressTrack: {
    height: 2,
    width: '100%',
    backgroundColor: 'rgba(166,149,128,0.15)',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#C44B22',
    borderRadius: 2,
  },
  // Intro
  introBlock: {
    marginBottom: 32,
  },
  introHeading: {
    fontFamily: 'CormorantGaramond-Bold',
    fontSize: 36,
    lineHeight: 42,
    color: 'inherit' as any,
  },
  // Section
  section: {
    marginBottom: 32,
  },
  sectionLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  stepBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(196,75,34,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBadgeText: {
    fontFamily: 'DMSans-Bold',
    fontSize: 9,
    color: '#C44B22',
    letterSpacing: 0.5,
  },
  // Goal cards
  goalList: {
    gap: 10,
  },
  goalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1.5,
  },
  goalCardIdle: {
    borderColor: 'rgba(166,149,128,0.3)',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  goalCardSelected: {
    borderColor: '#C44B22',
    backgroundColor: 'rgba(196,75,34,0.07)',
    shadowColor: '#C44B22',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 2,
  },
  goalCardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
    marginRight: 10,
  },
  goalIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(196,75,34,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  goalIconWrapActive: {
    backgroundColor: '#C44B22',
  },
  goalText: {
    flex: 1,
  },
  goalLabel: {
    fontFamily: 'DMSans-Medium',
    fontSize: 14,
    color: 'rgba(8,6,3,0.9)',
    marginBottom: 2,
  },
  goalLabelActive: {
    fontFamily: 'DMSans-Bold',
    color: '#C44B22',
  },
  goalSublabel: {
    fontFamily: 'DMSans-Regular',
    fontSize: 11,
    color: 'rgba(166,149,128,0.9)',
    lineHeight: 15,
  },
  // Selection dot
  dotOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  dotOuterActive: {
    backgroundColor: '#C44B22',
  },
  dotInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  // Pill chips
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 100,
    borderWidth: 1.5,
  },
  pillIdle: {
    borderColor: 'rgba(166,149,128,0.35)',
    backgroundColor: 'transparent',
  },
  pillSelected: {
    borderColor: '#C44B22',
    backgroundColor: '#C44B22',
    shadowColor: '#C44B22',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  pillText: {
    fontFamily: 'DMSans-Medium',
    fontSize: 13,
    color: '#A69580',
  },
  pillTextSelected: {
    color: '#FFFFFF',
    fontFamily: 'DMSans-Bold',
  },
  // Completion
  completionNote: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  // Footer
  stickyFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingTop: 14,
    borderTopWidth: 1,
  },
  continueBtn: {
    width: '100%',
    height: 52,
    borderRadius: 16,
    backgroundColor: '#C44B22',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#C44B22',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  continueBtnDisabled: {
    backgroundColor: 'rgba(196,75,34,0.35)',
    shadowOpacity: 0,
    elevation: 0,
  },
  continueBtnText: {
    fontFamily: 'DMSans-Bold',
    fontSize: 15,
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
});
