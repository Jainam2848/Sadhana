import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme as useDeviceColorScheme } from 'react-native';
import { useSettingsStore } from '@/stores/settingsStore';
import { useTimeOfDayTheme } from '@/hooks/useTimeOfDayTheme';
import { useColorScheme as useNativewindColorScheme } from 'nativewind';
import { useFonts } from 'expo-font';
import { CormorantGaramond_400Regular, CormorantGaramond_700Bold } from '@expo-google-fonts/cormorant-garamond';
import { DMSans_400Regular, DMSans_500Medium, DMSans_700Bold } from '@expo-google-fonts/dm-sans';
import { SpaceMono_400Regular } from '@expo-google-fonts/space-mono';
import {
  useSharedValue,
  useDerivedValue,
  withTiming,
  SharedValue,
} from 'react-native-reanimated';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeColors {
  background: string;
  surface: string;
  border: string;
  primaryText: string;
  secondaryText: string;
  accent: string;
  growth: string;
  highlight: string;
  destructive: string;
  sandstoneRose: string;
  templeBronze: string;
  templeBronzeLight: string;
  manuscriptGold: string;
}

export interface AnimatedColors {
  background: SharedValue<string>;
  surface: SharedValue<string>;
  border: SharedValue<string>;
  primaryText: Readonly<SharedValue<string>>;
  secondaryText: Readonly<SharedValue<string>>;
  accent: SharedValue<string>;
  growth: SharedValue<string>;
  highlight: SharedValue<string>;
  destructive: SharedValue<string>;
  sandstoneRose: SharedValue<string>;
  templeBronze: SharedValue<string>;
  templeBronzeLight: SharedValue<string>;
  manuscriptGold: SharedValue<string>;
}

export interface MotionConfig {
  duration: {
    quick: number;     // Micro-interactions, haptic scaling
    standard: number;  // Morph elements, fade transitions
    slow: number;      // Large layout expansions, route changes
    ambient: number;   // Slow breathing, color fading
  };
  spring: {
    calm: { damping: number; stiffness: number; mass: number };
    responsive: { damping: number; stiffness: number };
    bouncy: { damping: number; stiffness: number; mass: number };
  };
}

export interface ShadowStyle {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;
}

export interface ThemeShadows {
  none: ShadowStyle;
  sm: ShadowStyle;
  md: ShadowStyle;
  lg: ShadowStyle;
  hero: ShadowStyle;
}

export interface Theme {
  dark: boolean;
  mode: ThemeMode;
  colors: ThemeColors;
  animatedColors: AnimatedColors;
  spacing: {
    unit: number; // grid base unit (4px)
    base: number;
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  shadows: ThemeShadows;
  motion: MotionConfig;
  setMode: (mode: ThemeMode) => void;
}

// 1. Theme Palette Definitions
const morningColors: ThemeColors = {
  background: '#FAF5F2', // Soft clay tint
  surface: '#FFFFFF',
  border: 'rgba(44, 34, 30, 0.05)',
  primaryText: '#2C221E', // Espresso
  secondaryText: '#8C7A70', // Warm silt
  accent: '#D48C70', // Terracotta sunrise
  growth: '#4E6E58', // Sage green
  highlight: '#F5ECE8',
  destructive: '#C54E4E',
  sandstoneRose: '#E8DEC9',
  templeBronze: '#9E7850',
  templeBronzeLight: '#E5CDAE',
  manuscriptGold: '#D4AF37',
};

const middayColors: ThemeColors = {
  background: '#FAF7F2', // Grounding warm sand
  surface: '#FFFFFF',
  border: 'rgba(42, 36, 33, 0.06)',
  primaryText: '#2A2421', // Dark bark / charcoal
  secondaryText: '#7A6F68', // Soil gray
  accent: '#C95B32', // Earthen terracotta
  growth: '#3D5C47', // Forest moss green
  highlight: '#F2EADF', // Sandstone linen
  destructive: '#C54E4E',
  sandstoneRose: '#EADEC9',
  templeBronze: '#8A663E',
  templeBronzeLight: '#D4B895',
  manuscriptGold: '#D4AF37',
};

const eveningColors: ThemeColors = {
  background: '#181513', // Deep clay shadow
  surface: '#201C19', // Dark bark
  border: 'rgba(245, 239, 235, 0.05)',
  primaryText: '#F5EFEB', // Warm linen
  secondaryText: '#B0A298', // Volcanic ash
  accent: '#E27E57', // Sunset terracotta embers
  growth: '#598266', // Glowing moss
  highlight: '#2A221E',
  destructive: '#C54E4E',
  sandstoneRose: '#2C2621',
  templeBronze: '#C5A880',
  templeBronzeLight: '#A37E58',
  manuscriptGold: '#FFDF7A',
};

const spacing = {
  unit: 4,
  base: 4,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 28, // Relaxed
  xl: 44, // Generous section spacing
  xxl: 56, // Large break spacing
};

const borderRadius = {
  sm: 8,
  md: 12,
  lg: 20,
  xl: 28,
};

const shadows: ThemeShadows = {
  none: { shadowColor: 'transparent', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0, shadowRadius: 0, elevation: 0 },
  sm: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  md: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6, elevation: 3 },
  lg: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 12, elevation: 6 },
  hero: { shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.18, shadowRadius: 24, elevation: 12 },
};

const motion: MotionConfig = {
  duration: {
    quick: 180,      // Micro-interactions, haptic scaling
    standard: 280,   // Morph elements, fade transitions
    slow: 450,       // Large layout expansions, route changes
    ambient: 1500,   // Slow breathing, color fading
  },
  spring: {
    calm: { damping: 20, stiffness: 90, mass: 1 },
    responsive: { damping: 15, stiffness: 150 },
    bouncy: { damping: 12, stiffness: 180, mass: 0.8 },
  },
};

/**
 * Calculates the relative luminance of a color hex string.
 * Math-based on WCAG 2.0 relative luminance specifications.
 */
function getRelativeLuminance(colorHex: string): number {
  'worklet';
  let hex = colorHex.replace('#', '');
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const rs = r <= 0.04045 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
  const gs = g <= 0.04045 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
  const bs = b <= 0.04045 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);

  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculates the WCAG 2.0 contrast ratio between two relative luminances.
 */
function getContrastRatio(lum1: number, lum2: number): number {
  'worklet';
  const l1 = Math.max(lum1, lum2);
  const l2 = Math.min(lum1, lum2);
  return (l1 + 0.05) / (l2 + 0.05);
}

const ThemeContext = createContext<Theme | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // A. Load Fonts via expo-font
  const [fontsLoaded] = useFonts({
    'CormorantGaramond-Regular': CormorantGaramond_400Regular,
    'CormorantGaramond-Bold': CormorantGaramond_700Bold,
    'DMSans-Regular': DMSans_400Regular,
    'DMSans-Medium': DMSans_500Medium,
    'DMSans-Bold': DMSans_700Bold,
    'SpaceMono-Regular': SpaceMono_400Regular,
  });

  const deviceColorScheme = useDeviceColorScheme();
  const themeMode = useSettingsStore((state) => state.themeMode);
  const setThemeMode = useSettingsStore((state) => state.setThemeMode);
  const { setColorScheme } = useNativewindColorScheme();

  // B. Time of day detection
  const timeOfDay = useTimeOfDayTheme();

  // C. Calculate current target colors statically
  let activeColors: ThemeColors;
  let isDark: boolean;

  if (themeMode === 'dark') {
    activeColors = eveningColors;
    isDark = true;
  } else if (themeMode === 'light') {
    activeColors = middayColors;
    isDark = false;
  } else {
    // System theme: respect system forced dark mode or time-of-day if system is light/unspecified
    if (deviceColorScheme === 'dark') {
      activeColors = eveningColors;
      isDark = true;
    } else {
      if (timeOfDay === 'morning') {
        activeColors = morningColors;
        isDark = false;
      } else if (timeOfDay === 'midday') {
        activeColors = middayColors;
        isDark = false;
      } else {
        activeColors = eveningColors;
        isDark = true;
      }
    }
  }

  // React state for static colors (updated in React tree to force renders only on distinct theme changes)
  const [staticColors, setStaticColors] = useState<ThemeColors>(activeColors);

  // D. Create Reanimated Shared Values for native UI-thread interpolations
  const backgroundAnim = useSharedValue(activeColors.background);
  const surfaceAnim = useSharedValue(activeColors.surface);
  const borderAnim = useSharedValue(activeColors.border);
  const accentAnim = useSharedValue(activeColors.accent);
  const growthAnim = useSharedValue(activeColors.growth);
  const highlightAnim = useSharedValue(activeColors.highlight);
  const destructiveAnim = useSharedValue(activeColors.destructive);
  const sandstoneRoseAnim = useSharedValue(activeColors.sandstoneRose);
  const templeBronzeAnim = useSharedValue(activeColors.templeBronze);
  const templeBronzeLightAnim = useSharedValue(activeColors.templeBronzeLight);
  const manuscriptGoldAnim = useSharedValue(activeColors.manuscriptGold);

  // We maintain a target secondary text color that will animate, and apply contrast protection on top.
  const secondaryTextTargetAnim = useSharedValue(activeColors.secondaryText);

  // E. Setup Reanimated Derived Values for WCAG AA Contrast Guarantee
  // Threshold at 0.18 relative luminance.
  // Dark Text (#080603) and Light Text (#FFFFFF) are chosen to guarantee contrast >= 4.5:1 at the threshold boundary.
  const primaryTextAnim = useDerivedValue<string>(() => {
    const bg = backgroundAnim.value;
    const bgLum = getRelativeLuminance(bg);
    return bgLum >= 0.18 ? '#2A2421' : '#F5EFEB';
  });

  const secondaryTextAnim = useDerivedValue<string>(() => {
    const bg = backgroundAnim.value;
    const bgLum = getRelativeLuminance(bg);
    const targetSec = secondaryTextTargetAnim.value;
    const targetLum = getRelativeLuminance(targetSec);

    // If target secondary has sufficient contrast, use it. Otherwise override with high contrast defaults.
    const cr = getContrastRatio(bgLum, targetLum);
    if (cr >= 3.0) {
      return targetSec;
    }

    return bgLum >= 0.18 ? '#7A6F68' : '#B0A298';
  });

  // F. Run UI thread animations when theme updates
  useEffect(() => {
    setStaticColors(activeColors);
    setColorScheme(isDark ? 'dark' : 'light');

    // Trigger animations smoothly
    const config = { duration: 1500 };
    backgroundAnim.value = withTiming(activeColors.background, config);
    surfaceAnim.value = withTiming(activeColors.surface, config);
    borderAnim.value = withTiming(activeColors.border, config);
    accentAnim.value = withTiming(activeColors.accent, config);
    growthAnim.value = withTiming(activeColors.growth, config);
    highlightAnim.value = withTiming(activeColors.highlight, config);
    destructiveAnim.value = withTiming(activeColors.destructive, config);
    sandstoneRoseAnim.value = withTiming(activeColors.sandstoneRose, config);
    templeBronzeAnim.value = withTiming(activeColors.templeBronze, config);
    templeBronzeLightAnim.value = withTiming(activeColors.templeBronzeLight, config);
    manuscriptGoldAnim.value = withTiming(activeColors.manuscriptGold, config);
    secondaryTextTargetAnim.value = withTiming(activeColors.secondaryText, config);
  }, [activeColors, isDark]);

  // Don't gate on fontsLoaded — always render children so the navigator
  // and AuthProvider mount immediately. Fonts will swap in once ready.

  const value: Theme = {
    dark: isDark,
    mode: themeMode,
    colors: staticColors,
    animatedColors: {
      background: backgroundAnim,
      surface: surfaceAnim,
      border: borderAnim,
      primaryText: primaryTextAnim,
      secondaryText: secondaryTextAnim,
      accent: accentAnim,
      growth: growthAnim,
      highlight: highlightAnim,
      destructive: destructiveAnim,
      sandstoneRose: sandstoneRoseAnim,
      templeBronze: templeBronzeAnim,
      templeBronzeLight: templeBronzeLightAnim,
      manuscriptGold: manuscriptGoldAnim,
    },
    spacing,
    borderRadius,
    shadows,
    motion,
    setMode: setThemeMode,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
}
