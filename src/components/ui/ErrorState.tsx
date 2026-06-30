import React from 'react';
import { View } from '@/tw';
import { Heading, Body } from './Typography';
import { Button } from './Button';
import { AlertCircle } from 'lucide-react-native';
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
      <Heading className="text-primary-text text-lg mb-2 text-center">
        Connection Interrupted
      </Heading>
      <Body className="text-secondary-text text-sm text-center mb-8 max-w-[290px] leading-relaxed">
        {message}
      </Body>

      {/* Retry Action */}
      <Button
        variant="primary"
        title="Retry Connection"
        onPress={onRetry}
      />
    </View>
  );
}
