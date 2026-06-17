import React from 'react';
import { View, Text, ScrollView } from '@/tw';
import { useTheme } from '@/hooks/useTheme';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';
import { useProfile } from '@/hooks/api';
import { Heading, Micro } from '@/components/ui/Typography';
import { MandalaThread } from '@/components/ui/MandalaThread';
import { ChevronLeft, ChevronRight, User, Settings, Info, LogOut, Shield } from 'lucide-react-native';
import { Alert } from 'react-native';
import * as Haptics from 'expo-haptics';
import { PressableAnimated } from '@/components/ui/PressableAnimated';

export default function SettingsScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const clearSession = useAuthStore((state) => state.clearSession);

  // Load user profile to display current details
  const { data: profile } = useProfile(user?.id);

  const handleLogout = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out of Sadhana?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            await clearSession();
            router.replace('/(auth)/welcome');
          },
        },
      ]
    );
  };

  const handleHelpCenter = () => {
    Alert.alert('Help Center', 'For support or questions, contact us at support@sadhana.app');
  };

  return (
    <View className="flex-1 bg-background relative">
      <MandalaThread />

      {/* Header Bar */}
      <View className="pt-12 pb-3 px-6 z-40 bg-background/80 flex-row justify-between items-center border-b border-surface-border">
        <PressableAnimated
          className="w-10 h-10 -ml-2 items-center justify-center rounded-full active:bg-surface-border/20"
          onPress={() => router.back()}
          haptic="light"
          accessibilityLabel="Go back"
        >
          <ChevronLeft size={20} color={colors.primaryText} />
        </PressableAnimated>
        <Heading className="text-on-background text-center flex-1 font-serif">
          Settings
        </Heading>
        <View className="w-10" />
      </View>

      <ScrollView className="flex-1 px-6 pt-6" contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Account Details Section */}
        <View className="mb-6">
          <Micro className="text-secondary-text mb-3">Account Details</Micro>
          <View className="bg-surface rounded-xl border border-surface-border overflow-hidden">
            <View className="flex-row justify-between items-center p-4 border-b border-surface-border/50">
              <View className="flex-row items-center gap-3">
                <User size={18} color={colors.secondaryText} />
                <Text className="font-sans font-medium text-sm text-secondary-text">Name</Text>
              </View>
              <Text className="font-sans font-bold text-sm text-primary-text">
                {profile?.username || user?.name || 'Asha Devi'}
              </Text>
            </View>

            <View className="flex-row justify-between items-center p-4">
              <View className="flex-row items-center gap-3">
                <Info size={18} color={colors.secondaryText} />
                <Text className="font-sans font-medium text-sm text-secondary-text">Email</Text>
              </View>
              <Text className="font-sans font-bold text-sm text-primary-text">
                {user?.email || 'asha.devi@example.com'}
              </Text>
            </View>
          </View>
        </View>

        {/* App Settings Section */}
        <View className="mb-6">
          <Micro className="text-secondary-text mb-3">App Settings</Micro>
          <View className="bg-surface rounded-xl border border-surface-border overflow-hidden">
            <PressableAnimated
              className="flex-row justify-between items-center p-4 border-b border-surface-border/50 active:bg-surface-border/10"
              onPress={() => router.push('/preferences')}
              haptic="light"
              accessibilityLabel="Open preferences screen"
            >
              <View className="flex-row items-center gap-3">
                <Settings size={18} color={colors.secondaryText} />
                <Text className="font-sans font-medium text-sm text-secondary-text">Preferences</Text>
              </View>
              <ChevronRight size={16} color={colors.secondaryText} />
            </PressableAnimated>

            <PressableAnimated
              className="flex-row justify-between items-center p-4 active:bg-surface-border/10"
              onPress={() => router.push('/privacy')}
              haptic="light"
              accessibilityLabel="Open GDPR and Privacy screen"
            >
              <View className="flex-row items-center gap-3">
                <Shield size={18} color={colors.secondaryText} />
                <Text className="font-sans font-medium text-sm text-secondary-text">GDPR & Privacy</Text>
              </View>
              <ChevronRight size={16} color={colors.secondaryText} />
            </PressableAnimated>
          </View>
        </View>

        {/* Support & Legal Section */}
        <View className="mb-8">
          <Micro className="text-secondary-text mb-3">Support & Legal</Micro>
          <View className="bg-surface rounded-xl border border-surface-border overflow-hidden">
            <PressableAnimated
              className="flex-row justify-between items-center p-4 border-b border-surface-border/50 active:bg-surface-border/10"
              onPress={handleHelpCenter}
              haptic="light"
              accessibilityLabel="Open help center"
            >
              <Text className="font-sans font-medium text-sm text-secondary-text">Help Center</Text>
              <ChevronRight size={16} color={colors.secondaryText} />
            </PressableAnimated>

            <PressableAnimated
              className="flex-row justify-between items-center p-4 active:bg-surface-border/10"
              onPress={() => router.push('/privacy')}
              haptic="light"
              accessibilityLabel="Open privacy policy screen"
            >
              <Text className="font-sans font-medium text-sm text-secondary-text">Privacy Policy</Text>
              <ChevronRight size={16} color={colors.secondaryText} />
            </PressableAnimated>
          </View>
        </View>

        {/* Logout CTA */}
        <PressableAnimated
          className="w-full bg-surface border border-surface-border rounded-xl p-4 flex-row items-center justify-between active:bg-surface-border/10"
          onPress={handleLogout}
          haptic="warning"
          accessibilityLabel="Sign out of account"
        >
          <Text className="font-sans font-bold text-sm text-destructive-red">Sign Out</Text>
          <LogOut size={18} color="#991F1F" />
        </PressableAnimated>
      </ScrollView>
    </View>
  );
}
