import { create } from 'zustand';
import { persist, createJSONStorage, subscribeWithSelector } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface SettingsState {
  fontSizeScale: number;
  notificationsEnabled: boolean;
  reminderTime: string;
  themeMode: 'light' | 'dark' | 'system';
}

export interface SettingsActions {
  setFontSizeScale: (scale: number) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  setReminderTime: (time: string) => void;
  setThemeMode: (mode: 'light' | 'dark' | 'system') => void;
}

export type SettingsStore = SettingsState & SettingsActions;

export const useSettingsStore = create<SettingsStore>()(
  subscribeWithSelector(
    persist(
      (set) => ({
        fontSizeScale: 1.0,
        notificationsEnabled: false,
        reminderTime: '07:00',
        themeMode: 'system',

        setFontSizeScale: (fontSizeScale) => set({ fontSizeScale }),
        setNotificationsEnabled: (notificationsEnabled) => set({ notificationsEnabled }),
        setReminderTime: (reminderTime) => set({ reminderTime }),
        setThemeMode: (themeMode) => set({ themeMode }),
      }),
      {
        name: 'sadhana-settings-storage',
        storage: createJSONStorage(() => AsyncStorage),
      }
    )
  )
);
