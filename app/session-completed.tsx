import React, { useState, useEffect, useMemo } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, ScrollView, TextInput } from '@/tw';
import { useTheme } from '@/hooks/useTheme';
import { useProfile, useIncrementAdViews } from '@/hooks/api';
import { useAuthStore } from '@/stores/authStore';
import { Display, Heading, Body, Caption, Micro } from '@/components/ui/Typography';
import { MandalaThread } from '@/components/ui/MandalaThread';
import { 
  Flame, 
  Clock, 
  Heart, 
  Sparkles, 
  ChevronRight, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  X,
  CheckCircle2,
  Activity
} from 'lucide-react-native';
import { ActivityIndicator, Modal, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { PressableAnimated } from '@/components/ui/PressableAnimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Audio } from 'expo-av';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  cancelAnimation,
  Easing,
} from 'react-native-reanimated';
import { Svg, Circle, Path } from '@/components/ui/Compat';

const CALM_MOODS = [
  { id: 'peaceful', label: 'Peaceful', icon: '🕊️' },
  { id: 'grounded', label: 'Grounded', icon: '🌱' },
  { id: 'energized', label: 'Energized', icon: '⚡' },
  { id: 'quiet', label: 'Quiet', icon: '🌌' },
  { id: 'distracted', label: 'Distracted', icon: '🌪️' },
  { id: 'restless', label: 'Restless', icon: '🌊' }
];

type ScreenState = 'summary' | 'silence';
type RewardStatus = 'idle' | 'claiming' | 'claimed';

export default function SessionCompletedScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const insets = useSafeAreaInsets();
  
  const { totalMinutes } = useLocalSearchParams<{ totalMinutes: string }>();

  // Fetch updated profile
  const { data: profile } = useProfile(user?.id);
  const incrementAdViews = useIncrementAdViews();

  // Screen State & Reflection Inputs
  const [screenState, setScreenState] = useState<ScreenState>('summary');
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [journalText, setJournalText] = useState('');

  // Silence Timer States
  const [silenceTime, setSilenceTime] = useState(120); // in seconds
  const [initialSilenceTime, setInitialSilenceTime] = useState(120); // for progress calc
  const [silenceActive, setSilenceActive] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [extraMinutes, setExtraMinutes] = useState(0);

  // Rewards States
  const [adModalVisible, setAdModalVisible] = useState(false);
  const [adCountdown, setAdCountdown] = useState(10);
  const [adLoading, setAdLoading] = useState(false);
  const [rewardStatus, setRewardStatus] = useState<RewardStatus>('idle');
  const [soundMuted, setSoundMuted] = useState(false);

  const isPremium = profile?.premium || false;
  const streak = 12; // Fallback streak representation

  // Reanimated shared values for meditation pulsing
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const opacity = useSharedValue(0.4);

  useEffect(() => {
    // Initial entrance success haptic
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
  }, []);

  // Sync Reanimated values for silence meditation pulsing
  useEffect(() => {
    if (screenState === 'silence' && silenceActive) {
      rotation.value = withRepeat(
        withTiming(360, { duration: 30000, easing: Easing.linear }),
        -1,
        false
      );
      scale.value = withRepeat(
        withTiming(1.3, { duration: 6000, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
      opacity.value = withRepeat(
        withTiming(0.8, { duration: 6000, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
    } else {
      cancelAnimation(rotation);
      cancelAnimation(scale);
      cancelAnimation(opacity);
      rotation.value = 0;
      scale.value = 1.0;
      opacity.value = 0.4;
    }
    return () => {
      cancelAnimation(rotation);
      cancelAnimation(scale);
      cancelAnimation(opacity);
    };
  }, [screenState, silenceActive]);

  // Silence Timer Countdown & Count-up logic
  useEffect(() => {
    if (screenState !== 'silence' || !silenceActive) return;

    if (initialSilenceTime === -1) {
      // Infinite open-ended mode: count seconds elapsed
      const interval = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
        // Soft click haptic every 30 seconds as an anchor
        if ((secondsElapsed + 1) % 30 === 0) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
        }
      }, 1000);
      return () => clearInterval(interval);
    } else {
      // Countdown mode
      const interval = setInterval(() => {
        setSilenceTime((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setSilenceActive(false);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
            playCompletionBell();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [screenState, silenceActive, initialSilenceTime, secondsElapsed]);

  const playCompletionBell = async () => {
    if (soundMuted) return;
    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: 'https://assets.mixkit.co/active_storage/sfx/2869/2869-84.wav' },
        { shouldPlay: true, volume: 0.3 }
      );
      setTimeout(() => {
        sound.unloadAsync().catch(() => {});
      }, 7000);
    } catch (e) {
      console.warn('Completion bell failed to play', e);
    }
  };

  const handleStartSilence = () => {
    setScreenState('silence');
    setInitialSilenceTime(120); // Default to 2 min
    setSilenceTime(120);
    setSecondsElapsed(0);
    setSilenceActive(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
  };

  const handleExitSilence = () => {
    let minutesSat = 0;
    if (initialSilenceTime === -1) {
      minutesSat = Math.floor(secondsElapsed / 60);
    } else {
      const elapsed = initialSilenceTime - silenceTime;
      minutesSat = Math.floor(elapsed / 60);
    }

    if (minutesSat > 0) {
      setExtraMinutes((prev) => prev + minutesSat);
    }

    setSilenceActive(false);
    setScreenState('summary');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
  };

  const handleChangeSilencePreset = (seconds: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setInitialSilenceTime(seconds);
    setSilenceTime(seconds);
    setSecondsElapsed(0);
    setSilenceActive(true);
  };

  const toggleMood = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setSelectedMoods(prev =>
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const handleClaimCoins = () => {
    setRewardStatus('claiming');
    setAdModalVisible(true);
    setAdCountdown(10);

    const interval = setInterval(() => {
      setAdCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleCloseAd = async () => {
    if (adCountdown > 0) return;
    setAdLoading(true);
    try {
      await incrementAdViews.mutateAsync();
      setRewardStatus('claimed');
      setAdModalVisible(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    } catch (e: any) {
      console.error(e);
      setRewardStatus('idle');
      setAdModalVisible(false);
    } finally {
      setAdLoading(false);
    }
  };

  const handleCompleteRitual = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    router.replace('/(tabs)/home');
  };

  // Formatted string durations
  const minutes = (parseInt(totalMinutes || '12', 10) + extraMinutes).toString();
  const accentColorString = typeof colors.accent === 'string' ? colors.accent : '#C44B22';

  const ringProgressDashoffset = useMemo(() => {
    const circumference = 2 * Math.PI * 72; // r=72 -> 452.4
    if (initialSilenceTime === -1 || initialSilenceTime === 0) return circumference;
    const pct = silenceTime / initialSilenceTime;
    return circumference * (1 - pct);
  }, [silenceTime, initialSilenceTime]);

  const animatedMandalaStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}deg` }
    ],
    opacity: opacity.value,
  }));

  const formatSilenceTime = () => {
    if (initialSilenceTime === -1) {
      const min = Math.floor(secondsElapsed / 60);
      const sec = secondsElapsed % 60;
      return `${min}:${sec < 10 ? '0' : ''}${sec}`;
    } else {
      const min = Math.floor(silenceTime / 60);
      const sec = silenceTime % 60;
      return `${min}:${sec < 10 ? '0' : ''}${sec}`;
    }
  };

  // If in silence meditation mode
  if (screenState === 'silence') {
    return (
      <View
        style={{
          paddingBottom: Math.max(insets.bottom, 24),
          paddingTop: Math.max(insets.top, 16),
        }}
        className="flex-1 bg-background relative px-6 justify-between items-center"
      >
        <MandalaThread />

        {/* Top bar with back option */}
        <View className="w-full flex-row justify-between items-center px-2 mt-4 z-10">
          <PressableAnimated
            className="w-10 h-10 rounded-full bg-surface border border-surface-border/40 items-center justify-center"
            onPress={handleExitSilence}
            haptic="light"
            accessibilityLabel="Return to summary"
          >
            <X size={18} color={colors.secondaryText} />
          </PressableAnimated>
          
          <Micro className="text-secondary-text tracking-widest font-sans font-medium">STILLNESS MEDITATION</Micro>

          <PressableAnimated
            className="w-10 h-10 rounded-full bg-surface border border-surface-border/40 items-center justify-center"
            onPress={() => setSoundMuted(!soundMuted)}
            haptic="light"
            accessibilityLabel={soundMuted ? 'Unmute sounds' : 'Mute sounds'}
          >
            {soundMuted ? (
              <VolumeX size={18} color="#A69580" />
            ) : (
              <Volume2 size={18} color={accentColorString} />
            )}
          </PressableAnimated>
        </View>

        {/* Pulsing Breathing Circle */}
        <View className="flex-1 justify-center items-center my-4 z-0">
          <View className="justify-center items-center relative w-72 h-72">
            {/* Concentric Breathing Progress Ring */}
            <View className="absolute inset-0 items-center justify-center z-0">
              <Svg width="160" height="160" viewBox="0 0 160 160">
                <Circle cx="80" cy="80" r="72" stroke="rgba(255,255,255,0.06)" strokeWidth="4" fill="none" />
                {initialSilenceTime !== -1 && (
                  <Circle
                    cx="80"
                    cy="80"
                    r="72"
                    stroke={accentColorString}
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray={2 * Math.PI * 72}
                    strokeDashoffset={ringProgressDashoffset}
                    strokeLinecap="round"
                    transform="rotate(-90 80 80)"
                  />
                )}
              </Svg>
            </View>

            {/* Glowing Lotus Mandala */}
            <Animated.View
              style={[animatedMandalaStyle, { width: 180, height: 180 }]}
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
                {silenceActive ? 'SILENCE' : 'PAUSED'}
              </Heading>
              <Text className="font-mono text-accent-terracotta text-lg font-semibold mt-1">
                {formatSilenceTime()}
              </Text>
            </View>
          </View>
        </View>

        {/* Interactive timer preset pills */}
        <View className="w-full items-center mb-6 z-10">
          <Text className="text-secondary-text text-xs text-center px-8 leading-relaxed max-w-sm mb-4">
            {silenceActive
              ? "Let your thoughts pass like clouds. Just sit and breathe."
              : "Stillness paused. Adjust your timer or resume when ready."}
          </Text>

          <View className="flex-row justify-center gap-2">
            {[
              { label: '1m', value: 60 },
              { label: '3m', value: 180 },
              { label: '5m', value: 300 },
              { label: '∞', value: -1 }
            ].map((p) => {
              const isActive = initialSilenceTime === p.value;
              return (
                <PressableAnimated
                  key={p.label}
                  className={`px-4 py-1.5 rounded-full border ${
                    isActive 
                      ? 'bg-accent-terracotta border-accent-terracotta' 
                      : 'bg-surface border-surface-border/40'
                  }`}
                  onPress={() => handleChangeSilencePreset(p.value)}
                >
                  <Text className={`text-xs font-semibold ${isActive ? 'text-white' : 'text-secondary-text'}`}>
                    {p.label}
                  </Text>
                </PressableAnimated>
              );
            })}
          </View>
        </View>

        {/* Action Controls */}
        <View className="w-full flex-row justify-center items-center gap-8 mb-6 z-10">
          <PressableAnimated
            className="w-14 h-14 rounded-full bg-accent-terracotta items-center justify-center shadow-lg shadow-accent-terracotta/20"
            onPress={() => setSilenceActive(!silenceActive)}
            haptic="medium"
            accessibilityLabel={silenceActive ? 'Pause meditation' : 'Resume meditation'}
          >
            {silenceActive ? (
              <Pause size={20} color="#FFFFFF" fill="#FFFFFF" />
            ) : (
              <Play size={20} color="#FFFFFF" fill="#FFFFFF" style={{ marginLeft: 3 }} />
            )}
          </PressableAnimated>

          <PressableAnimated
            className="px-6 py-3.5 rounded-xl bg-surface border border-surface-border/40 flex-row items-center gap-2"
            onPress={handleExitSilence}
            haptic="medium"
            accessibilityLabel="Softly finish silence"
          >
            <Text className="text-secondary-text font-sans font-semibold text-sm">
              Softly Finish
            </Text>
            <ChevronRight size={15} color={colors.secondaryText} />
          </PressableAnimated>
        </View>
      </View>
    );
  }

  // Summary View
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-background"
    >
      <ScrollView
        contentContainerClassName="flex-grow justify-between px-6 py-12"
        showsVerticalScrollIndicator={false}
      >
        <MandalaThread />

        {/* Top Header Block */}
        <View style={{ paddingTop: Math.max(insets.top, 8) }} className="w-full items-center text-center gap-2">
          <Text className="font-devanagari text-accent-terracotta text-lg tracking-widest text-center">
            ॐ शान्तिः शान्तिः शान्तिः
          </Text>
          <Micro className="text-secondary-text font-sans font-semibold tracking-wider">RITUAL COMPLETE</Micro>
          <Display className="text-center font-serif text-3xl mt-1">
            Start Your Day in Stillness
          </Display>
        </View>

        {/* Quiet Metrics Section */}
        <View className="items-center justify-center my-6 gap-6">
          <View className="flex-row items-center justify-center gap-4 bg-surface/40 px-6 py-3 rounded-full border border-surface-border/30">
            <View className="flex-row items-center gap-1.5">
              <Clock size={16} color={accentColorString} />
              <Text className="font-mono text-sm text-primary-text font-semibold">{minutes}m Practiced</Text>
            </View>
            <View className="w-[1px] h-3 bg-surface-border/50" />
            <View className="flex-row items-center gap-1.5">
              <Flame size={16} color={accentColorString} fill={accentColorString} />
              <Text className="font-mono text-sm text-primary-text font-semibold">{streak}-Day Streak</Text>
            </View>
          </View>

          {/* Inline notification if meditation added */}
          {extraMinutes > 0 && (
            <Text className="text-xs text-accent-terracotta font-sans font-medium text-center bg-accent-terracotta/5 px-3 py-1 rounded-full border border-accent-terracotta/10">
              🌱 Sit in silence complete. +{extraMinutes}m stillness logged.
            </Text>
          )}
        </View>

        {/* Reflection & Journal Prompt */}
        <View className="w-full gap-4 items-center my-4">
          <Heading style={{ fontSize: 18 }} className="text-center font-serif text-primary-text">
            How is your mind breathing now?
          </Heading>
          
          <View className="flex-row flex-wrap justify-center gap-2 px-2 max-w-md">
            {CALM_MOODS.map((mood) => {
              const isSelected = selectedMoods.includes(mood.id);
              return (
                <PressableAnimated
                  key={mood.id}
                  className={`flex-row items-center gap-1.5 px-3 py-1.5 rounded-full border ${
                    isSelected 
                      ? 'bg-accent-terracotta/10 border-accent-terracotta/40' 
                      : 'bg-surface border-surface-border/40'
                  }`}
                  scaleTo={0.95}
                  onPress={() => toggleMood(mood.id)}
                >
                  <Text className={`text-xs font-sans ${isSelected ? 'text-accent-terracotta font-semibold' : 'text-secondary-text'}`}>
                    {mood.icon} {mood.label}
                  </Text>
                </PressableAnimated>
              );
            })}
          </View>

          {/* Optional Textarea Journal */}
          <View className="w-full max-w-sm mt-3 px-2">
            <TextInput
              className="w-full bg-surface border border-surface-border/40 rounded-xl p-3.5 text-primary-text text-sm font-sans"
              style={{ minHeight: 80 }}
              placeholder="Add a quiet note to your journal (optional)..."
              placeholderTextColor={colors.secondaryText + '80'}
              value={journalText}
              onChangeText={setJournalText}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Bottom Button Panel */}
        <View style={{ paddingBottom: Math.max(insets.bottom, 12) }} className="w-full gap-4 items-center mt-6">
          {/* Continue in Silence CTA */}
          <PressableAnimated
            className="w-full max-w-[300px] border border-accent-terracotta/30 py-3.5 rounded-xl flex-row items-center justify-center gap-2 bg-surface/50 active:bg-accent-terracotta/5"
            onPress={handleStartSilence}
            haptic="medium"
          >
            <Heart size={16} color={accentColorString} fill={accentColorString + '20'} />
            <Text className="text-accent-terracotta font-sans font-semibold text-sm">
              Continue in Silence
            </Text>
          </PressableAnimated>

          {/* Primary Ritual Complete CTA */}
          <PressableAnimated
            className="w-full max-w-[300px] bg-accent-terracotta py-4 rounded-xl items-center active:opacity-90 shadow-md shadow-accent-terracotta/10"
            onPress={handleCompleteRitual}
            haptic="medium"
            accessibilityLabel="Complete practice and return home"
          >
            <Text className="text-white font-sans font-bold text-sm">
              Complete Ritual
            </Text>
          </PressableAnimated>

          {/* Rewards Indicator (Secondary, Non-Intrusive) */}
          <View className="w-full max-w-[300px] items-center mt-1">
            {isPremium ? (
              <View className="flex-row items-center gap-1.5">
                <CheckCircle2 size={14} color={colors.growth || '#1A6B3A'} />
                <Caption className="text-secondary-text font-sans font-medium">
                  +30 Karma Coins credited to your wallet
                </Caption>
              </View>
            ) : (
              <View className="w-full items-center">
                {rewardStatus === 'idle' && (
                  <PressableAnimated
                    className="py-1 px-4 rounded-full border border-surface-border bg-surface/40"
                    onPress={handleClaimCoins}
                    haptic="light"
                  >
                    <Text className="text-xs text-secondary-text font-sans font-medium text-center underline underline-offset-4 decoration-surface-border">
                      Verify milestone for +30 Karma Coins
                    </Text>
                  </PressableAnimated>
                )}
                {rewardStatus === 'claiming' && (
                  <View className="flex-row items-center gap-2">
                    <ActivityIndicator size="small" color={accentColorString} />
                    <Caption className="text-secondary-text font-sans">Verifying practice session...</Caption>
                  </View>
                )}
                {rewardStatus === 'claimed' && (
                  <View className="flex-row items-center gap-1.5 bg-growth/5 border border-growth/20 px-3 py-1.5 rounded-full">
                    <CheckCircle2 size={14} color={colors.growth || '#1A6B3A'} />
                    <Text className="text-xs text-primary-text font-sans font-medium">
                      +30 Coins verified & credited. Thank you!
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>
        </View>

        {/* Full-Screen Ad Interstitial Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={adModalVisible}
          onRequestClose={() => setAdModalVisible(false)}
        >
          <View style={styles.adContainer}>
            <View className="items-center justify-center p-6 bg-surface w-[85%] rounded-2xl max-w-sm border border-surface-border">
              <Micro className="text-accent-terracotta mb-2 font-bold">SPONSORED VERIFICATION</Micro>
              <Heading style={{ fontSize: 20 }} className="text-center mb-4">Breathing Stretches</Heading>
              
              {/* Ad Animation Graphic */}
              <View className="w-16 h-16 rounded-full border border-accent-terracotta/20 justify-center items-center mb-6 bg-warm-highlight/20">
                <Activity size={24} color={accentColorString} />
              </View>

              <Text className="text-xs font-sans text-secondary-text mb-6 text-center leading-relaxed">
                Find peace in every movement. Thank you for supporting Sadhana's free sanctuary.
              </Text>

              {/* Countdown / Close Button */}
              <PressableAnimated
                className={`w-full py-3 rounded-xl items-center justify-center flex-row gap-2 ${
                  adCountdown > 0 ? 'bg-surface-border/40' : 'bg-accent-terracotta'
                }`}
                disabled={adCountdown > 0 || adLoading}
                onPress={handleCloseAd}
                haptic={adCountdown > 0 ? 'none' : 'success'}
                accessibilityLabel={adCountdown > 0 ? `Ad playing. Close in ${adCountdown} seconds.` : "Claim credit"}
              >
                {adLoading && <ActivityIndicator size="small" color="#FFFFFF" />}
                <Text className="text-white font-sans font-bold text-sm">
                  {adCountdown > 0 ? `Close in ${adCountdown}s` : 'Claim Credit'}
                </Text>
              </PressableAnimated>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  adContainer: {
    flex: 1,
    backgroundColor: 'rgba(28, 20, 9, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
