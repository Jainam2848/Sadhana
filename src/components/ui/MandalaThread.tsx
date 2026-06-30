import React, { useEffect } from 'react';
import { StyleSheet, ViewProps } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  cancelAnimation,
} from 'react-native-reanimated';
import { useTheme } from '@/hooks/useTheme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export interface MandalaThreadProps extends ViewProps {
  progress?: number; // 0 to 1 representing daily pillars completed
}

// Circumference calculations: 2 * Math.PI * R
const R1 = 100;
const R2 = 160;
const R3 = 220;

const L1 = 2 * Math.PI * R1;
const L2 = 2 * Math.PI * R2;
const L3 = 2 * Math.PI * R3;

/**
 * Living Mandala Thread component.
 * Renders faint concentric sacred geometry circles in the top-right corner, bleeding off-screen.
 * Animates circle drawing progress and style properties (stroke width, opacity) based on the user's progress.
 * Stroke colors dynamically transition on the UI thread as the time-of-day theme shifts.
 */
export function MandalaThread({ progress = 0.5, style, ...props }: MandalaThreadProps) {
  const { animatedColors, colors } = useTheme();
  
  // Progress animation shared value
  const animatedProgress = useSharedValue(progress);

  useEffect(() => {
    // Smooth timing transition for the progress value
    animatedProgress.value = withTiming(progress, { duration: 1500 });

    // CRITICAL: Cleanup to prevent memory leaks and animation stacking
    return () => {
      cancelAnimation(animatedProgress);
    };
  }, [progress]);

  // Animated properties for Circle 1 (Radius 100)
  const animatedProps1 = useAnimatedProps(() => {
    return {
      stroke: animatedColors.accent.value,
      strokeDashoffset: L1 * (1 - animatedProgress.value),
      opacity: 0.04 + 0.1 * animatedProgress.value,
      strokeWidth: 0.5 + 0.5 * animatedProgress.value,
    };
  });

  // Animated properties for Circle 2 (Radius 160)
  const animatedProps2 = useAnimatedProps(() => {
    return {
      stroke: animatedColors.accent.value,
      strokeDashoffset: L2 * (1 - animatedProgress.value),
      opacity: 0.04 + 0.1 * animatedProgress.value,
      strokeWidth: 0.5 + 0.5 * animatedProgress.value,
    };
  });

  // Animated properties for Circle 3 (Radius 220)
  const animatedProps3 = useAnimatedProps(() => {
    return {
      stroke: animatedColors.accent.value,
      strokeDashoffset: L3 * (1 - animatedProgress.value),
      opacity: 0.04 + 0.1 * animatedProgress.value,
      strokeWidth: 0.5 + 0.5 * animatedProgress.value,
    };
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.container, style]}
      {...props}
    >
      <Svg width="300" height="300" viewBox="0 0 300 300">
        {/* Radial guidelines (sacred geometry alignment) */}
        <Path d="M 300 0 L 0 0" stroke={colors.accent} strokeWidth={0.5} opacity={0.06} />
        <Path d="M 300 0 L 40.2 150" stroke={colors.accent} strokeWidth={0.5} opacity={0.04} />
        <Path d="M 300 0 L 87.9 212.1" stroke={colors.accent} strokeWidth={0.5} opacity={0.05} />
        <Path d="M 300 0 L 150 259.8" stroke={colors.accent} strokeWidth={0.5} opacity={0.04} />
        <Path d="M 300 0 L 300 300" stroke={colors.accent} strokeWidth={0.5} opacity={0.06} />

        {/* Rotated sacred square / diamond structures */}
        <Path d="M 140 0 L 300 160" stroke={colors.accent} strokeWidth={0.5} opacity={0.05} />
        <Path d="M 80 0 L 300 220" stroke={colors.accent} strokeWidth={0.5} opacity={0.04} />

        {/* Dashed intermediate rings to mimic drafts/manuscripts */}
        <Circle cx="300" cy="0" r="130" fill="none" stroke={colors.accent} strokeWidth={0.5} strokeDasharray="2, 4" opacity={0.05} />
        <Circle cx="300" cy="0" r="190" fill="none" stroke={colors.accent} strokeWidth={0.5} strokeDasharray="3, 5" opacity={0.04} />

        {/* Circle 1 */}
        <AnimatedCircle
          cx="300"
          cy="0"
          r={R1}
          fill="none"
          strokeDasharray={L1}
          animatedProps={animatedProps1}
        />
        {/* Circle 2 */}
        <AnimatedCircle
          cx="300"
          cy="0"
          r={R2}
          fill="none"
          strokeDasharray={L2}
          animatedProps={animatedProps2}
        />
        {/* Circle 3 */}
        <AnimatedCircle
          cx="300"
          cy="0"
          r={R3}
          fill="none"
          strokeDasharray={L3}
          animatedProps={animatedProps3}
        />
      </Svg>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: -20,
    right: -20,
    width: 300,
    height: 300,
    zIndex: 0,
    overflow: 'visible',
  },
});
