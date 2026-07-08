import { useAuthStore } from '../src/stores/useAuthStore';
import { useHistoryStore } from '../src/stores/useHistoryStore';

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
        referralsCount: 0,
        masterAccessVerified: false,
      },
    });
    expect(useAuthStore.getState().canRead()).toBe(true);
  });

  it('allows readings for elite users', () => {
    useAuthStore.setState({
      user: {
        name: 'Test',
        birthDate: '1990-01-01',
        birthTime: '12:00',
        birthLocation: 'NYC',
        subscription: 'elite',
        dailyReadingsCount: 0,
        lastReadingResetDate: '2024-01-01',
        notificationsEnabled: true,
        referralsCount: 0,
        masterAccessVerified: true,
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
        referralsCount: 0,
        masterAccessVerified: false,
      },
    });
    expect(useAuthStore.getState().canRead()).toBe(false);
  });

  it('applies valid promo code', async () => {
    useAuthStore.setState({
      user: {
        name: 'Test',
        birthDate: '1990-01-01',
        birthTime: '12:00',
        birthLocation: 'NYC',
        subscription: 'free',
        dailyReadingsCount: 0,
        lastReadingResetDate: '2024-01-01',
        notificationsEnabled: true,
        referralsCount: 0,
        masterAccessVerified: false,
      },
    });
    const result = await useAuthStore.getState().applyPromoCode('COSMIC50');
    expect(result.success).toBe(true);
    expect(useAuthStore.getState().user?.subscription).toBe('premium');
  });

  it('rejects invalid promo code', async () => {
    useAuthStore.setState({
      user: {
        name: 'Test',
        birthDate: '1990-01-01',
        birthTime: '12:00',
        birthLocation: 'NYC',
        subscription: 'free',
        dailyReadingsCount: 0,
        lastReadingResetDate: '2024-01-01',
        notificationsEnabled: true,
        referralsCount: 0,
        masterAccessVerified: false,
      },
    });
    const result = await useAuthStore.getState().applyPromoCode('INVALID');
    expect(result.success).toBe(false);
  });

  it('applies master access code', async () => {
    useAuthStore.setState({
      user: {
        name: 'Test',
        birthDate: '1990-01-01',
        birthTime: '12:00',
        birthLocation: 'NYC',
        subscription: 'free',
        dailyReadingsCount: 0,
        lastReadingResetDate: '2024-01-01',
        notificationsEnabled: true,
        referralsCount: 0,
        masterAccessVerified: false,
      },
    });
    const result = await useAuthStore.getState().applyMasterCode('STARZ-ELITE-2024');
    expect(result.success).toBe(true);
    expect(useAuthStore.getState().user?.subscription).toBe('elite');
    expect(useAuthStore.getState().user?.masterAccessVerified).toBe(true);
  });

  it('rejects wrong master code', async () => {
    useAuthStore.setState({
      user: {
        name: 'Test',
        birthDate: '1990-01-01',
        birthTime: '12:00',
        birthLocation: 'NYC',
        subscription: 'free',
        dailyReadingsCount: 0,
        lastReadingResetDate: '2024-01-01',
        notificationsEnabled: true,
        referralsCount: 0,
        masterAccessVerified: false,
      },
    });
    const result = await useAuthStore.getState().applyMasterCode('WRONG-CODE');
    expect(result.success).toBe(false);
  });

  it('upgrades to premium after 3 referrals', async () => {
    useAuthStore.setState({
      user: {
        name: 'Test',
        birthDate: '1990-01-01',
        birthTime: '12:00',
        birthLocation: 'NYC',
        subscription: 'free',
        dailyReadingsCount: 0,
        lastReadingResetDate: '2024-01-01',
        notificationsEnabled: true,
        referralsCount: 2,
        masterAccessVerified: false,
      },
    });
    await useAuthStore.getState().addReferral();
    expect(useAuthStore.getState().user?.subscription).toBe('premium');
    expect(useAuthStore.getState().user?.referralsCount).toBe(3);
  });

  it('returns correct tier limits', () => {
    useAuthStore.setState({
      user: {
        name: 'Test',
        birthDate: '1990-01-01',
        birthTime: '12:00',
        birthLocation: 'NYC',
        subscription: 'elite',
        dailyReadingsCount: 0,
        lastReadingResetDate: '2024-01-01',
        notificationsEnabled: true,
        referralsCount: 0,
        masterAccessVerified: true,
      },
    });
    const limits = useAuthStore.getState().getTierLimits();
    expect(limits.dailyReadings).toBe(-1);
    expect(limits.features).toContain('Data export');
  });
});

describe('useHistoryStore', () => {
  beforeEach(() => {
    useHistoryStore.setState({ history: [], dreams: [], compatibilities: [], numerologyReadings: [] });
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

  it('adds dream interpretations', () => {
    useHistoryStore.getState().addDream({
      dream: 'I was flying',
      interpretation: 'Freedom and aspiration',
      symbols: ['flying', 'sky'],
      date: '2024-01-01',
    });
    expect(useHistoryStore.getState().dreams).toHaveLength(1);
    expect(useHistoryStore.getState().dreams[0].dream).toBe('I was flying');
  });

  it('adds compatibility results', () => {
    useHistoryStore.getState().addCompatibility({
      sign1: 'Aries',
      sign2: 'Leo',
      score: 85,
      description: 'Great match',
    });
    expect(useHistoryStore.getState().compatibilities).toHaveLength(1);
  });

  it('adds numerology readings', () => {
    useHistoryStore.getState().addNumerology({
      number: 7,
      meaning: 'Spiritual number',
    });
    expect(useHistoryStore.getState().numerologyReadings).toHaveLength(1);
  });

  it('limits history to 100 items', () => {
    for (let i = 0; i < 105; i++) {
      useHistoryStore.getState().addReading({
        type: 'horoscope',
        title: `Reading ${i}`,
        date: '2024-01-01',
        preview: 'Preview',
      });
    }
    expect(useHistoryStore.getState().history).toHaveLength(100);
  });
});
