import React, { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { View, Text } from '@/tw';
import { useAuthStore } from '@/stores/authStore';
import { useTheme } from '@/hooks/useTheme';
import { Heading, Body, Caption, Micro } from '@/components/ui/Typography';
import { MandalaThread } from '@/components/ui/MandalaThread';
import { Check } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { billing } from '@/services/billing';
import { ActivityIndicator, Alert } from 'react-native';
import { PressableAnimated } from '@/components/ui/PressableAnimated';

export default function PaywallScreen() {
  const { colors } = useTheme();
  const updateAnswers = useAuthStore((state) => state.updateOnboardingAnswers);
  const user = useAuthStore((state) => state.user);

  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('annual');
  const [showSkip, setShowSkip] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  // Fade in the skip button after 1.8 seconds delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSkip(true);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  const handlePlanSelect = (plan: 'monthly' | 'annual') => {
    if (isPurchasing || isRestoring) return;
    setSelectedPlan(plan);
  };

  const handleStartTrial = async () => {
    if (user) {
      setIsPurchasing(true);
      try {
        const success = await billing.purchasePlan(selectedPlan);
        if (success) {
          Alert.alert('Subscription Success', 'Thank you for upgrading to Sadhana Premium!', [
            { text: 'OK', onPress: () => router.replace('/(tabs)/home') }
          ]);
        } else {
          Alert.alert('Subscription Failed', 'Could not complete the purchase. Please try again.');
        }
      } catch (error) {
        Alert.alert('Error', 'An unexpected error occurred during purchase.');
      } finally {
        setIsPurchasing(false);
      }
    } else {
      // Set trial flag in onboarding answers and route to register screen
      updateAnswers({ selectedPlan, startTrial: true });
      router.push('/(auth)/register?tier=premium');
    }
  };

  const handleSkipToFree = () => {
    if (user) {
      router.replace('/(tabs)/home');
    } else {
      updateAnswers({ startTrial: false });
      router.push('/(auth)/register?tier=free');
    }
  };

  const handleRestore = async () => {
    setIsRestoring(true);
    try {
      const success = await billing.restorePurchases();
      if (success) {
        Alert.alert('Purchases Restored', 'Your premium status has been restored successfully!', [
          { text: 'OK', onPress: () => router.replace('/(tabs)/home') }
        ]);
      } else {
        Alert.alert('Restore Failed', 'No active subscription found to restore.');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred while restoring.');
    } finally {
      setIsRestoring(false);
    }
  };

  const growthColorString = typeof colors.growth === 'string' ? colors.growth : '#4CAF50';
  const secondaryColorString = typeof colors.secondaryText === 'string' ? colors.secondaryText : '#A69580';

  return (
    <View className="flex-1 bg-background relative px-6 py-12 justify-between">
      <MandalaThread />

      {/* Header Skip Area */}
      <View className="w-full flex-row justify-end items-center h-8 z-10">
        {showSkip && (
          <PressableAnimated
            className="active:opacity-75"
            onPress={handleSkipToFree}
            haptic="light"
            accessibilityLabel="Skip and try free version"
          >
            <Text className="text-secondary-text font-sans font-medium text-sm">
              Skip · Try Free
            </Text>
          </PressableAnimated>
        )}
      </View>

      {/* Title block */}
      <View className="w-full mt-6 z-10">
        <Heading className="text-on-background text-3xl font-serif mb-2">
          Go deeper in your practice
        </Heading>
        <Body className="text-secondary-text text-sm">
          Personalized sequences, offline access, and no interruptions.
        </Body>
      </View>

      {/* Plan Cards Container */}
      <View className="w-full gap-3 my-6 z-10">
        {/* Monthly Card */}
        <PressableAnimated
          className={`w-full p-4 rounded-xl border flex-row justify-between items-center bg-surface transition-all duration-150 ${
            selectedPlan === 'monthly'
              ? 'border-accent-terracotta border-2'
              : 'border-surface-border'
          }`}
          onPress={() => handlePlanSelect('monthly')}
          disabled={isPurchasing || isRestoring}
          haptic="light"
          scaleTo={0.99}
          accessibilityLabel="Monthly plan. Billed monthly. 14 dollars 99 cents per month."
          accessibilityState={{ selected: selectedPlan === 'monthly' }}
        >
          <View className="flex-row items-center gap-3">
            <View
              className={`w-5 h-5 rounded-full border items-center justify-center ${
                selectedPlan === 'monthly' ? 'border-accent-terracotta' : 'border-secondary-text'
              }`}
            >
              {selectedPlan === 'monthly' && (
                <View className="w-2.5 h-2.5 rounded-full bg-accent-terracotta" />
              )}
            </View>
            <View>
              <Text className="font-sans font-bold text-sm text-primary-text">Monthly</Text>
              <Caption className="text-xs text-secondary-text mt-0.5">
                Billed monthly · Cancel anytime
              </Caption>
            </View>
          </View>
          <Text className="font-sans font-bold text-sm text-primary-text">$14.99/mo</Text>
        </PressableAnimated>

        {/* Annual Card */}
        <PressableAnimated
          className={`w-full p-4 rounded-xl border flex-row justify-between items-center bg-surface transition-all duration-150 relative ${
            selectedPlan === 'annual'
              ? 'border-accent-terracotta border-2'
              : 'border-surface-border'
          }`}
          onPress={() => handlePlanSelect('annual')}
          disabled={isPurchasing || isRestoring}
          haptic="light"
          scaleTo={0.99}
          accessibilityLabel="Annual plan. Billed annually. 89 dollars 99 cents per year. Best value."
          accessibilityState={{ selected: selectedPlan === 'annual' }}
        >
          {/* Best Value Badge */}
          <View className="absolute -top-3 right-4 bg-warm-highlight border border-accent-terracotta/20 px-2 py-0.5 rounded-full">
            <Micro className="text-accent-terracotta font-bold text-[9px]">
              Best value · 50% off
            </Micro>
          </View>
          
          <View className="flex-row items-center gap-3">
            <View
              className={`w-5 h-5 rounded-full border items-center justify-center ${
                selectedPlan === 'annual' ? 'border-accent-terracotta' : 'border-secondary-text'
              }`}
            >
              {selectedPlan === 'annual' && (
                <View className="w-2.5 h-2.5 rounded-full bg-accent-terracotta" />
              )}
            </View>
            <View>
              <Text className="font-sans font-bold text-sm text-primary-text">Annual</Text>
              <Caption className="text-xs text-secondary-text mt-0.5">
                Billed annually · Cancel anytime
              </Caption>
            </View>
          </View>
          <View className="items-end">
            <Text className="font-sans font-bold text-sm text-primary-text">$89.99/yr</Text>
            <Caption className="text-xs text-secondary-text line-through opacity-70 mt-0.5">$179.88</Caption>
          </View>
        </PressableAnimated>
      </View>

      {/* Feature Bullet Points */}
      <View className="w-full gap-3 px-2 z-10">
        {[
          'Personalized daily routine',
          'Offline downloads',
          'Karma Coins',
          'Advanced library (Creator+)',
          'Ad-free experience',
        ].map((feature, idx) => (
          <View key={idx} className="flex-row items-center gap-3">
            <Check size={16} color={growthColorString} />
            <Text className="font-sans text-sm text-primary-text">{feature}</Text>
          </View>
        ))}
      </View>

      {/* Bottom CTA Block */}
      <View className="w-full items-center mt-6 z-10">
        <PressableAnimated
          className="w-full max-w-[320px] bg-accent-terracotta py-4 rounded-full items-center mb-4 active:opacity-90 flex-row justify-center"
          onPress={handleStartTrial}
          disabled={isPurchasing || isRestoring}
          haptic="medium"
          accessibilityLabel={user ? 'Start subscription' : 'Start 7-day free trial'}
        >
          {isPurchasing ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text className="text-white font-sans font-bold text-base tracking-wide">
              {user ? 'Start subscription' : 'Start 7-day free trial'}
            </Text>
          )}
        </PressableAnimated>
        <Caption className="text-[11px] text-secondary-text text-center max-w-[280px] mb-4">
          No payment until trial ends. Cancel anytime before Day 7.
        </Caption>

        {user && (
          <PressableAnimated 
            className="py-2 active:opacity-75" 
            onPress={handleRestore}
            disabled={isPurchasing || isRestoring}
            haptic="light"
            accessibilityLabel="Restore purchases"
          >
            {isRestoring ? (
              <ActivityIndicator color={secondaryColorString} size="small" />
            ) : (
              <Text className="text-secondary-text font-sans font-medium text-xs underline">
                Restore Purchases
              </Text>
            )}
          </PressableAnimated>
        )}
      </View>
    </View>
  );
}
