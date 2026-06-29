import React, { useEffect } from 'react';
import { View } from '@/tw';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withDelay,
  withSequence,
} from 'react-native-reanimated';
import { useThemeContext } from '@/providers/ThemeProvider';

function RippleRing({ delay, size, color }: { delay: number; size: number; color: string }) {
  const scale = useSharedValue(0.4);
  const opacity = useSharedValue(0.7);

  useEffect(() => {
    scale.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(0.4, { duration: 0 }),
          withTiming(2.2, { duration: 2200 })
        ),
        -1,
        false
      )
    );

    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(0.7, { duration: 0 }),
          withTiming(0, { duration: 2200 })
        ),
        -1,
        false
      )
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: 1.5,
          borderColor: color,
        },
      ]}
    />
  );
}

export function LoadingSpinner({ size = 48 }: { size?: number }) {
  const { colors } = useThemeContext();

  return (
    <View style={{ width: size, height: size }} className="justify-center items-center relative">
      {/* Central calm dot */}
      <View
        style={{
          width: size * 0.28,
          height: size * 0.28,
          borderRadius: (size * 0.28) / 2,
          backgroundColor: colors.accent,
        }}
      />
      {/* Meditative expanding water ripples */}
      <RippleRing delay={0} size={size} color={colors.accent} />
      <RippleRing delay={700} size={size} color={colors.accent} />
      <RippleRing delay={1400} size={size} color={colors.accent} />
    </View>
  );
}

export { SkeletonLoader } from './Skeletons';
