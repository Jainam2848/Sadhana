import { create } from 'zustand';

export type TimeOfDay = 'morning' | 'midday' | 'evening';

export interface ThemeState {
  timeOfDay: TimeOfDay;
}

export interface ThemeActions {
  setTimeOfDay: (timeOfDay: TimeOfDay) => void;
  updateTimeOfDay: () => void;
}

export type ThemeStore = ThemeState & ThemeActions;

/**
 * Calculates the active time of day based on the current hour of the device.
 * Morning: 5:00 AM - 11:59 AM
 * Midday: 12:00 PM - 5:59 PM
 * Evening: 6:00 PM - 4:59 AM
 */
export function calculateTimeOfDay(date: Date = new Date()): TimeOfDay {
  const hours = date.getHours();
  if (hours >= 5 && hours < 12) {
    return 'morning';
  }
  if (hours >= 12 && hours < 18) {
    return 'midday';
  }
  return 'evening';
}

export const useThemeStore = create<ThemeStore>((set) => ({
  timeOfDay: calculateTimeOfDay(),

  setTimeOfDay: (timeOfDay) => set({ timeOfDay }),
  
  updateTimeOfDay: () => {
    const nextTimeOfDay = calculateTimeOfDay();
    set((state) => {
      if (state.timeOfDay !== nextTimeOfDay) {
        return { timeOfDay: nextTimeOfDay };
      }
      return {};
    });
  },
}));
