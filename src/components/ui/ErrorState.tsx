import React from 'react';
import { View } from '@/tw';
import { Heading, Body } from './Typography';
import { PressableAnimated } from './PressableAnimated';
import { AlertCircle, RefreshCw } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';

export interface ErrorStateProps {
  message?: string;
  onRetry: () => void;
}

export function ErrorState({
  message = "Sadhana is a quiet practice, but it looks like our connection is currently interrupted. Let's try reloading.",
  onRetry,
}: ErrorStateProps) {
  const { colors } = useTheme();

  return (
    <View className="flex-1 items-center justify-center py-12 px-6 bg-transparent">
      {/* Icon Wrapper */}
      <View className="w-16 h-16 rounded-full border border-destructive/20 bg-destructive/10 items-center justify-center mb-6">
        <AlertCircle size={28} color={colors.destructive} />
      </View>

      {/* Headline & Friendly Body Copy */}
      <Heading className="text-primary-text text-lg font-serif mb-2 text-center">
        Connection Interrupted
      </Heading>
      <Body className="text-secondary-text text-sm text-center mb-8 max-w-[290px] leading-relaxed">
        {message}
      </Body>

      {/* Retry Action */}
      <PressableAnimated
        haptic="medium"
        onPress={onRetry}
        className="bg-accent-terracotta px-6 py-3 rounded-full flex-row items-center gap-2 active:opacity-90 shadow-sm"
      >
        <RefreshCw size={14} color="#FFFFFF" />
        <Body className="text-white font-sans font-bold text-xs">
          Retry Connection
        </Body>
      </PressableAnimated>
    </View>
  );
}
