import React from 'react';
import { ActivityIndicator, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Pressable, Text } from '@/tw';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
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

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (disabled || loading) return;
    scale.value = withSpring(0.96, { damping: 15, stiffness: 300 });

    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  // Build NativeWind styles based on variant
  let containerStyles = 'py-3.5 px-6 rounded-xl items-center justify-center flex-row ';
  let textStyles = 'font-sans font-bold text-base ';

  if (variant === 'primary') {
    containerStyles += 'bg-accent-terracotta ';
    textStyles += 'text-white ';
  } else if (variant === 'secondary') {
    containerStyles += 'bg-warm-highlight border border-surface-border ';
    textStyles += 'text-primary-text ';
  } else if (variant === 'ghost') {
    containerStyles += 'bg-transparent ';
    textStyles += 'text-secondary-text underline ';
  }

  if (disabled || loading) {
    containerStyles += 'opacity-50 ';
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
      {loading ? (
        <ActivityIndicator size="small" color={variant === 'primary' ? '#FFFFFF' : '#C44B22'} />
      ) : (
        <Text className={textStyles}>{title}</Text>
      )}
    </AnimatedPressable>
  );
}
