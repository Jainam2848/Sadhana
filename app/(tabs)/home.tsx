
import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Platform, AccessibilityInfo, Switch, Alert, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Sparkles, Play, ArrowLeft, Download, Lock, Moon, Move, Wind, ChevronDown } from 'lucide-react-native';
import Svg, { Defs, LinearGradient, Stop, Path, Circle, G, Rect, RadialGradient } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withDelay,
  withSequence,
  withSpring,
  Easing,
  cancelAnimation,
  runOnJS,
} from 'react-native-reanimated';
import { useAuthStore } from '@/stores/authStore';
import { useTheme } from '@/hooks/useTheme';
import { useProfile, useTodayPlan, useRoutines } from '@/hooks/api';
import { useTimeOfDayTheme } from '@/hooks/useTimeOfDayTheme';
import { Text } from '@/components/ui/Text';
import { PressableAnimated } from '@/components/ui/PressableAnimated';
import { HomeSkeleton } from '@/components/ui/Skeletons';
import { ErrorState } from '@/components/ui/ErrorState';
import { Heading, Caption, Micro } from '@/components/ui/Typography';
import { PracticeIcon } from '@/components/ui/PracticeIcon';
import { Divider } from '@/components/ui/Divider';
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface SessionItem {
  label: string;
  title: string;
  duration: string;
}

const recentSessions: SessionItem[] = [
  { label: 'Yesterday', title: 'Evening Wind Down', duration: '15 min' },
  { label: 'Saturday', title: 'Core Awakening', duration: '20 min' },
  { label: 'Friday', title: 'Restorative Silence', duration: '10 min' },
];

const morningIntentions = [
  "Awaken your body and mind with fresh breath.",
  "Greet the day with clarity and steady purpose.",
  "Breathe in vitality, breathe out sleep.",
  "May your energy rise like the morning sun.",
];

const afternoonIntentions = [
  "Find stillness in the middle of action.",
  "Calm your focus, center your thoughts.",
  "Be present in this passing moment.",
  "May your mind remain steady like a flame.",
];

const eveningIntentions = [
  "Let go of what you cannot control.",
  "Slow down and absorb the day's wisdom.",
  "Breathe in peace, breathe out tension.",
  "Stillness is the sanctuary of the soul.",
];

const nightIntentions = [
  "Rest deep and surrender to silence.",
  "Enter the space between thoughts.",
  "Release the day; your practice is complete.",
  "Find comfort in quiet contemplation.",
];



function RotatingMandala({
  reduceMotion,
}: {
  reduceMotion: boolean;
}) {
  const { colors } = useTheme();
  const rotation = useSharedValue(0);

  useEffect(() => {
    if (reduceMotion) {
      rotation.value = 0;
      return;
    }
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 90000,
        easing: Easing.linear,
      }),
      -1,
      false
    );

    return () => {
      cancelAnimation(rotation);
    };
  }, [reduceMotion]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const strokeColor = colors.accent;

  return (
    <Animated.View
      style={[styles.mandalaContainer, animatedStyle]}
      pointerEvents="none"
    >
      <Svg width="220" height="220" viewBox="0 0 100 100">
        <G stroke={strokeColor} strokeWidth="0.4" fill="none" opacity="0.08">
          <Circle cx="50" cy="50" r="45" strokeDasharray="1,1" />
          <Circle cx="50" cy="50" r="40" />
          <Circle cx="50" cy="50" r="32" strokeDasharray="2,1" />
          <Circle cx="50" cy="50" r="22" />
          <Circle cx="50" cy="50" r="12" />

          <Path d="M50 5 L50 95" />
          <Path d="M5 50 L95 50" />
          <Path d="M18.2 18.2 L81.8 81.8" />
          <Path d="M18.2 81.8 L81.8 18.2" />

          <Circle cx="50" cy="28" r="8" />
          <Circle cx="50" cy="72" r="8" />
          <Circle cx="28" cy="50" r="8" />
          <Circle cx="72" cy="50" r="8" />

          <Circle cx="34.4" cy="34.4" r="6" />
          <Circle cx="65.6" cy="65.6" r="6" />
          <Circle cx="34.4" cy="65.6" r="6" />
          <Circle cx="65.6" cy="34.4" r="6" />
        </G>
      </Svg>
    </Animated.View>
  );
}

const AnimatedPath = Animated.createAnimatedComponent(Path) as any;
const AnimatedG = Animated.createAnimatedComponent(G) as any;

function AnimatedSunrise({ reduceMotion }: { reduceMotion: boolean }) {
  const { colors } = useTheme();
  const breath = useSharedValue(0);

  useEffect(() => {
    if (reduceMotion) {
      breath.value = 0.5;
      return;
    }
    breath.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 4000, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 4000, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );
    return () => {
      cancelAnimation(breath);
    };
  }, [reduceMotion]);

  const animatedSunStyle = useAnimatedStyle(() => {
    const scale = 1 + breath.value * 0.12;
    const translateY = -breath.value * 5;
    return {
      transform: [
        { scale },
        { translateY }
      ]
    };
  });

  const animatedGlowStyle = useAnimatedStyle(() => {
    const opacity = 0.35 + breath.value * 0.45;
    return {
      opacity
    };
  });

  return (
    <View style={styles.sunriseContainer}>
      <Svg width="180" height="100" viewBox="0 0 180 100" style={styles.sunriseSvg}>
        <Defs>
          <RadialGradient id="sunGlow" cx="50%" cy="100%" r="50%">
            <Stop offset="0%" stopColor={colors.accent} stopOpacity="1" />
            <Stop offset="50%" stopColor={colors.accent} stopOpacity="0.4" />
            <Stop offset="100%" stopColor={colors.accent} stopOpacity="0" />
          </RadialGradient>
        </Defs>

        {/* Glow */}
        <AnimatedPath
          d="M 10 100 A 80 80 0 0 1 170 100 Z"
          fill="url(#sunGlow)"
          style={animatedGlowStyle}
        />

        {/* Sunrise Horizon Line */}
        <Path
          d="M 10 100 L 170 100"
          stroke={colors.border}
          strokeWidth="1.2"
          opacity={0.4}
        />

        {/* Rising Sun */}
        <AnimatedG style={animatedSunStyle}>
          <Path
            d="M 60 100 A 30 30 0 0 1 120 100 Z"
            fill={colors.accent}
            opacity={0.8}
          />
          <Path
            d="M 48 100 A 42 42 0 0 1 132 100"
            fill="none"
            stroke={colors.accent}
            strokeWidth="0.8"
            strokeDasharray="2,3"
            opacity={0.4}
          />
        </AnimatedG>
      </Svg>
    </View>
  );
}

export default function HomeScreen() {
  const theme = useTheme();
  const { colors, spacing, borderRadius, dark, motion, shadows } = theme;
  const insets = useSafeAreaInsets();
  const bottomTabBarHeight = 84; // h-16 (64) + pb-4 (16) + pt-1 (4)
  const ctaBottomPosition = bottomTabBarHeight + insets.bottom + 8;
  const user = useAuthStore((state) => state.user);
  const dailyCheckIn = useAuthStore((state) => state.dailyCheckIn);
  const submitDailyCheckIn = useAuthStore((state) => state.submitDailyCheckIn);
  const timeOfDay = useTimeOfDayTheme();

  const [tuneMode, setTuneMode] = useState<'restore' | 'steady' | 'energize'>('steady');
  const [reduceMotionEnabled, setReduceMotionEnabled] = useState(false);
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [offlineEnabled, setOfflineEnabled] = useState(false);
  const expansionProgress = useSharedValue(0);

  const today = useMemo(() => new Date(), []);
  const formattedDate = useMemo(
    () =>
      today.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      }),
    [today]
  );
  const dayOfWeek = today.getDay();

  const { data: profile, isLoading: isProfileLoading, isError: isProfileError, refetch: refetchProfile } = useProfile(user?.id);
  const isPremium = profile?.premium || user?.premium || false;
  const { data: allRoutines } = useRoutines();
  const { data: planData, isLoading: isPlanLoading, isError: isPlanError, refetch: refetchPlan } = useTodayPlan(user?.id, isPremium, dayOfWeek);

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const isCheckedInToday = dailyCheckIn && dailyCheckIn.date === todayStr;

  const dailyProgress = useMemo(() => {
    return isCheckedInToday ? 0.72 : 0.25;
  }, [isCheckedInToday]);

  const greeting = useMemo(() => {
    const hours = today.getHours();
    const name = profile?.username ? `, ${profile.username.split(' ')[0]}` : '';
    if (hours >= 5 && hours < 12) return `GOOD MORNING${name.toUpperCase()}`;
    if (hours >= 12 && hours < 17) return `GOOD AFTERNOON${name.toUpperCase()}`;
    if (hours >= 17 && hours < 21) return `GOOD EVENING${name.toUpperCase()}`;
    return `GOOD NIGHT${name.toUpperCase()}`;
  }, [today, profile?.username]);

  const dailyIntention = useMemo(() => {
    const hours = today.getHours();
    let list = afternoonIntentions;
    if (hours >= 5 && hours < 12) list = morningIntentions;
    else if (hours >= 12 && hours < 18) list = afternoonIntentions;
    else if (hours >= 18 && hours < 21) list = eveningIntentions;
    else list = nightIntentions;

    const index = (today.getDate() + today.getMonth()) % list.length;
    return list[index];
  }, [today]);

  // Redesigned Staggered Entrance and Hover Shared Values
  const headerOpacity = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(20);
  const orbScale = useSharedValue(0.7);
  const orbOpacity = useSharedValue(0);
  const panelOpacity = useSharedValue(0);
  const panelTranslateY = useSharedValue(24);
  const ctaOpacity = useSharedValue(0);
  const ctaTranslateY = useSharedValue(16);

  // Floating hover animation for the glass panel
  const hoverTranslation = useSharedValue(0);

  // Floating CTA Glow Loop
  const ctaGlowScale = useSharedValue(1);
  const ctaGlowOpacity = useSharedValue(0.04);

  // Custom sliding segmented pill background alignment values
  const [containerWidth, setContainerWidth] = useState(0);
  const pillTranslateX = useSharedValue(1); // Default to steady (1)

  // Sync state with OS reduced motion
  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      setReduceMotionEnabled(enabled);
    });

    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      (enabled) => {
        setReduceMotionEnabled(enabled);
      }
    );

    return () => {
      subscription.remove();
    };
  }, []);

  // Sync selection state with previous check-in on mount
  useEffect(() => {
    if (isCheckedInToday && dailyCheckIn) {
      if (dailyCheckIn.energy === 'low') {
        setTuneMode('restore');
        pillTranslateX.value = 0;
      } else if (dailyCheckIn.energy === 'high' && dailyCheckIn.mind === 'steady') {
        setTuneMode('steady');
        pillTranslateX.value = 1;
      }
    }
  }, [isCheckedInToday, dailyCheckIn]);

  // Entrance spring trigger
  useEffect(() => {
    if (reduceMotionEnabled) {
      headerOpacity.value = 1;
      titleOpacity.value = 1;
      titleTranslateY.value = 0;
      orbScale.value = 1;
      orbOpacity.value = 1;
      panelOpacity.value = 1;
      panelTranslateY.value = 0;
      ctaOpacity.value = 1;
      ctaTranslateY.value = 0;
      hoverTranslation.value = 0;
      ctaGlowScale.value = 1;
      ctaGlowOpacity.value = 0;
      return;
    }

    // Staggered reveal animations using standard design tokens
    headerOpacity.value = withTiming(1, { duration: motion.duration.slow });

    titleOpacity.value = withDelay(motion.duration.quick, withTiming(1, { duration: motion.duration.slow }));
    titleTranslateY.value = withDelay(motion.duration.quick, withSpring(0, motion.spring.calm));

    orbOpacity.value = withDelay(motion.duration.standard, withTiming(1, { duration: motion.duration.slow }));
    orbScale.value = withDelay(motion.duration.standard, withSpring(1, motion.spring.calm));

    panelOpacity.value = withDelay(motion.duration.slow, withTiming(1, { duration: motion.duration.slow }));
    panelTranslateY.value = withDelay(motion.duration.slow, withSpring(0, motion.spring.calm));

    ctaOpacity.value = withDelay(motion.duration.slow + motion.duration.quick, withTiming(1, { duration: motion.duration.slow }));
    ctaTranslateY.value = withDelay(motion.duration.slow + motion.duration.quick, withSpring(0, motion.spring.calm));

    // Note: Removed hoverTranslation looping animation to align with Rule 2 (only one primary moving element).
    hoverTranslation.value = 0;

    // Glowing CTA Halo Loop - extremely subtle peripheral animation
    ctaGlowScale.value = withRepeat(
      withTiming(1.03, { duration: 3000, easing: Easing.inOut(Easing.quad) }),
      -1,
      true
    );
    ctaGlowOpacity.value = withRepeat(
      withTiming(0.06, { duration: 3000, easing: Easing.inOut(Easing.quad) }),
      -1,
      true
    );

    return () => {
      cancelAnimation(headerOpacity);
      cancelAnimation(titleOpacity);
      cancelAnimation(titleTranslateY);
      cancelAnimation(orbScale);
      cancelAnimation(orbOpacity);
      cancelAnimation(panelOpacity);
      cancelAnimation(panelTranslateY);
      cancelAnimation(ctaOpacity);
      cancelAnimation(ctaTranslateY);
      cancelAnimation(hoverTranslation);
      cancelAnimation(ctaGlowScale);
      cancelAnimation(ctaGlowOpacity);
    };
  }, [reduceMotionEnabled]);

  // Entrance animated styles mapping
  const animatedHeaderStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value * (1 - expansionProgress.value),
  }));

  const animatedTitleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value * (1 - expansionProgress.value),
    transform: [
      { translateY: titleTranslateY.value },
      { scale: 1 - 0.1 * expansionProgress.value }
    ],
  }));

  const animatedOrbStyle = useAnimatedStyle(() => ({
    opacity: orbOpacity.value * (1 - expansionProgress.value),
    transform: [
      { scale: orbScale.value * (1 - 0.2 * expansionProgress.value) }
    ],
  }));

  const animatedPanelStyle = useAnimatedStyle(() => ({
    opacity: panelOpacity.value * (1 - expansionProgress.value),
    transform: [
      { translateY: panelTranslateY.value + hoverTranslation.value },
      { scale: 1 - 0.05 * expansionProgress.value }
    ],
  }));

  const animatedCtaStyle = useAnimatedStyle(() => ({
    opacity: ctaOpacity.value * (1 - expansionProgress.value),
    transform: [
      { translateY: ctaTranslateY.value },
      { scale: 1 - 0.05 * expansionProgress.value }
    ],
  }));

  const animatedCtaGlowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ctaGlowScale.value }],
    opacity: ctaGlowOpacity.value * (1 - expansionProgress.value),
  }));

  const animatedMandalaStyle = useAnimatedStyle(() => {
    const progress = expansionProgress.value;
    const tx = progress * (SCREEN_WIDTH / 2 - 40);
    const initialTop = Platform.OS === 'ios' ? 75 : 55;
    const ty = progress * (-initialTop - 20); // shifts to top: -20
    const scaleVal = 1 + progress * 0.36; // scales from 220 to 300
    
    return {
      transform: [
        { translateX: tx },
        { translateY: ty },
        { scale: scaleVal }
      ],
    };
  });

  const animatedMorphPanelStyle = useAnimatedStyle(() => {
    const progress = expansionProgress.value;
    
    // Interpolating coordinates from inline glassPanel to fullscreen:
    const left = (1 - progress) * 24;
    const right = (1 - progress) * 24;
    // Estimated initial top offset is 450, final is 0:
    const top = (1 - progress) * 440;
    // Estimated initial height is 230, final is full screen:
    const height = 230 + progress * (SCREEN_HEIGHT - 230);
    const borderRadiusVal = (1 - progress) * 24;
    
    return {
      left,
      right,
      top,
      height,
      borderRadius: borderRadiusVal,
      opacity: progress,
    };
  });

  const animatedSliderStyle = useAnimatedStyle(() => {
    const step = containerWidth / 3;
    return {
      transform: [{ translateX: pillTranslateX.value * step }],
    };
  });

  const plan = useMemo(() => {
    if (!planData) return null;
    if (!isCheckedInToday || !allRoutines) return planData;

    const userLevel = planData.asana?.experience_level || 'beginner';
    let asanas = allRoutines.filter((r) => r.category === 'asana');
    if (!isPremium) asanas = asanas.filter((r) => !r.is_premium);
    asanas = asanas.filter((r) => r.experience_level === userLevel || r.experience_level === 'beginner');
    asanas =
      dailyCheckIn.energy === 'low'
        ? asanas.filter((r) => r.goals?.includes('stress') || r.goals?.includes('mobility'))
        : asanas.filter((r) => r.goals?.includes('strength') || r.goals?.includes('focus') || r.goals?.includes('mobility'));

    let pranayamas = allRoutines.filter((r) => r.category === 'pranayama');
    if (!isPremium) pranayamas = pranayamas.filter((r) => !r.is_premium);
    if (dailyCheckIn.mind === 'restless') {
      pranayamas = pranayamas.filter((r) => r.goals?.includes('stress') || r.goals?.includes('sleep'));
    }

    let dhyanas = allRoutines.filter((r) => r.category === 'dhyana');
    if (!isPremium) dhyanas = dhyanas.filter((r) => !r.is_premium);

    return {
      ...planData,
      asana: asanas[dayOfWeek % Math.max(asanas.length, 1)] || planData.asana,
      pranayama: pranayamas[dayOfWeek % Math.max(pranayamas.length, 1)] || planData.pranayama,
      dhyana: dhyanas[dayOfWeek % Math.max(dhyanas.length, 1)] || planData.dhyana,
    };
  }, [planData, isCheckedInToday, allRoutines, isPremium, dailyCheckIn, dayOfWeek]);

  const totalDuration = useMemo(() => {
    return (
      (plan?.asana?.duration_minutes || 0) +
      (plan?.pranayama?.duration_minutes || 0) +
      (plan?.dhyana?.duration_minutes || 0) || 15
    );
  }, [plan]);

  const handleRetry = useCallback(() => {
    refetchProfile();
    refetchPlan();
  }, [refetchProfile, refetchPlan]);

  const handlePrepareRoutine = useCallback(() => {
    if (!plan) return;
    setIsConfiguring(true);
    expansionProgress.value = withTiming(1, { duration: motion.duration.slow, easing: Easing.bezier(0.25, 1, 0.5, 1) });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  }, [plan]);

  const handleCloseConfig = useCallback(() => {
    expansionProgress.value = withTiming(0, { duration: motion.duration.slow, easing: Easing.bezier(0.25, 1, 0.5, 1) }, (finished) => {
      if (finished) {
        runOnJS(setIsConfiguring)(false);
      }
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  }, []);

  const handleStartPractice = useCallback(() => {
    if (!plan || !plan.asana) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    
    // Auto-close configuration so it's clean when we return from player
    setIsConfiguring(false);
    expansionProgress.value = 0;

    router.push({
      pathname: '/active-routine',
      params: {
        planId: plan.id,
        asanaId: plan.asana.id,
        asanaDuration: plan.asana.duration_minutes?.toString() || '5',
        pranayamaId: plan.pranayama?.id,
        pranayamaDuration: plan.pranayama?.duration_minutes?.toString() || '4',
        dhyanaId: plan.dhyana?.id,
        dhyanaDuration: plan.dhyana?.duration_minutes?.toString() || '3',
      },
    });
  }, [plan]);

  const handleOfflineToggle = useCallback((value: boolean) => {
    if (!isPremium) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
      Alert.alert(
        'Offline is premium',
        'Download rituals for travel, retreats, and low-signal mornings with Sadhana Premium.',
        [
          { text: 'Later', style: 'cancel' },
          {
            text: 'See Premium',
            onPress: () => {
              setIsConfiguring(false);
              expansionProgress.value = 0;
              router.push('/(auth)/paywall');
            },
          },
        ]
      );
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setOfflineEnabled(value);
  }, [isPremium]);

  // Adjust plan quietly when clicking a segmented mood option
  const selectMood = useCallback((mood: 'restore' | 'steady' | 'energize') => {
    setTuneMode(mood);
    let energy: 'high' | 'low' = 'high';
    let body: 'clear' | 'tight' = 'clear';
    let mind: 'steady' | 'restless' = 'steady';

    if (mood === 'restore') {
      energy = 'low';
      body = 'tight';
      mind = 'restless';
      pillTranslateX.value = withSpring(0, { damping: 18, stiffness: 120 });
    } else if (mood === 'steady') {
      pillTranslateX.value = withSpring(1, { damping: 18, stiffness: 120 });
    } else if (mood === 'energize') {
      energy = 'high';
      body = 'clear';
      mind = 'steady';
      pillTranslateX.value = withSpring(2, { damping: 18, stiffness: 120 });
    }

    submitDailyCheckIn(energy, body, mind);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [submitDailyCheckIn]);

  const isLoading = isPlanLoading || isProfileLoading;
  const isError = isProfileError || isPlanError;

  if (isError) return <ErrorState onRetry={handleRetry} />;
  if (isLoading) return <HomeSkeleton />;

  const glassPanelStyle = {
    backgroundColor: dark ? 'rgba(32, 28, 25, 0.45)' : 'rgba(255, 255, 255, 0.45)',
    borderColor: dark ? 'rgba(32, 28, 25, 0.06)' : 'rgba(255, 255, 255, 0.25)',
  };

  return (
    <View style={[styles.container, { backgroundColor: 'transparent' }]}>
      <StatusBar style={dark ? 'light' : 'dark'} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Immersive Hero Section Container */}
        <View style={styles.heroContainer}>

          <Animated.View style={[styles.mandalaWrapper, animatedMandalaStyle]}>
            <RotatingMandala reduceMotion={reduceMotionEnabled} />
          </Animated.View>

          {/* Minimalist Floating Header */}
          <Animated.View style={[styles.heroHeader, animatedHeaderStyle]}>
            <Text variant="body" weight="medium" style={[styles.dateText, { color: colors.secondaryText }]}>
              {formattedDate}
            </Text>
            <PressableAnimated
              haptic="light"
              scaleTo={0.96}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              accessibilityRole="button"
              accessibilityLabel="View profile settings"
              onPress={() => router.push('/profile')}
              style={[styles.profilePlaceholder, { borderColor: colors.border }]}
            >
              <Text variant="body" weight="medium" style={{ color: colors.secondaryText, fontSize: 11 }}>
                {profile?.username ? profile.username.split(' ').map((n) => n[0]).join('').toUpperCase() : 'OM'}
              </Text>
            </PressableAnimated>
          </Animated.View>

          {/* Hero text branding & dynamic intention */}
          <Animated.View style={[styles.heroTextSection, animatedTitleStyle]}>
            <Text variant="body" weight="medium" style={[styles.greetingText, { color: colors.manuscriptGold }]}>
              {greeting}
            </Text>
            <Text variant="display" weight="bold" style={[styles.heroTitle, { color: colors.primaryText }]}>
              Begin with{"\n"}one quiet breath.
            </Text>
          </Animated.View>

          {/* Centralized Breathing Sunrise */}
          <Animated.View style={[styles.breathingSection, animatedOrbStyle]}>
            <AnimatedSunrise reduceMotion={reduceMotionEnabled} />
          </Animated.View>

          {/* Subtle Down Arrow chevron guide */}
          <Animated.View style={[styles.chevronDown, animatedTitleStyle]}>
            <ChevronDown size={16} color={colors.secondaryText} style={{ opacity: 0.6 }} />
          </Animated.View>

          {/* Today's Ritual Block (directly on the page) */}
          <Animated.View style={[styles.ritualContainer, animatedPanelStyle]}>
            <Text style={[styles.ritualLabel, { color: colors.secondaryText }]}>
              Today's Ritual
            </Text>
            <Text variant="stat" style={[styles.ritualDuration, { color: colors.primaryText }]}>
              {totalDuration} MIN
            </Text>
            <Text style={[styles.ritualBreakdown, { color: colors.primaryText }]}>
              {plan?.asana ? 'Asana' : ''}
              {plan?.pranayama ? ' • Pranayama' : ''}
              {plan?.dhyana ? ' • Meditation' : ''}
            </Text>

            {/* Clean inline text mood links switcher */}
            <View style={styles.moodLinksRow}>
              {(['restore', 'steady', 'energize'] as const).map((mood) => {
                const isActive = tuneMode === mood;
                return (
                  <PressableAnimated
                    key={mood}
                    haptic="light"
                    scaleTo={0.96}
                    onPress={() => selectMood(mood)}
                    style={styles.moodLink}
                    accessibilityRole="tab"
                    accessibilityState={{ selected: isActive }}
                    accessibilityLabel={`${mood} mode`}
                  >
                    <Text
                      style={[
                        styles.moodLinkText,
                        {
                          color: isActive ? colors.accent : colors.secondaryText,
                          fontWeight: isActive ? '700' : '400',
                        }
                      ]}
                    >
                      {mood.charAt(0).toUpperCase() + mood.slice(1)}
                    </Text>
                    {isActive && (
                      <View style={[styles.moodDot, { backgroundColor: colors.accent }]} />
                    )}
                  </PressableAnimated>
                );
              })}
            </View>
          </Animated.View>

          {/* Clean wide CTA button */}
          <Animated.View style={[styles.ctaWrapper, animatedCtaStyle]}>
            <PressableAnimated
              haptic="medium"
              scaleTo={0.98}
              style={[styles.glowingCTA, { backgroundColor: colors.accent }]}
              onPress={handlePrepareRoutine}
              accessibilityRole="button"
              accessibilityLabel="Begin today's practice"
              accessibilityHint="Launches the guided session configurator"
            >
              <Play size={14} color="#FFFFFF" fill="#FFFFFF" />
              <Text variant="body" weight="bold" style={styles.glowingCTAText}>
                Begin Practice
              </Text>
            </PressableAnimated>
          </Animated.View>
        </View>

        {/* Lower page content */}
        <View style={styles.lowerContent}>
          {/* Alignment Statistics Section */}
          <View style={[styles.alignmentRow, { borderColor: colors.border }]}>
            <View style={styles.alignmentItem}>
              <PracticeIcon type="diya" size={15} streakIntensity={0.8} />
              <Text variant="body" weight="medium" style={[styles.alignmentText, { color: colors.primaryText }]}>
                12 Day Streak
              </Text>
            </View>
            <View style={[styles.alignmentLineDivider, { backgroundColor: colors.border }]} />
            <View style={styles.alignmentItem}>
              <Sparkles size={14} color={colors.manuscriptGold} strokeWidth={1.8} />
              <Text variant="body" weight="medium" style={[styles.alignmentText, { color: colors.primaryText }]}>
                {profile?.karma_coins ?? 0} Karma Coins
              </Text>
            </View>
          </View>

          {/* Recent Practice Journal */}
          <View style={styles.recentSection}>
            <Text variant="body" weight="medium" style={[styles.sectionTitle, { color: colors.secondaryText }]}>
              Recent Practice
            </Text>
            {recentSessions.map((session, index) => (
              <React.Fragment key={`${session.label}-${session.title}`}>
                {index > 0 && <Divider variant="carved" className="my-1" />}
                <View
                  style={styles.recentRow}
                >
                  <View style={styles.recentLeft}>
                    <Text variant="body" weight="medium" style={[styles.recentLabel, { color: colors.secondaryText }]}>
                      {session.label}
                    </Text>
                    <Text variant="body" weight="bold" style={[styles.recentTitle, { color: colors.primaryText }]} numberOfLines={1}>
                      {session.title}
                    </Text>
                  </View>
                  <Text variant="body" style={[styles.recentDuration, { color: colors.secondaryText }]}>
                    {session.duration}
                  </Text>
                </View>
              </React.Fragment>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Routine Configuration Content Morph Overlay */}
      {isConfiguring && (
        <Animated.View
          style={[
            styles.morphOverlay,
            {
              backgroundColor: dark ? 'rgba(32, 28, 25, 0.96)' : 'rgba(253, 250, 245, 0.96)',
            },
            animatedMorphPanelStyle
          ]}
        >
          <View style={styles.morphHeader}>
            <PressableAnimated
              haptic="light"
              style={styles.morphBackButton}
              onPress={handleCloseConfig}
              accessibilityLabel="Go back"
            >
              <ArrowLeft size={20} color={colors.primaryText} />
            </PressableAnimated>
            <Micro className="text-secondary-text">PREPARE</Micro>
            <View style={{ width: 44 }} />
          </View>

          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={[
              styles.morphScrollContent,
              { paddingBottom: 120 + ctaBottomPosition }
            ]}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.morphHeroBlock}>
              <Heading className="text-primary-text text-[36px] leading-[38px] font-bold">
                Enter gently.
              </Heading>
              <Caption className="text-secondary-text text-[15px] leading-6 mt-3 max-w-[310px]">
                Your practice opens with movement, settles into breath, and closes in quiet attention.
              </Caption>
            </View>

            <View style={[styles.morphDurationBand, { borderColor: colors.border }]}>
              <View>
                <Text className="font-mono text-primary-text text-[44px] leading-[48px]">{totalDuration}</Text>
                <Caption className="text-secondary-text -mt-1">minutes total</Caption>
              </View>
              <View style={styles.morphPhaseDots}>
                {[0, 1, 2].map((item) => (
                  <View key={item} style={[styles.morphPhaseDot, { backgroundColor: item === 0 ? colors.accent : colors.border }]} />
                ))}
              </View>
            </View>

            <View style={styles.morphSequenceList} accessibilityLabel="Today's practice sequence">
              {plan?.asana && (
                <View style={styles.morphSequenceRow}>
                  <View style={[styles.morphSequenceRail, { backgroundColor: colors.accent }]} />
                  <View style={[styles.morphSequenceIcon, { borderColor: colors.accent }]}>
                    <Move size={18} color={colors.accent} strokeWidth={1.8} />
                  </View>
                  <View style={styles.morphSequenceCopy}>
                    <Text className="font-sans text-[11px] uppercase tracking-[1.4px] text-secondary-text">
                      Asana
                    </Text>
                    <Text className="font-sans font-bold text-[15px] text-primary-text mt-1" numberOfLines={1}>
                      {plan.asana.title}
                    </Text>
                  </View>
                  <Text className="font-mono text-[16px] text-secondary-text">{plan.asana.duration_minutes}m</Text>
                </View>
              )}

              {plan?.pranayama && (
                <View style={styles.morphSequenceRow}>
                  <View style={[styles.morphSequenceRail, { backgroundColor: colors.accent }]} />
                  <View style={[styles.morphSequenceIcon, { borderColor: colors.accent }]}>
                    <Wind size={18} color={colors.accent} strokeWidth={1.8} />
                  </View>
                  <View style={styles.morphSequenceCopy}>
                    <Text className="font-sans text-[11px] uppercase tracking-[1.4px] text-secondary-text">
                      Pranayama
                    </Text>
                    <Text className="font-sans font-bold text-[15px] text-primary-text mt-1" numberOfLines={1}>
                      {plan.pranayama.title}
                    </Text>
                  </View>
                  <Text className="font-mono text-[16px] text-secondary-text">{plan.pranayama.duration_minutes}m</Text>
                </View>
              )}

              {plan?.dhyana && (
                <View style={styles.morphSequenceRow}>
                  <View style={[styles.morphSequenceRail, { backgroundColor: colors.accent }]} />
                  <View style={[styles.morphSequenceIcon, { borderColor: colors.accent }]}>
                    <Moon size={18} color={colors.accent} strokeWidth={1.8} />
                  </View>
                  <View style={styles.morphSequenceCopy}>
                    <Text className="font-sans text-[11px] uppercase tracking-[1.4px] text-secondary-text">
                      Dhyana
                    </Text>
                    <Text className="font-sans font-bold text-[15px] text-primary-text mt-1" numberOfLines={1}>
                      {plan.dhyana.title}
                    </Text>
                  </View>
                  <Text className="font-mono text-[16px] text-secondary-text">{plan.dhyana.duration_minutes}m</Text>
                </View>
              )}
            </View>

            <View style={[styles.morphOfflineRow, { borderColor: colors.border }]}>
              <View className="flex-row items-center gap-3 flex-1">
                <View style={[styles.morphDownloadIcon, { backgroundColor: colors.highlight }]}>
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

          <View
            style={[
              styles.morphStickyCta,
              {
                bottom: ctaBottomPosition,
                backgroundColor: 'transparent',
              }
            ]}
          >
            <PressableAnimated
              haptic="medium"
              scaleTo={0.98}
              style={[styles.morphStartButton, { backgroundColor: colors.accent }]}
              onPress={handleStartPractice}
              accessibilityLabel="Start today's Sadhana practice"
            >
              <Text className="text-white font-sans font-bold text-[15px]">Start Ritual</Text>
              <Play size={17} color="#FFFFFF" fill="#FFFFFF" />
            </PressableAnimated>
          </View>
        </Animated.View>
      )}
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
    paddingBottom: 110,
  },
  heroContainer: {
    width: '100%',
    position: 'relative',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 56 : 36,
    paddingBottom: 28,
    overflow: 'hidden',
  },
  heroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    zIndex: 2,
  },
  dateText: {
    fontSize: 13,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  profilePlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mandalaWrapper: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 75 : 55,
    left: '50%',
    marginLeft: -110,
    width: 220,
    height: 220,
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTextSection: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    marginBottom: 20,
    marginTop: 10,
  },
  greetingText: {
    fontSize: 11,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    marginBottom: 6,
    opacity: 0.8,
  },
  heroTitle: {
    fontSize: 32,
    lineHeight: 38,
    textAlign: 'center',
    maxWidth: 290,
    marginBottom: 10,
  },
  intentionText: {
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
    maxWidth: 260,
    fontStyle: 'italic',
  },
  breathingSection: {
    zIndex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  sunriseContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    zIndex: 2,
  },
  sunriseSvg: {
    overflow: 'visible',
  },
  chevronDown: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
    zIndex: 2,
  },
  ritualContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
    zIndex: 2,
  },
  ritualLabel: {
    fontSize: 11,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    marginBottom: 4,
    opacity: 0.6,
  },
  ritualDuration: {
    fontSize: 40,
    lineHeight: 46,
    marginBottom: 6,
  },
  ritualBreakdown: {
    fontSize: 14,
    letterSpacing: 0.5,
    opacity: 0.85,
    marginBottom: 16,
    textAlign: 'center',
  },
  moodLinksRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 8,
  },
  moodLink: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  moodLinkText: {
    fontSize: 14,
    letterSpacing: 0.8,
  },
  moodDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    marginTop: 2,
    alignSelf: 'center',
  },
  ctaWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    marginTop: 6,
  },
  glowingCTA: {
    height: 52,
    borderRadius: 26,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  glowingCTAText: {
    color: '#FFFFFF',
    fontSize: 15,
  },
  lowerContent: {
    paddingHorizontal: 24,
  },
  alignmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginTop: 8,
    marginBottom: 24,
  },
  alignmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  alignmentText: {
    fontSize: 13,
  },
  alignmentLineDivider: {
    width: 1,
    height: 12,
    marginHorizontal: 20,
    opacity: 0.3,
  },
  recentSection: {
    width: '100%',
  },
  sectionTitle: {
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  recentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  recentLeft: {
    flexDirection: 'column',
    flex: 1,
    marginRight: 16,
  },
  recentLabel: {
    fontSize: 11,
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  recentTitle: {
    fontSize: 14,
  },
  recentDuration: {
    fontSize: 12,
  },
  mistLayer: {
    position: 'absolute',
    left: -50,
    right: -50,
  },
  mandalaContainer: {
    width: 220,
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lotusPetal: {
    position: 'absolute',
  },
  particleDot: {
    position: 'absolute',
    width: 3.5,
    height: 3.5,
    borderRadius: 1.75,
  },
  morphOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 100,
  },
  morphHeader: {
    paddingTop: Platform.OS === 'ios' ? 60 : 45,
    paddingHorizontal: 24,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  morphBackButton: {
    width: 44,
    height: 44,
    marginLeft: -12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
  },
  morphScrollContent: {
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 132,
  },
  morphHeroBlock: {
    paddingTop: 18,
    paddingBottom: 26,
  },
  morphDurationBand: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingVertical: 20,
    marginBottom: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  morphPhaseDots: {
    flexDirection: 'row',
    gap: 7,
  },
  morphPhaseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  morphSequenceList: {
    gap: 18,
    marginBottom: 30,
  },
  morphSequenceRow: {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  morphSequenceRail: {
    width: 3,
    alignSelf: 'stretch',
    borderRadius: 2,
    backgroundColor: 'rgba(166,149,128,0.18)',
  },
  morphSequenceIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  morphSequenceCopy: {
    flex: 1,
    minWidth: 0,
  },
  morphOfflineRow: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  morphDownloadIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  morphStickyCta: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 24,
    paddingTop: 14,
    paddingBottom: 28,
  },
  morphStartButton: {
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
