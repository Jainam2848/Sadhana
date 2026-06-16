import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View } from '@/tw';

export interface SafeAreaWrapperProps {
  children: React.ReactNode;
  className?: string;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
}

export function SafeAreaWrapper({
  children,
  className = '',
  edges = ['top', 'bottom'],
}: SafeAreaWrapperProps) {
  const insets = useSafeAreaInsets();

  const style = {
    paddingTop: edges.includes('top') ? insets.top : 0,
    paddingBottom: edges.includes('bottom') ? insets.bottom : 0,
    paddingLeft: edges.includes('left') ? insets.left : 0,
    paddingRight: edges.includes('right') ? insets.right : 0,
  };

  return (
    <View
      style={style}
      className={`flex-1 bg-background ${className}`}
    >
      {children}
    </View>
  );
}
