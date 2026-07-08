import { ZodiacSign, HoroscopeReading, TarotReading, BirthChartData, MoonPhase, PlanetTransit, SubscriptionTier, UserProfile, ReadingHistoryItem, CompatibilityResult, DreamInterpretation, NumerologyReading, AIInsight } from '../types';

export type ZodiacSign =
  | 'Aries' | 'Taurus' | 'Gemini' | 'Cancer' | 'Leo' | 'Virgo'
  | 'Libra' | 'Scorpio' | 'Sagittarius' | 'Capricorn' | 'Aquarius' | 'Pisces';

export type Planet =
  | 'Sun' | 'Moon' | 'Mercury' | 'Venus' | 'Mars'
  | 'Jupiter' | 'Saturn' | 'Uranus' | 'Neptune' | 'Pluto';

export type TarotCard = {
  id: number;
  name: string;
  arcana: 'Major' | 'Minor';
  suit?: 'Wands' | 'Cups' | 'Swords' | 'Pentacles';
  meaning: string;
  reversed: string;
  keywords: string[];
};

export type TarotReading = {
  id: string;
  date: string;
  cards: TarotCard[];
  question: string;
  interpretation: string;
  aiEnhanced?: boolean;
};

export type HoroscopeReading = {
  id: string;
  sign: ZodiacSign;
  date: string;
  overview: string;
  love: string;
  career: string;
  health: string;
  luckyNumber: number;
  luckyColor: string;
  mood: string;
  cosmicSummary?: {
    affirmation: string;
    numerology: string;
    fortune: string;
    sentiment: { label: string; score: number };
  };
};

export type BirthChartData = {
  sunSign: ZodiacSign;
  moonSign: ZodiacSign;
  risingSign: ZodiacSign;
  planetaryPositions: Record<Planet, { sign: ZodiacSign; degree: number; house: number }>;
  houses: number[];
  aspects: string[];
};

export type MoonPhase = {
  phase: string;
  illumination: number;
  age: number;
  emoji: string;
};

export type PlanetTransit = {
  planet: Planet;
  sign: ZodiacSign;
  degree: number;
  isRetrograde: boolean;
  influence: string;
};

export type SubscriptionTier = 'free' | 'premium' | 'pro' | 'elite';

export type PromoCode = {
  code: string;
  tier: SubscriptionTier;
  discountPercent: number;
  expiresAt: string;
  usesRemaining: number;
};

export type UserProfile = {
  name: string;
  birthDate: string;
  birthTime: string;
  birthLocation: string;
  sunSign?: ZodiacSign;
  subscription: SubscriptionTier;
  dailyReadingsCount: number;
  lastReadingResetDate: string;
  notificationsEnabled: boolean;
  referralCode?: string;
  referralsCount: number;
  promoCodeApplied?: string;
  masterAccessVerified: boolean;
};

export type ReadingHistoryItem = {
  id: string;
  type: 'horoscope' | 'tarot' | 'birthchart' | 'moon' | 'compatibility' | 'dream' | 'numerology';
  title: string;
  date: string;
  preview: string;
};

export type CompatibilityResult = {
  sign1: ZodiacSign;
  sign2: ZodiacSign;
  score: number;
  description: string;
  aiAnalysis?: string;
};

export type DreamInterpretation = {
  id: string;
  dream: string;
  interpretation: string;
  symbols: string[];
  date: string;
};

export type NumerologyReading = {
  number: number;
  meaning: string;
  lifePathNumber?: number;
  aiInsight?: string;
};

export type AIInsight = {
  type: 'affirmation' | 'sentiment' | 'fortune' | 'compatibility';
  content: string;
  confidence: number;
  generatedAt: string;
};

export type SubscriptionPlan = {
  id: string;
  name: string;
  price: number;
  period: 'monthly' | 'yearly';
  features: string[];
  tier: SubscriptionTier;
  isPopular?: boolean;
};
