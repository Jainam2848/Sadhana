import React from 'react';
import { View, Image } from '@/tw';
import { Heading, Body } from './Typography';
import { PressableAnimated } from './PressableAnimated';

export interface EmptyStateProps {
  title: string;
  description: string;
  ctaText?: string;
  onCtaPress?: () => void;
}

export function EmptyState({
  title,
  description,
  ctaText,
  onCtaPress,
}: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center py-12 px-6 bg-transparent">
      {/* Custom Generated Earth Premium Illustration */}
      <View className="w-48 h-48 mb-6 items-center justify-center rounded-2xl overflow-hidden border border-surface-border bg-surface/30">
        <Image
          source={require('../../../assets/images/empty_state_illustration.png')}
          className="w-full h-full object-cover"
          accessibilityLabel="Quiet meditation space illustration"
        />
      </View>

      {/* Text Context */}
      <Heading className="text-primary-text text-lg font-serif mb-2 text-center">
        {title}
      </Heading>
      <Body className="text-secondary-text text-sm text-center mb-6 max-w-[280px] leading-relaxed">
        {description}
      </Body>

      {/* Optional CTA */}
      {ctaText && onCtaPress && (
        <PressableAnimated
          haptic="medium"
          onPress={onCtaPress}
          className="bg-accent-terracotta px-6 py-2.5 rounded-full active:opacity-90 shadow-sm"
        >
          <Body className="text-white font-sans font-bold text-xs">
            {ctaText}
          </Body>
        </PressableAnimated>
      )}
    </View>
  );
}
