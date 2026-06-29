import React, { useEffect, useState, useRef, useMemo } from 'react';
import { router } from 'expo-router';
import { View, Text } from '@/tw';
import { useTheme } from '@/hooks/useTheme';
import { MandalaThread } from '@/components/ui/MandalaThread';
import { Heading, Body, Micro } from '@/components/ui/Typography';
import { Svg, Circle, Path } from '@/components/ui/Compat';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  Easing,
  cancelAnimation,
  interpolateColor,
  useDerivedValue,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av';
import { AccessibilityInfo, Modal, StyleSheet, useWindowDimensions, Pressable } from 'react-native';
import { PressableAnimated } from '@/components/ui/PressableAnimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Play, Pause, RotateCcw, Sparkles, Info, Heart, ChevronRight, Volume2, VolumeX } from 'lucide-react-native';

type BreatheState = 'safety' | 'ready' | 'inhale' | 'hold_in' | 'exhale' | 'hold_out' | 'complete';

export default function BreathingSpaceScreen() {
  const { colors, dark } = useTheme();
  const [breatheState, setBreatheState] = useState<BreatheState>('safety');
  const [cycleCount, setCycleCount] = useState(1);
  const [timeLeft, setTimeLeft] = useState(4); // 4-second phases
  const [readyCountdown, setReadyCountdown] = useState(3); // 3s prep
  const [isPlaying, setIsPlaying] = useState(true);
  const [isGlossaryOpen, setIsGlossaryOpen] = useState(false);
  const [soundMuted, setSoundMuted] = useState(false);
  const [reduceMotionEnabled, setReduceMotionEnabled] = useState(false);
  
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const isSmallDevice = height < 750;

  // Reanimated shared values
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const opacity = useSharedValue(0.4);
  const bgShift = useSharedValue(0.5); // 0 = cool, 0.5 = neutral, 1 = warm

  // Check and listen to OS reduced motion setting
  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      setReduceMotionEnabled(enabled);
    });

    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      (enabled) => {
        setReduceMotionEnabled(enabled);
      }
    );

    return () => {
      subscription.remove();
    };
  }, []);

  // Continuous linear loop for aesthetic rotation
  useEffect(() => {
    if (reduceMotionEnabled) {
      rotation.value = 0;
      cancelAnimation(rotation);
    } else {
      rotation.value = withRepeat(
        withTiming(360, { duration: 24000, easing: Easing.linear }),
        -1,
        false
      );
    }
    return () => cancelAnimation(rotation);
  }, [reduceMotionEnabled]);

  // Play transition chime
  const playTransitionBell = async () => {
    if (soundMuted) return;
    try {
      const { sound: chimeSound } = await Audio.Sound.createAsync(
        { uri: 'https://assets.mixkit.co/active_storage/sfx/2869/2869-84.wav' },
        { shouldPlay: true, volume: 0.35 }
      );
      setTimeout(() => {
        chimeSound.unloadAsync().catch(() => {});
      }, 7000);
    } catch (e) {
      console.warn('Chime failed to play', e);
    }
  };

  // Sync Reanimated values to active breathing phase
  const triggerVisuals = (phase: BreatheState) => {
    if (reduceMotionEnabled) {
      scale.value = 1.0;
      if (phase === 'inhale') {
        opacity.value = withTiming(0.8, { duration: 4000 });
        bgShift.value = withTiming(1.0, { duration: 4000 });
      } else if (phase === 'hold_in') {
        opacity.value = withTiming(0.62, { duration: 4000 });
      } else if (phase === 'exhale') {
        opacity.value = withTiming(0.34, { duration: 4000 });
        bgShift.value = withTiming(0.0, { duration: 4000 });
      } else if (phase === 'hold_out') {
        opacity.value = withTiming(0.44, { duration: 4000 });
      }
      return;
    }

    if (phase === 'inhale') {
      scale.value = withTiming(1.45, { duration: 4000, easing: Easing.out(Easing.ease) });
      opacity.value = withTiming(0.78, { duration: 4000 });
      bgShift.value = withTiming(1.0, { duration: 4000, easing: Easing.inOut(Easing.ease) });
    } else if (phase === 'hold_in') {
      // Subtle pulse during hold
      opacity.value = withTiming(0.62, { duration: 2000 });
    } else if (phase === 'exhale') {
      scale.value = withTiming(1.0, { duration: 4000, easing: Easing.inOut(Easing.ease) });
      opacity.value = withTiming(0.34, { duration: 4000 });
      bgShift.value = withTiming(0.0, { duration: 4000, easing: Easing.inOut(Easing.ease) });
    } else if (phase === 'hold_out') {
      opacity.value = withTiming(0.44, { duration: 2000 });
    } else {
      scale.value = withTiming(1.0, { duration: 700 });
      opacity.value = withTiming(0.4, { duration: 700 });
      bgShift.value = withTiming(0.5, { duration: 700 });
    }
  };

  // Trigger phase transition changes (haptics, sound, reanimated triggers)
  const handlePhaseTransition = (nextPhase: BreatheState) => {
    triggerVisuals(nextPhase);
    playTransitionBell();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
  };

  // Master breathing countdown interval
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      // 1. Ready state countdown (3s)
      if (breatheState === 'ready') {
        setReadyCountdown((prev) => {
          if (prev <= 1) {
            setBreatheState('inhale');
            setTimeLeft(4);
            handlePhaseTransition('inhale');
            return 3;
          }
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
          return prev - 1;
        });
        return;
      }

      // Safety and complete states do not tick
      if (breatheState === 'safety' || breatheState === 'complete') {
        return;
      }

      // 2. Main Sama Vritti Box Breathing ticking (Inhale -> Hold -> Exhale -> Hold)
      setTimeLeft((prev) => {
        // Every second tick haptic feedback
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});

        if (prev <= 1) {
          // Transition to next phase
          if (breatheState === 'inhale') {
            setBreatheState('hold_in');
            handlePhaseTransition('hold_in');
            return 4;
          } else if (breatheState === 'hold_in') {
            setBreatheState('exhale');
            handlePhaseTransition('exhale');
            return 4;
          } else if (breatheState === 'exhale') {
            setBreatheState('hold_out');
            handlePhaseTransition('hold_out');
            return 4;
          } else if (breatheState === 'hold_out') {
            // End of cycle! Check if we complete or rotate
            if (cycleCount < 3) {
              setCycleCount((c) => c + 1);
              setBreatheState('inhale');
              handlePhaseTransition('inhale');
              return 4;
            } else {
              setBreatheState('complete');
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
              return 0;
            }
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, breatheState, cycleCount]);

  // Overall session progress bar percentage
  const getPhaseOffset = (state: BreatheState) => {
    switch (state) {
      case 'inhale': return 0;
      case 'hold_in': return 4;
      case 'exhale': return 8;
      case 'hold_out': return 12;
      default: return 0;
    }
  };

  const overallProgress = useMemo(() => {
    if (breatheState === 'complete') return 100;
    if (breatheState === 'safety' || breatheState === 'ready') return 0;
    const elapsedSeconds = (cycleCount - 1) * 16 + getPhaseOffset(breatheState) + (4 - timeLeft);
    return Math.min((elapsedSeconds / 48) * 100, 100);
  }, [breatheState, cycleCount, timeLeft]);

  // Text details mapping
  const getBreatheTitle = () => {
    switch (breatheState) {
      case 'inhale': return 'INHALE';
      case 'hold_in': return 'HOLD';
      case 'exhale': return 'EXHALE';
      case 'hold_out': return 'SUSPEND';
      case 'complete': return 'COMPLETE';
      case 'ready': return 'PREPARE';
      default: return 'PRANAYAMA';
    }
  };

  const getBreatheSub = () => {
    switch (breatheState) {
      case 'inhale': return 'Expand your chest, fill the lungs slowly.';
      case 'hold_in': return 'Retain the breath, resting in stillness.';
      case 'exhale': return 'Slowly release the breath, softening shoulders.';
      case 'hold_out': return 'Keep lungs empty, steadying your attention.';
      case 'complete': return 'Stillness achieved. Settle in your calm center.';
      case 'ready': return 'Adjust your seat. Close your eyes.';
      default: return 'Establish your daily sanctuary.';
    }
  };

  // SVG Mandala Animation Styles
  const animatedMandalaStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}deg` }
    ],
    opacity: opacity.value,
  }));

  const containerAnimatedStyle = useAnimatedStyle(() => {
    const coolBg = dark ? '#141715' : '#F2F6F3';
    const neutralBg = dark ? '#181513' : '#FAF7F2';
    const warmBg = dark ? '#221C1A' : '#FAF0EC';

    const backgroundColor = interpolateColor(
      bgShift.value,
      [0, 0.5, 1],
      [coolBg, neutralBg, warmBg]
    );

    return {
      backgroundColor,
    };
  });

  const accentColorString = typeof colors.accent === 'string' ? colors.accent : '#C44B22';

  // SVG Circular breathing progress ring configurations
  const ringProgressDashoffset = useMemo(() => {
    const circumference = 2 * Math.PI * 72; // r=72 -> 452.4
    if (breatheState === 'inhale') {
      const pct = (4 - timeLeft) / 4;
      return circumference * (1 - pct);
    } else if (breatheState === 'hold_in') {
      return 0; // Fully filled
    } else if (breatheState === 'exhale') {
      const pct = timeLeft / 4;
      return circumference * (1 - pct);
    } else if (breatheState === 'hold_out') {
      return circumference; // Fully empty
    }
    return circumference;
  }, [breatheState, timeLeft]);

  return (
    <Animated.View
      style={[
        containerAnimatedStyle,
        {
          paddingBottom: Math.max(insets.bottom, 24),
        }
      ]}
      className="flex-1 relative px-6 justify-between"
    >
      <MandalaThread />

      {/* Top Header Block */}
      <View style={{ paddingTop: Math.max(insets.top, 16) }} className="w-full items-center">
        {/* Progress Tracker Line */}
        <View className="w-full bg-surface-border/20 h-1 rounded-full overflow-hidden">
          <View className="bg-accent-terracotta h-full transition-all duration-300" style={{ width: `${overallProgress}%` }} />
        </View>

        <View className={`text-center items-center gap-2 ${isSmallDevice ? 'mt-4' : 'mt-8'}`}>
          <View className="flex-row items-center gap-2 justify-center">
            <Micro className="text-secondary-text uppercase tracking-widest">SAMA VRITTI (BOX BREATH)</Micro>
            {breatheState !== 'safety' && breatheState !== 'complete' && (
              <View className="bg-accent-terracotta/10 px-2 py-0.5 rounded-full">
                <Text className="text-accent-terracotta text-[9px] font-bold">CYCLE {cycleCount}/3</Text>
              </View>
            )}
          </View>
          <Heading className="text-on-surface px-4 text-center">
            {breatheState === 'safety' ? 'Posture & Safety' : breatheState === 'complete' ? 'Quiet Center Found' : 'Share One Quiet Breath'}
          </Heading>
        </View>
      </View>

      {/* Center Stage: Interactive Breathing Screen */}
      <View className="flex-1 justify-center items-center my-4">
        {breatheState === 'safety' ? (
          /* 1. SAFETY CARD STAGE */
          <View className="w-full max-w-sm bg-surface border border-surface-border rounded-2xl p-6 shadow-xl shadow-black/10">
            <View className="flex-row items-center gap-3 mb-3">
              <Info size={20} color={accentColorString} />
              <Text className="font-sans font-bold text-on-surface text-base">Guidelines & Safety</Text>
            </View>
            <Text className="text-secondary-text text-sm leading-relaxed mb-4">
              Sit upright with your spine tall but relaxed. Rest your hands on your lap. Breathe gently through the nose. Let the belly expand as you inhale.
            </Text>
            <View className="bg-accent-terracotta/5 border border-accent-terracotta/10 p-3 rounded-lg flex-row gap-2.5 mb-5">
              <Text className="text-accent-terracotta text-base mt-0.5">⚠️</Text>
              <Text className="text-accent-terracotta text-[11px] leading-relaxed flex-1 font-medium">
                Sama Vritti is safe and calming, but if you feel lightheaded, dizzy, or experience shortness of breath, please stop immediately and return to natural breathing.
              </Text>
            </View>
            <PressableAnimated
              className="w-full bg-accent-terracotta py-3.5 rounded-xl items-center justify-center flex-row gap-2 active:opacity-90"
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
                setBreatheState('ready');
                setReadyCountdown(3);
              }}
              haptic="medium"
            >
              <Text className="text-white font-sans font-bold text-sm">Begin Breathwork</Text>
              <ChevronRight size={15} color="#FFFFFF" />
            </PressableAnimated>
          </View>
        ) : breatheState === 'complete' ? (
          /* 2. COMPLETION STAGE */
          <View className="w-full max-w-sm items-center text-center p-6">
            <View className="w-20 h-20 rounded-full items-center justify-center mb-6 bg-accent-terracotta/10">
              <Sparkles size={40} color={accentColorString} />
            </View>
            <Text className="font-sans font-bold text-on-surface text-2xl mb-3 text-center">Stillness Achieved</Text>
            <Text className="text-secondary-text text-sm leading-relaxed text-center mb-8 italic">
              "The air is your sanctuary. Carry this quiet stillness with you as you enter your personalized practice."
            </Text>
            <PressableAnimated
              className="w-full max-w-[280px] bg-accent-terracotta py-4 rounded-xl items-center justify-center flex-row gap-2 active:opacity-90"
              onPress={() => router.push('/(auth)/gdpr')}
              haptic="medium"
              accessibilityLabel="Continue to GDPR consent screen"
            >
              <Text className="text-white font-sans font-bold text-sm">Enter the Sanctuary</Text>
              <ChevronRight size={15} color="#FFFFFF" />
            </PressableAnimated>
          </View>
        ) : (
          /* 3. ACTIVE BREATHING STAGE */
          <View className="justify-center items-center relative w-72 h-72">
            {/* Concentric Breathing Progress Ring */}
            <View className="absolute inset-0 items-center justify-center z-0">
              <Svg width="160" height="160" viewBox="0 0 160 160">
                <Circle cx="80" cy="80" r="72" stroke="rgba(255,255,255,0.06)" strokeWidth="6" fill="none" />
                <Circle
                  cx="80"
                  cy="80"
                  r="72"
                  stroke={accentColorString}
                  strokeWidth="6"
                  fill="none"
                  strokeDasharray={2 * Math.PI * 72}
                  strokeDashoffset={ringProgressDashoffset}
                  strokeLinecap="round"
                  transform="rotate(-90 80 80)"
                />
              </Svg>
            </View>

            {/* Subtle Radial Breathing Halo */}
            <Animated.View
              pointerEvents="none"
              style={[
                useAnimatedStyle(() => ({
                  transform: [{ scale: scale.value }],
                  opacity: opacity.value * 0.12, // Very soft halo
                })),
                {
                  position: 'absolute',
                  width: isSmallDevice ? 170 : 210,
                  height: isSmallDevice ? 170 : 210,
                  borderRadius: isSmallDevice ? 85 : 105,
                  backgroundColor: accentColorString,
                }
              ]}
            />

            {/* Glowing Lotus Mandala */}
            <Animated.View
              style={[animatedMandalaStyle, { width: isSmallDevice ? 156 : 192, height: isSmallDevice ? 156 : 192 }]}
              className="absolute items-center justify-center"
            >
              <Svg width="100%" height="100%" viewBox="0 0 200 200">
                <Circle cx="100" cy="100" r="90" fill="none" stroke={accentColorString} strokeWidth="0.5" strokeDasharray="4 4" opacity="0.3" />
                <Circle cx="100" cy="100" r="70" fill="none" stroke={accentColorString} strokeWidth="0.5" opacity="0.4" />
                <Circle cx="100" cy="100" r="50" fill="none" stroke={accentColorString} strokeWidth="0.5" opacity="0.5" />
                {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, index) => (
                  <Path
                    key={index}
                    d="M100 100 C115 70 125 70 100 30 C75 70 85 70 100 100 Z"
                    fill="none"
                    stroke={accentColorString}
                    strokeWidth="0.75"
                    opacity="0.35"
                    transform={`rotate(${angle} 100 100)`}
                  />
                ))}
              </Svg>
            </Animated.View>
            
            {/* Centered Telemetry Text */}
            <View className="absolute inset-0 items-center justify-center z-10">
              <Heading className="text-on-surface font-sans font-bold text-2xl tracking-widest text-center mt-1">
                {getBreatheTitle()}
              </Heading>
              <Text className="font-mono text-accent-terracotta text-base font-semibold mt-1">
                {breatheState === 'ready' ? `${readyCountdown}s` : `${timeLeft}s`}
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* Middle Text: Subtitle Directions */}
      {breatheState !== 'safety' && breatheState !== 'complete' && (
        <View className="w-full items-center mb-6">
          <Text className="text-secondary-text text-sm text-center px-8 leading-relaxed max-w-sm">
            {getBreatheSub()}
          </Text>
        </View>
      )}

      {/* Bottom Button/Controls Panel */}
      <View className="w-full items-center">
        {breatheState !== 'safety' && breatheState !== 'complete' ? (
          /* Active Breath controls */
          <View className="w-full flex-row justify-center items-center gap-10">
            <PressableAnimated
              className="w-12 h-12 rounded-full bg-surface border border-surface-border items-center justify-center"
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                setBreatheState('safety');
                setCycleCount(1);
                setIsPlaying(true);
              }}
              haptic="light"
              accessibilityLabel="Restart breathing practice"
            >
              <RotateCcw size={18} color={accentColorString} />
            </PressableAnimated>
            
            <PressableAnimated
              className="w-16 h-16 rounded-full bg-accent-terracotta items-center justify-center shadow-lg shadow-accent-terracotta/20"
              onPress={() => setIsPlaying(!isPlaying)}
              haptic="medium"
              accessibilityLabel={isPlaying ? 'Pause breathing practice' : 'Resume breathing practice'}
            >
              {isPlaying ? <Pause size={24} color="#FFFFFF" fill="#FFFFFF" /> : <Play size={24} color="#FFFFFF" fill="#FFFFFF" style={{ marginLeft: 3 }} />}
            </PressableAnimated>

            <PressableAnimated
              className="w-12 h-12 rounded-full bg-surface border border-surface-border items-center justify-center"
              onPress={() => setSoundMuted(!soundMuted)}
              haptic="light"
              accessibilityLabel={soundMuted ? 'Unmute transition sounds' : 'Mute transition sounds'}
            >
              {soundMuted ? <VolumeX size={18} color="#A69580" /> : <Volume2 size={18} color={accentColorString} />}
            </PressableAnimated>
          </View>
        ) : breatheState === 'safety' ? (
          /* Sanskrit Glossary Trigger */
          <View className="items-center">
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
        ) : null}
      </View>

      {/* Slide-Up Glossary Bottom Sheet Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isGlossaryOpen}
        onRequestClose={() => setIsGlossaryOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={styles.modalDismiss}
            onPress={() => setIsGlossaryOpen(false)}
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
              Prana means "life force" or "breath," and yama means "control." Pranayama is the practice of breath regulation, a core component of yoga. It is a method to clear physical and emotional obstacles in our body to free the flow of prana.
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
    </Animated.View>
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
