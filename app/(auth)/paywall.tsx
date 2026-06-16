import React, { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { View, Text, Pressable } from '@/tw';
import { useAuthStore } from '@/stores/authStore';
import { useTheme } from '@/hooks/useTheme';
import { Heading, Body, Caption, Micro } from '@/components/ui/Typography';
import { MandalaThread } from '@/components/ui/MandalaThread';
import { Check } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

export default function PaywallScreen() {
  const { colors } = useTheme();
  const updateAnswers = useAuthStore((state) => state.updateOnboardingAnswers);

  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('annual');
  const [showSkip, setShowSkip] = useState(false);

  // Fade in the skip button after 1.8 seconds delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSkip(true);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  const handlePlanSelect = (plan: 'monthly' | 'annual') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedPlan(plan);
  };

  const handleStartTrial = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Set trial flag in onboarding answers and route to register screen
    updateAnswers({ selectedPlan, startTrial: true });
    router.push('/(auth)/register?tier=premium');
  };

  const handleSkipToFree = () => {
    updateAnswers({ startTrial: false });
    router.push('/(auth)/register?tier=free');
  };

  return (
    <View className="flex-1 bg-background relative px-6 py-12 justify-between">
      <MandalaThread />

      {/* Header Skip Area */}
      <View className="w-full flex-row justify-end items-center h-8 z-10">
        {showSkip && (
          <Pressable className="active:opacity-75" onPress={handleSkipToFree}>
            <Text className="text-secondary-text font-sans font-medium text-sm">
              Skip · Try Free
            </Text>
          </Pressable>
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
        <Pressable
          className={`w-full p-4 rounded-xl border flex-row justify-between items-center bg-surface transition-all duration-150 ${
            selectedPlan === 'monthly'
              ? 'border-accent-terracotta border-2'
              : 'border-surface-border'
          }`}
          onPress={() => handlePlanSelect('monthly')}
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
        </Pressable>

        {/* Annual Card */}
        <Pressable
          className={`w-full p-4 rounded-xl border flex-row justify-between items-center bg-surface transition-all duration-150 relative ${
            selectedPlan === 'annual'
              ? 'border-accent-terracotta border-2'
              : 'border-surface-border'
          }`}
          onPress={() => handlePlanSelect('annual')}
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
        </Pressable>
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
            <Check size={16} color={colors.growth} />
            <Text className="font-sans text-sm text-primary-text">{feature}</Text>
          </View>
        ))}
      </View>

      {/* Bottom CTA Block */}
      <View className="w-full items-center mt-6 z-10">
        <Pressable
          className="w-full max-w-[320px] bg-accent-terracotta py-4 rounded-full items-center mb-4 active:opacity-90"
          onPress={handleStartTrial}
        >
          <Text className="text-white font-sans font-bold text-base tracking-wide">
            Start 7-day free trial
          </Text>
        </Pressable>
        <Caption className="text-[11px] text-secondary-text text-center max-w-[280px]">
          No payment until trial ends. Cancel anytime before Day 7.
        </Caption>
      </View>
    </View>
  );
}
