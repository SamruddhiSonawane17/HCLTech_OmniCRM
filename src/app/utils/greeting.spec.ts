import { getGreeting } from './greeting';

describe('getGreeting', () => {
  it('uses the morning greeting before noon', () => {
    expect(getGreeting(new Date(2026, 10, 3, 11, 59))).toBe('Good morning');
  });

  it('uses the afternoon greeting from noon through 4:59 PM', () => {
    expect(getGreeting(new Date(2026, 10, 3, 14, 25))).toBe('Good afternoon');
    expect(getGreeting(new Date(2026, 10, 3, 16, 59))).toBe('Good afternoon');
  });

  it('uses the evening greeting from 5 PM', () => {
    expect(getGreeting(new Date(2026, 10, 3, 17, 0))).toBe('Good evening');
  });
});
