import React, { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { View, Text, ScrollView } from '@/tw';
import { useAuthStore } from '@/stores/authStore';
import { useTheme } from '@/hooks/useTheme';
import { Heading, Body, Caption, Micro, Stat } from '@/components/ui/Typography';
import { MandalaThread } from '@/components/ui/MandalaThread';
import { Check } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { billing } from '@/services/billing';
import { ActivityIndicator, Alert, useWindowDimensions } from 'react-native';
import { PressableAnimated } from '@/components/ui/PressableAnimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

// Reanimated Checkmark Selection Indicator
function PlanSelectionIndicator({ active }: { active: boolean }) {
  const scale = useSharedValue(active ? 1 : 0);

  useEffect(() => {
    scale.value = withSpring(active ? 1 : 0, {
      damping: 15,
      stiffness: 150,
    });
  }, [active]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: scale.value,
    };
  });

  return (
    <View
      className={`w-5 h-5 rounded-full border items-center justify-center ${
        active ? 'border-accent-terracotta bg-accent-terracotta' : 'border-secondary-text'
      }`}
    >
      <Animated.View style={animatedStyle}>
        <Check size={11} color="#FFFFFF" strokeWidth={3} />
      </Animated.View>
    </View>
  );
}

export default function PaywallScreen() {
  const { colors } = useTheme();
  const updateAnswers = useAuthStore((state) => state.updateOnboardingAnswers);
  const user = useAuthStore((state) => state.user);
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const isSmallDevice = height < 750;

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

  const secondaryColorString = typeof colors.secondaryText === 'string' ? colors.secondaryText : '#A69580';

  return (
    <View className="flex-1 bg-background relative">
      <MandalaThread />

      <ScrollView
        className="flex-1 px-6"
        contentContainerStyle={{
          paddingTop: Math.max(insets.top, 16),
          paddingBottom: Math.max(insets.bottom, 24) + 16,
        }}
        showsVerticalScrollIndicator={false}
      >
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
        <View className={`w-full z-10 ${isSmallDevice ? 'mt-3 mb-4' : 'mt-6 mb-6'}`}>
          <Heading className={`text-on-background font-serif mb-2 ${isSmallDevice ? 'text-2xl' : 'text-3xl'}`}>
            Go deeper in your practice
          </Heading>
          <Body className="text-secondary-text text-sm">
            Personalized sequences, offline access, and no interruptions.
          </Body>
        </View>

        {/* Plan Cards Container */}
        <View className={`w-full gap-4 z-10 ${isSmallDevice ? 'my-3' : 'my-4'}`}>
          {/* Monthly Card */}
          <PressableAnimated
            className={`w-full ${isSmallDevice ? 'p-4' : 'p-5'} rounded-3xl border-2 flex-row justify-between items-center bg-surface transition-all duration-150 ${
              selectedPlan === 'monthly'
                ? 'border-accent-terracotta bg-warm-highlight/10 shadow-lg shadow-accent-terracotta/10'
                : 'border-surface-border shadow-sm shadow-black/5'
            }`}
            onPress={() => handlePlanSelect('monthly')}
            disabled={isPurchasing || isRestoring}
            haptic="light"
            scaleTo={0.99}
            accessibilityLabel="Monthly plan. Billed monthly. 14 dollars 99 cents per month. Approx 49 cents a day."
            accessibilityState={{ selected: selectedPlan === 'monthly' }}
          >
            <View className="flex-row items-center gap-4">
              <PlanSelectionIndicator active={selectedPlan === 'monthly'} />
              <View>
                <Text className="font-sans font-bold text-sm text-primary-text">Monthly</Text>
                <Caption className="text-xs text-secondary-text mt-0.5">
                  $14.99/mo (approx. $0.49/day)
                </Caption>
              </View>
            </View>
            <View className="items-end">
              <View className="flex-row items-baseline">
                <Stat className="text-base text-primary-text font-bold">$14.99</Stat>
                <Caption className="text-[11px] text-secondary-text ml-0.5">/mo</Caption>
              </View>
            </View>
          </PressableAnimated>

          {/* Annual Card */}
          <PressableAnimated
            className={`w-full ${isSmallDevice ? 'p-4' : 'p-5'} rounded-3xl border-2 flex-row justify-between items-center bg-surface transition-all duration-150 relative ${
              selectedPlan === 'annual'
                ? 'border-accent-terracotta bg-warm-highlight/20 shadow-lg shadow-accent-terracotta/10'
                : 'border-surface-border shadow-sm shadow-black/5'
            }`}
            onPress={() => handlePlanSelect('annual')}
            disabled={isPurchasing || isRestoring}
            haptic="light"
            scaleTo={0.99}
            accessibilityLabel="Annual plan. Billed annually. 89 dollars 99 cents per year. Approx 24 cents a day. Best value."
            accessibilityState={{ selected: selectedPlan === 'annual' }}
          >
            {/* Best Value Badge */}
            <View className={`absolute right-6 bg-warm-highlight border border-accent-terracotta/20 px-3 py-1 rounded-full ${isSmallDevice ? '-top-3' : '-top-3.5'}`}>
              <Micro className="text-accent-terracotta font-bold text-[9px] tracking-wider uppercase">
                Best value · Save 50%
              </Micro>
            </View>
            
            <View className="flex-row items-center gap-4">
              <PlanSelectionIndicator active={selectedPlan === 'annual'} />
              <View>
                <Text className="font-sans font-bold text-sm text-primary-text">Annual</Text>
                <Caption className="text-xs text-secondary-text mt-0.5">
                  $89.99/yr (approx. $0.24/day — less than tea)
                </Caption>
              </View>
            </View>
            <View className="items-end">
              <View className="flex-row items-baseline">
                <Stat className="text-base text-primary-text font-bold">$89.99</Stat>
                <Caption className="text-[11px] text-secondary-text ml-0.5">/yr</Caption>
              </View>
              <Caption className="text-xs text-secondary-text line-through opacity-70 mt-0.5">$179.88</Caption>
            </View>
          </PressableAnimated>
        </View>

        {/* Feature Bullet Points */}
        <View className={`w-full px-2 z-10 ${isSmallDevice ? 'gap-3 my-4' : 'gap-4 my-6'}`}>
          {[
            'Personalized daily routine matching your energy',
            'Complete offline downloads for phone-free mat time',
            'Earn Karma Coins for renewed discounts & charity',
            'Unlock advanced libraries and guided courses',
            'Ad-free sanctuary environment',
          ].map((feature, idx) => (
            <View key={idx} className="flex-row items-center gap-3.5">
              <View className="w-5 h-5 rounded-full bg-accent-terracotta/10 items-center justify-center">
                <Check size={11} color={colors.accent} strokeWidth={3} />
              </View>
              <Text className="font-sans text-sm text-primary-text leading-relaxed">{feature}</Text>
            </View>
          ))}
        </View>

        {/* Editorial Social Proof */}
        <View className="w-full border-t border-b border-surface-border/50 py-6 my-4 items-center z-10">
          <Body
            className="text-primary-text text-center px-4 text-xl"
            style={{ fontFamily: 'CormorantGaramond-Regular', fontStyle: 'italic' }}
          >
            "A quiet sanctuary in my pocket. Simple and beautiful."
          </Body>
          <Caption className="text-secondary-text text-center text-xs uppercase tracking-[0.15em] mt-3 font-medium">
            — Rohan M.
          </Caption>
        </View>

        {/* Bottom CTA Block */}
        <View className={`w-full items-center z-10 ${isSmallDevice ? 'mt-4' : 'mt-6'}`}>
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
      </ScrollView>
    </View>
  );
}
