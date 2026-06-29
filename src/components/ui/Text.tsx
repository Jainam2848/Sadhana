import React from 'react';
import { Text as CSSText } from '@/tw';
import { TextProps as RNTextProps, TextStyle, StyleSheet } from 'react-native';
import { useSettingsStore } from '@/stores/settingsStore';

export type TextVariant = 'display' | 'body' | 'stat';

export interface TextProps extends RNTextProps {
  variant?: TextVariant;
  children: React.ReactNode;
  weight?: 'regular' | 'medium' | 'bold';
}

const fontSizes: Record<TextVariant, number> = {
  display: 36,
  body: 16,
  stat: 48,
};

const fontFamilies = {
  display: {
    regular: 'CormorantGaramond-Regular',
    medium: 'CormorantGaramond-Regular', // Fallback
    bold: 'CormorantGaramond-Bold',
  },
  body: {
    regular: 'DMSans-Regular',
    medium: 'DMSans-Medium',
    bold: 'DMSans-Bold',
  },
  stat: {
    regular: 'SpaceMono-Regular',
    medium: 'SpaceMono-Regular',
    bold: 'SpaceMono-Regular',
  },
};

/**
 * Premium typography wrapper for the Sadhana meditation app.
 * Strictly enforces design guidelines:
 * - 'display' (Cormorant Garamond) is reserved strictly for main session titles.
 * - 'body' (DM Sans) is for all standard UI and copy.
 * - 'stat' (Space Mono) is tabular-spaced for timers, streaks, and numbers.
 *
 * Dev-only check: Throws warning if 'display' is rendered inside layout/navigation/control wrappers.
 */
export function Text({
  variant = 'body',
  weight = 'regular',
  style,
  children,
  ...props
}: TextProps) {
  const fontSizeScale = useSettingsStore((state) => state.fontSizeScale || 1.0);

  // Development check for structural / navigational usage of display text
  if (__DEV__ && variant === 'display') {
    const stack = new Error().stack;
    if (stack) {
      const forbiddenPatterns = [
        /Layout/i,
        /Navigator/i,
        /Screen/i,
        /Tab/i,
        /Button/i,
        /Card/i,
        /Header/i,
        /Pressable/i,
        /Touch/i,
        /Link/i,
        /List/i,
        /Menu/i,
      ];
      
      const lines = stack.split('\n');
      for (const line of lines) {
        // Skip current component and node_modules references
        if (
          line.includes('Text.tsx') ||
          line.includes('Typography.tsx') ||
          line.includes('node_modules')
        ) {
          continue;
        }

        for (const pattern of forbiddenPatterns) {
          if (pattern.test(line)) {
            console.warn(
              `[Sadhana Typography warning]: variant="display" used in a navigational, structural, or control context (${line.trim()}).\n` +
              `Display variant (Cormorant Garamond) is reserved strictly for main session titles.`
            );
            break;
          }
        }
      }
    }
  }

  const baseSize = fontSizes[variant];
  const scaledSize = Math.round(baseSize * fontSizeScale);
  const fontFamily = fontFamilies[variant][weight];

  const letterSpacing = variant === 'display' ? -scaledSize * 0.02 : undefined;
  const lineHeight = variant === 'display' ? Math.round(scaledSize * 1.15) : Math.round(scaledSize * 1.5);

  const combinedStyle = StyleSheet.flatten([
    {
      fontFamily,
      fontSize: scaledSize,
      letterSpacing,
      lineHeight,
    },
    style,
  ]);

  return (
    <CSSText style={combinedStyle} {...props}>
      {children}
    </CSSText>
  );
}
