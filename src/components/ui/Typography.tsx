import React from 'react';
import { TextProps as RNTextProps, TextStyle } from 'react-native';
import { Text } from './Text';

export type TypographyVariant = 'display' | 'heading' | 'subheading' | 'body' | 'caption' | 'micro' | 'stat';

export interface TypographyProps extends RNTextProps {
  variant?: TypographyVariant;
  children: React.ReactNode;
  style?: TextStyle | TextStyle[];
}

const fontSizes: Record<TypographyVariant, number> = {
  display: 36,
  heading: 26,
  subheading: 20,
  body: 16,
  caption: 14,
  micro: 11,
  stat: 48,
};

/**
 * Backward-compatible wrapper component that delegates styling to our strict Text wrapper.
 * Ensures all existing Typography calls respect the typography restraint design tokens.
 */
export function Typography({
  variant = 'body',
  children,
  style,
  ...props
}: TypographyProps) {
  // Map Typography variant to Text variant & weight
  let textVariant: 'display' | 'body' | 'stat' = 'body';
  let weight: 'regular' | 'medium' | 'bold' = 'regular';
  const customStyles: TextStyle = {};

  if (variant === 'display') {
    textVariant = 'display';
    weight = 'regular'; // Editorial regular weight for large displays
  } else if (variant === 'heading') {
    textVariant = 'display';
    weight = 'bold'; // Bold is fine for structural heading weights
    customStyles.fontSize = fontSizes.heading;
  } else if (variant === 'subheading') {
    textVariant = 'display';
    weight = 'regular';
    customStyles.fontSize = fontSizes.subheading;
  } else if (variant === 'body') {
    textVariant = 'body';
    weight = 'regular';
  } else if (variant === 'caption') {
    textVariant = 'body';
    weight = 'regular';
    customStyles.fontSize = fontSizes.caption;
    customStyles.opacity = 0.75;
  } else if (variant === 'micro') {
    textVariant = 'body';
    weight = 'medium';
    customStyles.fontSize = fontSizes.micro;
    customStyles.textTransform = 'uppercase';
    customStyles.letterSpacing = 1.6; // High tracking for resort aesthetic
    customStyles.opacity = 0.6;
  } else if (variant === 'stat') {
    textVariant = 'stat';
    weight = 'regular';
  }

  return (
    <Text
      variant={textVariant}
      weight={weight}
      style={[customStyles, style]}
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
export const Stat = (props: Omit<TypographyProps, 'variant'>) => <Typography variant="stat" {...props} />;
