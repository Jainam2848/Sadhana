import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView } from '@/tw';
import { useAuthStore } from '@/stores/authStore';
import { useTheme } from '@/hooks/useTheme';
import { router } from 'expo-router';
import { useProfile, useIncrementAdViews } from '@/hooks/api';
import { Display, Heading, Subheading, Body, Caption, Micro } from '@/components/ui/Typography';
import { MandalaThread } from '@/components/ui/MandalaThread';
import { Check, Award, Lock, Play, Activity } from 'lucide-react-native';
import { ActivityIndicator, Modal, StyleSheet, Alert } from 'react-native';
import * as Haptics from 'expo-haptics';

export default function RewardsScreen() {
  const { colors } = useTheme();
  const user = useAuthStore((state) => state.user);

  // Fetch user profile stats
  const { data: profile, isLoading } = useProfile(user?.id);
  const incrementAdViews = useIncrementAdViews();

  const [adModalVisible, setAdModalVisible] = useState(false);
  const [adCountdown, setAdCountdown] = useState(10);
  const [adLoading, setAdLoading] = useState(false);

  const handleWatchAd = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setAdModalVisible(true);
    setAdCountdown(10);

    // Simulated countdown timer for ad
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
      // Trigger database write
      const res = await incrementAdViews.mutateAsync();
      setAdModalVisible(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert(
        'Milestone Updated',
        `Thank you for supporting Sadhana! Your ad count is now ${res.updated_ad_count}.`
      );
    } catch (e: any) {
      console.error(e);
      Alert.alert('Ad Verification Failed', 'Unable to verify ad completion.');
    } finally {
      setAdLoading(false);
    }
  };

  const adCount = profile?.monthly_ad_count || 0;
  const coinsBalance = profile?.karma_coins || 0;
  const isPremium = profile?.premium || false;

  // Milestone check helpers
  const milestone1 = adCount >= 10;
  const milestone2 = adCount >= 30;
  const milestone3 = adCount >= 50;

  // Calculate proportional progress bar width (max 50)
  const progressPercent = Math.min((adCount / 50) * 100, 100);

  return (
    <View className="flex-1 bg-background relative">
      <MandalaThread />

      {/* Top App Bar */}
      <View className="pt-16 pb-4 px-6 z-40 bg-background/80 flex-row justify-between items-center border-b border-surface-border">
        <Heading className="text-primary font-serif">Rewards</Heading>
        {isPremium && (
          <Pressable
            className="flex-row items-center gap-1.5 bg-warm-highlight/50 px-3 py-1 rounded-full border border-accent-terracotta/20"
            onPress={() => router.push('/redemption')}
          >
            <Text className="font-devanagari text-accent-terracotta font-bold">ॐ</Text>
            <Text className="font-sans font-bold text-xs text-primary-text">{coinsBalance}</Text>
          </Pressable>
        )}
      </View>

      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      ) : (
        <ScrollView
          className="flex-1 px-6 pt-6"
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {/* Milestone Card */}
          <View className="bg-surface rounded-xl border border-surface-border p-5 mb-4 flex-col">
            <Micro className="text-secondary-text mb-1">THIS MONTH</Micro>
            <Subheading className="text-primary-text font-bold text-sm mb-4">
              {adCount} of 50 ads viewed
            </Subheading>

            {/* Custom Progress Bar */}
            <View className="w-full h-2 bg-surface-border/20 rounded-full mb-6 relative justify-center">
              <View
                className="h-full bg-accent-terracotta rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
              {/* Tick Marks representing milestones */}
              <View
                className={`absolute left-[20%] w-2 h-3 border border-white rounded-[2px] ${
                  milestone1 ? 'bg-growth-green' : 'bg-secondary-text/40'
                }`}
              />
              <View
                className={`absolute left-[60%] w-2 h-3 border border-white rounded-[2px] ${
                  milestone2 ? 'bg-growth-green' : 'bg-secondary-text/40'
                }`}
              />
              <View
                className={`absolute left-[100%] w-2 h-3 border border-white rounded-[2px] ${
                  milestone3 ? 'bg-growth-green' : 'bg-secondary-text/40'
                }`}
              />
            </View>

            {/* Milestones list */}
            <View className="gap-2">
              <View className="flex-row items-center gap-2">
                <View
                  className={`w-5 h-5 rounded-full items-center justify-center border ${
                    milestone1 ? 'bg-growth-green/10 border-growth-green' : 'border-surface-border'
                  }`}
                >
                  {milestone1 && <Check size={12} color={colors.growth} />}
                </View>
                <Text className={`font-sans text-xs ${milestone1 ? 'text-growth-green font-bold' : 'text-secondary-text'}`}>
                  10 Ads: Unlock single session
                </Text>
              </View>

              <View className="flex-row items-center gap-2">
                <View
                  className={`w-5 h-5 rounded-full items-center justify-center border ${
                    milestone2 ? 'bg-growth-green/10 border-growth-green' : 'border-surface-border'
                  }`}
                >
                  {milestone2 && <Check size={12} color={colors.growth} />}
                </View>
                <Text className={`font-sans text-xs ${milestone2 ? 'text-growth-green font-bold' : 'text-secondary-text'}`}>
                  30 Ads: Guided course bundle
                </Text>
              </View>

              <View className="flex-row items-center gap-2">
                <View
                  className={`w-5 h-5 rounded-full items-center justify-center border ${
                    milestone3 ? 'bg-growth-green/10 border-growth-green' : 'border-surface-border'
                  }`}
                >
                  {milestone3 && <Check size={12} color={colors.growth} />}
                </View>
                <Text className={`font-sans text-xs ${milestone3 ? 'text-growth-green font-bold' : 'text-secondary-text'}`}>
                  50 Ads: 24-hour ad-free pass
                </Text>
              </View>
            </View>
          </View>

          {/* Karma Coins Card */}
          <View
            className={`rounded-xl p-5 mb-8 flex-row items-center justify-between border ${
              isPremium ? 'bg-surface border-accent-terracotta/30' : 'bg-surface/50 border-surface-border'
            }`}
          >
            <View className="flex-1 pr-4">
              <Micro className="text-secondary-text mb-0.5">KARMA COINS</Micro>
              {isPremium ? (
                <Text className="font-serif text-3xl font-bold text-primary-text">{coinsBalance}</Text>
              ) : (
                <View className="flex-row items-center gap-1.5 mt-1">
                  <Lock size={14} color={colors.secondaryText} />
                  <Text className="font-sans font-medium text-sm text-secondary-text">
                    Locked (Premium Only)
                  </Text>
                </View>
              )}
            </View>
            <View
              className={`w-9 h-9 rounded-full border items-center justify-center ${
                isPremium ? 'border-accent-terracotta text-accent-terracotta' : 'border-surface-border text-secondary-text'
              }`}
            >
              <Text className="font-devanagari text-lg leading-none font-bold">ॐ</Text>
            </View>
          </View>

          {/* Primary CTA */}
          <View className="items-center">
            {isPremium ? (
              <Pressable
                className="w-full bg-accent-terracotta py-4 rounded-xl items-center active:opacity-90"
                onPress={() => router.push('/(tabs)/home')}
              >
                <Text className="text-white font-sans font-bold text-sm">
                  Complete a Session • Earn 30 Coins
                </Text>
              </Pressable>
            ) : (
              <Pressable
                className="w-full bg-accent-terracotta py-4 rounded-xl items-center active:opacity-90 flex-row justify-center gap-2"
                onPress={handleWatchAd}
              >
                <Play size={16} color="#FFFFFF" fill="#FFFFFF" />
                <Text className="text-white font-sans font-bold text-sm">
                  Watch Ad • Get 1 Credit
                </Text>
              </Pressable>
            )}
            <Caption className="text-xs text-secondary-text mt-3 text-center">
              Rewarded — not required. Always your choice.
            </Caption>
          </View>
        </ScrollView>
      )}

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
