import React from 'react';
import { View } from '@/tw';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <View className={`bg-surface border border-surface-border p-6 rounded-2xl shadow-sm ${className}`}>
      {children}
    </View>
  );
}
