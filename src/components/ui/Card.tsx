import React from 'react';
import { View } from '@/tw';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <View className={`bg-surface/80 border border-surface-border/50 p-6 rounded-2xl ${className}`}>
      {children}
    </View>
  );
}
