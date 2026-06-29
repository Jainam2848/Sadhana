import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView } from '@/tw';
import { useAuthStore } from '@/stores/authStore';
import { useTheme } from '@/hooks/useTheme';
import { router } from 'expo-router';
import { useProfile, useIncrementAdViews } from '@/hooks/api';
import { Display, Heading, Subheading, Caption, Micro } from '@/components/ui/Typography';
import { MandalaThread } from '@/components/ui/MandalaThread';
import { PressableAnimated } from '@/components/ui/PressableAnimated';
import { RewardsSkeleton } from '@/components/ui/Skeletons';
import { ErrorState } from '@/components/ui/ErrorState';
import { Check, Lock, Play, ArrowLeft } from 'lucide-react-native';
import { ActivityIndicator, Modal, StyleSheet, Alert, Animated, Easing } from 'react-native';
import * as Haptics from 'expo-haptics';

export default function RewardsScreen() {
  const { colors } = useTheme();
  const user = useAuthStore((state) => state.user);

  // Fetch user profile stats
  const { data: profile, isLoading, isError, refetch } = useProfile(user?.id);
  const incrementAdViews = useIncrementAdViews();

  const [adModalVisible, setAdModalVisible] = useState(false);
  const [adCountdown, setAdCountdown] = useState(10);
  const [adLoading, setAdLoading] = useState(false);

  const spinValue = useRef(new Animated.Value(0)).current;

  // Slow rotation animation for mandala graphic
  useEffect(() => {
    if (adModalVisible) {
      spinValue.setValue(0);
      Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 10000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    } else {
      spinValue.setValue(0);
    }
  }, [adModalVisible]);

  // Countdown timer effect
  useEffect(() => {
    let interval: any;
    if (adModalVisible) {
      setAdCountdown(10);
      interval = setInterval(() => {
        setAdCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [adModalVisible]);

  const handleWatchAd = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setAdModalVisible(true);
  };

  const handleCloseAd = async () => {
    if (adCountdown > 0) return;
    setAdLoading(true);
    try {
      // Trigger database write
      const res = await incrementAdViews.mutateAsync();
      setAdModalVisible(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      if (res.milestone_unlocked) {
        let rewardMsg = '';
        if (res.updated_ad_count === 10) {
          rewardMsg = isPremium ? 'Earned 10 Karma Coins!' : 'Unlocked a Single Premium Session!';
        } else if (res.updated_ad_count === 30) {
          rewardMsg = isPremium ? 'Earned 30 Karma Coins!' : 'Unlocked a Guided Course Bundle!';
        } else if (res.updated_ad_count === 50) {
          rewardMsg = isPremium ? 'Earned 50 Karma Coins!' : 'Unlocked a 24-hour Ad-Free Pass!';
        }
        Alert.alert(
          '🎉 Milestone Unlocked!',
          `Incredible dedication! You have completed ${res.updated_ad_count} ad views.\nReward: ${rewardMsg}`
        );
      } else {
        Alert.alert(
          'Ad Completed',
          `Thank you for supporting Sadhana! You've earned 1 ad credit. (${res.updated_ad_count}/50 for next milestone)`
        );
      }
    } catch (e: any) {
      console.error(e);
      Alert.alert('Ad Verification Failed', 'Unable to verify ad completion.');
    } finally {
      setAdLoading(false);
    }
  };

  const adCount = profile?.monthly_ad_count || 0;
  const coinsBalance = profile?.karma_coins || 0;
  const isPremium = profile?.premium || user?.premium || false;

  // Milestone check helpers
  const milestone1 = adCount >= 10;
  const milestone2 = adCount >= 30;
  const milestone3 = adCount >= 50;

  // Calculate proportional progress bar width (max 50)
  const progressPercent = Math.min((adCount / 50) * 100, 100);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    opacityRange: [0, 1], // Unused but keeps interpolation happy
    outputRange: ['0deg', '360deg'],
  } as any);

  return (
    <View className="flex-1 bg-background relative">
      <MandalaThread />

      {/* Top App Bar with back button */}
      <View className="pt-16 pb-4 px-6 z-40 bg-background/80 flex-row justify-between items-center border-b border-surface-border">
        <View className="flex-row items-center gap-1">
          <PressableAnimated
            haptic="light"
            className="w-10 h-10 items-center justify-center rounded-full active:bg-surface-border/20 -ml-2 mr-1"
            onPress={() => router.back()}
            accessibilityLabel="Go back to Profile"
          >
            <ArrowLeft size={20} color={colors.primaryText} />
          </PressableAnimated>
          <Heading className="text-primary font-serif">Rewards</Heading>
        </View>

        {isPremium && (
          <PressableAnimated
            haptic="light"
            className="flex-row items-center gap-1.5 bg-warm-highlight/50 px-3 py-1 rounded-full border border-accent-terracotta/20"
            onPress={() => router.push('/redemption')}
            accessibilityLabel={`Redeem ${coinsBalance} Karma Coins`}
          >
            <Text className="font-devanagari text-accent-terracotta font-bold">ॐ</Text>
            <Text className="font-sans font-bold text-xs text-primary-text">{coinsBalance}</Text>
          </PressableAnimated>
        )}
      </View>

      {isError ? (
        <ErrorState onRetry={refetch} />
      ) : isLoading ? (
        <RewardsSkeleton />
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
            <View 
              className="w-full h-2 bg-surface-border/20 rounded-full mb-6 relative justify-center"
              accessibilityLabel={`${adCount} out of 50 ads completed`}
            >
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
              <View className="flex-row items-center gap-2" accessibilityLabel={`10 ads milestone. ${milestone1 ? 'Completed' : 'Locked'}`}>
                <View
                  className={`w-5 h-5 rounded-full items-center justify-center border ${
                    milestone1 ? 'bg-growth-green/10 border-growth-green' : 'border-surface-border'
                  }`}
                >
                  {milestone1 && <Check size={12} color={colors.growth} />}
                </View>
                <Text className={`font-sans text-xs ${milestone1 ? 'text-growth-green font-bold' : 'text-secondary-text'}`}>
                  10 Ads: {isPremium ? '+10 Karma Coins' : 'Unlock single session'}
                </Text>
              </View>

              <View className="flex-row items-center gap-2" accessibilityLabel={`30 ads milestone. ${milestone2 ? 'Completed' : 'Locked'}`}>
                <View
                  className={`w-5 h-5 rounded-full items-center justify-center border ${
                    milestone2 ? 'bg-growth-green/10 border-growth-green' : 'border-surface-border'
                  }`}
                >
                  {milestone2 && <Check size={12} color={colors.growth} />}
                </View>
                <Text className={`font-sans text-xs ${milestone2 ? 'text-growth-green font-bold' : 'text-secondary-text'}`}>
                  30 Ads: {isPremium ? '+30 Karma Coins' : 'Guided course bundle'}
                </Text>
              </View>

              <View className="flex-row items-center gap-2" accessibilityLabel={`50 ads milestone. ${milestone3 ? 'Completed' : 'Locked'}`}>
                <View
                  className={`w-5 h-5 rounded-full items-center justify-center border ${
                    milestone3 ? 'bg-growth-green/10 border-growth-green' : 'border-surface-border'
                  }`}
                >
                  {milestone3 && <Check size={12} color={colors.growth} />}
                </View>
                <Text className={`font-sans text-xs ${milestone3 ? 'text-growth-green font-bold' : 'text-secondary-text'}`}>
                  50 Ads: {isPremium ? '+50 Karma Coins' : '24-hour ad-free pass'}
                </Text>
              </View>
            </View>
          </View>

          {/* Karma Coins Card */}
          <View
            className={`rounded-xl p-5 mb-8 flex-row items-center justify-between border ${
              isPremium ? 'bg-surface border-accent-terracotta/30' : 'bg-surface/50 border-surface-border'
            }`}
            accessibilityLabel={`Karma Coins Wallet. Balance: ${isPremium ? coinsBalance : 'locked'}`}
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
              <PressableAnimated
                haptic="medium"
                className="w-full bg-accent-terracotta py-4 rounded-xl items-center active:opacity-90"
                onPress={() => router.push('/(tabs)/home')}
                accessibilityLabel="Practice today's Sadhana to earn coins"
              >
                <Text className="text-white font-sans font-bold text-sm">
                  Complete a Session • Earn 30 Coins
                </Text>
              </PressableAnimated>
            ) : (
              <PressableAnimated
                haptic="medium"
                className="w-full bg-accent-terracotta py-4 rounded-xl items-center active:opacity-90 flex-row justify-center gap-2"
                onPress={handleWatchAd}
                accessibilityLabel="Watch video ad for credits"
              >
                <Play size={16} color="#FFFFFF" fill="#FFFFFF" />
                <Text className="text-white font-sans font-bold text-sm">
                  Watch Ad • Get 1 Credit
                </Text>
              </PressableAnimated>
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
            <Heading className="text-center mb-6">Sadhana Sanctuary</Heading>
            
            {/* Ad Animation Graphic - Slow Spinning Mandala */}
            <View className="w-24 h-24 items-center justify-center mb-8 relative">
              <Animated.View style={{ transform: [{ rotate: spin }] }} accessibilityLabel="Animated rotating mandala">
                <Text className="font-devanagari text-6xl text-accent-terracotta leading-none">ॐ</Text>
              </Animated.View>
            </View>

            <Text className="text-sm font-sans text-secondary-text mb-8 text-center leading-relaxed">
              Find peace in every movement. Practicing Sadhana cultivates continuous mindfulness.
            </Text>

            {/* Countdown / Close Button */}
            {adCountdown > 0 ? (
              <View className="w-full py-3 rounded-full bg-surface-border/40 items-center justify-center flex-row gap-2">
                <Text className="text-secondary-text font-sans font-bold text-sm">
                  Close in {adCountdown}s
                </Text>
              </View>
            ) : (
              <PressableAnimated
                haptic="success"
                className="w-full py-3 bg-growth-green rounded-full items-center justify-center flex-row gap-2 active:opacity-90"
                disabled={adLoading}
                onPress={handleCloseAd}
                accessibilityLabel="Claim your ad reward credit"
              >
                {adLoading && <ActivityIndicator size="small" color="#FFFFFF" />}
                <Text className="text-white font-sans font-bold text-sm">
                  Claim Credit
                </Text>
              </PressableAnimated>
            )}
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
  starRow: {
    flexDirection: 'row',
    gap: 3,
  },
});
