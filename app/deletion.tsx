import React, { useState } from 'react';
import { View, Text, Pressable, TextInput } from '@/tw';
import { useTheme } from '@/hooks/useTheme';
import { useRouter } from 'expo-router';
import { useDeleteAccount } from '@/hooks/api';
import { useAuthStore } from '@/stores/authStore';
import { Heading, Body, Caption, Micro } from '@/components/ui/Typography';
import { MandalaThread } from '@/components/ui/MandalaThread';
import { ChevronLeft, AlertTriangle } from 'lucide-react-native';
import { ActivityIndicator, Alert, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSequence, withTiming } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

export default function DeletionScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const deleteAccount = useDeleteAccount();
  const clearSession = useAuthStore((state) => state.clearSession);

  const [confirmText, setConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Reanimated values for button shake effect
  const shakeOffset = useSharedValue(0);

  const shakeStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: shakeOffset.value }],
    };
  });

  const triggerShake = () => {
    shakeOffset.value = withSequence(
      withTiming(-6, { duration: 50 }),
      withTiming(6, { duration: 50 }),
      withTiming(-6, { duration: 50 }),
      withTiming(6, { duration: 50 }),
      withTiming(0, { duration: 50 })
    );
  };

  const isMatched = confirmText === 'DELETE';

  const handleDeleteAccount = async () => {
    if (!isMatched) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      triggerShake();
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    Alert.alert(
      'Permanent Deletion',
      'This action is irreversible. All of your practice logs, coins, and profile details will be immediately wiped. Confirm deletion?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Permanently Delete',
          style: 'destructive',
          onPress: executeDeletion,
        },
      ]
    );
  };

  const executeDeletion = async () => {
    setIsDeleting(true);
    try {
      await deleteAccount.mutateAsync();
      
      // Wipe auth details
      await clearSession();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      Alert.alert(
        'Account Deleted',
        'Your account has been deleted in compliance with GDPR regulations. Hari Om.',
        [{ text: 'Close', onPress: () => router.replace('/(auth)/welcome') }]
      );
    } catch (e: any) {
      console.error(e);
      Alert.alert('Deletion Failed', 'Failed to delete your account. Please check your network connection.');
      setIsDeleting(false);
    }
  };

  return (
    <View className="flex-1 bg-background relative justify-between px-6">
      <MandalaThread />

      {/* Header bar */}
      <View className="pt-12 pb-3 z-40 bg-background/80 flex-row justify-between items-center w-full">
        <Pressable
          className="w-10 h-10 -ml-2 items-center justify-center rounded-full active:bg-surface-border/20"
          onPress={() => router.back()}
        >
          <ChevronLeft size={20} color={colors.primaryText} />
        </Pressable>
        <Text className="font-sans font-bold text-xs text-secondary-text uppercase tracking-widest text-center flex-1">
          Account Deletion
        </Text>
        <View className="w-10" />
      </View>

      <View className="flex-grow justify-start pt-6 gap-6">
        {/* Warning card */}
        <View className="bg-red-50 border border-red-200/50 rounded-2xl p-5 gap-2">
          <View className="flex-row items-center gap-2">
            <AlertTriangle size={18} color="#991F1F" />
            <Text className="font-sans font-bold text-sm text-[#991F1F]">
              This cannot be undone
            </Text>
          </View>
          <Text className="font-sans text-xs leading-relaxed text-[#991F1F]/80">
            Your sessions, streak history, and Karma Coins will be permanently removed. Subscriptions are not automatically cancelled — manage billing separately.
          </Text>
        </View>

        {/* Input box */}
        <View className="gap-2">
          <Text className="font-sans text-[15px] text-primary-text">
            To confirm, type <Text className="font-bold">DELETE</Text> below:
          </Text>
          <TextInput
            className={`w-full h-12 bg-surface rounded-xl px-4 font-sans text-sm text-primary-text border ${
              isMatched ? 'border-destructive-red' : 'border-surface-border'
            }`}
            placeholder="DELETE"
            placeholderTextColor="#A69580"
            autoCapitalize="characters"
            autoCorrect={false}
            value={confirmText}
            onChangeText={setConfirmText}
          />
        </View>
      </View>

      {/* Action buttons */}
      <View className="gap-4 pb-12 w-full max-w-sm mx-auto items-center">
        <Animated.View style={[{ width: '100%' }, shakeStyle]}>
          <Pressable
            className={`w-full h-12 rounded-full items-center justify-center flex-row gap-2 active:scale-98 ${
              isMatched ? 'bg-destructive-red' : 'bg-destructive-red/35'
            }`}
            disabled={isDeleting}
            onPress={handleDeleteAccount}
          >
            {isDeleting ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text className="text-white font-sans font-bold text-sm">
                Permanently delete my account
              </Text>
            )}
          </Pressable>
        </Animated.View>

        <Pressable className="py-2" onPress={() => router.back()}>
          <Text className="text-secondary-text font-sans font-medium text-sm underline underline-offset-4 decoration-surface-border">
            Take me back
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
