import { useAuthStore } from '@/stores/authStore';
import * as Haptics from 'expo-haptics';

/**
 * Mock Billing Service
 * Simulates subscription logic and updates Zustand authStore.
 * Will be replaced by @revenuecat/purchases-react-native in production.
 */
export const billing = {
  /**
   * Mock purchasing a subscription package
   */
  purchasePlan: async (planId: 'monthly' | 'annual'): Promise<boolean> => {
    // Simulate network transaction delay
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const user = useAuthStore.getState().user;
    if (!user) {
      return false;
    }

    // Update Zustand state
    useAuthStore.getState().setUserPremium(true);

    // Trigger success haptic feedback
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    return true;
  },

  /**
   * Mock restoring purchases
   */
  restorePurchases: async (): Promise<boolean> => {
    // Simulate restore latency
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const user = useAuthStore.getState().user;
    if (!user) {
      return false;
    }

    // Grant premium status
    useAuthStore.getState().setUserPremium(true);

    // Success haptic
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    return true;
  },

  /**
   * Mock fetching active entitlements
   */
  getActiveEntitlements: async (): Promise<string[]> => {
    const user = useAuthStore.getState().user;
    if (user && user.premium) {
      return ['premium'];
    }
    return [];
  },
};
