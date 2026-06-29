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
    <View className="flex-1 items-center justify-center py-16 px-8 bg-transparent">
      {/* Custom Generated Earth Premium Illustration */}
      <View className="w-44 h-44 mb-8 items-center justify-center rounded-full overflow-hidden border border-surface-border/50 bg-surface/40">
        <Image
          source={require('../../../assets/images/empty_state_illustration.png')}
          className="w-full h-full object-cover"
          accessibilityLabel="Quiet meditation space illustration"
        />
      </View>

      {/* Text Context */}
      <Heading className="text-primary-text text-xl font-normal mb-3 text-center">
        {title}
      </Heading>
      <Body className="text-secondary-text text-sm text-center mb-8 max-w-[260px] leading-relaxed opacity-80">
        {description}
      </Body>

      {/* Optional CTA */}
      {ctaText && onCtaPress && (
        <PressableAnimated
          haptic="medium"
          onPress={onCtaPress}
          className="bg-accent-terracotta px-8 py-3.5 rounded-full active:opacity-90 shadow-sm"
        >
          <Body className="text-white font-sans font-medium text-xs tracking-widest uppercase">
            {ctaText}
          </Body>
        </PressableAnimated>
      )}
    </View>
  );
}
