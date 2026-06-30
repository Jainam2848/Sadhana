import React, { useEffect } from 'react';
import { View } from '@/tw';
import { PremiumLoading } from './PremiumLoading';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

// 1. Base Shimmering Skeleton Loader Block
export function SkeletonLoader({
  width = '100%',
  height = 80,
  className = '',
  borderRadius = 12,
}: {
  width?: number | string;
  height?: number | string;
  className?: string;
  borderRadius?: number;
}) {
  const opacity = useSharedValue(0.2);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.45, { duration: 1800 }),
        withTiming(0.2, { duration: 1800 })
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
    height: typeof height === 'number' ? height : undefined,
  };

  return (
    <View
      className={`bg-surface-border/30 rounded-xl overflow-hidden ${typeof width === 'string' ? width : ''} ${typeof height === 'string' ? height : ''} ${className}`}
      style={containerStyle}
    >
      <Animated.View
        style={[
          animatedStyle,
          {
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(122, 111, 104, 0.08)',
            borderRadius,
          },
        ]}
      />
    </View>
  );
}

// 2. Home Screen Skeleton
export function HomeSkeleton() {
  return <PremiumLoading label="Preparing Home Sanctuary" />;
}

// 3. Library Screen Skeleton
export function LibrarySkeleton() {
  return <PremiumLoading label="Opening Practice Library" />;
}

// 4. Rewards Screen Skeleton
export function RewardsSkeleton() {
  return <PremiumLoading label="Assembling Milestones" />;
}

// 5. Profile Screen Skeleton
export function ProfileSkeleton() {
  return <PremiumLoading label="Consulting Your Progress" />;
}

// 6. Course Detail Screen Skeleton
export function CourseDetailSkeleton() {
  return <PremiumLoading label="Aligning Syllabus" />;
}

// 7. Player Screen Skeleton
export function PlayerSkeleton() {
  return <PremiumLoading label="Preparing Guided Routine" />;
}

