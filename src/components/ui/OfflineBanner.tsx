import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { View, Text } from '@/tw';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { WifiOff } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(false);
  const insets = useSafeAreaInsets();
  
  const progress = useSharedValue(0);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOffline(state.isConnected === false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    progress.value = withSpring(isOffline ? 1 : 0, { damping: 15, stiffness: 120 });
  }, [isOffline]);

  const animatedStyle = useAnimatedStyle(() => {
    const translateY = (1 - progress.value) * 120;
    return {
      transform: [{ translateY }],
      opacity: progress.value,
    };
  });

  return (
    <Animated.View
      style={[
        styles.bannerContainer,
        { bottom: insets.bottom + 8 },
        animatedStyle,
      ]}
      pointerEvents={isOffline ? 'auto' : 'none'}
    >
      <View className="bg-destructive/95 px-4 py-2.5 rounded-full flex-row items-center gap-2.5 shadow-lg border border-white/10">
        <WifiOff size={14} color="#FFFFFF" />
        <Text className="font-sans font-bold text-xs text-white">
          Practice Offline • Database sync paused
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  bannerContainer: {
    position: 'absolute',
    left: 20,
    right: 20,
    alignItems: 'center',
    zIndex: 9999,
  },
});
