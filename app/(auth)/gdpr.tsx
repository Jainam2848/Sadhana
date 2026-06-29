import React, { useState } from 'react';
import { router } from 'expo-router';
import { View, Text } from '@/tw';
import { useTheme } from '@/hooks/useTheme';
import { Body, Caption, Display } from '@/components/ui/Typography';
import { Switch, useWindowDimensions } from 'react-native';
import { PressableAnimated } from '@/components/ui/PressableAnimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MandalaThread } from '@/components/ui/MandalaThread';
import { Shield } from 'lucide-react-native';

export default function GDPRScreen() {
  const { colors } = useTheme();
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const isSmallDevice = height < 750;

  const handleAgreeAll = () => {
    // Save consent (both essential and performance analytics)
    router.push('/(auth)/priming');
  };

  const handleSaveOptions = () => {
    // Save only options currently toggled
    router.push('/(auth)/priming');
  };

  const borderColorString = typeof colors.border === 'string' ? colors.border : '#2a1f16';
  const growthColorString = typeof colors.growth === 'string' ? colors.growth : '#4CAF50';

  return (
    <View className="flex-1 bg-background">
      <MandalaThread />

      <View
        className="flex-1 px-8 justify-between"
        style={{
          paddingTop: Math.max(insets.top + 20, 40),
          paddingBottom: Math.max(insets.bottom + 20, 40),
        }}
      >
        {/* Top Header Label */}
        <View className="items-center mb-6">
          <Text className="text-accent-terracotta tracking-widest text-xs uppercase font-medium">
            Sadhana
          </Text>
        </View>

        {/* Center Content */}
        <View className="flex-1 justify-center my-auto">
          {/* Icon */}
          <View className="w-12 h-12 rounded-full items-center justify-center bg-accent-terracotta/10 mb-6">
            <Shield size={22} color="#C44B22" />
          </View>

          {/* Title */}
          <Display className="text-primary-text leading-tight mb-2">
            A Covenant of Space
          </Display>
          {/* Easy-to-understand subtitle to satisfy user's feedback */}
          <Text className="text-secondary-text text-sm font-sans font-medium mb-6">
            Our Commitment to Your Privacy (Data Policy)
          </Text>

          {/* Body statement */}
          <Body className="text-secondary-text text-base leading-relaxed mb-8">
            In our tradition, practice is private. We hold your metrics locally, encrypt your reflections, and sell nothing. Ever.
          </Body>

          {/* Divider */}
          <View className="h-[1px] bg-surface-border/20 w-full mb-8" />

          {/* Transparent full-bleed consent rows */}
          <View className="gap-6">
            {/* Required Row */}
            <View className="flex-row justify-between items-center py-1">
              <View className="flex-1 pr-6">
                <Text className="font-sans font-bold text-sm text-primary-text">
                  Essential practice functions
                </Text>
                <Caption className="text-xs text-secondary-text mt-0.5">
                  Secures your local session files and syncs configuration.
                </Caption>
              </View>
              <Switch
                value={true}
                disabled={true}
                trackColor={{ false: borderColorString, true: growthColorString }}
                accessibilityLabel="Essential functions (Required)"
              />
            </View>

            {/* Analytics Row */}
            <View className="flex-row justify-between items-center py-1">
              <View className="flex-1 pr-6">
                <Text className="font-sans font-bold text-sm text-primary-text">
                  Performance analytics
                </Text>
                <Caption className="text-xs text-secondary-text mt-0.5">
                  Helps us refine timing, transitions, and daily wisdom delivery.
                </Caption>
              </View>
              <Switch
                value={analyticsEnabled}
                onValueChange={setAnalyticsEnabled}
                trackColor={{ false: borderColorString, true: '#C44B22' }}
                thumbColor="#FFFFFF"
                accessibilityLabel="Performance Analytics Consent Toggle"
              />
            </View>
          </View>
        </View>

        {/* Buttons footer */}
        <View className="gap-4 mt-6">
          <PressableAnimated
            className="w-full bg-accent-terracotta py-4 rounded-full items-center active:opacity-90"
            onPress={handleAgreeAll}
            haptic="medium"
            accessibilityLabel="Agree to all data policies"
          >
            <Text className="text-white font-sans font-bold text-sm">
              Agree and Continue
            </Text>
          </PressableAnimated>

          <PressableAnimated
            className="w-full py-2 items-center active:opacity-70"
            onPress={handleSaveOptions}
            haptic="light"
            accessibilityLabel="Save selected preferences"
          >
            <Text className="text-secondary-text font-sans font-medium text-sm underline underline-offset-4 decoration-surface-border">
              Save selected preferences
            </Text>
          </PressableAnimated>
        </View>
      </View>
    </View>
  );
}
