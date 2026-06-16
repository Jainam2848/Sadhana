import { useSettingsStore } from '../src/stores/settingsStore';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
}));

describe('SettingsStore Unit Tests', () => {
  beforeEach(() => {
    // Reset store to default state
    useSettingsStore.setState({
      fontSizeScale: 1.0,
      notificationsEnabled: false,
      reminderTime: '07:00',
      themeMode: 'system',
    });
  });

  test('should initialize with default values', () => {
    const state = useSettingsStore.getState();
    expect(state.fontSizeScale).toBe(1.0);
    expect(state.notificationsEnabled).toBe(false);
    expect(state.reminderTime).toBe('07:00');
    expect(state.themeMode).toBe('system');
  });

  test('should set font size scale', () => {
    useSettingsStore.getState().setFontSizeScale(1.5);
    expect(useSettingsStore.getState().fontSizeScale).toBe(1.5);
  });

  test('should toggle notifications enabled', () => {
    useSettingsStore.getState().setNotificationsEnabled(true);
    expect(useSettingsStore.getState().notificationsEnabled).toBe(true);
  });

  test('should set reminder time', () => {
    useSettingsStore.getState().setReminderTime('08:30');
    expect(useSettingsStore.getState().reminderTime).toBe('08:30');
  });

  test('should set theme mode', () => {
    useSettingsStore.getState().setThemeMode('dark');
    expect(useSettingsStore.getState().themeMode).toBe('dark');
  });
});
