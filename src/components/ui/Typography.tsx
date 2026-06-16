import React from 'react';
import { TextProps, TextStyle } from 'react-native';
import { Text } from '@/tw';
import { useSettingsStore } from '@/stores/settingsStore';

export type TypographyVariant = 'display' | 'heading' | 'subheading' | 'body' | 'caption' | 'micro';

export interface TypographyProps extends TextProps {
  variant?: TypographyVariant;
  children: React.ReactNode;
  className?: string;
}

const fontSizes: Record<TypographyVariant, number> = {
  display: 32,
  heading: 24,
  subheading: 18,
  body: 15,
  caption: 13,
  micro: 11,
};

export function Typography({
  variant = 'body',
  children,
  className = '',
  style,
  ...props
}: TypographyProps) {
  const fontSizeScale = useSettingsStore((state) => state.fontSizeScale);
  const baseSize = fontSizes[variant];
  const scaledSize = Math.round(baseSize * fontSizeScale);

  // Map variant to Tailwind CSS class rules
  let fontClasses = '';
  if (variant === 'display') {
    fontClasses = 'font-serif text-primary-text leading-[1.1]';
  } else if (variant === 'heading') {
    fontClasses = 'font-serif text-primary-text leading-[1.2]';
  } else if (variant === 'subheading') {
    fontClasses = 'font-serif text-primary-text leading-[1.3]';
  } else if (variant === 'body') {
    fontClasses = 'font-sans text-primary-text leading-[1.5]';
  } else if (variant === 'caption') {
    fontClasses = 'font-sans text-secondary-text leading-[1.4]';
  } else if (variant === 'micro') {
    fontClasses = 'font-sans text-secondary-text leading-[1.2] uppercase tracking-[0.08em]';
  }

  const textStyle: TextStyle = {
    fontSize: scaledSize,
  };

  return (
    <Text
      className={`${fontClasses} ${className}`}
      style={[textStyle, style]}
      {...props}
    >
      {children}
    </Text>
  );
}

// Named exports for quick developer access
export const Display = (props: Omit<TypographyProps, 'variant'>) => <Typography variant="display" {...props} />;
export const Heading = (props: Omit<TypographyProps, 'variant'>) => <Typography variant="heading" {...props} />;
export const Subheading = (props: Omit<TypographyProps, 'variant'>) => <Typography variant="subheading" {...props} />;
export const Body = (props: Omit<TypographyProps, 'variant'>) => <Typography variant="body" {...props} />;
export const Caption = (props: Omit<TypographyProps, 'variant'>) => <Typography variant="caption" {...props} />;
export const Micro = (props: Omit<TypographyProps, 'variant'>) => <Typography variant="micro" {...props} />;
