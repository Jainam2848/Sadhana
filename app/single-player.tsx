import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, StyleSheet, Platform, ActivityIndicator, Alert, AccessibilityInfo } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useSubmitSession } from '@/hooks/api';
import { Text } from '@/components/ui/Text';
import { SettlingTransition } from '@/components/ui/SettlingTransition';
import { useSignatureHaptic } from '@/hooks/useSignatureHaptic';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { ChevronDown, Play, Pause, RotateCcw, Heart, Check, Award, Volume2, VolumeX } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  cancelAnimation,
  Easing,
} from 'react-native-reanimated';
import { PressableAnimated } from '@/components/ui/PressableAnimated';
import { StatusBar } from 'expo-status-bar';
import { Svg, Circle, Path } from 'react-native-svg';
import { Display, Heading, Subheading, Caption, Micro } from '@/components/ui/Typography';
import { MandalaThread } from '@/components/ui/MandalaThread';

export default function SinglePlayerScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const submitSession = useSubmitSession();
  const triggerSignatureHaptic = useSignatureHaptic();

  const { routineId, title, lessonTitle, mediaUrl, duration, category } = useLocalSearchParams<{
    routineId: string;
    title: string;
    lessonTitle: string;
    mediaUrl: string;
    duration: string;
    category: string;
  }>();

  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoadingSound, setIsLoadingSound] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [breathCue, setBreathCue] = useState('Stillness');

  // Time tracking (countdown)
  const totalSeconds = useMemo(() => parseInt(duration || '15', 10) * 60, [duration]);
  const [position, setPosition] = useState(0);
  const remainingSeconds = useMemo(() => Math.max(totalSeconds - position, 0), [totalSeconds, position]);

  // Reanimated Shared Values for Breathing Mandala
  const breathingScale = useSharedValue(1);
  const breathingOpacity = useSharedValue(0.42);
  const visualizerRotation = useSharedValue(0);

  // Check and listen to OS reduced motion setting
  const [reduceMotionEnabled, setReduceMotionEnabled] = useState(false);
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

  useEffect(() => {
    if (reduceMotionEnabled) {
      visualizerRotation.value = 0;
      cancelAnimation(visualizerRotation);
    } else {
      visualizerRotation.value = withRepeat(
        withTiming(360, { duration: 32000, easing: Easing.linear }),
        -1,
        false
      );
    }
    return () => {
      cancelAnimation(visualizerRotation);
    };
  }, [reduceMotionEnabled]);

  // Playback finished handler
  const handlePlaybackFinished = useCallback(async () => {
    setIsPlaying(false);
    setPosition(totalSeconds);
    setIsCompleted(true);
    
    // Trigger signature haptic naturally at completion
    await triggerSignatureHaptic();

    // Perform dramatic visual completion expand-and-fade animation on breathing ring
    cancelAnimation(breathingScale);
    cancelAnimation(breathingOpacity);
    breathingScale.value = withTiming(2.5, { duration: 1000, easing: Easing.out(Easing.quad) });
    breathingOpacity.value = withTiming(0, { duration: 1000, easing: Easing.out(Easing.quad) });

    // Submit session to backend
    try {
      await submitSession.mutateAsync({
        routineId: routineId || 'single-practice-mock',
        durationPracticed: parseInt(duration || '15', 10),
      });
    } catch (e) {
      console.warn('[SinglePlayer] Failed to upload finished session:', e);
    }
  }, [routineId, duration, totalSeconds, triggerSignatureHaptic, breathingScale, breathingOpacity, submitSession]);

  // Load sound stream
  const loadMedia = async () => {
    try {
      setIsLoadingSound(true);
      setHasError(false);
      if (sound) {
        await sound.unloadAsync();
      }

      const streamUrl = mediaUrl || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: streamUrl },
        { shouldPlay: false, volume: isMuted ? 0 : 0.5 }
      );

      setSound(newSound);

      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          const currentPos = Math.round(status.positionMillis / 1000);
          setPosition(currentPos);
          setIsPlaying(status.isPlaying);
          
          if (status.didJustFinish) {
            handlePlaybackFinished();
          }
        }
      });

      setIsLoadingSound(false);
    } catch (e) {
      console.warn('Failed to load audio stream', e);
      setIsLoadingSound(false);
      setHasError(true);
    }
  };

  useEffect(() => {
    loadMedia();
    return () => {
      if (sound) {
        sound.unloadAsync().catch(() => {});
      }
    };
  }, [routineId]);

  // Sync volume with mute status
  useEffect(() => {
    if (sound) {
      sound.setVolumeAsync(isMuted ? 0 : 0.5).catch(() => {});
    }
  }, [isMuted, sound]);

  // Coordinate Breathing Ring animation loop when playing
  useEffect(() => {
    if (isCompleted) return;

    if (isPlaying) {
      if (reduceMotionEnabled) {
        // Reduced motion: static scale and static opacity
        breathingScale.value = withTiming(1.0, { duration: 500 });
        breathingOpacity.value = withTiming(0.6, { duration: 500 });
      } else {
        // Gentle breathing rate (4s inhale, 4s exhale)
        breathingScale.value = withRepeat(
          withSequence(
            withTiming(1.28, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
            withTiming(1.0, { duration: 4000, easing: Easing.inOut(Easing.ease) })
          ),
          -1,
          false
        );
        breathingOpacity.value = withRepeat(
          withSequence(
            withTiming(0.8, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
            withTiming(0.42, { duration: 4000, easing: Easing.inOut(Easing.ease) })
          ),
          -1,
          false
        );
      }
    } else {
      // Settle down to static breathing ring
      breathingScale.value = withTiming(1.0, { duration: 1000 });
      breathingOpacity.value = withTiming(0.42, { duration: 1000 });
    }

    return () => {
      if (!isCompleted) {
        cancelAnimation(breathingScale);
        cancelAnimation(breathingOpacity);
      }
    };
  }, [isPlaying, isCompleted, breathingScale, breathingOpacity, reduceMotionEnabled]);

  // Coordinate Breathing Cues and Haptics
  useEffect(() => {
    if (isCompleted) {
      setBreathCue('Completed');
      return;
    }
    if (!isPlaying) {
      setBreathCue('Paused');
      return;
    }

    setBreathCue('Inhale');
    let isExhale = false;

    // Trigger haptic at start of play
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});

    const interval = setInterval(() => {
      isExhale = !isExhale;
      setBreathCue(isExhale ? 'Exhale' : 'Inhale');
      // Subtle microinteraction: haptic pulse on inhale/exhale transition
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }, 4000);

    return () => clearInterval(interval);
  }, [isPlaying, isCompleted]);

  // Play/pause toggles
  const togglePlayPause = useCallback(async () => {
    if (!sound) return;
    if (isPlaying) {
      await sound.pauseAsync();
    } else {
      await sound.playAsync();
    }
  }, [sound, isPlaying]);

  const handleReset = useCallback(async () => {
    if (!sound) return;
    await sound.setPositionAsync(0);
    setPosition(0);
    setIsCompleted(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [sound]);

  const formatTime = useCallback((seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  }, []);

  const progressPercent = useMemo(() => Math.min((position / totalSeconds) * 100, 100), [position, totalSeconds]);

  // Breathing style mapping
  const breathingRingStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: breathingScale.value },
        { rotate: `${visualizerRotation.value}deg` }
      ],
      opacity: breathingOpacity.value,
    };
  });

  const accentColorString = useMemo(() => (typeof colors.accent === 'string' ? colors.accent : '#C44B22'), [colors.accent]);

  // Render Full Screen Completion State
  if (isCompleted) {
    return (
      <View style={styles.fullscreenOverlay}>
        <MandalaThread />
        <View className="items-center justify-center px-8 flex-1">
          {/* Circular badge */}
          <View className="w-24 h-24 bg-growth-green/10 border border-growth-green/30 rounded-full items-center justify-center mb-6">
            <Award size={48} color="#4CAF50" strokeWidth={1.5} />
          </View>

          {/* Stats Card */}
          <View className="w-full max-w-xs flex-row justify-around bg-surface border border-surface-border rounded-xl p-5 mb-6 shadow-sm">
            <View className="items-center">
              <Text className="font-sans text-xs text-secondary-text">Minutes Completed</Text>
              <Display className="text-primary-text font-bold text-2xl mt-1">
                {duration || '15'}
              </Display>
            </View>
            <View className="w-[1px] bg-surface-border/50" />
            <View className="items-center">
              <Text className="font-sans text-xs text-secondary-text">Karma Coins</Text>
              <Display className="text-primary-text font-bold text-2xl mt-1">
                +30
              </Display>
            </View>
          </View>
          
          <Heading className="text-3xl font-serif text-primary-text text-center mb-2">
            Practice Complete
          </Heading>
          
          <Heading className="text-accent-terracotta text-center font-devanagari text-2xl mb-4">
            Hari Om Tat Sat
          </Heading>
          <Caption className="text-secondary-text text-center font-sans max-w-xs mb-8">
            You have completed {duration || '15'} minutes of {lessonTitle || title || 'Meditation'}. Your morning devotion is logged.
          </Caption>

          <PressableAnimated
            haptic="medium"
            className="px-8 py-4 bg-accent-terracotta rounded-full flex-row items-center gap-2 active:opacity-90 shadow-md"
            onPress={() => router.back()}
            accessibilityLabel="Return to dashboard"
          >
            <Text className="text-white font-sans font-bold text-sm">Hari Om</Text>
          </PressableAnimated>
        </View>
      </View>
    );
  }

  // Render Full Screen Loading State
  if (isLoadingSound) {
    return (
      <View style={styles.fullscreenOverlay}>
        <MandalaThread />
        <View className="items-center justify-center flex-1">
          <ActivityIndicator size="large" color={accentColorString} />
          <Text className="font-serif text-base text-primary-text mt-4">
            Preparing your practice sanctuary...
          </Text>
        </View>
      </View>
    );
  }

  // Render Full Screen Error State
  if (hasError) {
    return (
      <View style={styles.fullscreenOverlay}>
        <MandalaThread />
        <View className="items-center justify-center flex-1 px-8">
          <Text className="font-serif text-lg text-accent-terracotta font-bold mb-2 text-center">
            Failed to open sanctuary
          </Text>
          <Text className="text-sm text-secondary-text mb-6 text-center leading-relaxed">
            Please make sure your device is connected to the internet and try again.
          </Text>
          <View className="flex-row gap-4">
            <PressableAnimated
              haptic="light"
              className="px-6 py-2.5 bg-surface border border-surface-border rounded-full"
              onPress={() => router.back()}
            >
              <Text className="font-sans font-bold text-sm text-primary-text">Back</Text>
            </PressableAnimated>
            <PressableAnimated
              haptic="medium"
              className="px-6 py-2.5 bg-accent-terracotta rounded-full"
              onPress={loadMedia}
            >
              <Text className="font-sans font-bold text-sm text-white">Retry</Text>
            </PressableAnimated>
          </View>
        </View>
      </View>
    );
  }

  return (
    <SettlingTransition style={styles.settlingContainer}>
      <View style={styles.container}>
        <StatusBar style="light" />

        {/* Top Header Navigation */}
        <View style={styles.header}>
          <PressableAnimated
            style={styles.closeBtn}
            onPress={() => router.back()}
            haptic="light"
            accessibilityRole="button"
            accessibilityLabel="Close Practice Sanctuary Player"
            accessibilityHint="Navigates back to the home dashboard screen."
          >
            <ChevronDown size={24} color="#FDFAF5" />
          </PressableAnimated>

          <Text variant="body" weight="medium" style={styles.headerTitle}>
            PRACTICE PLAYER
          </Text>

          <PressableAnimated
            style={styles.closeBtn}
            onPress={() => {
              setIsFavorited(!isFavorited);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
            haptic="light"
            accessibilityRole="button"
            accessibilityLabel={isFavorited ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart
              size={20}
              color={isFavorited ? accentColorString : '#FDFAF5'}
              fill={isFavorited ? accentColorString : 'transparent'}
            />
          </PressableAnimated>
        </View>

        {/* Dynamic Center Stage: Concentric Breathing Mandala */}
        <View style={styles.centerStage}>
          <View style={styles.visualizerContainer}>
            {/* Pulsing Spinning Mandala SVG */}
            <Animated.View style={[styles.mandalaWrapper, breathingRingStyle]}>
              <Svg width={240} height={240} viewBox="0 0 220 220" fill="none">
                {/* Concentric rings */}
                <Circle cx="110" cy="110" r="96" stroke={accentColorString} strokeWidth="0.6" strokeDasharray="5 6" opacity="0.25" />
                <Circle cx="110" cy="110" r="72" stroke={accentColorString} strokeWidth="0.6" opacity="0.4" />
                <Circle cx="110" cy="110" r="50" stroke={accentColorString} strokeWidth="0.8" opacity="0.55" />
                {/* Petals */}
                {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                  <Path
                    key={angle}
                    d="M110 110 C128 78 136 78 110 36 C84 78 92 78 110 110 Z"
                    stroke={accentColorString}
                    strokeWidth="0.75"
                    opacity="0.35"
                    transform={`rotate(${angle} 110 110)`}
                  />
                ))}
              </Svg>
            </Animated.View>

            {/* Inner Center Timer Display */}
            <View className="absolute inset-0 items-center justify-center">
              <Text className="font-serif text-3xl font-bold text-white leading-none">
                {formatTime(remainingSeconds)}
              </Text>
              <Caption className="text-white/40 text-[9px] uppercase font-bold mt-1.5 tracking-widest">
                {breathCue}
              </Caption>
            </View>
          </View>

          {/* Title & Instructor Details */}
          <View style={styles.metaContainer}>
            <Text variant="display" weight="bold" style={styles.lessonTitle}>
              {lessonTitle || title}
            </Text>
            <Text variant="body" style={[styles.instructorSub, { color: '#a38c75' }]}>
              Swami Vidyadhishananda • {category?.toUpperCase() || 'MEDITATION'}
            </Text>
          </View>
        </View>

        {/* Lower Controls Section */}
        <View style={styles.controlsSection}>
          {/* Main Countdown Scrubber (Weightless Thin Line) */}
          <View style={styles.scrubberContainer}>
            <View style={styles.progressBarBg}>
              <View
                style={[styles.progressBarFill, { width: `${progressPercent}%`, backgroundColor: accentColorString }]}
              />
            </View>
          </View>

          {/* Button Control Row */}
          <View style={styles.buttonsRow}>
            {/* Restart Button */}
            <PressableAnimated
              style={styles.circleButton}
              onPress={handleReset}
              haptic="light"
              accessibilityRole="button"
              accessibilityLabel="Restart session"
            >
              <RotateCcw size={20} color="#F7E5D2" />
            </PressableAnimated>

            {/* Central Play Button */}
            <PressableAnimated
              style={[styles.playButton, { backgroundColor: accentColorString }]}
              scaleTo={1.05}
              haptic="medium"
              onPress={togglePlayPause}
              disabled={isLoadingSound}
              accessibilityRole="button"
              accessibilityLabel={isPlaying ? "Pause practice session" : "Play practice session"}
            >
              {isPlaying ? (
                <Pause size={28} color="#FDFAF5" fill="#FDFAF5" />
              ) : (
                <Play size={28} color="#FDFAF5" fill="#FDFAF5" style={{ marginLeft: 4 }} />
              )}
            </PressableAnimated>

            {/* Mute/Volume Toggle */}
            <PressableAnimated
              style={styles.circleButton}
              onPress={() => setIsMuted(!isMuted)}
              haptic="light"
              accessibilityRole="button"
              accessibilityLabel={isMuted ? "Unmute audio" : "Mute audio"}
            >
              {isMuted ? (
                <VolumeX size={20} color="#F7E5D2" />
              ) : (
                <Volume2 size={20} color="#F7E5D2" />
              )}
            </PressableAnimated>
          </View>
        </View>
      </View>
    </SettlingTransition>
  );
}

const styles = StyleSheet.create({
  settlingContainer: {
    flex: 1,
    backgroundColor: '#0D0A06', // Lock the screen to dynamic deep dark evening background
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  fullscreenOverlay: {
    flex: 1,
    backgroundColor: '#0D0A06',
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedContainer: {
    flex: 1,
    backgroundColor: '#0D0A06',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0D0A06',
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#0D0A06',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  closeBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  headerTitle: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.4)',
    letterSpacing: 2,
    textAlign: 'center',
    flex: 1,
  },
  centerStage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  visualizerContainer: {
    width: 240,
    height: 240,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginVertical: 24,
  },
  mandalaWrapper: {
    position: 'absolute',
    width: 240,
    height: 240,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metaContainer: {
    alignItems: 'center',
    marginTop: 24,
    paddingHorizontal: 16,
  },
  lessonTitle: {
    fontSize: 24,
    color: '#F7E5D2',
    textAlign: 'center',
    marginBottom: 6,
    lineHeight: 30,
  },
  instructorSub: {
    fontSize: 13,
    textAlign: 'center',
  },
  controlsSection: {
    paddingBottom: Platform.OS === 'ios' ? 50 : 30,
    gap: 32,
  },
  scrubberContainer: {
    width: '100%',
  },
  progressBarBg: {
    width: '100%',
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 1,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 1,
  },
  countdownText: {
    letterSpacing: 0.5,
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  circleButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  playButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
});
