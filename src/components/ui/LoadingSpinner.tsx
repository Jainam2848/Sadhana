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

export { SkeletonLoader } from './Skeletons';
