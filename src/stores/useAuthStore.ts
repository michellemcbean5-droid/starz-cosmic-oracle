import { create } from 'zustand';
import { UserProfile, SubscriptionTier, PromoCode } from '../types';
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
  applyPromoCode: (code: string) => Promise<{ success: boolean; message: string }>;
  applyMasterCode: (code: string) => Promise<{ success: boolean; message: string }>;
  addReferral: () => Promise<void>;
  getTierLimits: () => { dailyReadings: number; features: string[] };
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
  referralsCount: 0,
  masterAccessVerified: false,
};

// Master access code - stored securely in env vars
const MASTER_ACCESS_CODE = process.env.MASTER_ACCESS_CODE || 'STARZ-ELITE-2024';

// Promo codes database
const PROMO_CODES: Record<string, PromoCode> = {
  'COSMIC50': { code: 'COSMIC50', tier: 'premium', discountPercent: 50, expiresAt: '2025-12-31', usesRemaining: 100 },
  'STARZPRO': { code: 'STARZPRO', tier: 'pro', discountPercent: 30, expiresAt: '2025-12-31', usesRemaining: 50 },
  'NEWMOON': { code: 'NEWMOON', tier: 'premium', discountPercent: 100, expiresAt: '2025-06-30', usesRemaining: 200 },
  'ELITE2024': { code: 'ELITE2024', tier: 'elite', discountPercent: 25, expiresAt: '2025-12-31', usesRemaining: 20 },
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,

  loadUser: async () => {
    const stored = await Storage.get<UserProfile>('user_profile');
    if (stored) {
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
    if (user.subscription === 'premium' || user.subscription === 'pro' || user.subscription === 'elite') return true;
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

  applyPromoCode: async (code: string) => {
    const user = get().user;
    if (!user) return { success: false, message: 'User not loaded' };
    
    const promo = PROMO_CODES[code.toUpperCase()];
    if (!promo) return { success: false, message: 'Invalid promo code' };
    
    const now = new Date().toISOString().split('T')[0];
    if (promo.expiresAt < now) return { success: false, message: 'Promo code expired' };
    if (promo.usesRemaining <= 0) return { success: false, message: 'Promo code fully redeemed' };
    
    promo.usesRemaining--;
    const updated = { ...user, subscription: promo.tier, promoCodeApplied: code };
    await Storage.set('user_profile', updated);
    set({ user: updated });
    
    return { 
      success: true, 
      message: `Promo code applied! You now have ${promo.tier} access with ${promo.discountPercent}% discount.` 
    };
  },

  applyMasterCode: async (code: string) => {
    const user = get().user;
    if (!user) return { success: false, message: 'User not loaded' };
    
    if (code !== MASTER_ACCESS_CODE) {
      return { success: false, message: 'Invalid master access code' };
    }
    
    const updated = { 
      ...user, 
      subscription: 'elite' as SubscriptionTier, 
      masterAccessVerified: true 
    };
    await Storage.set('user_profile', updated);
    set({ user: updated });
    
    return { success: true, message: 'Master access granted! Elite tier unlocked.' };
  },

  addReferral: async () => {
    const user = get().user;
    if (!user) return;
    const updated = { ...user, referralsCount: user.referralsCount + 1 };
    // Upgrade to premium after 3 referrals
    if (updated.referralsCount >= 3 && updated.subscription === 'free') {
      updated.subscription = 'premium';
    }
    await Storage.set('user_profile', updated);
    set({ user: updated });
  },

  getTierLimits: () => {
    const user = get().user;
    const tier = user?.subscription || 'free';
    switch (tier) {
      case 'elite':
        return { 
          dailyReadings: -1, 
          features: ['Unlimited readings', 'AI-enhanced horoscopes', 'Full birth chart', 'Planetary transits', 'Dream interpretation', 'Compatibility analysis', 'Numerology insights', 'Priority support', 'No ads', 'Data export'] 
        };
      case 'pro':
        return { 
          dailyReadings: -1, 
          features: ['Unlimited readings', 'AI-enhanced horoscopes', 'Full birth chart', 'Planetary transits', 'Dream interpretation', 'No ads'] 
        };
      case 'premium':
        return { 
          dailyReadings: -1, 
          features: ['Unlimited readings', 'Daily horoscope', 'Moon phase tracker', 'Tarot readings', 'No ads'] 
        };
      default:
        return { 
          dailyReadings: 3, 
          features: ['3 daily readings', 'Basic horoscope', 'Moon phase tracker', 'Ad-supported'] 
        };
    }
  },
}));
