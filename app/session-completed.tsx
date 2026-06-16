import React, { useState, useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, Pressable } from '@/tw';
import { useTheme } from '@/hooks/useTheme';
import { useProfile, useIncrementAdViews } from '@/hooks/api';
import { useAuthStore } from '@/stores/authStore';
import { Display, Heading, Subheading, Body, Caption, Micro } from '@/components/ui/Typography';
import { MandalaThread } from '@/components/ui/MandalaThread';
import { Award, Flame, Play, Activity } from 'lucide-react-native';
import { ActivityIndicator, Modal, StyleSheet, Alert } from 'react-native';
import * as Haptics from 'expo-haptics';

export default function SessionCompletedScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  
  const { totalMinutes } = useLocalSearchParams<{ totalMinutes: string }>();

  // Fetch updated profile
  const { data: profile, isLoading } = useProfile(user?.id);
  const incrementAdViews = useIncrementAdViews();

  const [adModalVisible, setAdModalVisible] = useState(false);
  const [adCountdown, setAdCountdown] = useState(10);
  const [adLoading, setAdLoading] = useState(false);

  const isPremium = profile?.premium || false;

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, []);

  const handleClaimRewards = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (!isPremium) {
      // Free users must watch an ad to claim credit
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
    } else {
      // Premium users already got their 30 coins in active-routine
      Alert.alert(
        'Practice Logged',
        '+30 Karma Coins have been securely added to your wallet! Return to dashboard.',
        [{ text: 'Hari Om', onPress: () => router.replace('/(tabs)/home') }]
      );
    }
  };

  const handleCloseAd = async () => {
    if (adCountdown > 0) return;
    setAdLoading(true);
    try {
      await incrementAdViews.mutateAsync();
      setAdModalVisible(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert(
        'Practice Logged',
        'Your milestone has been credited! Thank you for supporting Sadhana.',
        [{ text: 'Hari Om', onPress: () => router.replace('/(tabs)/home') }]
      );
    } catch (e: any) {
      console.error(e);
      Alert.alert('Verification Failed', 'Failed to update your rewards milestone.');
    } finally {
      setAdLoading(false);
    }
  };

  const minutes = totalMinutes || '12';
  const streak = 12; // Fallback streak representation

  return (
    <View className="flex-1 bg-background relative px-6 py-12 justify-between">
      <MandalaThread />

      {/* Top Header Block */}
      <View className="w-full items-center mt-16 text-center gap-2">
        <Micro className="text-secondary-text">RITUAL COMPLETE</Micro>
        <Display className="text-center font-serif text-3xl">
          Start Your Day in Stillness
        </Display>
      </View>

      {/* Center Details Section */}
      <View className="items-center justify-center my-8 gap-8">
        <View className="w-24 h-24 rounded-full bg-warm-highlight/50 border border-accent-terracotta/20 items-center justify-center">
          <Award size={44} color={colors.accent} />
        </View>

        {/* Stats Panel */}
        <View className="bg-surface rounded-xl border border-surface-border p-5 w-full max-w-sm flex-row justify-around">
          <View className="items-center">
            <Text className="font-serif text-3xl font-bold text-primary-text">{minutes}</Text>
            <Caption className="text-secondary-text mt-1">Minutes</Caption>
          </View>
          <View className="w-[1px] bg-surface-border/40 h-10 self-center" />
          <View className="items-center">
            <View className="flex-row items-center gap-1">
              <Flame size={20} color={colors.accent} fill={colors.accent} />
              <Text className="font-serif text-3xl font-bold text-primary-text">{streak}</Text>
            </View>
            <Caption className="text-secondary-text mt-1">Day Streak</Caption>
          </View>
        </View>

        {/* Premium Coin Notification */}
        {isPremium && (
          <Body className="text-growth-green text-center font-bold px-6">
            +30 Karma Coins added to your wallet!
          </Body>
        )}
      </View>

      {/* Bottom Button Panel */}
      <View className="w-full gap-4 items-center mb-6">
        <Pressable
          className="w-full max-w-[320px] bg-accent-terracotta py-4 rounded-xl items-center active:opacity-90"
          onPress={handleClaimRewards}
        >
          <Text className="text-white font-sans font-bold text-sm">
            {isPremium ? 'Done' : 'Claim Reward Milestone'}
          </Text>
        </Pressable>

        <Pressable
          className="py-2 active:opacity-85"
          onPress={() => router.replace('/(tabs)/home')}
        >
          <Text className="text-secondary-text font-sans font-medium text-sm underline underline-offset-4 decoration-surface-border">
            Back to Dashboard
          </Text>
        </Pressable>
      </View>

      {/* Full-Screen Ad Interstitial Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={adModalVisible}
        onRequestClose={() => {}}
      >
        <View style={styles.adContainer}>
          <View className="items-center justify-center p-6 bg-surface w-[85%] rounded-2xl max-w-sm border border-surface-border">
            <Micro className="text-accent-terracotta mb-2 font-bold">SPONSORED AD</Micro>
            <Heading className="text-center mb-6">Breathing Stretches</Heading>
            
            {/* Ad Animation Graphic */}
            <View className="w-20 h-20 rounded-full border-2 border-accent-terracotta/30 justify-center items-center mb-8 bg-warm-highlight/20">
              <Activity size={32} color={colors.accent} />
            </View>

            <Text className="text-sm font-sans text-secondary-text mb-8 text-center leading-relaxed">
              Find peace in every movement. Practicing Sadhana cultivates continuous mindfulness.
            </Text>

            {/* Countdown / Close Button */}
            <Pressable
              className={`w-full py-3 rounded-full items-center justify-center flex-row gap-2 ${
                adCountdown > 0 ? 'bg-surface-border/40' : 'bg-growth-green'
              }`}
              disabled={adCountdown > 0 || adLoading}
              onPress={handleCloseAd}
            >
              {adLoading && <ActivityIndicator size="small" color="#FFFFFF" />}
              <Text className="text-white font-sans font-bold text-sm">
                {adCountdown > 0 ? `Close in ${adCountdown}s` : 'Claim Credit'}
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  adContainer: {
    flex: 1,
    backgroundColor: 'rgba(28, 20, 9, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
