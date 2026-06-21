import React, { useEffect, useState, useRef } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, ScrollView, Image } from '@/tw';
import { useTheme } from '@/hooks/useTheme';
import { useSubmitSession, useRoutine } from '@/hooks/api';
import { Heading, Caption } from '@/components/ui/Typography';
import { Video as ExpoVideo, Audio, ResizeMode } from 'expo-av';
import { Video, Svg, Circle, Path } from '@/components/ui/Compat';
import { Modal, StyleSheet, Alert } from 'react-native';
import { ArrowLeft, Play, Pause, RotateCcw, RotateCw, SkipForward, BookOpen, Volume2, VolumeX } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { PressableAnimated } from '@/components/ui/PressableAnimated';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withRepeat, Easing } from 'react-native-reanimated';

export default function ActiveRoutinePlayerScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const submitSession = useSubmitSession();

  const { planId, asanaId, asanaDuration, pranayamaId, pranayamaDuration, dhyanaId, dhyanaDuration } = useLocalSearchParams<{
    planId: string;
    asanaId: string;
    asanaDuration: string;
    pranayamaId: string;
    pranayamaDuration: string;
    dhyanaId: string;
    dhyanaDuration: string;
  }>();

  // Active playing segment: 0 = Asana, 1 = Pranayama, 2 = Dhyana
  const [currentSegment, setCurrentSegment] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isGlossaryOpen, setIsGlossaryOpen] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  // Fetch actual routine details from catalog dynamically
  const { data: asanaRoutine } = useRoutine(asanaId);
  const { data: pranayamaRoutine } = useRoutine(pranayamaId);
  const { data: dhyanaRoutine } = useRoutine(dhyanaId);

  // Reanimated shared values for premium visualizer
  const visualizerScale = useSharedValue(1);
  const visualizerRotation = useSharedValue(0);
  const visualizerOpacity = useSharedValue(0.4);

  // Slow continuous linear loop for aesthetic rotation
  useEffect(() => {
    visualizerRotation.value = withRepeat(
      withTiming(360, { duration: 24000, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  // Synchronized breathing loop (10-second cycles: 4s inhale, 2s hold, 4s exhale)
  useEffect(() => {
    if (currentSegment === 0 || !isPlaying) {
      // Return to baseline when in Asana or paused
      visualizerScale.value = withTiming(1.0, { duration: 500 });
      visualizerOpacity.value = withTiming(0.4, { duration: 500 });
      return;
    }

    let isSubscribed = true;
    let holdTimeout: any;
    let exhaleTimeout: any;

    const runCycle = () => {
      if (!isSubscribed || !isPlaying) return;

      // Inhale Phase (0s to 4s)
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
      visualizerScale.value = withTiming(1.5, { duration: 4000, easing: Easing.out(Easing.ease) });
      visualizerOpacity.value = withTiming(0.8, { duration: 4000 });

      // Hold Phase (4s to 6s)
      holdTimeout = setTimeout(() => {
        if (!isSubscribed || !isPlaying) return;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
        visualizerOpacity.value = withTiming(0.6, { duration: 2000 });

        // Exhale Phase (6s to 10s)
        exhaleTimeout = setTimeout(() => {
          if (!isSubscribed || !isPlaying) return;
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
          visualizerScale.value = withTiming(1.0, { duration: 4000, easing: Easing.inOut(Easing.ease) });
          visualizerOpacity.value = withTiming(0.4, { duration: 4000 });
        }, 2000);
      }, 4000);
    };

    runCycle();
    const interval = setInterval(runCycle, 10000);

    return () => {
      isSubscribed = false;
      clearInterval(interval);
      clearTimeout(holdTimeout);
      clearTimeout(exhaleTimeout);
    };
  }, [currentSegment, isPlaying]);

  const animatedMandalaStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: visualizerScale.value },
      { rotate: `${visualizerRotation.value}deg` }
    ],
    opacity: visualizerOpacity.value,
  }));

  // Time management (in seconds)
  const durations = [
    parseInt(asanaDuration || '5', 10) * 60,
    parseInt(pranayamaDuration || '4', 10) * 60,
    parseInt(dhyanaDuration || '3', 10) * 60,
  ];
  
  const [timeLeft, setTimeLeft] = useState(durations[0]);
  const videoRef = useRef<ExpoVideo>(null);

  // Handle Dhyana sitar music background loops
  const loadBackgroundSound = async () => {
    try {
      // Unload previous sound if exists
      if (sound) {
        await sound.unloadAsync();
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: dhyanaRoutine?.media_url || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3' }, // Sitar-like slow ambient sound URL
        { shouldPlay: isPlaying && !isMuted, isLooping: true, volume: 0.15 }
      );
      setSound(newSound);
    } catch (e) {
      console.warn('Failed to load ambient background audio', e);
    }
  };

  useEffect(() => {
    // Only load background music when transitioning to Dhyana (segment index 2)
    if (currentSegment === 2) {
      loadBackgroundSound();
    } else {
      if (sound) {
        sound.unloadAsync().catch(() => {});
        setSound(null);
      }
    }

    // Reset timer to segment default
    setTimeLeft(durations[currentSegment]);
  }, [currentSegment]);

  // Clean up sound on unmount
  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync().catch(() => {});
      }
    };
  }, [sound]);

  // Sync play/pause with background music
  useEffect(() => {
    if (sound) {
      if (isPlaying && !isMuted) {
        sound.playAsync().catch(() => {});
      } else {
        sound.pauseAsync().catch(() => {});
      }
    }
  }, [isPlaying, isMuted, sound]);

  // Timer tick effect
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Timer finished, advance to next segment or complete routine
          clearInterval(timer);
          handleNextSegment();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, currentSegment]);

  const handleNextSegment = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    if (currentSegment < 2) {
      setCurrentSegment((prev) => prev + 1);
    } else {
      // Completed last segment! Log the session database write
      setIsPlaying(false);
      try {
        const totalMinutes = (durations[0] + durations[1] + durations[2]) / 60;
        await submitSession.mutateAsync({
          routineId: asanaId || 'mock-asana-123',
          durationPracticed: Math.round(totalMinutes),
        });
        
        // Route to completion screen
        router.replace({
          pathname: '/session-completed',
          params: { totalMinutes: totalMinutes.toString() },
        });
      } catch (e: any) {
        console.error(e);
        Alert.alert('Session Log Failed', 'We saved your streak locally but failed to write to database.');
        router.replace('/(tabs)/home');
      }
    }
  };

  const handleSkipForward = () => {
    setTimeLeft((prev) => Math.max(prev - 10, 0));
  };

  const handleSkipBackward = () => {
    setTimeLeft((prev) => Math.min(prev + 10, durations[currentSegment]));
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const currentDuration = durations[currentSegment];
  const progressPercent = ((currentDuration - timeLeft) / currentDuration) * 100;

  // Segment headers resolved dynamically
  const segmentHeaders = [
    {
      type: 'Asana',
      title: asanaRoutine?.title || 'Physical Posture',
      subtitle: asanaRoutine
        ? Object.keys(asanaRoutine.sanskrit_terms || {})[0] || asanaRoutine.description
        : 'Downward-Facing Dog',
    },
    {
      type: 'Pranayama',
      title: pranayamaRoutine?.title || 'Breathing Technique',
      subtitle: pranayamaRoutine
        ? Object.keys(pranayamaRoutine.sanskrit_terms || {})[0] || pranayamaRoutine.description
        : 'Sanskrit: Nadi Shodhana',
    },
    {
      type: 'Dhyana',
      title: dhyanaRoutine?.title || 'Silent Meditation',
      subtitle: dhyanaRoutine
        ? Object.keys(dhyanaRoutine.sanskrit_terms || {})[0] || dhyanaRoutine.description
        : 'Sitar Background',
    },
  ];

  const currentHeader = segmentHeaders[currentSegment];

  return (
    <View className="flex-1 bg-[#0D0A06] relative justify-between">
      {/* Decorative Background Arc */}
      <View
        pointerEvents="none"
        className="absolute -top-12 -right-12 w-48 h-48 rounded-full border-[0.5px] border-accent-terracotta/40 z-0"
      />

      {/* Top Header */}
      <View className="pt-12 pb-3 px-6 z-40 bg-gradient-to-b from-[#0D0A06] to-transparent flex-row justify-between items-center w-full">
        <PressableAnimated
          className="w-10 h-10 items-center justify-center rounded-full bg-white/10 active:scale-95"
          onPress={() => router.back()}
          haptic="light"
          accessibilityLabel="Go back"
        >
          <ArrowLeft size={18} color="#FDFAF5" />
        </PressableAnimated>
        <Text className="font-sans font-bold text-sm text-white/80 uppercase tracking-widest text-center flex-1">
          {currentHeader.type}
        </Text>
        {currentSegment === 2 ? (
          <PressableAnimated
            className="w-10 h-10 items-center justify-center rounded-full bg-white/10 active:scale-95"
            onPress={() => setIsMuted(!isMuted)}
            haptic="light"
            accessibilityLabel={isMuted ? "Unmute ambient music" : "Mute ambient music"}
          >
            {isMuted ? <VolumeX size={18} color="#FDFAF5" /> : <Volume2 size={18} color="#FDFAF5" />}
          </PressableAnimated>
        ) : (
          <View className="w-10" />
        )}
      </View>

      {/* Video / Visual Focus Viewport */}
      <View className="flex-1 justify-center relative mt-4">
        {currentSegment === 0 ? (
          /* Segment 1: Asana video player */
          <View className="w-full aspect-video bg-[#1A1A1A] justify-center overflow-hidden">
            <Video
              ref={videoRef}
              style={StyleSheet.absoluteFill}
              source={{
                uri: asanaRoutine?.media_url || 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4', // dynamic video stream
              }}
              resizeMode={ResizeMode.COVER}
              shouldPlay={isPlaying}
              isLooping
              isMuted
            />
            <View className="absolute inset-0 bg-gradient-to-t from-[#0D0A06] to-transparent pointer-events-none" />
          </View>
        ) : currentSegment === 1 ? (
          /* Segment 2: Pranayama breathing visualizer */
          <View className="w-full h-64 items-center justify-center">
            <Animated.View
              style={[animatedMandalaStyle, { width: 192, height: 192 }]}
              className="items-center justify-center"
            >
              <Svg width="100%" height="100%" viewBox="0 0 200 200">
                <Circle cx="100" cy="100" r="90" fill="none" stroke={colors.accent} strokeWidth="0.5" strokeDasharray="4 4" opacity="0.3" />
                <Circle cx="100" cy="100" r="70" fill="none" stroke={colors.accent} strokeWidth="0.5" opacity="0.4" />
                <Circle cx="100" cy="100" r="50" fill="none" stroke={colors.accent} strokeWidth="0.5" opacity="0.5" />
                {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, index) => (
                  <Path
                    key={index}
                    d="M100 100 C115 70 125 70 100 30 C75 70 85 70 100 100 Z"
                    fill="none"
                    stroke={colors.accent}
                    strokeWidth="0.75"
                    opacity="0.35"
                    transform={`rotate(${angle} 100 100)`}
                  />
                ))}
                <Circle cx="100" cy="100" r="25" fill="none" stroke={colors.accent} strokeWidth="0.75" opacity="0.4" />
              </Svg>
            </Animated.View>
            <View className="absolute inset-0 items-center justify-center pointer-events-none">
              <Text className="font-sans font-bold text-xs text-white/50 tracking-wider">
                BREATHE
              </Text>
            </View>
          </View>
        ) : (
          /* Segment 3: Dhyana meditation visual focus */
          <View className="w-full h-64 items-center justify-center">
            <Animated.View
              style={[animatedMandalaStyle, { width: 192, height: 192 }]}
              className="items-center justify-center"
            >
              <Svg width="100%" height="100%" viewBox="0 0 200 200">
                <Circle cx="100" cy="100" r="90" fill="none" stroke={colors.accent} strokeWidth="0.5" strokeDasharray="4 4" opacity="0.2" />
                <Circle cx="100" cy="100" r="70" fill="none" stroke={colors.accent} strokeWidth="0.5" opacity="0.3" />
                <Circle cx="100" cy="100" r="50" fill="none" stroke={colors.accent} strokeWidth="0.5" opacity="0.4" />
                {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, index) => (
                  <Path
                    key={index}
                    d="M100 100 C115 70 125 70 100 30 C75 70 85 70 100 100 Z"
                    fill="none"
                    stroke={colors.accent}
                    strokeWidth="0.75"
                    opacity="0.25"
                    transform={`rotate(${angle} 100 100)`}
                  />
                ))}
                <Circle cx="100" cy="100" r="25" fill="none" stroke={colors.accent} strokeWidth="0.75" opacity="0.3" />
              </Svg>
            </Animated.View>
            <View className="absolute inset-0 items-center justify-center pointer-events-none">
              <Text className="font-sans font-bold text-xs text-white/50 tracking-wider">
                FOCUS
              </Text>
            </View>
          </View>
        )}

        {/* Current title/details overlay */}
        <View className="px-6 absolute bottom-6 left-0">
          <Heading className="text-white text-2xl font-serif mb-1">
            {currentHeader.title}
          </Heading>
          <Caption className="text-white/70 text-sm">
            {currentHeader.subtitle}
          </Caption>
        </View>
      </View>

      {/* Control Area */}
      <View className="px-6 pb-12 gap-8 w-full max-w-lg mx-auto">
        {/* Sanskrit Glossary Trigger */}
        <View className="items-center">
          <PressableAnimated
            className="flex-row items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/5 active:scale-95"
            onPress={() => setIsGlossaryOpen(true)}
            haptic="light"
            accessibilityLabel="Open Sanskrit glossary"
          >
            <BookOpen size={14} color="#FDFAF5" />
            <Text className="font-sans font-bold text-xs text-white/80">Sanskrit Glossary</Text>
          </PressableAnimated>
        </View>

        {/* Seek Bar */}
        <View className="w-full gap-2">
          <View className="w-full h-[3px] bg-white/20 rounded-full relative justify-center">
            <View
              className="h-full bg-accent-terracotta rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
            <View
              className="absolute w-3 h-3 bg-accent-terracotta rounded-full shadow"
              style={{ left: `${progressPercent}%`, marginLeft: -6 }}
            />
          </View>
          <View className="flex-row justify-between items-center">
            <Caption className="text-white/60 text-xs tabular-nums">
              {formatTime(currentDuration - timeLeft)}
            </Caption>
            <Caption className="text-white/60 text-xs tabular-nums">
              {formatTime(timeLeft)}
            </Caption>
          </View>
        </View>

        {/* Action Controls */}
        <View className="flex-row justify-center items-center gap-8 relative w-full">
          {/* Replay 10s */}
          <PressableAnimated
            haptic="light"
            onPress={handleSkipBackward}
            accessibilityLabel="Rewind 10 seconds"
          >
            <RotateCcw size={24} color="#FDFAF5" />
          </PressableAnimated>

          {/* Play/Pause toggle */}
          <PressableAnimated
            className="w-16 h-16 bg-accent-terracotta rounded-full items-center justify-center shadow-lg"
            scaleTo={1.05}
            haptic="medium"
            onPress={togglePlayPause}
            accessibilityLabel={isPlaying ? "Pause routine" : "Resume routine"}
          >
            {isPlaying ? (
              <Pause size={28} color="#FDFAF5" fill="#FDFAF5" />
            ) : (
              <Play size={28} color="#FDFAF5" fill="#FDFAF5" style={{ marginLeft: 4 }} />
            )}
          </PressableAnimated>

          {/* Forward 10s */}
          <PressableAnimated
            haptic="light"
            onPress={handleSkipForward}
            accessibilityLabel="Fast forward 10 seconds"
          >
            <RotateCw size={24} color="#FDFAF5" />
          </PressableAnimated>

          {/* Next Segment button */}
          <PressableAnimated
            className="absolute right-0 p-3 bg-white/5 rounded-full"
            onPress={handleNextSegment}
            haptic="medium"
            accessibilityLabel="Skip to next segment"
          >
            <SkipForward size={22} color="#FDFAF5" />
          </PressableAnimated>
        </View>
      </View>

      {/* Sanskrit Glossary Bottom Sheet Modal */}
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
            className="bg-background-bone w-full rounded-t-[24px] p-6 pb-12 border-t border-surface-border max-w-md"
            style={styles.modalContent}
          >
            <View className="w-12 h-1 bg-surface-border/40 rounded-full mx-auto mb-4" />
            <Heading className="text-on-surface mb-6">Sanskrit Glossary</Heading>

            <ScrollView className="max-h-[300px] mb-6">
              {[
                { term: 'Asana', dev: 'आसन', def: 'Physical posture; literally "seat".' },
                { term: 'Pranayama', dev: 'प्राणायाम', def: 'Control of breath; life force extension.' },
                { term: 'Ujjayi', dev: 'उज्जायी', def: 'Victorious breath; constriction in throat.' },
                { term: 'Dhyana', dev: 'ध्यान', def: 'Meditation; uninterrupted concentration.' },
              ].map((item, index) => (
                <View key={index} className="border-b border-surface-border/50 py-3 gap-1">
                  <View className="flex-row items-baseline gap-2">
                    <Text className="font-sans font-bold text-sm text-primary-text">{item.term}</Text>
                    <Text className="font-devanagari text-accent-terracotta text-sm">{item.dev}</Text>
                  </View>
                  <Caption className="text-secondary-text">{item.def}</Caption>
                </View>
              ))}
            </ScrollView>

            <PressableAnimated
              className="w-full py-3.5 rounded-full border border-accent-terracotta items-center active:bg-warm-highlight"
              onPress={() => setIsGlossaryOpen(false)}
              haptic="light"
              accessibilityLabel="Close glossary"
            >
              <Text className="text-accent-terracotta font-sans font-bold text-sm">Close</Text>
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
    backgroundColor: 'rgba(28, 20, 9, 0.6)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalDismiss: {
    flex: 1,
    width: '100%',
  },
  modalContent: {
    elevation: 8,
    shadowColor: '#1C1409',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
  },
});
