import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme as useDeviceColorScheme } from 'react-native';
import * as AsyncStorage from '@react-native-async-storage/async-storage';

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
}

export interface Theme {
  dark: boolean;
  mode: ThemeMode;
  colors: ThemeColors;
  spacing: {
    base: number;
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  setMode: (mode: ThemeMode) => void;
}

const lightColors: ThemeColors = {
  background: '#FDFAF5',
  surface: '#FFFFFF',
  border: 'rgba(42, 29, 10, 0.08)',
  primaryText: '#1C1409',
  secondaryText: '#6B5A41',
  accent: '#C44B22',
  growth: '#1A6B3A',
  highlight: '#F5E6C8',
  destructive: '#991F1F',
};

const darkColors: ThemeColors = {
  background: '#120F0A',
  surface: '#1C1610',
  border: 'rgba(245, 230, 200, 0.08)',
  primaryText: '#FDFAF5',
  secondaryText: '#A69580',
  accent: '#E06135',
  growth: '#2CA358',
  highlight: '#2C2216',
  destructive: '#E04343',
};

const spacing = {
  base: 4,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

const borderRadius = {
  sm: 8,
  md: 12,
  lg: 20,
  xl: 28,
};

const ThemeContext = createContext<Theme | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const deviceColorScheme = useDeviceColorScheme();
  const [mode, setModeState] = useState<ThemeMode>('system');

  useEffect(() => {
    // Load persisted theme preference
    // We import AsyncStorage dynamically or directly
    const loadTheme = async () => {
      try {
        const savedMode = await AsyncStorage.default.getItem('sadhana-theme-mode');
        if (savedMode) {
          setModeState(savedMode as ThemeMode);
        }
      } catch (e) {
        console.warn('Failed to load theme preference', e);
      }
    };
    loadTheme();
  }, []);

  const setMode = async (newMode: ThemeMode) => {
    setModeState(newMode);
    try {
      await AsyncStorage.default.setItem('sadhana-theme-mode', newMode);
    } catch (e) {
      console.warn('Failed to save theme preference', e);
    }
  };

  const isDark = mode === 'system' ? deviceColorScheme === 'dark' : mode === 'dark';
  const colors = isDark ? darkColors : lightColors;

  const value: Theme = {
    dark: isDark,
    mode,
    colors,
    spacing,
    borderRadius,
    setMode,
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
