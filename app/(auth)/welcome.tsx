import React, { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';
import { router } from 'expo-router';
import { View, Text } from '@/tw';
import { useTheme } from '@/hooks/useTheme';
import { useTimeOfDayTheme } from '@/hooks/useTimeOfDayTheme';
import { MandalaThread } from '@/components/ui/MandalaThread';
import { Display, Body } from '@/components/ui/Typography';
import { Svg, Path } from '@/components/ui/Compat';
import { Defs, RadialGradient, Stop, Rect } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withRepeat,
  withDelay,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { PressableAnimated } from '@/components/ui/PressableAnimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useWindowDimensions } from 'react-native';

const DefsAny = Defs as any;
const RadialGradientAny = RadialGradient as any;
const StopAny = Stop as any;
const RectAny = Rect as any;

export default function WelcomeScreen() {
  const { colors, dark } = useTheme();
  const timeOfDay = useTimeOfDayTheme();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const isSmallDevice = height < 750;

  const [reduceMotionEnabled, setReduceMotionEnabled] = useState(false);

  // Animation values
  const entrance1 = useSharedValue(0);
  const entrance2 = useSharedValue(0);
  const entrance3 = useSharedValue(0);
  const entrance4 = useSharedValue(0);
  const entrance5 = useSharedValue(0);

  const lotusScale = useSharedValue(1);
  const ctaPulse = useSharedValue(1);

  // Check and listen to OS reduced motion setting
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

  // Entrance & looping animations
  useEffect(() => {
    if (reduceMotionEnabled) {
      // Immediate/short timing fallback
      entrance1.value = withTiming(1, { duration: 250 });
      entrance2.value = withTiming(1, { duration: 250 });
      entrance3.value = withTiming(1, { duration: 250 });
      entrance4.value = withTiming(1, { duration: 250 });
      entrance5.value = withTiming(1, { duration: 250 });

      lotusScale.value = 1;
      ctaPulse.value = 1;
    } else {
      // Premium spring transitions (staggered)
      const springConfig = { stiffness: 100, damping: 15, mass: 1 };
      entrance1.value = withSpring(1, springConfig);
      entrance2.value = withDelay(150, withSpring(1, springConfig));
      entrance3.value = withDelay(300, withSpring(1, springConfig));
      entrance4.value = withDelay(450, withSpring(1, springConfig));
      entrance5.value = withDelay(600, withSpring(1, springConfig));

      // Breathing Lotus loop (4-second cycle: 2s in, 2s out)
      lotusScale.value = withRepeat(
        withTiming(1.08, {
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
        }),
        -1,
        true
      );

      // Microscopic CTA pulse loop
      ctaPulse.value = withRepeat(
        withTiming(1.025, {
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
        }),
        -1,
        true
      );
    }
  }, [reduceMotionEnabled]);

  // Animated styles
  const entranceStyle1 = useAnimatedStyle(() => ({
    opacity: entrance1.value,
    transform: reduceMotionEnabled
      ? []
      : [
          { translateY: (1 - entrance1.value) * 20 },
          { scale: 0.97 + 0.03 * entrance1.value },
        ],
  }));

  const entranceStyle2 = useAnimatedStyle(() => ({
    opacity: entrance2.value,
    transform: reduceMotionEnabled
      ? []
      : [
          { translateY: (1 - entrance2.value) * 20 },
          { scale: 0.97 + 0.03 * entrance2.value },
        ],
  }));

  const entranceStyle3 = useAnimatedStyle(() => ({
    opacity: entrance3.value,
    transform: reduceMotionEnabled
      ? []
      : [
          { translateY: (1 - entrance3.value) * 20 },
          { scale: 0.97 + 0.03 * entrance3.value },
        ],
  }));

  const entranceStyle4 = useAnimatedStyle(() => ({
    opacity: entrance4.value,
    transform: reduceMotionEnabled
      ? []
      : [
          { translateY: (1 - entrance4.value) * 20 },
          { scale: 0.97 + 0.03 * entrance4.value },
        ],
  }));

  const entranceStyle5 = useAnimatedStyle(() => ({
    opacity: entrance5.value,
    transform: reduceMotionEnabled
      ? []
      : [
          { translateY: (1 - entrance5.value) * 20 },
          { scale: 0.97 + 0.03 * entrance5.value },
        ],
  }));

  const lotusAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: lotusScale.value }],
  }));

  const ctaAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ctaPulse.value }],
  }));

  const accentColorString = typeof colors.accent === 'string' ? colors.accent : '#C44B22';

  // Ambient glow color determination based on timeOfDay and active theme
  const getGlowColor = () => {
    if (dark) {
      return 'rgba(224, 97, 53, 0.15)'; // Deep Terracotta Sunset Glow
    }
    switch (timeOfDay) {
      case 'morning':
        return 'rgba(245, 230, 200, 0.45)'; // Warm golden morning glow
      case 'midday':
        return 'rgba(215, 230, 245, 0.35)'; // Soft blue/teal midday glow
      case 'evening':
      default:
        return 'rgba(224, 97, 53, 0.15)'; // Evening sunset glow
    }
  };

  const glowColor = getGlowColor();
  const backgroundColor = colors.background || (dark ? '#120F0A' : '#FDFAF5');

  return (
    <View
      style={{
        paddingTop: Math.max(insets.top, 24),
        paddingBottom: Math.max(insets.bottom, 24),
        backgroundColor,
      }}
      className="flex-1 justify-between px-6 relative"
    >
      {/* Decorative Background Arc */}
      <MandalaThread />

      {/* Time-of-day Ambient Depth Glow */}
      <View className="absolute bottom-0 left-0 right-0 h-64 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
        <Svg width="100%" height="100%">
          <DefsAny>
            <RadialGradientAny id="bottomGlow" cx="50%" cy="100%" rx="50%" ry="100%" fx="50%" fy="100%">
              <StopAny offset="0%" stopColor={glowColor} stopOpacity={1} />
              <StopAny offset="100%" stopColor={backgroundColor} stopOpacity={0} />
            </RadialGradientAny>
          </DefsAny>
          <RectAny x="0" y="0" width="100%" height="100%" fill="url(#bottomGlow)" />
        </Svg>
      </View>

      {/* Top Brand Block */}
      <View className={`flex-1 justify-center items-center ${isSmallDevice ? 'mt-4' : 'mt-12'}`} style={{ zIndex: 1 }}>
        
        {/* The "Breathing" Lotus Wrapper */}
        <View className={`items-center justify-center ${isSmallDevice ? 'w-16 h-16 mb-4' : 'w-20 h-20 mb-8'}`}>
          <Animated.View style={[entranceStyle1, { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }]}>
            <Animated.View style={[lotusAnimatedStyle, { width: '100%', height: '100%' }]}>
              <Svg width="100%" height="100%" viewBox="0 0 100 100">
                {/* Center Petal */}
                <Path
                  d="M50 25 C55 40 55 60 50 75 C45 60 45 40 50 25 Z"
                  fill="none"
                  stroke={accentColorString}
                  strokeWidth="1.5"
                />
                {/* Inner Petals */}
                <Path
                  d="M50 75 C40 65 30 50 35 35 C40 45 45 65 50 75 Z"
                  fill="none"
                  stroke={accentColorString}
                  strokeWidth="1.5"
                />
                <Path
                  d="M50 75 C60 65 70 50 65 35 C60 45 55 65 50 75 Z"
                  fill="none"
                  stroke={accentColorString}
                  strokeWidth="1.5"
                />
                {/* Mid Petals */}
                <Path
                  d="M50 75 C30 70 20 55 25 45 C30 55 40 65 50 75 Z"
                  fill="none"
                  stroke={accentColorString}
                  strokeWidth="1.5"
                />
                <Path
                  d="M50 75 C70 70 80 55 75 45 C70 55 60 65 50 75 Z"
                  fill="none"
                  stroke={accentColorString}
                  strokeWidth="1.5"
                />
                {/* Outer Petals */}
                <Path
                  d="M50 75 C20 75 10 65 15 60 C20 65 35 70 50 75 Z"
                  fill="none"
                  stroke={accentColorString}
                  strokeWidth="1.5"
                />
                <Path
                  d="M50 75 C80 75 90 65 85 60 C80 65 65 70 50 75 Z"
                  fill="none"
                  stroke={accentColorString}
                  strokeWidth="1.5"
                />
              </Svg>
            </Animated.View>
          </Animated.View>
        </View>

        {/* Title */}
        <View className="w-full">
          <Animated.View style={entranceStyle2}>
            <Display className={`text-center px-4 ${isSmallDevice ? 'mb-2' : 'mb-4'}`}>
              Return to still.
            </Display>
          </Animated.View>
        </View>

        {/* Description */}
        <View className="w-full items-center">
          <Animated.View style={entranceStyle3}>
            <Body className="text-secondary-text text-center px-6 leading-relaxed max-w-sm mb-4">
              Sadhana is a quiet space for authentic posture, breath control, and contemplation.
            </Body>
          </Animated.View>
        </View>
      </View>

      {/* Bottom Button Panel */}
      <View className={`w-full items-center ${isSmallDevice ? 'mb-2' : 'mb-4'}`} style={{ zIndex: 1 }}>
        <Animated.View style={[entranceStyle5, { width: '100%', alignItems: 'center' }]}>
          <Animated.View style={[ctaAnimatedStyle, { width: '100%', maxWidth: 320, alignItems: 'center' }]}>
            <PressableAnimated
              className="w-full bg-accent-terracotta py-4 rounded-xl items-center active:opacity-90 mb-4"
              style={{
                shadowColor: accentColorString,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 6,
                elevation: 4,
              }}
              onPress={() => router.push('/(auth)/personalize')}
              haptic="medium"
              accessibilityLabel="Begin your journey button"
            >
              <Text className="text-white font-sans font-bold text-base tracking-wide">
                Enter the Sanctuary
              </Text>
            </PressableAnimated>
          </Animated.View>

          <PressableAnimated
            className="py-2 active:opacity-85"
            onPress={() => router.push('/(auth)/register')}
            haptic="light"
            accessibilityLabel="Sign in button"
          >
            <Text className="text-secondary-text font-sans text-sm underline underline-offset-4">
              Already have an account? Sign in
            </Text>
          </PressableAnimated>
        </Animated.View>
      </View>
    </View>
  );
}
