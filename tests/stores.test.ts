import { useAuthStore } from '../src/stores/useAuthStore';
import { useHistoryStore } from '../src/stores/useHistoryStore';
import { act } from 'react-test-renderer';

describe('useAuthStore', () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null, isLoading: false });
  });

  it('allows readings for premium users', () => {
    useAuthStore.setState({
      user: {
        name: 'Test',
        birthDate: '1990-01-01',
        birthTime: '12:00',
        birthLocation: 'NYC',
        subscription: 'premium',
        dailyReadingsCount: 0,
        lastReadingResetDate: '2024-01-01',
        notificationsEnabled: true,
      },
    });
    expect(useAuthStore.getState().canRead()).toBe(true);
  });

  it('limits free users to 3 readings', () => {
    useAuthStore.setState({
      user: {
        name: 'Test',
        birthDate: '1990-01-01',
        birthTime: '12:00',
        birthLocation: 'NYC',
        subscription: 'free',
        dailyReadingsCount: 3,
        lastReadingResetDate: '2024-01-01',
        notificationsEnabled: true,
      },
    });
    expect(useAuthStore.getState().canRead()).toBe(false);
  });
});

describe('useHistoryStore', () => {
  beforeEach(() => {
    useHistoryStore.setState({ history: [] });
  });

  it('adds readings to history', () => {
    useHistoryStore.getState().addReading({
      type: 'horoscope',
      title: 'Test Reading',
      date: '2024-01-01',
      preview: 'Test preview',
    });
    expect(useHistoryStore.getState().history).toHaveLength(1);
    expect(useHistoryStore.getState().history[0].title).toBe('Test Reading');
  });
});
