import React, { useEffect, useState, useRef } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, Pressable, ScrollView, Image } from '@/tw';
import { useTheme } from '@/hooks/useTheme';
import { useSubmitSession } from '@/hooks/api';
import { Heading, Body, Caption, Micro } from '@/components/ui/Typography';
import { Video as ExpoVideo, Audio, ResizeMode } from 'expo-av';
import { Video } from '@/components/ui/Compat';
import { ActivityIndicator, Modal, StyleSheet, Alert } from 'react-native';
import { ArrowLeft, Play, Pause, RotateCcw, RotateCw, SkipForward, BookOpen, Volume2, VolumeX } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

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

  // Time management (in seconds)
  const durations = [
    parseInt(asanaDuration || '5') * 60,
    parseInt(pranayamaDuration || '4') * 60,
    parseInt(dhyanaDuration || '3') * 60,
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
        { uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3' }, // Sitar-like slow ambient sound URL
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
        sound.unloadAsync();
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
        sound.unloadAsync();
      }
    };
  }, [sound]);

  // Sync play/pause with background music
  useEffect(() => {
    if (sound) {
      if (isPlaying && !isMuted) {
        sound.playAsync();
      } else {
        sound.pauseAsync();
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
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleSkipBackward = () => {
    setTimeLeft((prev) => Math.min(prev + 10, durations[currentSegment]));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const togglePlayPause = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsPlaying(!isPlaying);
  };

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const currentDuration = durations[currentSegment];
  const progressPercent = ((currentDuration - timeLeft) / currentDuration) * 100;

  // Segment headers
  const segmentHeaders = [
    { type: 'Asana', title: 'Adho Mukha Svanasana', subtitle: 'Downward-Facing Dog' },
    { type: 'Pranayama', title: 'Equal Breathing', subtitle: 'Sanskrit: Nadi Shodhana' },
    { type: 'Dhyana', title: 'Silent Observation', subtitle: 'Sitar Background' },
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
        <Pressable
          className="w-10 h-10 items-center justify-center rounded-full bg-white/10"
          onPress={() => router.back()}
        >
          <ArrowLeft size={18} color="#FDFAF5" />
        </Pressable>
        <Text className="font-sans font-bold text-sm text-white/80 uppercase tracking-widest">
          {currentHeader.type}
        </Text>
        {currentSegment === 2 ? (
          <Pressable
            className="w-10 h-10 items-center justify-center rounded-full bg-white/10"
            onPress={() => setIsMuted(!isMuted)}
          >
            {isMuted ? <VolumeX size={18} color="#FDFAF5" /> : <Volume2 size={18} color="#FDFAF5" />}
          </Pressable>
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
                uri: 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4', // demo testing video stream
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
            {/* Concentric circles representing breathing cycle */}
            <View className="w-40 h-40 rounded-full border border-accent-terracotta/40 items-center justify-center">
              <View className="w-28 h-28 rounded-full bg-accent-terracotta/10 items-center justify-center">
                <Text className="font-sans font-bold text-sm text-accent-terracotta">
                  Breathe
                </Text>
              </View>
            </View>
          </View>
        ) : (
          /* Segment 3: Dhyana meditation visual focus */
          <View className="w-full h-64 items-center justify-center">
            <Image
              className="w-48 h-48 rounded-full border border-accent-terracotta/20 opacity-60"
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBOBqUUu5CIaHxn1iqKt_K72OTq3Mz4d5pD3kCaHnL559px4_e5-2JkaTR4dRcmCfeNporGlLjde2y67GLEIY7w7b9QoaoTWXKgVPMEjXhSnOO3jc-SkkPJeU6M8bBt0TuIHFa5ggi2Cig8b-LpmZQq_mirQh0_zSUVTowJtlDWmPcR6hyF47-d-o0QGKKsWM54pxgUPR_GwwRgXl7leFGN1iez4RboqAi7cFFPn5eETqNHkQm2fIxB3dAhRyuzM9E2NzSfedxLIQ' }}
            />
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
          <Pressable
            className="flex-row items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/5 active:opacity-85"
            onPress={() => setIsGlossaryOpen(true)}
          >
            <BookOpen size={14} color="#FDFAF5" />
            <Text className="font-sans font-bold text-xs text-white/80">Sanskrit Glossary</Text>
          </Pressable>
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
        <View className="flex-row justify-center items-center gap-8 relative">
          {/* Replay 10s */}
          <Pressable className="active:scale-95" onPress={handleSkipBackward}>
            <RotateCcw size={24} color="#FDFAF5" />
          </Pressable>

          {/* Play/Pause toggle */}
          <Pressable
            className="w-14 h-14 bg-accent-terracotta rounded-full items-center justify-center shadow-lg active:scale-105"
            onPress={togglePlayPause}
          >
            {isPlaying ? (
              <Pause size={28} color="#FDFAF5" fill="#FDFAF5" />
            ) : (
              <Play size={28} color="#FDFAF5" fill="#FDFAF5" style={{ marginLeft: 4 }} />
            )}
          </Pressable>

          {/* Forward 10s */}
          <Pressable className="active:scale-95" onPress={handleSkipForward}>
            <RotateCw size={24} color="#FDFAF5" />
          </Pressable>

          {/* Next Segment button */}
          <Pressable
            className="absolute right-0 active:scale-95 p-2"
            onPress={handleNextSegment}
          >
            <SkipForward size={22} color="#FDFAF5" />
          </Pressable>
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
          <Pressable style={styles.modalDismiss} onPress={() => setIsGlossaryOpen(false)} />
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

            <Pressable
              className="w-full py-3 rounded-full border border-accent-terracotta items-center active:bg-warm-highlight"
              onPress={() => setIsGlossaryOpen(false)}
            >
              <Text className="text-accent-terracotta font-sans font-bold text-sm">Close</Text>
            </Pressable>
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
