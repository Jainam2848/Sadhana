import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text } from '@/tw';
import { useTheme } from '@/hooks/useTheme';
import { useSubmitSession } from '@/hooks/api';
import { Heading, Caption } from '@/components/ui/Typography';
import { Svg, Path, Circle } from '@/components/ui/Compat';
import { Audio } from 'expo-av';
import { Alert } from 'react-native';
import { ChevronDown, Play, Pause, RotateCcw, RotateCw, RefreshCw, Heart, Check } from 'lucide-react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing, cancelAnimation } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { PlayerSkeleton } from '@/components/ui/Skeletons';
import { ErrorState } from '@/components/ui/ErrorState';
import { PressableAnimated } from '@/components/ui/PressableAnimated';

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
  const [hasError, setHasError] = useState(false);

  // Time tracking (in seconds)
  const totalSeconds = parseInt(duration || '15', 10) * 60;
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
      setHasError(false);
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
    if (isPlaying) {
      await sound.pauseAsync();
    } else {
      await sound.playAsync();
    }
  };

  const handleSkipForward = async () => {
    if (!sound) return;
    const status = await sound.getStatusAsync();
    if (status.isLoaded) {
      const newPos = Math.min(status.positionMillis + 10000, (status.durationMillis || totalSeconds * 1000));
      await sound.setPositionAsync(newPos);
    }
  };

  const handleSkipBackward = async () => {
    if (!sound) return;
    const status = await sound.getStatusAsync();
    if (status.isLoaded) {
      const newPos = Math.max(status.positionMillis - 10000, 0);
      await sound.setPositionAsync(newPos);
    }
  };

  const toggleLoop = async () => {
    if (!sound) return;
    const newLoop = !isLooping;
    setIsLooping(newLoop);
    await sound.setIsLoopingAsync(newLoop);
  };

  const handleCompletePractice = async () => {
    if (isCompleted) return;
    setIsCompleted(true);

    try {
      await submitSession.mutateAsync({
        routineId: routineId || 'single-practice-mock',
        durationPracticed: parseInt(duration || '15', 10),
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

  if (hasError) {
    return (
      <View className="flex-1 bg-[#0D0A06] justify-center items-center px-6">
        <ErrorState
          message="We couldn't connect to the temple audio servers. Check your connection and try again."
          onRetry={loadMedia}
        />
      </View>
    );
  }

  if (isLoadingSound) {
    return <PlayerSkeleton />;
  }

  const accentColorString = typeof colors.accent === 'string' ? colors.accent : '#C44B22';
  const growthColorString = typeof colors.growth === 'string' ? colors.growth : '#4CAF50';

  return (
    <View className="flex-1 bg-[#0D0A06] relative justify-between px-6">
      {/* Top Background Arc */}
      <View
        pointerEvents="none"
        className="absolute -top-6 -right-6 w-32 h-32 rounded-full border-[0.5px] border-accent-terracotta/40 z-0"
      />

      {/* Header bar */}
      <View className="pt-12 pb-3 z-40 flex-row justify-between items-center w-full">
        <PressableAnimated
          className="w-10 h-10 items-center justify-center rounded-full bg-white/5 active:scale-95"
          onPress={() => router.back()}
          haptic="light"
          accessibilityLabel="Go back"
        >
          <ChevronDown size={24} color="#FDFAF5" />
        </PressableAnimated>
        <Text className="font-sans font-bold text-xs text-white/50 uppercase tracking-widest text-center flex-1">
          Now Playing
        </Text>
        <View className="w-10" />
      </View>

      <View className="flex-1 justify-between py-8">
        {/* Rotating Mandala Artwork */}
        <View className="items-center justify-center my-auto">
          <View className="w-56 h-56 bg-[#1C1409] rounded-2xl shadow-2xl items-center justify-center border border-[#2a1f16] overflow-hidden">
            <Animated.View style={[{ width: 160, height: 160 }, mandalaAnimatedStyle]}>
              {/* SVG Mandala Shape */}
              <Svg width="160" height="160" viewBox="0 0 100 100">
                <Circle cx="50" cy="50" r="48" stroke="#C44B22" strokeDasharray="2 4" strokeWidth="0.5" fill="none" />
                <Circle cx="50" cy="50" r="40" stroke="#C44B22" strokeWidth="0.5" fill="none" />
                <Path d="M50 15 L50 85 M15 50 L85 50 M25 25 L75 75 M25 75 L75 25" stroke="#C44B22" strokeWidth="0.25" />
                <Circle cx="50" cy="50" r="25" stroke="#C44B22" strokeDasharray="1 2" strokeWidth="0.5" fill="none" />
                <Circle cx="50" cy="50" fill="#1C1409" r="10" stroke="#C44B22" strokeWidth="1" />
              </Svg>
            </Animated.View>
          </View>

          <View className="mt-8 px-6">
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
            <PressableAnimated
              scaleTo={0.9}
              haptic="light"
              onPress={toggleLoop}
              accessibilityLabel={isLooping ? "Disable loop" : "Enable loop"}
            >
              <RefreshCw size={20} color={isLooping ? accentColorString : '#a38c75'} />
            </PressableAnimated>

            <PressableAnimated
              haptic="light"
              onPress={handleSkipBackward}
              accessibilityLabel="Rewind 10 seconds"
            >
              <RotateCcw size={24} color="#F7E5D2" />
            </PressableAnimated>

            <PressableAnimated
              className="w-16 h-16 bg-accent-terracotta rounded-full items-center justify-center shadow-lg"
              scaleTo={1.05}
              haptic="medium"
              onPress={togglePlayPause}
              accessibilityLabel={isPlaying ? "Pause session" : "Play session"}
            >
              {isPlaying ? (
                <Pause size={28} color="#FDFAF5" fill="#FDFAF5" />
              ) : (
                <Play size={28} color="#FDFAF5" fill="#FDFAF5" style={{ marginLeft: 4 }} />
              )}
            </PressableAnimated>

            <PressableAnimated
              haptic="light"
              onPress={handleSkipForward}
              accessibilityLabel="Fast forward 10 seconds"
            >
              <RotateCw size={24} color="#F7E5D2" />
            </PressableAnimated>

            <PressableAnimated
              scaleTo={0.9}
              haptic="light"
              onPress={() => setIsFavorited(!isFavorited)}
              accessibilityLabel={isFavorited ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart
                size={20}
                color={isFavorited ? accentColorString : '#a38c75'}
                fill={isFavorited ? accentColorString : 'transparent'}
              />
            </PressableAnimated>
          </View>

          {/* Mark as Complete CTA */}
          <PressableAnimated
            scaleTo={0.98}
            haptic="success"
            className={`w-full h-12 rounded-full border flex-row items-center justify-center gap-2 transition-all duration-300 ${
              isCompleted
                ? 'border-growth bg-growth/10'
                : 'border-accent-terracotta'
            }`}
            onPress={handleCompletePractice}
            accessibilityLabel={isCompleted ? "Practice session completed" : "Mark practice as complete"}
          >
            {isCompleted ? (
              <>
                <Check size={16} color={growthColorString} />
                <Text className="text-growth-green font-sans font-bold text-sm">Completed</Text>
              </>
            ) : (
              <Text className="text-accent-terracotta font-sans font-bold text-sm">Mark as Complete</Text>
            )}
          </PressableAnimated>
        </View>
      </View>
    </View>
  );
}
