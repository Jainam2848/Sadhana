import React from 'react';
import { Platform, PressableStateCallbackType, StyleProp, ViewStyle } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Pressable } from '@/tw';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

export type HapticType = 'light' | 'medium' | 'success' | 'warning' | 'error' | 'none';

export interface PressableAnimatedProps extends React.ComponentProps<typeof Pressable> {
  haptic?: HapticType;
  scaleTo?: number;
  children?: React.ReactNode | ((state: PressableStateCallbackType) => React.ReactNode);
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const PressableAnimated = React.forwardRef<any, PressableAnimatedProps>(
  ({ haptic = 'light', scaleTo = 0.97, onPress, onPressIn, onPressOut, style, children, ...props }, ref) => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    const handlePressIn = (event: any) => {
      if (props.disabled) return;
      scale.value = withSpring(scaleTo, { damping: 15, stiffness: 300 });

      if (Platform.OS !== 'web' && haptic !== 'none') {
        try {
          if (haptic === 'light') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          } else if (haptic === 'medium') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          } else if (haptic === 'success') {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          } else if (haptic === 'warning') {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          } else if (haptic === 'error') {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          }
        } catch (e) {
          console.warn('Haptic trigger failed', e);
        }
      }

      if (onPressIn) onPressIn(event);
    };

    const handlePressOut = (event: any) => {
      if (props.disabled) return;
      scale.value = withSpring(1, { damping: 15, stiffness: 300 });
      if (onPressOut) onPressOut(event);
    };

    return (
      <AnimatedPressable
        ref={ref}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[animatedStyle, style as StyleProp<ViewStyle>]}
        accessibilityRole="button"
        {...props}
      >
        {children}
      </AnimatedPressable>
    );
  }
);

PressableAnimated.displayName = 'PressableAnimated';
