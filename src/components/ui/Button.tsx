import React from 'react';
import { ActivityIndicator, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Pressable, Text } from '@/tw';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Button({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  className = '',
}: ButtonProps) {
  const scale = useSharedValue(1);
  const pressActive = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: pressActive.value,
  }));

  const handlePressIn = () => {
    if (disabled || loading) return;
    scale.value = withSpring(0.96, { damping: 24, stiffness: 180 });
    pressActive.value = withTiming(1, { duration: 120 });

    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 24, stiffness: 180 });
    pressActive.value = withTiming(0, { duration: 200 });
  };

  // Build luxury capsule button styles
  let containerStyles = 'py-4 px-8 rounded-full items-center justify-center flex-row relative overflow-hidden ';
  let textStyles = 'font-sans font-medium text-xs tracking-widest uppercase ';

  if (variant === 'primary') {
    containerStyles += 'bg-accent-terracotta ';
    textStyles += 'text-white ';
  } else if (variant === 'secondary') {
    containerStyles += 'bg-transparent border border-primary-text/20 ';
    textStyles += 'text-primary-text ';
  } else if (variant === 'ghost') {
    containerStyles += 'bg-transparent ';
    textStyles += 'text-secondary-text ';
  }

  if (disabled || loading) {
    containerStyles += 'opacity-40 ';
  }

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      style={animatedStyle}
      className={`${containerStyles} ${className}`}
    >
      {/* Subtle Inner Glow Overlay */}
      <Animated.View
        pointerEvents="none"
        style={[
          glowStyle,
          {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: variant === 'primary' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(201, 91, 50, 0.08)',
            borderRadius: 9999,
          }
        ]}
      />

      {loading ? (
        <ActivityIndicator size="small" color={variant === 'primary' ? '#FFFFFF' : '#C95B32'} />
      ) : (
        <Text className={textStyles}>{title}</Text>
      )}
    </AnimatedPressable>
  );
}
