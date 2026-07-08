import { create } from 'zustand';
import { UserProfile, SubscriptionTier } from '../types';
import { Storage } from '../utils/storage';

interface AuthState {
  user: UserProfile | null;
  isLoading: boolean;
  loadUser: () => Promise<void>;
  setUser: (user: UserProfile) => Promise<void>;
  updateSubscription: (tier: SubscriptionTier) => Promise<void>;
  incrementReadingCount: () => Promise<void>;
  canRead: () => boolean;
  resetDailyReadings: () => Promise<void>;
}

const DEFAULT_USER: UserProfile = {
  name: 'Cosmic Seeker',
  birthDate: '1990-01-01',
  birthTime: '12:00',
  birthLocation: 'New York, USA',
  subscription: 'free',
  dailyReadingsCount: 0,
  lastReadingResetDate: new Date().toISOString().split('T')[0],
  notificationsEnabled: true,
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,

  loadUser: async () => {
    const stored = await Storage.get<UserProfile>('user_profile');
    if (stored) {
      // Reset daily count if it's a new day
      const today = new Date().toISOString().split('T')[0];
      if (stored.lastReadingResetDate !== today) {
        stored.dailyReadingsCount = 0;
        stored.lastReadingResetDate = today;
        await Storage.set('user_profile', stored);
      }
      set({ user: stored, isLoading: false });
    } else {
      await Storage.set('user_profile', DEFAULT_USER);
      set({ user: DEFAULT_USER, isLoading: false });
    }
  },

  setUser: async (user) => {
    await Storage.set('user_profile', user);
    set({ user });
  },

  updateSubscription: async (tier) => {
    const user = get().user;
    if (!user) return;
    const updated = { ...user, subscription: tier };
    await Storage.set('user_profile', updated);
    set({ user: updated });
  },

  incrementReadingCount: async () => {
    const user = get().user;
    if (!user) return;
    const updated = { ...user, dailyReadingsCount: user.dailyReadingsCount + 1 };
    await Storage.set('user_profile', updated);
    set({ user: updated });
  },

  canRead: () => {
    const user = get().user;
    if (!user) return false;
    if (user.subscription === 'premium' || user.subscription === 'pro') return true;
    return user.dailyReadingsCount < 3;
  },

  resetDailyReadings: async () => {
    const user = get().user;
    if (!user) return;
    const today = new Date().toISOString().split('T')[0];
    const updated = { ...user, dailyReadingsCount: 0, lastReadingResetDate: today };
    await Storage.set('user_profile', updated);
    set({ user: updated });
  },
}));
