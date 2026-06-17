// Mock expo-haptics
jest.mock('expo-haptics', () => {
  const mockHaptics = {
    notificationAsync: jest.fn(() => Promise.resolve()),
    impactAsync: jest.fn(() => Promise.resolve()),
    NotificationFeedbackType: {
      Success: 'success',
      Warning: 'warning',
      Error: 'error',
    },
    ImpactFeedbackStyle: {
      Light: 'light',
      Medium: 'medium',
      Heavy: 'heavy',
    },
  };
  return {
    __esModule: true,
    ...mockHaptics,
    default: mockHaptics,
  };
});

// Mock expo-secure-store
jest.mock('expo-secure-store', () => {
  const mockStore = {
    setItemAsync: jest.fn(() => Promise.resolve()),
    getItemAsync: jest.fn(() => Promise.resolve(null)),
    deleteItemAsync: jest.fn(() => Promise.resolve()),
  };
  return {
    __esModule: true,
    ...mockStore,
    default: mockStore,
  };
});

const { billing } = require('../src/services/billing');
const { useAuthStore } = require('../src/stores/authStore');

describe('Billing Service & authStore Subscription Gating', () => {
  beforeEach(async () => {
    // Re-establish mock implementations since resetMocks resets them
    const SecureStore = require('expo-secure-store');
    SecureStore.setItemAsync.mockImplementation(() => Promise.resolve());
    SecureStore.getItemAsync.mockImplementation(() => Promise.resolve(null));
    SecureStore.deleteItemAsync.mockImplementation(() => Promise.resolve());

    const Haptics = require('expo-haptics');
    Haptics.notificationAsync.mockImplementation(() => Promise.resolve());
    Haptics.impactAsync.mockImplementation(() => Promise.resolve());

    // Set up a mock user session in the authStore
    await useAuthStore.getState().setSession(
      {
        id: 'test-user-id',
        email: 'test@sadhana.app',
        name: 'Test Sadhaka',
        premium: false,
        onboardingCompleted: true,
      },
      'mock-jwt-token'
    );
  });

  afterEach(async () => {
    await useAuthStore.getState().clearSession();
  });

  test('should return empty entitlements if user is not premium', async () => {
    const entitlements = await billing.getActiveEntitlements();
    expect(entitlements).toEqual([]);
  });

  test('purchasePlan should simulate network delay and grant premium status', async () => {
    const start = Date.now();
    const success = await billing.purchasePlan('annual');
    const end = Date.now();

    expect(success).toBe(true);
    // Verify delay was simulated
    expect(end - start).toBeGreaterThanOrEqual(1000);

    // Verify Zustand state was updated
    const userState = useAuthStore.getState().user;
    expect(userState?.premium).toBe(true);

    // Verify entitlements are now active
    const entitlements = await billing.getActiveEntitlements();
    expect(entitlements).toEqual(['premium']);
  });

  test('restorePurchases should simulate restore latency and grant premium status', async () => {
    const start = Date.now();
    const success = await billing.restorePurchases();
    const end = Date.now();

    expect(success).toBe(true);
    // Verify delay
    expect(end - start).toBeGreaterThanOrEqual(800);

    // Verify Zustand state
    const userState = useAuthStore.getState().user;
    expect(userState?.premium).toBe(true);

    const entitlements = await billing.getActiveEntitlements();
    expect(entitlements).toEqual(['premium']);
  });

  test('should fail purchase/restore if user is not logged in', async () => {
    // Clear session
    await useAuthStore.getState().clearSession();

    const purchaseSuccess = await billing.purchasePlan('annual');
    expect(purchaseSuccess).toBe(false);

    const restoreSuccess = await billing.restorePurchases();
    expect(restoreSuccess).toBe(false);

    const entitlements = await billing.getActiveEntitlements();
    expect(entitlements).toEqual([]);
  });
});
