import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, StyleSheet, Platform, ActivityIndicator } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useSubmitSession } from '@/hooks/api';
import { Text } from '@/components/ui/Text';
import { SettlingTransition } from '@/components/ui/SettlingTransition';
import { useSignatureHaptic } from '@/hooks/useSignatureHaptic';
import { PracticeIcon } from '@/components/ui/PracticeIcon';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { ChevronDown, Play, Pause, RotateCcw, Heart, Check } from 'lucide-react-native';
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

  // Time tracking (countdown)
  const totalSeconds = useMemo(() => parseInt(duration || '15', 10) * 60, [duration]);
  const [position, setPosition] = useState(0);
  const remainingSeconds = useMemo(() => Math.max(totalSeconds - position, 0), [totalSeconds, position]);

  // 1. Reanimated Shared Values for the Breathing Ring
  const breathingScale = useSharedValue(1);
  const breathingOpacity = useSharedValue(0.15);

  // 2. Playback finished handler
  const handlePlaybackFinished = useCallback(async () => {
    setIsPlaying(false);
    setPosition(totalSeconds);
    setIsCompleted(true);
    
    // Trigger signature haptic naturally at completion
    await triggerSignatureHaptic();

    // Perform dramatic visual completion expand-and-fade animation on breathing ring
    cancelAnimation(breathingScale);
    cancelAnimation(breathingOpacity);
    breathingScale.value = withTiming(3.0, { duration: 1200, easing: Easing.out(Easing.quad) });
    breathingOpacity.value = withTiming(0, { duration: 1200, easing: Easing.out(Easing.quad) });

    // Submit session to backend
    try {
      await submitSession.mutateAsync({
        routineId: routineId || 'single-practice-mock',
        durationPracticed: parseInt(duration || '15', 10),
      });
    } catch (e) {
      console.warn('[SinglePlayer] Failed to upload finished session:', e);
    }
  }, [routineId, duration, totalSeconds, triggerSignatureHaptic, submitSession, breathingScale, breathingOpacity]);

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
        { shouldPlay: false, volume: 0.5 }
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

  // 3. Coordinate Breathing Ring animation loop when playing
  useEffect(() => {
    if (isCompleted) return;

    if (isPlaying) {
      // Gentle breathing rate (4s inhale, 4s exhale)
      breathingScale.value = withRepeat(
        withSequence(
          withTiming(1.25, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
          withTiming(1.0, { duration: 4000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );
      breathingOpacity.value = withRepeat(
        withSequence(
          withTiming(0.35, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.15, { duration: 4000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );
    } else {
      // Settle down to static breathing ring
      breathingScale.value = withTiming(1.0, { duration: 1000 });
      breathingOpacity.value = withTiming(0.15, { duration: 1000 });
    }

    return () => {
      if (!isCompleted) {
        cancelAnimation(breathingScale);
        cancelAnimation(breathingOpacity);
      }
    };
  }, [isPlaying, isCompleted, breathingScale, breathingOpacity]);

  // 4. useCallback play/pause toggles to prevent lag and block-free layout triggers
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

  // Format countdown string
  const formatTime = useCallback((seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  }, []);

  const progressPercent = useMemo(() => Math.min((position / totalSeconds) * 100, 100), [position, totalSeconds]);

  // Breathing style mapping
  const breathingRingStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: breathingScale.value }],
      opacity: breathingOpacity.value,
    };
  });

  const accentColorString = useMemo(() => (typeof colors.accent === 'string' ? colors.accent : '#C44B22'), [colors.accent]);

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
          <View style={styles.headerSpacer} />
        </View>

        {/* Dynamic Center Stage: Breathing Ring and Details */}
        <View style={styles.centerStage}>
          {isLoadingSound ? (
            <ActivityIndicator size="large" color={accentColorString} style={styles.loader} />
          ) : (
            <View style={styles.visualizerContainer}>
              {/* Outer Breathing Ring (Animated) */}
              <Animated.View style={[styles.breathingRing, { borderColor: accentColorString }, breathingRingStyle]} />

              {/* Inner Focus core and Practice Icon */}
              <View style={[styles.focusCore, { backgroundColor: '#1C1409', borderColor: 'rgba(196, 75, 34, 0.2)' }]}>
                <PracticeIcon 
                  type={(category?.toLowerCase() as any) || 'dhyana'} 
                  size={56} 
                  color={accentColorString}
                  streakIntensity={0.8}
                />
              </View>
            </View>
          )}

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
          {/* Main Countdown Scrubber */}
          <View style={styles.scrubberContainer}>
            <View style={styles.progressBarBg}>
              <View
                style={[styles.progressBarFill, { width: `${progressPercent}%`, backgroundColor: accentColorString }]}
              />
            </View>
            <View style={styles.timeLabelsRow}>
              {/* Stat text represents the actual elapsed time */}
              <Text variant="stat" style={styles.timeLabel}>
                {formatTime(position)}
              </Text>
              {/* Middle countdown timer */}
              <Text variant="stat" style={[styles.countdownText, { color: '#FDFAF5' }]}>
                {formatTime(remainingSeconds)}
              </Text>
              <Text variant="stat" style={styles.timeLabel}>
                -{formatTime(remainingSeconds)}
              </Text>
            </View>
          </View>

          {/* Button Control Row */}
          <View style={styles.buttonsRow}>
            <PressableAnimated
              style={styles.circleButton}
              onPress={handleReset}
              haptic="light"
              accessibilityRole="button"
              accessibilityLabel="Restart session"
            >
              <RotateCcw size={22} color="#F7E5D2" />
            </PressableAnimated>

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

            <PressableAnimated
              style={styles.circleButton}
              onPress={() => setIsFavorited(!isFavorited)}
              haptic="light"
              accessibilityRole="button"
              accessibilityLabel={isFavorited ? "Remove practice from favorites" : "Add practice to favorites"}
            >
              <Heart
                size={22}
                color={isFavorited ? accentColorString : '#a38c75'}
                fill={isFavorited ? accentColorString : 'transparent'}
              />
            </PressableAnimated>
          </View>

          {/* Quick complete feedback indicator */}
          {isCompleted && (
            <View style={styles.completedBadge}>
              <Check size={14} color="#FDFAF5" />
              <Text variant="body" weight="bold" style={styles.completedText}>Practice Sanctuary Completed</Text>
            </View>
          )}
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
  headerSpacer: {
    width: 44,
  },
  centerStage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loader: {
    marginVertical: 40,
  },
  visualizerContainer: {
    width: 240,
    height: 240,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginVertical: 24,
  },
  breathingRing: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 2,
  },
  focusCore: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  metaContainer: {
    alignItems: 'center',
    marginTop: 20,
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
    gap: 28,
  },
  scrubberContainer: {
    width: '100%',
    gap: 12,
  },
  progressBarBg: {
    width: '100%',
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 1.5,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 1.5,
  },
  timeLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeLabel: {
    fontSize: 11,
    color: '#a38c75',
    width: 44,
  },
  countdownText: {
    fontSize: 32,
    letterSpacing: 0.5,
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
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
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(76, 175, 80, 0.15)',
    borderColor: '#4CAF50',
    borderWidth: 0.5,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
  },
  completedText: {
    color: '#FDFAF5',
    fontSize: 12,
  },
});
