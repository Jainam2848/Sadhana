import { useCallback } from 'react';
import * as Haptics from 'expo-haptics';

/**
 * Custom hook to trigger the signature Sadhana haptic pattern.
 * Creates a premium two-pulse, breath-paced sensory sequence:
 * - Pulse 1: Light impact
 * - Delay: 400ms (representing breath transition)
 * - Pulse 2: Medium impact (representing settling)
 *
 * Wire this to execute ONLY when a timer or action naturally completes.
 */
export function useSignatureHaptic() {
  const triggerHaptic = useCallback(async () => {
    try {
      // 1. Initial breath-in pulse (Light)
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      
      // 2. Breath pace delay (400ms)
      await new Promise((resolve) => setTimeout(resolve, 400));
      
      // 3. Settling pulse (Medium)
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (error) {
      // Graceful fallback for non-supported devices / web
      console.warn('[Sadhana Haptics] Haptics not supported or failed to trigger:', error);
    }
  }, []);

  return triggerHaptic;
}
