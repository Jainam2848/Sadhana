import React, { useEffect, useState, useRef } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, Pressable } from '@/tw';
import { useTheme } from '@/hooks/useTheme';
import { useSubmitSession } from '@/hooks/api';
import { Heading, Body, Caption, Micro } from '@/components/ui/Typography';
import { Audio } from 'expo-av';
import { ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { ChevronDown, Play, Pause, RotateCcw, RotateCw, RefreshCw, Heart, Check } from 'lucide-react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing, cancelAnimation } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

export default function SinglePlayerScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const submitSession = useSubmitSession();

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
  const [isLooping, setIsLooping] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoadingSound, setIsLoadingSound] = useState(true);

  // Time tracking (in seconds)
  const totalSeconds = parseInt(duration || '15') * 60;
  const [position, setPosition] = useState(0);

  // Reanimated shared value for rotating Mandala
  const rotation = useSharedValue(0);

  // Setup animated style
  const mandalaAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  const loadMedia = async () => {
    try {
      setIsLoadingSound(true);
      if (sound) {
        await sound.unloadAsync();
      }

      // Default fallback media if none exists in routine database row
      const streamUrl = mediaUrl || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: streamUrl },
        { shouldPlay: false, isLooping: isLooping, volume: 0.5 }
      );

      setSound(newSound);

      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          setPosition(Math.round(status.positionMillis / 1000));
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
      Alert.alert('Playback Error', 'Failed to load the practice audio stream.');
    }
  };

  useEffect(() => {
    loadMedia();
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [routineId]);

  // Handle Rotation animation based on isPlaying state
  useEffect(() => {
    if (isPlaying) {
      rotation.value = withRepeat(
        withTiming(rotation.value + 360, {
          duration: 16000,
          easing: Easing.linear,
        }),
        -1, // Infinite repeat
        false // Do not reverse
      );
    } else {
      cancelAnimation(rotation);
    }
  }, [isPlaying]);

  const handlePlaybackFinished = async () => {
    setIsPlaying(false);
    setPosition(totalSeconds);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const togglePlayPause = async () => {
    if (!sound) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (isPlaying) {
      await sound.pauseAsync();
    } else {
      await sound.playAsync();
    }
  };

  const handleSkipForward = async () => {
    if (!sound) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const status = await sound.getStatusAsync();
    if (status.isLoaded) {
      const newPos = Math.min(status.positionMillis + 10000, status.durationMillis || totalSeconds * 1000);
      await sound.setPositionAsync(newPos);
    }
  };

  const handleSkipBackward = async () => {
    if (!sound) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const status = await sound.getStatusAsync();
    if (status.isLoaded) {
      const newPos = Math.max(status.positionMillis - 10000, 0);
      await sound.setPositionAsync(newPos);
    }
  };

  const toggleLoop = async () => {
    if (!sound) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newLoop = !isLooping;
    setIsLooping(newLoop);
    await sound.setIsLoopingAsync(newLoop);
  };

  const handleCompletePractice = async () => {
    if (isCompleted) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setIsCompleted(true);

    try {
      await submitSession.mutateAsync({
        routineId: routineId || 'single-practice-mock',
        durationPracticed: parseInt(duration || '15'),
      });
      
      Alert.alert(
        'Practice Logged',
        'Your standalone session has been credited to your daily streak.',
        [{ text: 'Hari Om', onPress: () => router.back() }]
      );
    } catch (e: any) {
      console.error(e);
      Alert.alert('Session Log Failed', 'We saved your practice locally but failed to reach database.');
    }
  };

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const progressPercent = Math.min((position / totalSeconds) * 100, 100);

  return (
    <View className="flex-1 bg-[#0D0A06] relative justify-between px-6">
      {/* Top Background Arc */}
      <View
        pointerEvents="none"
        className="absolute -top-6 -right-6 w-32 h-32 rounded-full border-[0.5px] border-accent-terracotta/40 z-0"
      />

      {/* Header bar */}
      <View className="pt-12 pb-3 z-40 flex-row justify-between items-center w-full">
        <Pressable
          className="w-10 h-10 items-center justify-center rounded-full hover:bg-white/10 active:scale-95"
          onPress={() => router.back()}
        >
          <ChevronDown size={24} color="#FDFAF5" />
        </Pressable>
        <Text className="font-sans font-bold text-xs text-white/50 uppercase tracking-widest">
          Now Playing
        </Text>
        <View className="w-10" />
      </View>

      {isLoadingSound ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={colors.accent} />
          <Caption className="text-white/60 mt-4">Preparing soundscape...</Caption>
        </View>
      ) : (
        <View className="flex-1 justify-between py-8">
          {/* Rotating Mandala Artwork */}
          <View className="items-center justify-center my-auto">
            <View className="w-56 h-56 bg-[#1C1409] rounded-2xl shadow-2xl items-center justify-center border border-[#2a1f16] overflow-hidden">
              <Animated.View style={[{ width: 160, height: 160 }, mandalaAnimatedStyle]}>
                {/* SVG Mandala Shape */}
                <svg width="160" height="160" viewBox="0 0 100 100" fill="none">
                  <circle cx="50" cy="50" r="48" stroke="#C44B22" strokeDasharray="2 4" strokeWidth="0.5" />
                  <circle cx="50" cy="50" r="40" stroke="#C44B22" strokeWidth="0.5" />
                  <path d="M50 15 L50 85 M15 50 L85 50 M25 25 L75 75 M25 75 L75 25" stroke="#C44B22" strokeWidth="0.25" />
                  <circle cx="50" cy="50" r="25" stroke="#C44B22" strokeDasharray="1 2" strokeWidth="0.5" />
                  <circle cx="50" cy="50" fill="#1C1409" r="10" stroke="#C44B22" strokeWidth="1" />
                </svg>
              </Animated.View>
            </View>

            <View className="text-center mt-8 px-6">
              <Heading className="text-[#F7E5D2] text-2xl font-serif text-center mb-1">
                {lessonTitle || title}
              </Heading>
              <Caption className="text-[#a38c75] text-center font-medium">
                Swami Vidyadhishananda • {category?.toUpperCase() || 'PRACTICE'}
              </Caption>
            </View>
          </View>

          {/* Controls Stack */}
          <View className="gap-6 w-full max-w-sm mx-auto">
            {/* Scrubber slider */}
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
              <View className="flex-row justify-between items-center px-1">
                <Caption className="text-[#a38c75] text-xs tabular-nums">
                  {formatTime(position)}
                </Caption>
                <Caption className="text-[#a38c75] text-xs tabular-nums">
                  -{formatTime(Math.max(totalSeconds - position, 0))}
                </Caption>
              </View>
            </View>

            {/* Play controls */}
            <View className="flex-row justify-between items-center w-full px-4 mb-4">
              <Pressable className="active:scale-95" onPress={toggleLoop}>
                <RefreshCw size={20} color={isLooping ? colors.accent : '#a38c75'} />
              </Pressable>

              <Pressable className="active:scale-95" onPress={handleSkipBackward}>
                <RotateCcw size={24} color="#F7E5D2" />
              </Pressable>

              <Pressable
                className="w-16 h-16 bg-accent-terracotta rounded-full items-center justify-center shadow-lg active:scale-105"
                onPress={togglePlayPause}
              >
                {isPlaying ? (
                  <Pause size={28} color="#FDFAF5" fill="#FDFAF5" />
                ) : (
                  <Play size={28} color="#FDFAF5" fill="#FDFAF5" style={{ marginLeft: 4 }} />
                )}
              </Pressable>

              <Pressable className="active:scale-95" onPress={handleSkipForward}>
                <RotateCw size={24} color="#F7E5D2" />
              </Pressable>

              <Pressable className="active:scale-95" onPress={() => setIsFavorited(!isFavorited)}>
                <Heart size={20} color={isFavorited ? colors.accent : '#a38c75'} fill={isFavorited ? colors.accent : 'transparent'} />
              </Pressable>
            </View>

            {/* Mark as Complete CTA */}
            <Pressable
              className={`w-full h-12 rounded-full border flex-row items-center justify-center gap-2 active:scale-98 transition-all duration-300 ${
                isCompleted
                  ? 'border-growth bg-growth/10'
                  : 'border-accent-terracotta'
              }`}
              onPress={handleCompletePractice}
            >
              {isCompleted ? (
                <>
                  <Check size={16} color={colors.growth} />
                  <Text className="text-growth-green font-sans font-bold text-sm">Completed</Text>
                </>
              ) : (
                <Text className="text-accent-terracotta font-sans font-bold text-sm">Mark as Complete</Text>
              )}
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}
