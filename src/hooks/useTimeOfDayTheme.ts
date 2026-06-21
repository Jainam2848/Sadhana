import { useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useThemeStore } from '../stores/themeStore';

/**
 * Custom hook to manage the time-of-day theme state.
 * It computes the active palette on mount and whenever the app returns to the foreground.
 * It also sets up a coarse interval (every 5 minutes) to recalculate the palette,
 * avoiding expensive per-render checks.
 */
export function useTimeOfDayTheme() {
  const updateTimeOfDay = useThemeStore((state) => state.updateTimeOfDay);
  const timeOfDay = useThemeStore((state) => state.timeOfDay);

  useEffect(() => {
    // 1. Initial calculation on mount
    updateTimeOfDay();

    // 2. Set up interval for coarse checks (every 5 minutes / 300,000 ms)
    const intervalId = setInterval(() => {
      updateTimeOfDay();
    }, 5 * 60 * 1000);

    // 3. Listen to AppState changes (to recalculate immediately on foreground transition)
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        updateTimeOfDay();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    // Cleanup listeners and interval
    return () => {
      clearInterval(intervalId);
      subscription.remove();
    };
  }, [updateTimeOfDay]);

  return timeOfDay;
}
