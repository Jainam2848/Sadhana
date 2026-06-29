import React, { useState, useEffect, useMemo } from 'react';
import { router } from 'expo-router';
import { View, Text, ScrollView } from '@/tw';
import { useAuthStore } from '@/stores/authStore';
import { useTheme } from '@/hooks/useTheme';
import { Heading, Body, Caption, Micro, Stat } from '@/components/ui/Typography';
import { MandalaThread } from '@/components/ui/MandalaThread';
import { Check, Star, X, Lock } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { billing } from '@/services/billing';
import { supabase } from '@/lib/supabase';
import { ActivityIndicator, StyleSheet, useWindowDimensions } from 'react-native';
import { PressableAnimated } from '@/components/ui/PressableAnimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

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
        active ? 'border-accent-terracotta bg-accent-terracotta' : 'border-secondary-text/30 bg-surface'
      }`}
    >
      <Animated.View style={animatedStyle}>
        <Check size={11} color="#FFFFFF" strokeWidth={3} />
      </Animated.View>
    </View>
  );
}

// Star Rating Row
function StarRating({ count = 5 }: { count?: number }) {
  return (
    <View style={styles.starRow}>
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} size={12} color="#C44B22" fill="#C44B22" />
      ))}
    </View>
  );
}

export default function PaywallScreen() {
  const { colors } = useTheme();
  const user = useAuthStore((state) => state.user);
  const onboardingAnswers = useAuthStore((state) => state.onboardingAnswers || {});
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const isSmallDevice = height < 750;

  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('annual');
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const handlePlanSelect = (plan: 'monthly' | 'annual') => {
    if (isPurchasing || isRestoring) return;
    setSelectedPlan(plan);
  };

  const handleStartTrial = async () => {
    setCheckoutError(null);
    if (user) {
      setIsPurchasing(true);
      try {
        const success = await billing.purchasePlan(selectedPlan);
        if (success) {
          // Update database profile
          const { error: dbError } = await supabase
            .from('profiles')
            .update({ premium: true })
            .eq('id', user.id);
          if (dbError) {
            console.warn('Failed to update premium status in database', dbError);
          }

          // Update local AuthStore premium state
          useAuthStore.getState().setUserPremium(true);

          // Clear onboarding answers to finalize onboarding flow
          useAuthStore.setState({ onboardingAnswers: {} });

          setPurchaseSuccess(true);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
        } else {
          setCheckoutError('Payment verification was not completed. Please try again.');
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
        }
      } catch (err) {
        setCheckoutError('An unexpected error occurred during checkout.');
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
      } finally {
        setIsPurchasing(false);
      }
    } else {
      router.push('/(auth)/register');
    }
  };

  const handleSkipToFree = () => {
    // Clear onboarding answers to finalize onboarding flow
    useAuthStore.setState({ onboardingAnswers: {} });
    router.replace('/(tabs)/home');
  };

  const handleRestore = async () => {
    if (!user) return;
    setCheckoutError(null);
    setIsRestoring(true);
    try {
      const success = await billing.restorePurchases();
      if (success) {
        // Update database profile
        const { error: dbError } = await supabase
          .from('profiles')
          .update({ premium: true })
          .eq('id', user.id);
        if (dbError) {
          console.warn('Failed to restore premium status in database', dbError);
        }

        // Update local AuthStore premium state
        useAuthStore.getState().setUserPremium(true);

        // Clear onboarding answers to finalize onboarding flow
        useAuthStore.setState({ onboardingAnswers: {} });

        setPurchaseSuccess(true);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      } else {
        setCheckoutError('No active subscriptions were found on this Apple ID.');
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
      }
    } catch {
      setCheckoutError('An unexpected error occurred while restoring purchases.');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
    } finally {
      setIsRestoring(false);
    }
  };

  // Onboarding personalized content mapping
  const personalizedContent = useMemo(() => {
    const goal = onboardingAnswers.goal;
    const duration = onboardingAnswers.duration || 12;
    const schedule = onboardingAnswers.schedule || 'morning';

    const scheduleLabel = 
      schedule === 'morning' ? 'morning' : 
      schedule === 'afternoon' ? 'afternoon' : 
      schedule === 'evening' ? 'evening' : 'daily';

    let heading = 'A Covenant of Space';
    let body = 'Support the lineage. Unlock personalized sequences, offline practices, and deep meditation libraries.';

    if (goal === 'stress') {
      heading = 'Restore Your Calm';
      body = `We’ve prepared a custom ${duration}m ${scheduleLabel} practice path to soothe your overactive mind and release anxiety.`;
    } else if (goal === 'mobility') {
      heading = 'Free Your Body';
      body = `We’ve prepared a custom ${duration}m ${scheduleLabel} practice path to target muscle tightness and release joint stiffness.`;
    } else if (goal === 'philosophy') {
      heading = 'Deepen Your Lineage';
      body = `We’ve prepared a custom ${duration}m ${scheduleLabel} practice path in contemplative meditation, wisdom sutras, and traditional teachings.`;
    }

    return { heading, body };
  }, [onboardingAnswers]);

  const secondaryColorString =
    typeof colors.secondaryText === 'string' ? colors.secondaryText : '#A69580';
  const accentColorString = typeof colors.accent === 'string' ? colors.accent : '#C44B22';

  const features = [
    { title: 'Personalized Daily Sequences', desc: 'Practices matched to your morning energy and joint stiffness.' },
    { title: 'Phone-Free Offline Rituals', desc: 'Download sessions directly to your device for zero screen distractions.' },
    { title: 'Advanced Pranayama & Chanting', desc: 'Guided box breathing, cooling breaths, and chakra seed sounds.' },
    { title: 'Deep Lineage Philosophy Paths', desc: 'Wisdom studies and traditional guided meditation courses.' },
    { title: 'Uninterrupted Sanctuary Space', desc: '100% ad-free environment to preserve complete stillness.' },
  ];

  // Success view if purchase completes
  if (purchaseSuccess) {
    return (
      <View className="flex-1 bg-background justify-center items-center px-8 relative">
        <MandalaThread />
        
        <View className="items-center max-w-sm text-center">
          {/* Animated Success Badge */}
          <View className="w-20 h-20 bg-growth-green/10 border border-growth-green/30 rounded-full items-center justify-center mb-6">
            <Check size={40} color={colors.growth || '#1A6B3A'} strokeWidth={1.5} />
          </View>
          
          <Heading className="text-3xl font-serif text-primary-text mb-2">
            Sanctuary Unlocked
          </Heading>
          
          <Heading className="text-accent-terracotta font-devanagari text-2xl mb-4">
            हरि ॐ
          </Heading>
          
          <Body className="text-secondary-text text-sm leading-relaxed mb-8 px-4">
            Welcome to Creator+ Membership. Your personalized sequences are active, and the full Sadhana catalog is now completely unlocked.
          </Body>
          
          <PressableAnimated
            haptic="medium"
            className="w-full bg-accent-terracotta py-4 rounded-xl items-center shadow-lg shadow-accent-terracotta/20"
            onPress={() => router.replace('/(tabs)/home')}
          >
            <Text className="text-white font-sans font-bold text-sm">
              Enter the Sanctuary
            </Text>
          </PressableAnimated>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <MandalaThread />

      <ScrollView
        className="flex-1 px-6"
        contentContainerStyle={{
          paddingTop: Math.max(insets.top, 16),
          paddingBottom: Math.max(insets.bottom, 24) + 16,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Close button (Visible immediately) */}
        <View className="w-full flex-row justify-end items-center h-8">
          <PressableAnimated
            onPress={handleSkipToFree}
            haptic="light"
            accessibilityLabel="Close and continue to free version"
            className="w-8 h-8 items-center justify-center rounded-full bg-surface-border/10"
          >
            <X size={18} color={colors.primaryText} />
          </PressableAnimated>
        </View>

        {/* Title block */}
        <View className={`w-full ${isSmallDevice ? 'mt-2 mb-4' : 'mt-4 mb-6'}`}>
          <Heading
            className={`text-on-background font-serif mb-1 ${isSmallDevice ? 'text-2xl' : 'text-3xl'}`}
          >
            {personalizedContent.heading}
          </Heading>
          <Text className="text-accent-terracotta text-[10px] font-sans font-bold mb-3 uppercase tracking-widest">
            Premium Practice Sanctuary
          </Text>
          <Body className="text-secondary-text text-sm leading-relaxed">
            {personalizedContent.body}
          </Body>
        </View>

        {/* Side-by-Side Plan Cards */}
        <View style={styles.plansContainer} className="flex-row">
          {/* Monthly Card */}
          <PressableAnimated
            className={`flex-1 ${isSmallDevice ? 'p-4' : 'p-5'} rounded-2xl border justify-between items-center bg-surface mr-2 ${
              selectedPlan === 'monthly'
                ? 'border-accent-terracotta/40'
                : 'border-surface-border/40'
            }`}
            style={[
              selectedPlan === 'monthly' ? styles.planCardActive : styles.planCardInactive,
            ]}
            onPress={() => handlePlanSelect('monthly')}
            disabled={isPurchasing || isRestoring}
            haptic="light"
            scaleTo={0.97}
            accessibilityLabel="Monthly plan. $14.99 per month."
            accessibilityState={{ selected: selectedPlan === 'monthly' }}
          >
            <View className="items-center mb-4">
              <PlanSelectionIndicator active={selectedPlan === 'monthly'} />
              <Text className="font-sans font-bold text-sm text-primary-text mt-3">Monthly</Text>
              <Caption className="text-center text-[10px] text-secondary-text mt-1">
                Flexible billing
              </Caption>
            </View>
            <View className="items-center">
              <Stat style={{ fontSize: 24 }} className="text-primary-text font-bold">$14.99</Stat>
              <Caption className="text-[10px] text-secondary-text">per month</Caption>
            </View>
          </PressableAnimated>

          {/* Annual Card */}
          <PressableAnimated
            className={`flex-1 ${isSmallDevice ? 'p-4' : 'p-5'} rounded-2xl border-2 justify-between items-center bg-[#FFF8F2] dark:bg-[#1E150F] ml-2 ${
              selectedPlan === 'annual'
                ? 'border-accent-terracotta'
                : 'border-surface-border/40'
            }`}
            style={[
              selectedPlan === 'annual' ? styles.planCardActive : styles.planCardInactive,
            ]}
            onPress={() => handlePlanSelect('annual')}
            disabled={isPurchasing || isRestoring}
            haptic="light"
            scaleTo={0.97}
            accessibilityLabel="Annual plan. $89.99 per year. Save 50%."
            accessibilityState={{ selected: selectedPlan === 'annual' }}
          >
            {/* Save 50% Badge */}
            <View style={styles.badge} className="bg-accent-terracotta border border-white/20 px-2 py-0.5 rounded-full">
              <Micro className="text-white font-bold text-[7px] tracking-wider uppercase">
                Save 50%
              </Micro>
            </View>

            <View className="items-center mb-4">
              <PlanSelectionIndicator active={selectedPlan === 'annual'} />
              <Text className="font-sans font-bold text-sm text-primary-text mt-3">Annual</Text>
              <Caption className="text-center text-[10px] text-secondary-text mt-1">
                Equivalent to $7.50/mo
              </Caption>
            </View>
            <View className="items-center">
              <Stat style={{ fontSize: 24 }} className="text-primary-text font-bold">$89.99</Stat>
              <Caption className="text-[10px] text-secondary-text">per year</Caption>
              <Caption className="text-[9px] text-secondary-text line-through opacity-60 mt-0.5">
                $179.88
              </Caption>
            </View>
          </PressableAnimated>
        </View>

        {/* Feature List (Connected Value Props) */}
        <View
          className={`w-full px-1 ${isSmallDevice ? 'my-4' : 'my-6'}`}
          style={{ gap: 14 }}
        >
          {features.map((feature, idx) => (
            <View key={idx} className="flex-row items-start" style={{ gap: 14 }}>
              <View className="w-5 h-5 rounded-full bg-accent-terracotta/10 items-center justify-center flex-shrink-0 mt-0.5">
                <Check size={11} color={accentColorString} strokeWidth={3} />
              </View>
              <View className="flex-1">
                <Text className="font-sans text-sm font-bold text-primary-text leading-snug">
                  {feature.title}
                </Text>
                <Text className="font-sans text-xs text-secondary-text leading-relaxed mt-0.5">
                  {feature.desc}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Testimonials & Social Proof */}
        <View className="w-full border-t border-b border-surface-border/40 py-5 my-4 items-center">
          <StarRating count={5} />
          <Body
            className="text-primary-text text-center px-4 mt-3"
            style={{ fontFamily: 'CormorantGaramond-Regular', fontStyle: 'italic', fontSize: 18, lineHeight: 26 }}
          >
            "A quiet sanctuary in my pocket.{'\n'}The offline focus mode is truly wonderful."
          </Body>
          <Caption className="text-secondary-text text-center text-[10px] uppercase tracking-[0.15em] mt-3 font-semibold font-sans">
            — Rohan M., Mumbai
          </Caption>
        </View>

        {/* Honest Guarantee */}
        <View className="w-full items-center my-2">
          <Text className="text-[11px] text-secondary-text/80 text-center font-sans max-w-[280px]">
            🛡️ <Text className="font-bold">Honest Practice Guarantee:</Text> Cancel anytime in just 2 taps. No hidden fees.
          </Text>
        </View>

        {/* Checkout Error Feedback */}
        {checkoutError && (
          <View className="w-full mt-2 mb-4 bg-destructive/5 border border-destructive/20 p-3.5 rounded-xl">
            <Text className="text-xs text-destructive text-center font-sans font-medium">
              ⚠️ {checkoutError}
            </Text>
          </View>
        )}

        {/* CTA Block */}
        <View className="w-full items-center mt-4">
          <PressableAnimated
            className="w-full max-w-sm bg-accent-terracotta py-4 rounded-xl items-center mb-3 flex-row justify-center shadow-md shadow-accent-terracotta/10"
            onPress={handleStartTrial}
            disabled={isPurchasing || isRestoring}
            haptic="medium"
            accessibilityLabel="Start 7-day free trial"
          >
            {isPurchasing ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text className="text-white font-sans font-bold text-sm tracking-wide">
                Start 7-Day Free Trial
              </Text>
            )}
          </PressableAnimated>

          <Caption className="text-[11px] text-secondary-text text-center max-w-[280px] mb-4">
            Cancel anytime before Day 7. No payment needed today.
          </Caption>
        </View>

        {/* Footer quiet actions */}
        <View className="w-full flex-row justify-center gap-6 items-center mt-4 opacity-75">
          {user && (
            <PressableAnimated
              onPress={handleRestore}
              disabled={isPurchasing || isRestoring}
              haptic="light"
            >
              {isRestoring ? (
                <ActivityIndicator color={secondaryColorString} size="small" />
              ) : (
                <Text className="text-secondary-text font-sans font-medium text-[10px] underline">
                  Restore Purchase
                </Text>
              )}
            </PressableAnimated>
          )}
          <Text className="text-secondary-text/30 text-xs">|</Text>
          <PressableAnimated
            onPress={() => router.push('/privacy')}
            haptic="light"
          >
            <Text className="text-secondary-text font-sans font-medium text-[10px] underline">
              Terms & Privacy
            </Text>
          </PressableAnimated>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  plansContainer: {
    marginVertical: 12,
  },
  planCardActive: {
    shadowColor: '#C44B22',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  planCardInactive: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 2,
    elevation: 0.5,
  },
  starRow: {
    flexDirection: 'row',
    gap: 3,
  },
  badge: {
    position: 'absolute',
    top: -11,
    right: 12,
    zIndex: 10,
  },
});
