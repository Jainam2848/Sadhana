import React, { useEffect } from 'react';
import { StyleSheet, ViewProps } from 'react-native';
import Svg, { Path, Circle, G } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  cancelAnimation,
} from 'react-native-reanimated';
import { useTheme } from '@/hooks/useTheme';

const AnimatedG = Animated.createAnimatedComponent(G) as any;

export type PracticeIconType = 'asana' | 'pranayama' | 'dhyana' | 'diya' | 'om-coin';

export interface PracticeIconProps extends ViewProps {
  type: PracticeIconType;
  size?: number;
  color?: string; // Statically overrides theme colors if provided
  streakIntensity?: number; // 0-1, specifically for the 'diya' icon flame scaling
}

/**
 * Custom Practice Icon component.
 * Renders high-craft custom SVG paths for Sadhana practices.
 * The 'diya' icon features a dynamically scaling flame that pulses based on streak intensity.
 */
export function PracticeIcon({
  type,
  size = 24,
  color,
  streakIntensity = 0.5,
  style,
  ...props
}: PracticeIconProps) {
  const { colors } = useTheme();
  
  // Use custom color if provided, fallback to active theme accent
  const iconColor = color || colors.accent;

  // Animation for the Diya flame scaling
  const flameScale = useSharedValue(streakIntensity);

  useEffect(() => {
    if (type === 'diya') {
      flameScale.value = withSpring(0.8 + streakIntensity * 0.4, {
        stiffness: 80,
        damping: 10,
      });
    }
    return () => {
      cancelAnimation(flameScale);
    };
  }, [type, streakIntensity]);

  // Animated style for the Diya flame group
  const flameAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: 0.7 + 0.3 * flameScale.value,
      transform: [
        { translateY: 11 },
        { scaleY: flameScale.value },
        { scaleX: 0.9 + 0.1 * flameScale.value },
        { translateY: -11 },
      ],
    };
  });

  // Common SVG settings
  const commonProps = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: iconColor,
    strokeWidth: 1.5,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  switch (type) {
    case 'asana':
      return (
        <Svg
          {...commonProps}
          accessibilityLabel="Asana Practice - Body Posture"
          style={style}
          {...props as any}
        >
          {/* Head */}
          <Circle cx="12" cy="5" r="2" stroke={iconColor} fill="none" />
          {/* Spine & Body core */}
          <Path d="M 12 7 L 12 13" />
          {/* Arms folded / resting on knees in Gyan Mudra */}
          <Path d="M 6 13 C 8 10, 10 10, 12 11.5 C 14 10, 16 10, 18 13" />
          {/* Crossed legs / Lotus pose base */}
          <Path d="M 4 17 C 7 14, 8 14, 12 16 C 16 14, 17 14, 20 17" />
          <Path d="M 8 16.5 C 10 18, 14 18, 16 16.5" />
        </Svg>
      );

    case 'pranayama':
      return (
        <Svg
          {...commonProps}
          accessibilityLabel="Pranayama Practice - Breath Expansion"
          style={style}
          {...props as any}
        >
          {/* Sine wave 1 - Inhale wave */}
          <Path
            d="M 2 12 C 6 4, 10 4, 12 12 C 14 20, 18 20, 22 12"
            strokeWidth={1.8}
          />
          {/* Sine wave 2 - Exhale wave (mirrored / phase shifted) */}
          <Path
            d="M 2 12 C 6 20, 10 20, 12 12 C 14 4, 18 4, 22 12"
            opacity={0.4}
            strokeWidth={1.2}
            strokeDasharray="2,2"
          />
        </Svg>
      );

    case 'dhyana':
      return (
        <Svg
          {...commonProps}
          accessibilityLabel="Dhyana Practice - Lotus Meditation"
          style={style}
          {...props as any}
        >
          {/* Center Petal */}
          <Path d="M 12 4 C 10 8, 10 16, 12 19 C 14 16, 14 8, 12 4 Z" fill="none" />
          {/* Left Petal */}
          <Path d="M 12 9 C 7 11, 4 15, 7 18 C 9 18, 11 15, 12 9 Z" fill="none" />
          {/* Right Petal */}
          <Path d="M 12 9 C 17 11, 20 15, 17 18 C 15 18, 13 15, 12 9 Z" fill="none" />
          {/* Bottom support petals */}
          <Path d="M 4 18 C 9 21, 15 21, 20 18" />
        </Svg>
      );

    case 'diya':
      return (
        <Svg
          {...commonProps}
          accessibilityLabel="Diya Streak Lamp"
          style={style}
          {...props as any}
        >
          {/* Oil bowl base */}
          <Path
            d="M 3 13 C 3 18, 21 18, 21 13 C 21 13, 19 11, 12 11 C 5 11, 3 13, 3 13 Z"
            fill="none"
          />
          {/* Decorative stand */}
          <Path d="M 10 18 C 10 20, 14 20, 14 18" />
          {/* Flame (Animated Group) */}
          <AnimatedG style={flameAnimatedStyle}>
            {/* Outer flame */}
            <Path
              d="M 12 11 C 9.5 11, 8.5 9, 12 3 C 15.5 9, 14.5 11, 12 11 Z"
              fill={iconColor}
              opacity={0.4}
              stroke="none"
            />
            {/* Inner flame core */}
            <Path
              d="M 12 11 C 10.5 11, 10 10, 12 5 C 14 10, 13.5 11, 12 11 Z"
              fill={colors.accent}
              stroke="none"
            />
          </AnimatedG>
        </Svg>
      );

    case 'om-coin':
      return (
        <Svg
          {...commonProps}
          accessibilityLabel="Sadhana Om Coin"
          style={style}
          {...props as any}
        >
          {/* Coin outer border */}
          <Circle cx="12" cy="12" r="10" />
          {/* Inner ring */}
          <Circle cx="12" cy="12" r="8" opacity={0.3} strokeDasharray="3,3" />
          {/* Stylized Om Symbol representation */}
          <Path d="M 9 9 C 9 7, 13 7, 13 9.5 C 13 11, 10 11, 10 12 C 10 13, 13 13, 13 15 C 13 17, 9 17, 9 15" />
          {/* Upper bindu (dot) and crescent */}
          <Path d="M 13.5 10 C 14.5 10, 15.5 9, 15.5 9" />
          <Circle cx="15.5" cy="7.5" r="0.5" fill={iconColor} />
        </Svg>
      );

    default:
      return null;
  }
}

const styles = StyleSheet.create({});
