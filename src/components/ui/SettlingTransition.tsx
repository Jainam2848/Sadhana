import React, { useEffect, useState } from 'react';
import { AccessibilityInfo, StyleSheet, ViewProps } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  cancelAnimation,
} from 'react-native-reanimated';

export interface SettlingTransitionProps extends ViewProps {
  children: React.ReactNode;
}

/**
 * SettlingTransition wrapper component.
 * Applies Tier 4 "Settling" motion rules for premium transitions.
 * Configured with a gentle spring (stiffness: 100, damping: 15, mass: 1) for overshoot and settle.
 * Respects OS accessibility settings: falls back to a simple 200ms fade if reduce motion is enabled.
 */
export function SettlingTransition({ children, style, ...props }: SettlingTransitionProps) {
  const [reduceMotion, setReduceMotion] = useState(false);
  const animProgress = useSharedValue(0);

  useEffect(() => {
    // Check initial OS state for reduced motion setting
    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      setReduceMotion(enabled);
    });

    // Listen to changes in the OS reduced motion setting
    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      (enabled) => {
        setReduceMotion(enabled);
      }
    );

    return () => {
      subscription.remove();
      cancelAnimation(animProgress);
    };
  }, []);

  useEffect(() => {
    // Run entering animation
    if (reduceMotion) {
      // Fallback: 200ms clean linear fade
      animProgress.value = withTiming(1, { duration: 200 });
    } else {
      // Premium transition: Gentle spring settle (600-900ms duration feel)
      animProgress.value = withSpring(1, {
        stiffness: 100,
        damping: 15,
        mass: 1,
      });
    }
  }, [reduceMotion]);

  const animatedStyle = useAnimatedStyle(() => {
    if (reduceMotion) {
      return {
        opacity: animProgress.value,
      };
    }

    return {
      opacity: animProgress.value,
      transform: [
        {
          translateY: (1 - animProgress.value) * 40, // Gentle slide up
        },
        {
          scale: 0.96 + 0.04 * animProgress.value, // Subtle scale settle
        },
      ],
    };
  });

  return (
    <Animated.View style={[styles.container, animatedStyle, style]} {...props}>
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
