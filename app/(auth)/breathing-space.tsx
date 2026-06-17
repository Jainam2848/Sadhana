import React, { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { View, Text } from '@/tw';
import { useTheme } from '@/hooks/useTheme';
import { MandalaThread } from '@/components/ui/MandalaThread';
import { Heading, Body, Micro } from '@/components/ui/Typography';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Modal, StyleSheet } from 'react-native';
import { PressableAnimated } from '@/components/ui/PressableAnimated';

export default function BreathingSpaceScreen() {
  const { colors } = useTheme();
  const [breatheState, setBreatheState] = useState<'ready' | 'inhale' | 'hold' | 'exhale' | 'complete'>('ready');
  const [isGlossaryOpen, setIsGlossaryOpen] = useState(false);
  const [showContinue, setShowContinue] = useState(false);

  // Animation values
  const circleScale1 = useSharedValue(1);
  const circleScale2 = useSharedValue(1);
  const circleScale3 = useSharedValue(1);

  const circleOpacity1 = useSharedValue(0.3);
  const circleOpacity2 = useSharedValue(0.2);
  const circleOpacity3 = useSharedValue(0.1);

  // Run the 30-second breathing space demo (1 full cycles of 10s: Inhale 4s, Hold 2s, Exhale 4s, repeat, then complete)
  useEffect(() => {
    let timer: any;

    const runDemo = () => {
      // 1. Ready to Inhale (delayed start)
      timer = setTimeout(() => {
        // First Cycle: Inhale (0 to 4s)
        setBreatheState('inhale');
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        
        circleScale1.value = withTiming(1.15, { duration: 4000, easing: Easing.out(Easing.ease) });
        circleScale2.value = withTiming(1.45, { duration: 4000, easing: Easing.out(Easing.ease) });
        circleScale3.value = withTiming(1.85, { duration: 4000, easing: Easing.out(Easing.ease) });

        circleOpacity1.value = withTiming(0.7, { duration: 4000 });
        circleOpacity2.value = withTiming(0.5, { duration: 4000 });
        circleOpacity3.value = withTiming(0.3, { duration: 4000 });

        // Hold (4s to 6s)
        timer = setTimeout(() => {
          setBreatheState('hold');
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

          // Subtly pulse opacity during hold
          circleOpacity1.value = withTiming(0.5, { duration: 2000 });
          circleOpacity2.value = withTiming(0.3, { duration: 2000 });
          circleOpacity3.value = withTiming(0.2, { duration: 2000 });

          // Exhale (6s to 10s)
          timer = setTimeout(() => {
            setBreatheState('exhale');
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

            circleScale1.value = withTiming(1.0, { duration: 4000, easing: Easing.inOut(Easing.ease) });
            circleScale2.value = withTiming(1.0, { duration: 4000, easing: Easing.inOut(Easing.ease) });
            circleScale3.value = withTiming(1.0, { duration: 4000, easing: Easing.inOut(Easing.ease) });

            circleOpacity1.value = withTiming(0.3, { duration: 4000 });
            circleOpacity2.value = withTiming(0.2, { duration: 4000 });
            circleOpacity3.value = withTiming(0.1, { duration: 4000 });

            // Complete
            timer = setTimeout(() => {
              setBreatheState('complete');
              setShowContinue(true);
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }, 4000);
          }, 2000);
        }, 4000);
      }, 1500);
    };

    runDemo();

    return () => clearTimeout(timer);
  }, []);

  // Animated styles for concentric circles
  const circleStyle1 = useAnimatedStyle(() => ({
    transform: [{ scale: circleScale1.value }],
    opacity: circleOpacity1.value,
  }));

  const circleStyle2 = useAnimatedStyle(() => ({
    transform: [{ scale: circleScale2.value }],
    opacity: circleOpacity2.value,
  }));

  const circleStyle3 = useAnimatedStyle(() => ({
    transform: [{ scale: circleScale3.value }],
    opacity: circleOpacity3.value,
  }));

  const getBreatheText = () => {
    switch (breatheState) {
      case 'inhale':
        return 'Inhale';
      case 'hold':
        return 'Hold';
      case 'exhale':
        return 'Exhale';
      case 'complete':
        return 'Complete';
      default:
        return 'Ready';
    }
  };

  const accentColorString = typeof colors.accent === 'string' ? colors.accent : '#C44B22';

  return (
    <View className="flex-1 bg-background relative px-6 py-12 justify-between">
      <MandalaThread />

      {/* Top Header Block */}
      <View className="w-full items-center mt-4">
        {/* Progress Bar (30%) */}
        <View className="w-full bg-surface-border/20 h-1 rounded-full overflow-hidden">
          <View className="bg-accent-terracotta h-full w-[30%]" />
        </View>
        <View className="text-center items-center mt-12 gap-2">
          <Micro className="text-secondary-text">Experience Stillness</Micro>
          <Heading className="text-on-surface px-4 text-center">
            A 30-Second Breathing Space
          </Heading>
        </View>
      </View>

      {/* Center Section: Concentric Circles Animation */}
      <View className="flex-1 justify-center items-center my-12">
        <View className="w-64 h-64 justify-center items-center relative">
          {/* Animated concentric circles */}
          <View className="absolute w-32 h-32 rounded-full border border-accent-terracotta/20">
            <Animated.View
              style={[circleStyle3, { width: '100%', height: '100%', borderRadius: 9999, borderWidth: 1, borderColor: accentColorString }]}
            />
          </View>
          <View className="absolute w-32 h-32 rounded-full bg-surface-border/20">
            <Animated.View
              style={[circleStyle2, { width: '100%', height: '100%', borderRadius: 9999, backgroundColor: 'rgba(42,29,10,0.08)' }]}
            />
          </View>
          <View className="absolute w-32 h-32 rounded-full bg-surface-border/40">
            <Animated.View
              style={[circleStyle1, { width: '100%', height: '100%', borderRadius: 9999, backgroundColor: 'rgba(42,29,10,0.16)' }]}
            />
          </View>
          
          {/* Centered state text */}
          <View className="absolute inset-0 items-center justify-center z-10">
            <Heading className="text-accent-terracotta text-2xl font-semibold">
              {getBreatheText()}
            </Heading>
          </View>
        </View>

        {/* Sanskrit Glossary Trigger */}
        <View className="mt-8 items-center">
          <PressableAnimated
            className="items-center gap-1 active:opacity-85"
            onPress={() => setIsGlossaryOpen(true)}
            haptic="light"
            accessibilityLabel="Open glossary explaining Pranayama"
          >
            <Text className="text-secondary-text text-sm">
              Sanskrit:{' '}
              <Text className="font-devanagari text-accent-terracotta font-medium">
                प्राणायाम
              </Text>{' '}
              (Pranayama)
            </Text>
            <Text className="text-xs text-secondary-text border-b border-dashed border-secondary-text pb-0.5">
              What is this?
            </Text>
          </PressableAnimated>
        </View>
      </View>

      {/* Bottom Button Panel */}
      <View className="w-full items-center h-16 justify-end">
        {showContinue && (
          <PressableAnimated
            className="w-full max-w-[320px] bg-accent-terracotta py-4 rounded-xl items-center active:opacity-90 animate-fade-in"
            onPress={() => router.push('/(auth)/gdpr')}
            haptic="medium"
            accessibilityLabel="Continue to GDPR consent screen"
          >
            <Text className="text-white font-sans font-bold text-base">
              Continue
            </Text>
          </PressableAnimated>
        )}
      </View>

      {/* Slide-Up Glossary Bottom Sheet Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isGlossaryOpen}
        onRequestClose={() => setIsGlossaryOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <PressableAnimated
            style={styles.modalDismiss}
            onPress={() => setIsGlossaryOpen(false)}
            haptic="none"
          />
          <View
            className="bg-surface w-full max-w-md rounded-t-[24px] p-6 pb-12 border-t border-surface-border"
            style={styles.modalContent}
          >
            <View className="w-12 h-1 bg-surface-border/40 rounded-full mx-auto mb-4" />
            <Heading className="text-on-surface mb-4 flex-row items-center gap-2">
              <Text className="font-devanagari text-accent-terracotta text-2xl">प्राणायाम</Text>{' '}
              Pranayama
            </Heading>
            <Body className="text-secondary-text text-sm mb-6 leading-relaxed">
              Prana means "life force" or "breath," and yama means "control." Pranayama is the practice of breath regulation, a core component of yoga. It is a method to clear the physical and emotional obstacles in our body to free the breath and flow of prana.
            </Body>
            <PressableAnimated
              className="w-full py-3.5 rounded-full border border-accent-terracotta items-center active:bg-warm-highlight"
              onPress={() => setIsGlossaryOpen(false)}
              haptic="light"
              accessibilityLabel="Close glossary modal"
            >
              <Text className="text-accent-terracotta font-sans font-bold text-sm">
                Close
              </Text>
            </PressableAnimated>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(28, 20, 9, 0.4)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalDismiss: {
    flex: 1,
    width: '100%',
  },
  modalContent: {
    elevation: 5,
    shadowColor: '#1C1409',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
});
