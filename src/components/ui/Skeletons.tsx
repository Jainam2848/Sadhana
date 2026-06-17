import React, { useEffect } from 'react';
import { View } from '@/tw';
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
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.65, { duration: 750 }),
        withTiming(0.3, { duration: 750 })
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
            backgroundColor: 'rgba(107, 90, 65, 0.08)',
            borderRadius,
          },
        ]}
      />
    </View>
  );
}

// 2. Home Screen Skeleton
export function HomeSkeleton() {
  return (
    <View className="flex-1 px-6 pt-6 gap-6">
      {/* Greetings Block */}
      <View className="mb-2 gap-3">
        <SkeletonLoader width="70%" height={32} />
        <View className="flex-row items-center gap-2">
          <SkeletonLoader width={16} height={16} borderRadius={8} />
          <SkeletonLoader width="35%" height={16} />
        </View>
      </View>

      {/* Plan Card Block */}
      <View className="bg-surface rounded-xl border border-surface-border p-5 gap-5">
        <View className="flex-row justify-between items-start">
          <SkeletonLoader width="50%" height={24} />
          <SkeletonLoader width="25%" height={18} borderRadius={12} />
        </View>
        <View className="flex-row gap-2">
          <SkeletonLoader width={90} height={28} borderRadius={14} />
          <SkeletonLoader width={110} height={28} borderRadius={14} />
          <SkeletonLoader width={90} height={28} borderRadius={14} />
        </View>
        <SkeletonLoader width="60%" height={16} />
        <SkeletonLoader width="100%" height={48} borderRadius={24} />
      </View>

      {/* Recent Sessions Block */}
      <View className="gap-4">
        <SkeletonLoader width="40%" height={16} />
        <View className="flex-row gap-3">
          <View className="w-[140px] h-[86px] bg-surface border border-surface-border rounded-xl p-3 justify-between">
            <SkeletonLoader width="60%" height={10} />
            <View className="gap-1.5">
              <SkeletonLoader width="90%" height={12} />
              <SkeletonLoader width="50%" height={10} />
            </View>
          </View>
          <View className="w-[140px] h-[86px] bg-surface border border-surface-border rounded-xl p-3 justify-between">
            <SkeletonLoader width="60%" height={10} />
            <View className="gap-1.5">
              <SkeletonLoader width="90%" height={12} />
              <SkeletonLoader width="50%" height={10} />
            </View>
          </View>
          <View className="w-[140px] h-[86px] bg-surface border border-surface-border rounded-xl p-3 justify-between">
            <SkeletonLoader width="60%" height={10} />
            <View className="gap-1.5">
              <SkeletonLoader width="90%" height={12} />
              <SkeletonLoader width="50%" height={10} />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

// 3. Library Screen Skeleton
export function LibrarySkeleton() {
  return (
    <View className="flex-1 px-6 pt-4 gap-6">
      {/* Category Pills Row */}
      <View className="flex-row gap-2">
        <SkeletonLoader width={60} height={32} borderRadius={16} />
        <SkeletonLoader width={80} height={32} borderRadius={16} />
        <SkeletonLoader width={100} height={32} borderRadius={16} />
        <SkeletonLoader width={85} height={32} borderRadius={16} />
      </View>

      {/* Routines Grid/List */}
      <View className="gap-4">
        {[1, 2, 3, 4].map((i) => (
          <View
            key={i}
            className="bg-surface border border-surface-border p-4 rounded-xl flex-row justify-between items-center"
          >
            <View className="flex-1 gap-2">
              <SkeletonLoader width="60%" height={16} />
              <SkeletonLoader width="40%" height={12} />
            </View>
            <SkeletonLoader width={20} height={20} borderRadius={10} />
          </View>
        ))}
      </View>
    </View>
  );
}

// 4. Rewards Screen Skeleton
export function RewardsSkeleton() {
  return (
    <View className="flex-1 px-6 pt-6 gap-6">
      {/* Milestone Card */}
      <View className="bg-surface rounded-xl border border-surface-border p-5 gap-4">
        <SkeletonLoader width="30%" height={12} />
        <SkeletonLoader width="60%" height={18} />
        <SkeletonLoader width="100%" height={8} borderRadius={4} />

        <View className="gap-3 mt-2">
          {[1, 2, 3].map((i) => (
            <View key={i} className="flex-row items-center gap-3">
              <SkeletonLoader width={20} height={20} borderRadius={10} />
              <SkeletonLoader width="75%" height={12} />
            </View>
          ))}
        </View>
      </View>

      {/* Karma Coins Card */}
      <View className="bg-surface border border-surface-border rounded-xl p-5 flex-row justify-between items-center">
        <View className="gap-2 flex-1">
          <SkeletonLoader width="40%" height={10} />
          <SkeletonLoader width="30%" height={28} />
        </View>
        <SkeletonLoader width={36} height={36} borderRadius={18} />
      </View>

      {/* Button */}
      <SkeletonLoader width="100%" height={52} borderRadius={12} />
    </View>
  );
}

// 5. Profile Screen Skeleton
export function ProfileSkeleton() {
  return (
    <View className="flex-1 px-6 pt-6 gap-8">
      {/* User Meta Card */}
      <View className="items-center gap-3">
        <SkeletonLoader width={96} height={96} borderRadius={48} />
        <SkeletonLoader width="50%" height={24} />
        <SkeletonLoader width="30%" height={14} />
      </View>

      {/* Stats Bar */}
      <View className="flex-row justify-around border-t border-b border-surface-border py-6 bg-surface/30 rounded-xl">
        {[1, 2, 3].map((i) => (
          <View key={i} className="items-center gap-2 flex-1">
            <SkeletonLoader width="40%" height={28} />
            <SkeletonLoader width="60%" height={12} />
          </View>
        ))}
      </View>

      {/* Heatmap Card */}
      <View className="gap-3">
        <SkeletonLoader width="40%" height={18} />
        <View className="bg-surface rounded-xl border border-surface-border p-5 items-center">
          <View className="flex-row gap-1.5 justify-center">
            {[1, 2, 3, 4, 5, 6].map((col) => (
              <View key={col} className="gap-1.5">
                {[1, 2, 3, 4, 5, 6, 7].map((row) => (
                  <SkeletonLoader key={row} width={16} height={16} borderRadius={3} />
                ))}
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}

// 6. Course Detail Screen Skeleton
export function CourseDetailSkeleton() {
  return (
    <View className="flex-1 bg-background">
      {/* Hero Header Area */}
      <View className="h-[240px] bg-warm-highlight/30 items-center justify-center border-b border-surface-border">
        <SkeletonLoader width={64} height={64} borderRadius={32} />
      </View>

      {/* Main Content Area */}
      <View className="bg-background rounded-t-[24px] -mt-6 pt-6 px-6 gap-6 flex-1">
        <View className="gap-3 pt-2">
          <SkeletonLoader width="20%" height={12} />
          <SkeletonLoader width="75%" height={32} />

          {/* Instructor Row */}
          <View className="flex-row items-center gap-3 mt-2">
            <SkeletonLoader width={40} height={40} borderRadius={20} />
            <View className="gap-1.5 flex-1">
              <SkeletonLoader width="50%" height={14} />
              <SkeletonLoader width="30%" height={12} />
            </View>
          </View>

          {/* Meta Chips */}
          <View className="flex-row gap-2 mt-2">
            <SkeletonLoader width={80} height={24} borderRadius={12} />
            <SkeletonLoader width={80} height={24} borderRadius={12} />
            <SkeletonLoader width={100} height={24} borderRadius={12} />
          </View>
        </View>

        {/* Description Lines */}
        <View className="gap-2">
          <SkeletonLoader width="100%" height={14} />
          <SkeletonLoader width="95%" height={14} />
          <SkeletonLoader width="70%" height={14} />
        </View>

        {/* Syllabus Section */}
        <View className="gap-3 pb-8">
          <SkeletonLoader width="40%" height={14} />
          {[1, 2, 3].map((i) => (
            <View
              key={i}
              className="flex-row items-center gap-4 py-4 px-4 rounded-xl border border-surface-border bg-surface"
            >
              <SkeletonLoader width={20} height={16} />
              <View className="flex-1 gap-2">
                <SkeletonLoader width="70%" height={14} />
                <SkeletonLoader width="40%" height={10} />
              </View>
              <SkeletonLoader width={18} height={18} borderRadius={9} />
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

// 7. Player Screen Skeleton
export function PlayerSkeleton() {
  return (
    <View className="flex-1 bg-background justify-between px-6 pt-12 pb-8">
      {/* Header bar */}
      <View className="pt-12 pb-3 flex-row justify-between items-center w-full">
        <SkeletonLoader width={40} height={40} borderRadius={20} />
        <SkeletonLoader width={80} height={16} />
        <View className="w-10" />
      </View>

      {/* Rotating Mandala Artwork Skeleton */}
      <View className="items-center justify-center my-auto gap-8">
        <SkeletonLoader width={224} height={224} borderRadius={16} />
        <View className="items-center gap-2 w-full px-6">
          <SkeletonLoader width="70%" height={24} />
          <SkeletonLoader width="50%" height={16} />
        </View>
      </View>

      {/* Controls Stack Skeleton */}
      <View className="gap-6 w-full max-w-sm mx-auto">
        {/* Scrubber slider */}
        <View className="w-full gap-2">
          <SkeletonLoader width="100%" height={4} />
          <View className="flex-row justify-between items-center px-1">
            <SkeletonLoader width={40} height={12} />
            <SkeletonLoader width={40} height={12} />
          </View>
        </View>

        {/* Play controls */}
        <View className="flex-row justify-between items-center w-full px-4 mb-4">
          <SkeletonLoader width={32} height={32} borderRadius={16} />
          <SkeletonLoader width={32} height={32} borderRadius={16} />
          <SkeletonLoader width={64} height={64} borderRadius={32} />
          <SkeletonLoader width={32} height={32} borderRadius={16} />
          <SkeletonLoader width={32} height={32} borderRadius={16} />
        </View>

        {/* Mark as Complete CTA */}
        <SkeletonLoader width="100%" height={48} borderRadius={24} />
      </View>
    </View>
  );
}

