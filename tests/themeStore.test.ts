import { calculateTimeOfDay } from '../src/stores/themeStore';

describe('ThemeStore Time-of-Day Calculation', () => {
  test('should return morning for hours between 5 and 11', () => {
    const morningDate = new Date();
    morningDate.setHours(8);
    expect(calculateTimeOfDay(morningDate)).toBe('morning');
  });

  test('should return midday for hours between 12 and 17', () => {
    const middayDate = new Date();
    middayDate.setHours(14);
    expect(calculateTimeOfDay(middayDate)).toBe('midday');
  });

  test('should return evening for hours between 18 and 4', () => {
    const eveningDate = new Date();
    eveningDate.setHours(20);
    expect(calculateTimeOfDay(eveningDate)).toBe('evening');

    const nightDate = new Date();
    nightDate.setHours(2);
    expect(calculateTimeOfDay(nightDate)).toBe('evening');
  });
});
