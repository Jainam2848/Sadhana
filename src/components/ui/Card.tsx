import React from 'react';
import { View } from '@/tw';

export type CardVariant = 'standard' | 'lotus' | 'lotus-inverse';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: CardVariant;
}

export function Card({ children, className = '', variant = 'standard' }: CardProps) {
  let radiusClass = 'rounded-2xl';
  if (variant === 'lotus') {
    radiusClass = 'rounded-lotus';
  } else if (variant === 'lotus-inverse') {
    radiusClass = 'rounded-lotus-inverse';
  }

  return (
    <View className={`bg-surface/80 border border-surface-border/50 p-6 ${radiusClass} ${className}`}>
      {children}
    </View>
  );
}
