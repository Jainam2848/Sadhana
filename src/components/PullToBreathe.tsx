import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  interpolate,
  Extrapolation,
  SharedValue,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

const THRESHOLD = 130;
const MAX_PULL = 220;

interface PullToBreatheProps {
  children: React.ReactNode;
  onRefresh: () => Promise<void> | void;
  scrollOffset?: SharedValue<number>;
}

export const PullToBreathe: React.FC<PullToBreatheProps> = ({ children, onRefresh, scrollOffset }) => {
  const translateY = useSharedValue(0);
  const isRefreshing = useSharedValue(false);

  const triggerHapticInhale = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  }, []);

  const triggerHapticHold = useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
  }, []);

  const triggerHapticExhale = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
  }, []);

  const runRefresh = useCallback(async () => {
    try {
      await onRefresh();
    } catch (e) {
      console.error('[PullToBreathe] Refresh error:', e);
    }
  }, [onRefresh]);

  const startRefreshSequence = useCallback(() => {
    // Hold for 2 seconds (Kumbhaka)
    setTimeout(() => {
      runRefresh();
      
      // Slow exhale snap-back over 4 seconds
      translateY.value = withTiming(0, { duration: 4000 }, (finished) => {
        if (finished) {
          isRefreshing.value = false;
          runOnJS(triggerHapticExhale)();
        }
      });
    }, 2000);
  }, [runRefresh, triggerHapticExhale]);

  const pan = Gesture.Pan()
    .activeOffsetY([5, 100]) // Only trigger on pull down
    .onUpdate((event) => {
      'worklet';
      if (isRefreshing.value) return;

      // Ensure we are at the top of the scrollable container before pulling
      if (scrollOffset && scrollOffset.value > 0.5) {
        translateY.value = 0;
        return;
      }

      const rawY = event.translationY;
      if (rawY > 0) {
        // Log-based resistance for weighty, fluid pull feeling
        const pulled = Math.pow(rawY, 0.82);
        const lastValue = translateY.value;
        translateY.value = Math.min(pulled, MAX_PULL);

        // Haptic feedback pulses based on pull distance increments
        const currentInt = Math.floor(translateY.value);
        const lastInt = Math.floor(lastValue);
        if (currentInt > 0 && Math.floor(currentInt / 18) > Math.floor(lastInt / 18)) {
          runOnJS(triggerHapticInhale)();
        }
      } else {
        translateY.value = 0;
      }
    })
    .onEnd(() => {
      'worklet';
      if (isRefreshing.value) return;

      if (translateY.value >= THRESHOLD) {
        isRefreshing.value = true;
        
        // Snaps to holding state (Kumbhaka)
        translateY.value = withSpring(THRESHOLD, { damping: 15, stiffness: 80 });
        runOnJS(triggerHapticHold)();

        // Trigger holding, refresh, and snapback sequence on JS thread
        runOnJS(startRefreshSequence)();
      } else {
        // Quick snap back if threshold not met
        translateY.value = withSpring(0, { damping: 20, stiffness: 120 });
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      translateY.value,
      [0, THRESHOLD],
      [1, 1.05],
      Extrapolation.CLAMP
    );

    return {
      transform: [
        { translateY: translateY.value },
        { scale: scale },
      ],
    };
  });

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[styles.container, animatedStyle]}>
        {children}
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
