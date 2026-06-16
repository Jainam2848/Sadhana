import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView } from '@/tw';
import { useTheme } from '@/hooks/useTheme';
import { useRouter } from 'expo-router';
import { useProfile, useRedeemCoins } from '@/hooks/api';
import { useAuthStore } from '@/stores/authStore';
import { Display, Heading, Subheading, Body, Caption, Micro } from '@/components/ui/Typography';
import { MandalaThread } from '@/components/ui/MandalaThread';
import { ArrowLeft, ChevronLeft, Award, Coins, Heart, Gift, Leaf, Check } from 'lucide-react-native';
import { ActivityIndicator, Modal, StyleSheet, Alert } from 'react-native';
import * as Haptics from 'expo-haptics';

interface RewardOption {
  id: string;
  title: string;
  cost: number;
  description: string;
  type: 'redeem_discount' | 'redeem_donation';
  iconName: 'gift' | 'heart' | 'leaf' | 'coins';
}

const REDEMPTION_OFFERS: RewardOption[] = [
  {
    id: 'script-preservation',
    title: 'Indian Heritage Script Preservation',
    cost: 100,
    description: 'Contribute to the digitization and preservation of ancient palm-leaf yogic manuscripts.',
    type: 'redeem_donation',
    iconName: 'heart',
  },
  {
    id: 'premium-mat-discount',
    title: '20% Off Premium Cork Yoga Mats',
    cost: 50,
    description: 'Get an exclusive discount on sustainable, organic-cotton/cork Sadhana yoga mats.',
    type: 'redeem_discount',
    iconName: 'gift',
  },
  {
    id: 'premium-subscription',
    title: '1 Month Premium Membership',
    cost: 30,
    description: 'Redeem coins to extend your Creator+ Premium subscription access by 30 days.',
    type: 'redeem_discount',
    iconName: 'coins',
  },
  {
    id: 'tree-planting',
    title: 'Plant a Sacred Tree in India',
    cost: 20,
    description: 'Partner with local non-profits to plant and nurture a native tree in Uttrakhand.',
    type: 'redeem_donation',
    iconName: 'leaf',
  },
];

export default function RedemptionScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  const { data: profile } = useProfile(user?.id);
  const redeemCoins = useRedeemCoins();

  const [selectedOffer, setSelectedOffer] = useState<RewardOption | null>(null);
  const [redeemedOfferIds, setRedeemedOfferIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userCoins = profile?.karma_coins || 0;

  const handleSelectOffer = (offer: RewardOption) => {
    if (redeemedOfferIds.includes(offer.id)) return;

    if (userCoins < offer.cost) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert(
        'Insufficient Coins',
        `This reward costs ${offer.cost} Karma Coins. You currently have ${userCoins} coins. Practice daily to earn more!`
      );
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedOffer(offer);
  };

  const handleConfirmRedeem = async () => {
    if (!selectedOffer) return;
    setIsSubmitting(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      await redeemCoins.mutateAsync({
        amount: selectedOffer.cost,
        type: selectedOffer.type,
        description: selectedOffer.title,
      });

      setRedeemedOfferIds((prev) => [...prev, selectedOffer.id]);
      const offerTitle = selectedOffer.title;
      setSelectedOffer(null);

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert(
        'Redeemed Successfully',
        `Thank you! You have successfully redeemed "${offerTitle}".`
      );
    } catch (e: any) {
      console.error(e);
      Alert.alert('Redemption Failed', 'An error occurred during coins redemption. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRewardIcon = (iconName: string, size = 20, color = colors.accent) => {
    switch (iconName) {
      case 'heart':
        return <Heart size={size} color={color} fill={color} />;
      case 'leaf':
        return <Leaf size={size} color={color} fill={color} />;
      case 'coins':
        return <Coins size={size} color={color} fill={color} />;
      default:
        return <Gift size={size} color={color} fill={color} />;
    }
  };

  return (
    <View className="flex-1 bg-background relative justify-between">
      <MandalaThread />

      {/* Header bar */}
      <View className="pt-12 pb-3 px-6 z-40 bg-background/80 flex-row justify-between items-center border-b border-surface-border">
        <Pressable
          className="w-10 h-10 -ml-2 items-center justify-center rounded-full active:bg-surface-border/20"
          onPress={() => router.back()}
        >
          <ChevronLeft size={20} color={colors.primaryText} />
        </Pressable>
        <Heading className="text-on-background text-center flex-1 font-serif">
          Karma Redemption
        </Heading>
        <View className="flex-row items-center gap-1.5 bg-warm-highlight/50 px-3 py-1.5 rounded-full border border-surface-border">
          <Coins size={14} color={colors.accent} fill={colors.accent} />
          <Text className="font-sans font-bold text-xs text-accent-terracotta">{userCoins}</Text>
        </View>
      </View>

      <ScrollView className="flex-grow px-6 pt-6" contentContainerStyle={{ paddingBottom: 60 }}>
        {/* Intro */}
        <View className="mb-6">
          <Body className="text-secondary-text font-sans text-sm">
            Exchange your hard-earned Karma Coins to support cultural preservation, plant sacred groves, or redeem exclusive organic partner offers.
          </Body>
        </View>

        {/* Featured Offer */}
        <View className="mb-6">
          <Micro className="text-secondary-text mb-2">Featured Cause</Micro>
          {REDEMPTION_OFFERS.slice(0, 1).map((offer) => {
            const isRedeemed = redeemedOfferIds.includes(offer.id);
            return (
              <Pressable
                key={offer.id}
                className={`relative w-full bg-highlight-sandstone border border-accent-terracotta/40 rounded-2xl p-5 overflow-hidden active:scale-[0.98] transition-transform ${
                  isRedeemed ? 'opacity-60' : ''
                }`}
                onPress={() => handleSelectOffer(offer)}
              >
                {/* Left accent bar */}
                <View className="absolute left-0 top-0 bottom-0 w-[4px] bg-accent-terracotta" />
                
                <View className="flex-row gap-3 items-start mb-2 pl-2">
                  <View className="w-10 h-10 rounded-full bg-accent-terracotta/10 items-center justify-center">
                    {getRewardIcon(offer.iconName, 18, colors.accent)}
                  </View>
                  <View className="flex-1">
                    <Subheading className="text-primary-text font-bold text-base leading-tight">
                      {offer.title}
                    </Subheading>
                    <Caption className="text-accent-terracotta font-bold mt-0.5">
                      {offer.cost} Karma Coins
                    </Caption>
                  </View>
                </View>

                <Text className="text-sm font-sans text-secondary-text mb-4 pl-2 leading-relaxed">
                  {offer.description}
                </Text>

                <View className="flex-row justify-end">
                  <Pressable
                    className={`px-5 py-2 rounded-full border border-accent-terracotta active:bg-accent-terracotta active:text-white ${
                      isRedeemed ? 'bg-growth/10 border-growth' : 'bg-transparent'
                    }`}
                    onPress={() => handleSelectOffer(offer)}
                  >
                    <Text className={`font-sans font-bold text-xs ${isRedeemed ? 'text-growth-green' : 'text-accent-terracotta'}`}>
                      {isRedeemed ? 'Redeemed' : 'Redeem Offer'}
                    </Text>
                  </Pressable>
                </View>

                {isRedeemed && (
                  <View style={styles.stampOverlay}>
                    <Check size={24} color="#FFFFFF" />
                    <Text className="text-white font-sans font-bold text-[10px] uppercase mt-1">Redeemed</Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>

        {/* Regular offers list */}
        <View className="mb-8">
          <Micro className="text-secondary-text mb-3">Available Partner Offers</Micro>
          <View className="gap-4">
            {REDEMPTION_OFFERS.slice(1).map((offer) => {
              const isRedeemed = redeemedOfferIds.includes(offer.id);
              return (
                <Pressable
                  key={offer.id}
                  className={`bg-surface border border-surface-border p-4 rounded-xl relative overflow-hidden flex-row items-center gap-4 active:bg-surface-border/10 ${
                    isRedeemed ? 'opacity-65' : ''
                  }`}
                  onPress={() => handleSelectOffer(offer)}
                >
                  <View className="w-10 h-10 rounded-full bg-warm-highlight/50 items-center justify-center">
                    {getRewardIcon(offer.iconName, 18, colors.accent)}
                  </View>
                  <View className="flex-1 pr-16">
                    <Text className="font-sans font-bold text-sm text-primary-text leading-tight mb-1">
                      {offer.title}
                    </Text>
                    <Caption className="text-accent-terracotta font-bold">
                      {offer.cost} Coins
                    </Caption>
                  </View>

                  <Pressable
                    className="absolute right-4 py-1.5 px-4 rounded-full border border-accent-terracotta"
                    onPress={() => handleSelectOffer(offer)}
                  >
                    <Text className="text-accent-terracotta font-sans font-bold text-[11px]">
                      Redeem
                    </Text>
                  </Pressable>

                  {isRedeemed && (
                    <View style={styles.stampOverlay}>
                      <Check size={20} color="#FFFFFF" />
                      <Text className="text-white font-sans font-bold text-[9px] uppercase mt-0.5">Redeemed</Text>
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Confirmation Modal Sheet */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={selectedOffer !== null}
        onRequestClose={() => setSelectedOffer(null)}
      >
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalDismiss} onPress={() => setSelectedOffer(null)} />
          <View className="bg-background-bone w-full rounded-t-[24px] p-6 pb-12 border-t border-surface-border max-w-md" style={styles.modalContent}>
            <View className="w-12 h-1 bg-surface-border/40 rounded-full mx-auto mb-6" />
            <Heading className="text-on-surface mb-2 font-serif">Confirm Redemption</Heading>
            
            <Body className="text-secondary-text mb-6">
              Confirm redemption — {selectedOffer?.cost} Karma Coins for {selectedOffer?.title}
            </Body>

            <View className="bg-surface rounded-xl p-4 mb-6 flex-row justify-between items-center border border-surface-border">
              <Text className="font-sans font-medium text-sm text-secondary-text">Remaining Balance</Text>
              <Text className="font-sans font-bold text-base text-accent-terracotta">
                {userCoins} → {userCoins - (selectedOffer?.cost || 0)} coins
              </Text>
            </View>

            <View className="gap-3">
              <Pressable
                className="w-full bg-accent-terracotta py-3 rounded-full items-center justify-center flex-row gap-2 active:opacity-90 shadow"
                disabled={isSubmitting}
                onPress={handleConfirmRedeem}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text className="text-white font-sans font-bold text-sm">Confirm</Text>
                )}
              </Pressable>

              <Pressable
                className="w-full py-3 rounded-full border border-surface-border items-center active:bg-surface-border/20"
                disabled={isSubmitting}
                onPress={() => setSelectedOffer(null)}
              >
                <Text className="text-secondary-text font-sans font-bold text-sm">Cancel</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(28, 20, 9, 0.6)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalDismiss: {
    flex: 1,
    width: '100%',
  },
  modalContent: {
    elevation: 8,
    shadowColor: '#1C1409',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
  },
  stampOverlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(26, 107, 58, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
  },
});
