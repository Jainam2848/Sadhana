import React, { useEffect } from 'react';
import { View } from '@/tw';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withSequence,
} from 'react-native-reanimated';

export function LoadingSpinner({ size = 40 }: { size?: number }) {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 1200 }),
      -1, // Infinite loop
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <View className="justify-center items-center">
      <Animated.View
        style={[
          animatedStyle,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: 3,
            borderColor: '#F5E6C8', // Sandstone base
            borderTopColor: '#C44B22', // Terracotta top indicator
          },
        ]}
      />
    </View>
  );
}

export function SkeletonLoader({
  width = '100%',
  height = 80,
  className = '',
}: {
  width?: number | string;
  height?: number;
  className?: string;
}) {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.7, { duration: 800 }),
        withTiming(0.3, { duration: 800 })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const containerStyle = {
    width: typeof width === 'number' ? width : undefined,
    height,
  };

  return (
    <View
      className={`bg-surface-border/40 rounded-xl ${typeof width === 'string' ? width : ''} ${className}`}
      style={containerStyle}
    >
      <Animated.View
        style={[animatedStyle, { width: '100%', height: '100%', backgroundColor: 'rgba(42,29,10,0.04)', borderRadius: 12 }]}
      />
    </View>
  );
}
