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

// ---------------------------------------------------------------------------
// Precision engine types (server/ — Swiss Ephemeris backed)
// ---------------------------------------------------------------------------

export type EngineBody = {
  name: string;
  glyph: string;
  longitude: number;
  sign: string;
  sign_glyph: string;
  degree: number;
  degree_str: string;
  retrograde: boolean;
  speed: number;
  house?: number;
  element: string;
  mode: string;
};

export type EngineAngle = {
  name: string;
  glyph: string;
  longitude: number;
  sign: string;
  sign_glyph: string;
  degree: number;
  degree_str: string;
};

export type EngineHouse = {
  number: number;
  longitude: number;
  sign: string;
  sign_glyph: string;
  degree: number;
};

export type EngineAspect = {
  body1: string;
  body2: string;
  aspect: string;
  angle: number;
  orb: number;
  kind: 'major' | 'minor';
};

export type EngineChart = {
  julian_day: number;
  bodies: EngineBody[];
  houses: EngineHouse[];
  angles: Record<'Ascendant' | 'Midheaven' | 'Descendant' | 'Imum Coeli', EngineAngle>;
  aspects: EngineAspect[];
  balance: {
    elements: Record<string, number>;
    modes: Record<string, number>;
    dominant_element: string;
    dominant_mode: string;
  };
  house_system: string;
};

export type ArabicLot = {
  name: string;
  longitude: number;
  sign: string;
  sign_glyph: string;
  degree: number;
  degree_str: string;
  formula: string;
  meaning: string;
};

export type TransitHit = {
  transit: string;
  aspect: string;
  natal: string;
  orb: number;
  transit_sign: string;
  retrograde: boolean;
};

export type EngineTransits = {
  datetime: string;
  sky: EngineBody[];
  hits: TransitHit[];
};

export type SlangReading = {
  core: { title: string; sun: string; moon: string; rising: string };
  balance: { title: string; element: string; mode: string; elements: Record<string, number>; modes: Record<string, number> };
  planets: { planet: string; glyph: string; sign: string; degree: string; headline: string; text: string }[];
  aspects: { pair: string; kind: string; orb: number; text: string }[];
  sabian: { point: string; sabian: string; symbol: string; text: string }[];
  lots: { name: string; placement: string; text: string }[];
  predictions?: { title: string; as_of: string; lines: { text: string; orb: number }[] };
};

export type PreciseChartResponse = {
  name?: string | null;
  birth: { date: string; time: string };
  chart: EngineChart;
  lots: ArabicLot[];
  transits: EngineTransits;
  reading: SlangReading;
};

export type AIReadingResponse = {
  available: boolean;
  text?: string;
  reason?: string;
};

export type WorldForecast = {
  year: number;
  as_of: string;
  aries_ingress: {
    year: number;
    moment_utc: string;
    location: string;
    ascendant: { sign: string; degree_str: string };
    bodies: EngineBody[];
    aspects: EngineAspect[];
  };
  current_sky: EngineBody[];
  world_aspects: { body1: string; body2: string; aspect: string; orb: number }[];
  predictions: string[];
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
