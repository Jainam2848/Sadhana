import React, { useEffect, useState } from 'react';
import { StyleSheet, View, AccessibilityInfo } from 'react-native';
import Svg, { Path, Circle, G, Defs, RadialGradient, Stop } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';
import { Heading, Body } from './Typography';
import { Button } from './Button';
import { useTheme } from '@/hooks/useTheme';

export interface EmptyStateProps {
  title: string;
  description: string;
  ctaText?: string;
  onCtaPress?: () => void;
}

export function EmptyState({
  title,
  description,
  ctaText,
  onCtaPress,
}: EmptyStateProps) {
  const { colors } = useTheme();
  const [reduceMotion, setReduceMotion] = useState(false);

  // Sync state with OS reduced motion
  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      setReduceMotion(enabled);
    });

    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      (enabled) => {
        setReduceMotion(enabled);
      }
    );

    return () => {
      subscription.remove();
    };
  }, []);

  // Pulse animation for the flame and glowing backdrop
  const flamePulse = useSharedValue(1);

  useEffect(() => {
    if (reduceMotion) {
      flamePulse.value = 1;
      return;
    }

    flamePulse.value = withRepeat(
      withTiming(1.16, { duration: 1600, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
    return () => {
      cancelAnimation(flamePulse);
    };
  }, [reduceMotion]);

  const animatedGlowStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: flamePulse.value }],
      opacity: 0.2 + (flamePulse.value - 1) * 0.4,
    };
  });

  const animatedFlameStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scaleY: flamePulse.value },
        { scaleX: 2 - flamePulse.value },
      ],
    };
  });

  return (
    <View style={styles.container}>
      {/* Immersive Pulsing Sacred Diya Lamp Illustration */}
      <View style={[styles.illustrationContainer, { borderColor: colors.border, backgroundColor: colors.surface }]}>
        <Svg width="160" height="160" viewBox="0 0 100 100" style={StyleSheet.absoluteFill}>
          <Defs>
            <RadialGradient id="flameGlow" cx="50%" cy="50%" rx="50%" ry="50%">
              <Stop offset="0%" stopColor="#FFAE42" stopOpacity={0.8} />
              <Stop offset="50%" stopColor="#E65100" stopOpacity={0.3} />
              <Stop offset="100%" stopColor="#E65100" stopOpacity={0} />
            </RadialGradient>
          </Defs>
        </Svg>

        {/* Soft background aura */}
        <Animated.View style={[styles.glowWrapper, animatedGlowStyle]}>
          <Svg width="160" height="160" viewBox="0 0 100 100">
            <Circle cx="50" cy="40" r="28" fill="url(#flameGlow)" />
          </Svg>
        </Animated.View>

        <Svg width="160" height="160" viewBox="0 0 100 100" style={styles.staticSvg}>
          {/* Diya Clay Base */}
          <G opacity="0.95">
            {/* The outer terracotta clay body */}
            <Path
              d="M15 55 C15 72, 85 72, 85 55 C85 55, 75 60, 50 60 C25 60, 15 55, 15 55 Z"
              fill="#B85834" // Warm terracotta sandstone
            />
            {/* Inner rim bronze detailing */}
            <Path
              d="M20 53 C20 68, 80 68, 80 53 C80 53, 72 57, 50 57 C28 57, 20 53, 20 53 Z"
              fill="#8A663E" // Temple bronze
            />
            {/* Fine manuscript detail guidelines on base */}
            <Circle cx="50" cy="62" r="2" fill="#D4AF37" opacity="0.3" />
            <Path d="M40 64 Q50 66 60 64" stroke="#D4AF37" strokeWidth="0.4" fill="none" opacity="0.25" />
          </G>
        </Svg>

        {/* Flickering Flame (centered above the lamp spout) */}
        <Animated.View style={[styles.flameWrapper, animatedFlameStyle]}>
          <Svg width="160" height="160" viewBox="0 0 100 100">
            {/* Outer flame */}
            <Path
              d="M50 48 C55 48, 56 42, 50 30 C44 42, 45 48, 50 48 Z"
              fill="#FFAE42"
            />
            {/* Core flame (inner hot zone) */}
            <Path
              d="M50 47 C52 47, 53 44, 50 35 C47 44, 48 47, 50 47 Z"
              fill="#FFFDE8"
            />
          </Svg>
        </Animated.View>
      </View>

      {/* Text Context */}
      <Heading style={[styles.title, { color: colors.primaryText }]}>
        {title}
      </Heading>
      <Body style={[styles.description, { color: colors.secondaryText }]}>
        {description}
      </Body>

      {/* Optional CTA */}
      {ctaText && onCtaPress && (
        <Button
          variant="primary"
          title={ctaText}
          onPress={onCtaPress}
          className="mt-6"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
    backgroundColor: 'transparent',
  },
  illustrationContainer: {
    width: 160,
    height: 160,
    marginBottom: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 80,
    borderWidth: 1,
    overflow: 'hidden',
  },
  glowWrapper: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  staticSvg: {
    ...StyleSheet.absoluteFillObject,
  },
  flameWrapper: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 19,
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 28,
    maxWidth: 270,
    opacity: 0.8,
  },
});
