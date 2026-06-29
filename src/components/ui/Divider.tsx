import React from 'react';
import { View } from '@/tw';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '@/hooks/useTheme';

export interface DividerProps {
  variant?: 'solid' | 'carved';
  className?: string;
}

export function Divider({ variant = 'solid', className = '' }: DividerProps) {
  const { colors } = useTheme();

  if (variant === 'carved') {
    return (
      <View className={`flex-row items-center justify-center py-2 ${className}`}>
        <View className="flex-1 h-[0.5px] bg-surface-border/50" />
        <View className="mx-3 opacity-60">
          <Svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <Path
              d="M6 0 L12 6 L6 12 L0 6 Z"
              fill={colors.accent}
              opacity={0.7}
            />
            <Path
              d="M6 3 L9 6 L6 9 L3 6 Z"
              fill="none"
              stroke={colors.background}
              strokeWidth={1}
            />
          </Svg>
        </View>
        <View className="flex-1 h-[0.5px] bg-surface-border/50" />
      </View>
    );
  }

  return <View className={`h-[1px] bg-surface-border/40 ${className}`} />;
}
