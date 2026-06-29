import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Platform, AccessibilityInfo } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Sparkles, Play } from 'lucide-react-native';
import Svg, { Defs, LinearGradient, Stop, Path, Circle, G, Rect } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withDelay,
  withSpring,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';
import { useAuthStore } from '@/stores/authStore';
import { useTheme } from '@/hooks/useTheme';
import { useProfile, useTodayPlan, useRoutines } from '@/hooks/api';
import { useTimeOfDayTheme } from '@/hooks/useTimeOfDayTheme';
import { Text } from '@/components/ui/Text';
import { PressableAnimated } from '@/components/ui/PressableAnimated';
import { HomeSkeleton } from '@/components/ui/Skeletons';
import { ErrorState } from '@/components/ui/ErrorState';
import { PracticeIcon } from '@/components/ui/PracticeIcon';

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

const AnimatedG = Animated.createAnimatedComponent(G) as any;

function LotusPetal({ style, color }: { style: any; color: string }) {
  return (
    <Animated.View style={[styles.lotusPetal, style]} pointerEvents="none">
      <Svg width="16" height="24" viewBox="0 0 10 20">
        <Path
          d="M5 0 C7.5 5, 7.5 15, 5 20 C2.5 15, 2.5 5, 5 0 Z"
          fill={color}
          opacity={0.35}
        />
      </Svg>
    </Animated.View>
  );
}

function Particle({ style, color }: { style: any; color: string }) {
  return (
    <Animated.View
      style={[
        styles.particleDot,
        style,
        { backgroundColor: color }
      ]}
      pointerEvents="none"
    />
  );
}

function HeroBackground({
  timeOfDay,
  hours,
  reduceMotion,
}: {
  timeOfDay: 'morning' | 'midday' | 'evening';
  hours: number;
  reduceMotion: boolean;
}) {
  const { colors } = useTheme();
  const isNight = hours >= 21 || hours < 5;

  const config = useMemo(() => {
    if (timeOfDay === 'morning') {
      return {
        gradStart: '#FFEBE0', // Sunrise peach
        gradEnd: colors.background,
        sunColor: '#FFD2B8',
        sunOpacity: 0.65,
        mountainColor1: 'rgba(212, 140, 112, 0.05)',
        mountainColor2: 'rgba(212, 140, 112, 0.12)',
        lightRayOpacity: 0.1,
        showStars: false,
        petalColor1: '#FFD2B8',
        petalColor2: '#D48C70',
        particleColor1: '#FFF0E6',
        particleColor2: '#FFD2B8',
      };
    } else if (timeOfDay === 'midday') {
      return {
        gradStart: '#E5EEFC', // Midday soft blue
        gradEnd: colors.background,
        sunColor: '#FFFDE8',
        sunOpacity: 0.5,
        mountainColor1: 'rgba(122, 111, 104, 0.03)',
        mountainColor2: 'rgba(122, 111, 104, 0.08)',
        lightRayOpacity: 0.05,
        showStars: false,
        petalColor1: '#E29B7A',
        petalColor2: '#C95B32',
        particleColor1: '#FFFDE8',
        particleColor2: '#DCE8FA',
      };
    } else if (isNight) {
      return {
        gradStart: '#080811', // Deep night violet
        gradEnd: colors.background,
        sunColor: '#E6E4FA', // Silver moon
        sunOpacity: 0.3,
        mountainColor1: 'rgba(245, 239, 235, 0.02)',
        mountainColor2: 'rgba(245, 239, 235, 0.06)',
        lightRayOpacity: 0,
        showStars: true,
        petalColor1: '#8A82C7', // Lilac
        petalColor2: '#534E7C', // Volcanic violet
        particleColor1: '#E6E4FA', // Silver moondust
        particleColor2: '#413A6B',
      };
    } else {
      // Evening
      return {
        gradStart: '#2A1814', // Sunset terracotta
        gradEnd: colors.background,
        sunColor: '#E27E57', // Dusk sun
        sunOpacity: 0.4,
        mountainColor1: 'rgba(226, 126, 87, 0.04)',
        mountainColor2: 'rgba(226, 126, 87, 0.10)',
        lightRayOpacity: 0.08,
        showStars: false,
        petalColor1: '#E27E57',
        petalColor2: '#B85834',
        particleColor1: '#FFE6D9',
        particleColor2: '#E27E57',
      };
    }
  }, [timeOfDay, isNight, colors.background]);

  const mistOffset1 = useSharedValue(0);
  const mistOffset2 = useSharedValue(0);
  const lightRayPulse = useSharedValue(0.8);

  // Lotus petals animation values
  const petal1Progress = useSharedValue(0);
  const petal2Progress = useSharedValue(0);
  const petal3Progress = useSharedValue(0);

  // Ambient particles animation values
  const part1Progress = useSharedValue(0);
  const part2Progress = useSharedValue(0);
  const part3Progress = useSharedValue(0);
  const part4Progress = useSharedValue(0);

  useEffect(() => {
    if (reduceMotion) {
      mistOffset1.value = 0;
      mistOffset2.value = 0;
      lightRayPulse.value = 0.8;
      petal1Progress.value = 0;
      petal2Progress.value = 0;
      petal3Progress.value = 0;
      part1Progress.value = 0;
      part2Progress.value = 0;
      part3Progress.value = 0;
      part4Progress.value = 0;
      return;
    }

    mistOffset1.value = withRepeat(
      withTiming(40, { duration: 15000, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
    mistOffset2.value = withRepeat(
      withTiming(-30, { duration: 18000, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
    lightRayPulse.value = withRepeat(
      withTiming(1.2, { duration: 6000, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );

    // Drifting Lotus Petals Loop
    petal1Progress.value = withRepeat(withTiming(1, { duration: 16000, easing: Easing.linear }), -1, false);
    petal2Progress.value = withRepeat(withTiming(1, { duration: 22000, easing: Easing.linear }), -1, false);
    petal3Progress.value = withRepeat(withTiming(1, { duration: 18000, easing: Easing.linear }), -1, false);

    // Rising Faint Particles Loop
    part1Progress.value = withRepeat(withTiming(1, { duration: 11000, easing: Easing.linear }), -1, false);
    part2Progress.value = withRepeat(withTiming(1, { duration: 15000, easing: Easing.linear }), -1, false);
    part3Progress.value = withRepeat(withTiming(1, { duration: 13000, easing: Easing.linear }), -1, false);
    part4Progress.value = withRepeat(withTiming(1, { duration: 17000, easing: Easing.linear }), -1, false);

    return () => {
      cancelAnimation(mistOffset1);
      cancelAnimation(mistOffset2);
      cancelAnimation(lightRayPulse);
      cancelAnimation(petal1Progress);
      cancelAnimation(petal2Progress);
      cancelAnimation(petal3Progress);
      cancelAnimation(part1Progress);
      cancelAnimation(part2Progress);
      cancelAnimation(part3Progress);
      cancelAnimation(part4Progress);
    };
  }, [reduceMotion]);

  const animatedMist1Style = useAnimatedStyle(() => ({
    transform: [{ translateX: mistOffset1.value }],
  }));

  const animatedMist2Style = useAnimatedStyle(() => ({
    transform: [{ translateX: mistOffset2.value }],
  }));

  const animatedRayStyle = useAnimatedStyle(() => ({
    opacity: lightRayPulse.value * config.lightRayOpacity,
  }));

  // Lotus Petal animated styles
  const animatedPetal1 = useAnimatedStyle(() => {
    const x = 30 + petal1Progress.value * 90;
    const y = -20 + petal1Progress.value * 200;
    const rot = petal1Progress.value * 360;
    return {
      transform: [{ translateX: x }, { translateY: y }, { rotate: `${rot}deg` }],
      opacity: Math.sin(petal1Progress.value * Math.PI) * 0.45,
    };
  });

  const animatedPetal2 = useAnimatedStyle(() => {
    const x = 280 - petal2Progress.value * 120;
    const y = 10 + petal2Progress.value * 210;
    const rot = petal2Progress.value * -240;
    return {
      transform: [{ translateX: x }, { translateY: y }, { rotate: `${rot}deg` }],
      opacity: Math.sin(petal2Progress.value * Math.PI) * 0.35,
    };
  });

  const animatedPetal3 = useAnimatedStyle(() => {
    const x = 110 + petal3Progress.value * 80;
    const y = 60 + petal3Progress.value * 180;
    const rot = petal3Progress.value * 180;
    return {
      transform: [{ translateX: x }, { translateY: y }, { rotate: `${rot}deg` }],
      opacity: Math.sin(petal3Progress.value * Math.PI) * 0.3,
    };
  });

  // Particle animated styles
  const animatedPart1 = useAnimatedStyle(() => {
    const y = 200 - part1Progress.value * 150;
    return {
      transform: [{ translateX: 60 }, { translateY: y }],
      opacity: Math.sin(part1Progress.value * Math.PI) * 0.4,
    };
  });

  const animatedPart2 = useAnimatedStyle(() => {
    const y = 220 - part2Progress.value * 180;
    return {
      transform: [{ translateX: 150 + Math.sin(part2Progress.value * Math.PI * 2) * 15 }, { translateY: y }],
      opacity: Math.sin(part2Progress.value * Math.PI) * 0.35,
    };
  });

  const animatedPart3 = useAnimatedStyle(() => {
    const y = 240 - part3Progress.value * 160;
    return {
      transform: [{ translateX: 290 }, { translateY: y }],
      opacity: Math.sin(part3Progress.value * Math.PI) * 0.4,
    };
  });

  const animatedPart4 = useAnimatedStyle(() => {
    const y = 180 - part4Progress.value * 140;
    return {
      transform: [{ translateX: 220 + Math.cos(part4Progress.value * Math.PI * 2) * 10 }, { translateY: y }],
      opacity: Math.sin(part4Progress.value * Math.PI) * 0.3,
    };
  });

  return (
    <View style={StyleSheet.absoluteFillObject}>
      <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id="heroBgGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={config.gradStart} />
            <Stop offset="0.6" stopColor={config.gradStart} stopOpacity={0.8} />
            <Stop offset="1" stopColor={config.gradEnd} />
          </LinearGradient>
        </Defs>

        <Rect width="100%" height="100%" fill="url(#heroBgGrad)" />

        {config.showStars && (
          <G opacity={0.6}>
            <Circle cx="45" cy="50" r="0.8" fill="#FFF" opacity={0.8} />
            <Circle cx="120" cy="30" r="0.6" fill="#FFF" opacity={0.6} />
            <Circle cx="280" cy="70" r="1.0" fill="#FFF" opacity={0.9} />
            <Circle cx="320" cy="25" r="0.5" fill="#FFF" opacity={0.5} />
            <Circle cx="190" cy="80" r="0.6" fill="#FFF" opacity={0.7} />
            <Circle cx="80" cy="95" r="0.8" fill="#FFF" opacity={0.7} />
          </G>
        )}

        {!reduceMotion && config.lightRayOpacity > 0 && (
          <AnimatedG style={animatedRayStyle}>
            <Path d="M120 0 L150 200 L180 200 Z" fill={config.sunColor} opacity={0.2} />
            <Path d="M220 0 L200 220 L250 220 Z" fill={config.sunColor} opacity={0.15} />
            <Path d="M80 0 L40 180 L100 180 Z" fill={config.sunColor} opacity={0.15} />
          </AnimatedG>
        )}

        <Circle cx="200" cy="95" r="48" fill={config.sunColor} opacity={config.sunOpacity} />

        <Path
          d="M-50 200 L30 110 L110 170 L190 80 L270 160 L360 70 L460 200 Z"
          fill={config.mountainColor1}
        />

        <Path
          d="M-50 220 L70 140 L150 190 L240 120 L320 170 L400 110 L490 220 Z"
          fill={config.mountainColor2}
        />
      </Svg>

      {!reduceMotion && (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <Animated.View style={[styles.mistLayer, { bottom: 15 }, animatedMist1Style]}>
            <Svg width="500" height="50" viewBox="0 0 500 50">
              <Path
                d="M0 25 Q125 10 250 25 T500 25 L500 50 L0 50 Z"
                fill={timeOfDay === 'midday' ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.12)'}
                opacity={0.5}
              />
            </Svg>
          </Animated.View>
          <Animated.View style={[styles.mistLayer, { bottom: 0 }, animatedMist2Style]}>
            <Svg width="500" height="50" viewBox="0 0 500 50">
              <Path
                d="M0 25 Q125 40 250 25 T500 25 L500 50 L0 50 Z"
                fill={timeOfDay === 'midday' ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.15)'}
                opacity={0.4}
              />
            </Svg>
          </Animated.View>

          {/* Floating Lotus Petals */}
          <LotusPetal style={animatedPetal1} color={config.petalColor1} />
          <LotusPetal style={animatedPetal2} color={config.petalColor2} />
          <LotusPetal style={animatedPetal3} color={config.petalColor2} />

          {/* Drifting Ambient Particles */}
          <Particle style={animatedPart1} color={config.particleColor1} />
          <Particle style={animatedPart2} color={config.particleColor2} />
          <Particle style={animatedPart3} color={config.particleColor1} />
          <Particle style={animatedPart4} color={config.particleColor2} />
        </View>
      )}
    </View>
  );
}

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
    <Animated.View style={[styles.mandalaContainer, animatedStyle]} pointerEvents="none">
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

function BreathingOrbWithProgress({
  progress = 0.72,
  reduceMotion,
}: {
  progress?: number;
  reduceMotion: boolean;
}) {
  const { colors } = useTheme();
  const orbScale = useSharedValue(1);
  const orbOpacity = useSharedValue(0.4);
  const [phase, setPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Rest'>('Inhale');

  useEffect(() => {
    if (reduceMotion) {
      orbScale.value = 1;
      orbOpacity.value = 0.5;
      setPhase('Inhale');
      return;
    }

    // Sama Vritti 4s Inhale, 4s Hold, 4s Exhale, 4s Hold
    const runBreathAnimation = () => {
      orbScale.value = withTiming(
        1.25,
        { duration: 4000, easing: Easing.inOut(Easing.sin) },
        (isFinished) => {
          if (isFinished) {
            // Hold (In)
            orbScale.value = withDelay(
              4000,
              withTiming(
                1.0,
                { duration: 4000, easing: Easing.inOut(Easing.sin) },
                (finished) => {
                  if (finished) {
                    // Hold (Out)
                    orbScale.value = withDelay(
                      4000,
                      withTiming(1.25, { duration: 0 }, () => {
                        runBreathAnimation();
                      })
                    );
                  }
                }
              )
            );
          }
        }
      );

      orbOpacity.value = withTiming(
        0.75,
        { duration: 4000, easing: Easing.inOut(Easing.sin) },
        (isFinished) => {
          if (isFinished) {
            orbOpacity.value = withDelay(
              4000,
              withTiming(
                0.35,
                { duration: 4000, easing: Easing.inOut(Easing.sin) },
                (finished) => {
                  if (finished) {
                    orbOpacity.value = withDelay(
                      4000,
                      withTiming(0.75, { duration: 0 })
                    );
                  }
                }
              )
            );
          }
        }
      );
    };

    runBreathAnimation();

    let count = 0;
    const interval = setInterval(() => {
      count = (count + 1) % 4;
      const phases: Array<'Inhale' | 'Hold' | 'Exhale' | 'Rest'> = ['Inhale', 'Hold', 'Exhale', 'Rest'];
      setPhase(phases[count]);
    }, 4000);

    return () => {
      cancelAnimation(orbScale);
      cancelAnimation(orbOpacity);
      clearInterval(interval);
    };
  }, [reduceMotion]);

  const animatedOrbStyle = useAnimatedStyle(() => ({
    transform: [{ scale: orbScale.value }],
    opacity: orbOpacity.value,
  }));

  const radius = 55;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <View style={styles.breathingOrbContainer}>
      <Svg width="140" height="140" viewBox="0 0 140 140" style={styles.progressRingSvg}>
        <Circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke={colors.border}
          strokeWidth="3.5"
          opacity={0.3}
        />
        <Circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke={colors.accent}
          strokeWidth="3.5"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform="rotate(-90 70 70)"
        />
      </Svg>

      <Animated.View
        style={[
          styles.breathingOrb,
          { backgroundColor: colors.accent },
          animatedOrbStyle,
        ]}
        accessibilityRole="button"
        accessibilityLabel={`Pranayama breathing orb. Current phase: ${phase}`}
        accessibilityHint="Guides you through Sama Vritti box breathing rhythm"
      >
        <Text
          variant="body"
          weight="bold"
          style={[styles.breathingOrbText, { color: '#FFFFFF' }]}
        >
          {phase === 'Rest' ? 'HOLD' : phase.toUpperCase()}
        </Text>
      </Animated.View>
    </View>
  );
}

function PracticeCard({
  title,
  duration,
  icon,
  onPress,
}: {
  title: string;
  duration?: number;
  icon: 'asana' | 'pranayama' | 'dhyana';
  onPress?: () => void;
}) {
  const { colors, spacing, borderRadius } = useTheme();

  return (
    <PressableAnimated
      haptic="light"
      scaleTo={0.97}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${title} practice, ${duration || 5} minutes`}
      accessibilityHint="Tap to configure this routine"
      style={[
        styles.practiceCard,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderRadius: borderRadius.lg,
          paddingVertical: spacing.sm * 1.5, // 12px
          paddingHorizontal: spacing.sm, // 8px
        }
      ]}
    >
      <View style={[styles.practiceCardIconWrapper, { backgroundColor: colors.highlight }]}>
        <PracticeIcon type={icon} size={18} color={colors.accent} />
      </View>
      <Text variant="body" weight="medium" style={[styles.practiceCardTitle, { color: colors.primaryText }]}>
        {title}
      </Text>
      <Text variant="body" style={[styles.practiceCardDuration, { color: colors.secondaryText }]}>
        {duration || 5} min
      </Text>
    </PressableAnimated>
  );
}

export default function HomeScreen() {
  const theme = useTheme();
  const { colors, spacing, borderRadius, dark } = theme;
  const user = useAuthStore((state) => state.user);
  const dailyCheckIn = useAuthStore((state) => state.dailyCheckIn);
  const submitDailyCheckIn = useAuthStore((state) => state.submitDailyCheckIn);
  const timeOfDay = useTimeOfDayTheme();

  const [tuneMode, setTuneMode] = useState<'restore' | 'steady' | 'energize'>('steady');
  const [reduceMotionEnabled, setReduceMotionEnabled] = useState(false);

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
  const ctaGlowOpacity = useSharedValue(0.2);

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

    // Staggered reveal animations
    headerOpacity.value = withTiming(1, { duration: 550 });

    titleOpacity.value = withDelay(120, withTiming(1, { duration: 600 }));
    titleTranslateY.value = withDelay(120, withSpring(0, { damping: 15 }));

    orbOpacity.value = withDelay(240, withTiming(1, { duration: 600 }));
    orbScale.value = withDelay(240, withSpring(1, { damping: 14 }));

    panelOpacity.value = withDelay(360, withTiming(1, { duration: 600 }));
    panelTranslateY.value = withDelay(360, withSpring(0, { damping: 16 }));

    ctaOpacity.value = withDelay(480, withTiming(1, { duration: 600 }));
    ctaTranslateY.value = withDelay(480, withSpring(0, { damping: 15 }));

    // Card Hover Loop (moves gently up and down by 4px)
    hoverTranslation.value = withRepeat(
      withTiming(4, { duration: 3500, easing: Easing.inOut(Easing.quad) }),
      -1,
      true
    );

    // Glowing CTA Halo Loop
    ctaGlowScale.value = withRepeat(
      withTiming(1.06, { duration: 2500, easing: Easing.inOut(Easing.quad) }),
      -1,
      true
    );
    ctaGlowOpacity.value = withRepeat(
      withTiming(0.12, { duration: 2500, easing: Easing.inOut(Easing.quad) }),
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
    opacity: headerOpacity.value,
  }));

  const animatedTitleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslateY.value }],
  }));

  const animatedOrbStyle = useAnimatedStyle(() => ({
    opacity: orbOpacity.value,
    transform: [{ scale: orbScale.value }],
  }));

  const animatedPanelStyle = useAnimatedStyle(() => ({
    opacity: panelOpacity.value,
    transform: [{ translateY: panelTranslateY.value + hoverTranslation.value }],
  }));

  const animatedCtaStyle = useAnimatedStyle(() => ({
    opacity: ctaOpacity.value,
    transform: [{ translateY: ctaTranslateY.value }],
  }));

  const animatedCtaGlowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ctaGlowScale.value }],
    opacity: ctaGlowOpacity.value,
  }));

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
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={dark ? 'light' : 'dark'} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Immersive Hero Section Container */}
        <View style={styles.heroContainer}>
          <HeroBackground
            timeOfDay={timeOfDay}
            hours={today.getHours()}
            reduceMotion={reduceMotionEnabled}
          />

          <View style={styles.mandalaWrapper}>
            <RotatingMandala reduceMotion={reduceMotionEnabled} />
          </View>

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
            <Text variant="body" weight="medium" style={[styles.greetingText, { color: colors.accent }]}>
              {greeting}
            </Text>
            <Text variant="display" weight="bold" style={[styles.heroTitle, { color: colors.primaryText }]}>
              Begin with one quiet breath.
            </Text>
            <Text variant="body" style={[styles.intentionText, { color: colors.secondaryText }]}>
              Intention: {dailyIntention}
            </Text>
          </Animated.View>

          {/* Centralized Breathing Orb and Progress Ring */}
          <Animated.View style={[styles.breathingSection, animatedOrbStyle]}>
            <BreathingOrbWithProgress
              progress={dailyProgress}
              reduceMotion={reduceMotionEnabled}
            />
          </Animated.View>

          {/* Glassmorphic content panel */}
          <Animated.View style={[
            styles.glassPanel,
            glassPanelStyle,
            animatedPanelStyle,
            { borderRadius: borderRadius.xl, padding: spacing.md }
          ]}>
            {/* Practice Breakdown Cards */}
            <View style={styles.practiceCardsRow}>
              <PracticeCard title="Asana" duration={plan?.asana?.duration_minutes} icon="asana" onPress={handlePrepareRoutine} />
              <PracticeCard title="Pranayama" duration={plan?.pranayama?.duration_minutes} icon="pranayama" onPress={handlePrepareRoutine} />
              <PracticeCard title="Meditation" duration={plan?.dhyana?.duration_minutes} icon="dhyana" onPress={handlePrepareRoutine} />
            </View>

            {/* Segmented Pill Tuning Controls */}
            <View style={styles.tuningContainer}>
              <View
                style={[
                  styles.tuningPillContainer,
                  { backgroundColor: colors.highlight, borderRadius: borderRadius.lg }
                ]}
                onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width - 8)}
              >
                {containerWidth > 0 && (
                  <Animated.View
                    style={[
                      styles.tuningPillSlider,
                      {
                        width: containerWidth / 3,
                        backgroundColor: colors.surface,
                        borderRadius: borderRadius.md,
                      },
                      animatedSliderStyle
                    ]}
                  />
                )}
                <PressableAnimated
                  accessibilityRole="tab"
                  accessibilityState={{ selected: tuneMode === 'restore' }}
                  accessibilityLabel="Restore mode"
                  accessibilityHint="Tunes your practice routine to be relaxing and restorative"
                  haptic="light"
                  scaleTo={0.96}
                  onPress={() => selectMood('restore')}
                  style={styles.tuningPill}
                >
                  <Text
                    variant="body"
                    weight={tuneMode === 'restore' ? 'bold' : 'regular'}
                    style={[
                      styles.tuningPillText,
                      { color: tuneMode === 'restore' ? colors.accent : colors.secondaryText }
                    ]}
                  >
                    Restore
                  </Text>
                </PressableAnimated>
                <PressableAnimated
                  accessibilityRole="tab"
                  accessibilityState={{ selected: tuneMode === 'steady' }}
                  accessibilityLabel="Steady mode"
                  accessibilityHint="Tunes your practice routine to be balanced and steady"
                  haptic="light"
                  scaleTo={0.96}
                  onPress={() => selectMood('steady')}
                  style={styles.tuningPill}
                >
                  <Text
                    variant="body"
                    weight={tuneMode === 'steady' ? 'bold' : 'regular'}
                    style={[
                      styles.tuningPillText,
                      { color: tuneMode === 'steady' ? colors.accent : colors.secondaryText }
                    ]}
                  >
                    Steady
                  </Text>
                </PressableAnimated>
                <PressableAnimated
                  accessibilityRole="tab"
                  accessibilityState={{ selected: tuneMode === 'energize' }}
                  accessibilityLabel="Energize mode"
                  accessibilityHint="Tunes your practice routine to be active and energizing"
                  haptic="light"
                  scaleTo={0.96}
                  onPress={() => selectMood('energize')}
                  style={styles.tuningPill}
                >
                  <Text
                    variant="body"
                    weight={tuneMode === 'energize' ? 'bold' : 'regular'}
                    style={[
                      styles.tuningPillText,
                      { color: tuneMode === 'energize' ? colors.accent : colors.secondaryText }
                    ]}
                  >
                    Energize
                  </Text>
                </PressableAnimated>
              </View>
            </View>
          </Animated.View>

          {/* Elevated Glowing CTA button */}
          <Animated.View style={[styles.ctaWrapper, animatedCtaStyle]}>
            {!reduceMotionEnabled && (
              <Animated.View
                style={[
                  styles.ctaGlowBehind,
                  { backgroundColor: colors.accent },
                  animatedCtaGlowStyle,
                ]}
              />
            )}
            <PressableAnimated
              haptic="medium"
              scaleTo={0.98}
              style={[styles.glowingCTA, { backgroundColor: colors.accent, shadowColor: colors.accent }]}
              onPress={handlePrepareRoutine}
              accessibilityRole="button"
              accessibilityLabel="Begin today's practice"
              accessibilityHint="Launches the guided session configurator"
            >
              <Play size={15} color="#FFFFFF" fill="#FFFFFF" />
              <Text variant="body" weight="bold" style={styles.glowingCTAText}>
                Begin Today's Practice
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
              <Sparkles size={14} color={colors.accent} strokeWidth={1.8} />
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
            {recentSessions.map((session) => (
              <View
                key={`${session.label}-${session.title}`}
                style={[
                  styles.recentRow,
                  { borderBottomColor: colors.border }
                ]}
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
            ))}
          </View>
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
  glassPanel: {
    borderWidth: 1,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 4,
    width: '100%',
    zIndex: 2,
    marginTop: 14,
    marginBottom: 16,
  },
  practiceCardsRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
    marginBottom: 16,
  },
  practiceCard: {
    flex: 1,
    alignItems: 'center',
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  practiceCardIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  practiceCardTitle: {
    fontSize: 11,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 2,
    textAlign: 'center',
  },
  practiceCardDuration: {
    fontSize: 12,
    textAlign: 'center',
  },
  tuningContainer: {
    width: '100%',
    alignItems: 'center',
  },
  tuningPillContainer: {
    flexDirection: 'row',
    padding: 4,
    width: '100%',
    justifyContent: 'space-between',
    position: 'relative',
  },
  tuningPillSlider: {
    position: 'absolute',
    top: 4,
    bottom: 4,
    left: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tuningPill: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  tuningPillText: {
    fontSize: 13,
    letterSpacing: 0.4,
  },
  ctaWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    marginTop: 6,
  },
  ctaGlowBehind: {
    position: 'absolute',
    width: '100%',
    height: 52,
    borderRadius: 26,
    pointerEvents: 'none',
  },
  glowingCTA: {
    height: 52,
    borderRadius: 26,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
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
    paddingVertical: 14,
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    marginTop: 10,
    marginBottom: 28,
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
    borderBottomWidth: 0.5,
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
  breathingOrbContainer: {
    width: 140,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    alignSelf: 'center',
  },
  progressRingSvg: {
    position: 'absolute',
  },
  breathingOrb: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  breathingOrbText: {
    fontSize: 10,
    letterSpacing: 1.2,
    fontWeight: 'bold',
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
});
