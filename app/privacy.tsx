import React, { useState } from 'react';
import { View, Text, ScrollView } from '@/tw';
import { useTheme } from '@/hooks/useTheme';
import { useRouter } from 'expo-router';
import { Heading, Body, Caption, Micro } from '@/components/ui/Typography';
import { MandalaThread } from '@/components/ui/MandalaThread';
import { ChevronLeft, ChevronRight, Download, Trash2 } from 'lucide-react-native';
import { Switch, Alert } from 'react-native';
import * as Haptics from 'expo-haptics';
import { PressableAnimated } from '@/components/ui/PressableAnimated';

export default function PrivacyScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  const [analyticsConsent, setAnalyticsConsent] = useState(true);
  const [personalizationConsent, setPersonalizationConsent] = useState(true);

  const handleDownloadData = () => {
    Alert.alert(
      'Export Requested',
      'We are compiling your Sadhana activity logs and profile data. You will receive a secure download link at your registered email address within 24–48 hours.',
      [{ text: 'Understood' }]
    );
  };

  const handleDeleteAccountNav = () => {
    router.push('/deletion');
  };

  const borderColorString = typeof colors.border === 'string' ? colors.border : '#2a1f16';
  const growthColorString = typeof colors.growth === 'string' ? colors.growth : '#4CAF50';

  return (
    <View className="flex-1 bg-background relative justify-between">
      <MandalaThread />

      {/* Header bar */}
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
          Your Data
        </Heading>
        <View className="w-10" />
      </View>

      <ScrollView className="flex-1 px-6 pt-6" contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Intro Info */}
        <View className="mb-6">
          <Body className="text-secondary-text font-sans text-[15px] leading-relaxed">
            Sadhana never sells your user data. We respect your privacy as a sacred trust, focusing entirely on providing you a secure space for your practice.
          </Body>
        </View>

        {/* Toggles Card */}
        <View className="bg-surface rounded-xl border border-surface-border overflow-hidden mb-8">
          {/* Essential Cookies */}
          <View className="flex-row justify-between items-center p-4 border-b border-surface-border/50">
            <View className="flex-1 pr-4">
              <Text className="font-sans font-bold text-sm text-primary-text">Essential Cookies</Text>
              <Caption className="text-secondary-text mt-0.5">Required for secure authentication and token storage.</Caption>
            </View>
            <Switch
              value={true}
              disabled={true}
              trackColor={{ false: borderColorString, true: borderColorString }}
              thumbColor="#FFFFFF"
              accessibilityLabel="Essential Cookies (Required)"
            />
          </View>

          {/* Analytics Consent */}
          <View className="flex-row justify-between items-center p-4 border-b border-surface-border/50">
            <View className="flex-1 pr-4">
              <Text className="font-sans font-bold text-sm text-primary-text">Analytics & Improvement</Text>
              <Caption className="text-secondary-text mt-0.5">Help us optimize video playback streams and offline caching.</Caption>
            </View>
            <Switch
              value={analyticsConsent}
              onValueChange={(val) => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setAnalyticsConsent(val);
              }}
              trackColor={{ false: borderColorString, true: growthColorString }}
              thumbColor="#FFFFFF"
              accessibilityLabel="Analytics & Improvement Consent"
            />
          </View>

          {/* Personalization Consent */}
          <View className="flex-row justify-between items-center p-4">
            <View className="flex-1 pr-4">
              <Text className="font-sans font-bold text-sm text-primary-text">Personalisation Data</Text>
              <Caption className="text-secondary-text mt-0.5">Analyze your goals to compile the daily custom schedule.</Caption>
            </View>
            <Switch
              value={personalizationConsent}
              onValueChange={(val) => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setPersonalizationConsent(val);
              }}
              trackColor={{ false: borderColorString, true: growthColorString }}
              thumbColor="#FFFFFF"
              accessibilityLabel="Personalization Data Consent"
            />
          </View>
        </View>

        {/* Action Buttons */}
        <View className="gap-3">
          {/* Export Data */}
          <PressableAnimated
            className="bg-surface border border-surface-border p-4 rounded-xl flex-row items-center justify-between active:bg-surface-border/10"
            onPress={handleDownloadData}
            haptic="medium"
            accessibilityLabel="Download my data"
          >
            <View className="flex-row items-center gap-3">
              <Download size={18} color={colors.growth} />
              <Text className="font-sans font-bold text-sm text-growth-green">Download My Data</Text>
            </View>
            <ChevronRight size={16} color={colors.growth} />
          </PressableAnimated>

          {/* Delete Account */}
          <PressableAnimated
            className="bg-surface border border-surface-border p-4 rounded-xl flex-row items-center justify-between active:bg-destructive/10"
            onPress={handleDeleteAccountNav}
            haptic="warning"
            accessibilityLabel="Delete my account"
          >
            <View className="flex-row items-center gap-3">
              <Trash2 size={18} color="#991F1F" />
              <Text className="font-sans font-bold text-sm text-destructive">Delete My Account</Text>
            </View>
            <ChevronRight size={16} color="#991F1F" />
          </PressableAnimated>
        </View>
      </ScrollView>

      {/* GDPR note in footer */}
      <View className="p-6 items-center">
        <Caption className="text-center text-xs text-secondary-text max-w-[280px]">
          Data export requests are processed in compliance with GDPR Art. 15. All requests will be delivered to your registered email.
        </Caption>
      </View>
    </View>
  );
}
