import React from 'react';
import { View } from '@/tw';

export function MandalaThread() {
  return (
    <View
      pointerEvents="none"
      className="absolute -top-12 -right-12 w-48 h-48 rounded-full border-[0.5px] border-accent-terracotta/20 z-0"
    />
  );
}
