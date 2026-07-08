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

export type SubscriptionTier = 'free' | 'premium' | 'pro';

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
};

export type ReadingHistoryItem = {
  id: string;
  type: 'horoscope' | 'tarot' | 'birthchart' | 'moon';
  title: string;
  date: string;
  preview: string;
};
