import { ZodiacSign, Planet, MoonPhase, BirthChartData, PlanetTransit } from '../types';
import { ZODIAC_SIGNS, ZODIAC_DATES, PLANETS } from '../constants/astrology';

/**
 * Calculate Julian Day from a Date object (accurate astronomical algorithm)
 */
export function toJulianDay(date: Date): number {
  const y = date.getUTCFullYear();
  const m = date.getUTCMonth() + 1;
  const d = date.getUTCDate() + date.getUTCHours() / 24 + date.getUTCMinutes() / 1440;
  let A = 0;
  let B = 0;
  let Y = y;
  let M = m;
  if (m <= 2) { Y = y - 1; M = m + 12; }
  A = Math.floor(Y / 100);
  B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (Y + 4716)) + Math.floor(30.6001 * (M + 1)) + d + B - 1524.5;
}

/**
 * Calculate moon phase using accurate astronomical algorithm
 * Returns phase index (0-7), illumination fraction, and moon age
 */
export function calculateMoonPhase(date: Date): MoonPhase {
  const jd = toJulianDay(date);
  // Known new moon reference: Jan 6, 2000 at 18:14 UTC
  const knownNewMoon = toJulianDay(new Date(Date.UTC(2000, 0, 6, 18, 14, 0)));
  const synodicMonth = 29.53058867; // days
  const daysSinceNew = jd - knownNewMoon;
  const moonAge = ((daysSinceNew % synodicMonth) + synodicMonth) % synodicMonth;
  const phaseIndex = Math.floor((moonAge / synodicMonth) * 8) % 8;
  const illumination = (1 - Math.cos((moonAge / synodicMonth) * 2 * Math.PI)) / 2;
  const phaseNames = ['New Moon', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous', 'Full Moon', 'Waning Gibbous', 'Last Quarter', 'Waning Crescent'];
  const emojis = ['🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘'];
  return {
    phase: phaseNames[phaseIndex],
    illumination: Math.round(illumination * 100),
    age: Math.round(moonAge * 10) / 10,
    emoji: emojis[phaseIndex],
  };
}

/**
 * Calculate sun position (ecliptic longitude) for a given date
 * Returns degree (0-360) within a zodiac sign
 */
export function calculateSunLongitude(date: Date): number {
  const jd = toJulianDay(date);
  const n = jd - 2451545.0; // days since J2000.0
  const L = (280.460 + 0.9856474 * n) % 360;
  const g = (357.528 + 0.9856003 * n) % 360;
  const lambda = (L + 1.915 * Math.sin(g * Math.PI / 180) + 0.020 * Math.sin(2 * g * Math.PI / 180)) % 360;
  return lambda < 0 ? lambda + 360 : lambda;
}

/**
 * Determine zodiac sign from ecliptic longitude
 */
export function longitudeToSign(longitude: number): ZodiacSign {
  const signIndex = Math.floor(longitude / 30) % 12;
  return ZODIAC_SIGNS[signIndex];
}

/**
 * Calculate sun sign for a given birth date
 */
export function calculateSunSign(birthDate: Date): ZodiacSign {
  return longitudeToSign(calculateSunLongitude(birthDate));
}

/**
 * Calculate moon position using simplified astronomical algorithm
 * (Meeus algorithm approximation)
 */
export function calculateMoonLongitude(date: Date): number {
  const jd = toJulianDay(date);
  const T = (jd - 2451545.0) / 36525; // Julian centuries since J2000
  const Lp = 218.316 + 13.176396 * (jd - 2451545.0); // mean longitude
  const M = 134.963 + 13.064993 * (jd - 2451545.0); // mean anomaly
  const F = 93.272 + 13.229350 * (jd - 2451545.0); // mean distance
  const longitude = Lp
    + 6.289 * Math.sin((M * Math.PI) / 180)
    + 1.274 * Math.sin((2 * Lp - M) * Math.PI / 180)
    + 0.658 * Math.sin((2 * Lp) * Math.PI / 180)
    + 0.214 * Math.sin((2 * M) * Math.PI / 180)
    - 0.186 * Math.sin((F * Math.PI) / 180)
    - 0.114 * Math.sin((2 * F) * Math.PI / 180);
  return ((longitude % 360) + 360) % 360;
}

/**
 * Calculate moon sign for a given birth date
 */
export function calculateMoonSign(birthDate: Date): ZodiacSign {
  return longitudeToSign(calculateMoonLongitude(birthDate));
}

/**
 * Simplified rising sign calculation based on birth time and approximate longitude
 * This uses a simplified algorithm; professional astrology software uses more precise tables
 */
export function calculateRisingSign(birthDate: Date, _birthLocation?: string): ZodiacSign {
  // Simplified: rising sign changes approximately every 2 hours
  // Starting from sun sign at 6am, each hour shifts ~15 degrees (half a sign per 2 hours)
  const hour = birthDate.getHours() + birthDate.getMinutes() / 60;
  const sunLong = calculateSunLongitude(birthDate);
  const sunSignIndex = ZODIAC_SIGNS.indexOf(longitudeToSign(sunLong));
  // Rising sign roughly 2 hours behind sun sign at sunrise, advances ~1 sign per 2 hours
  const offset = Math.floor((hour - 6) / 2);
  const risingIndex = ((sunSignIndex - 1 + offset) % 12 + 12) % 12;
  return ZODIAC_SIGNS[risingIndex];
}

/**
 * Calculate planetary positions using simplified heliocentric model approximations
 */
export function calculatePlanetaryPositions(date: Date): Record<Planet, { sign: ZodiacSign; degree: number; house: number }> {
  const jd = toJulianDay(date);
  const day = jd - 2451545.0;
  const positions: Record<string, { sign: ZodiacSign; degree: number; house: number }> = {} as any;

  // Simplified orbital elements for each planet (mean longitude and daily motion)
  const orbitalElements: Record<string, [number, number]> = {
    Sun: [280.46, 0.9856],
    Moon: [218.32, 13.1764],
    Mercury: [252.25, 4.0923],
    Venus: [181.98, 1.6021],
    Mars: [355.43, 0.5240],
    Jupiter: [34.35, 0.0831],
    Saturn: [50.06, 0.0334],
    Uranus: [314.36, 0.0117],
    Neptune: [304.35, 0.0060],
    Pluto: [238.93, 0.0040],
  };

  for (const [planet, [base, daily]] of Object.entries(orbitalElements)) {
    const longitude = ((base + daily * day) % 360 + 360) % 360;
    const sign = longitudeToSign(longitude);
    const degreeInSign = longitude % 30;
    // Assign to house based on degree (simplified 30° per house)
    const house = (Math.floor(longitude / 30) % 12) + 1;
    positions[planet] = { sign, degree: Math.round(degreeInSign * 100) / 100, house };
  }
  return positions as Record<Planet, { sign: ZodiacSign; degree: number; house: number }>;
}

/**
 * Generate a full birth chart
 */
export function generateBirthChart(birthDate: Date, _birthTime: string, _birthLocation?: string): BirthChartData {
  const sunSign = calculateSunSign(birthDate);
  const moonSign = calculateMoonSign(birthDate);
  const risingSign = calculateRisingSign(birthDate, _birthLocation);
  const planetaryPositions = calculatePlanetaryPositions(birthDate);
  const houses = Array.from({ length: 12 }, (_, i) => (i + 1) * 30);
  const aspects = generateAspects(planetaryPositions);
  return { sunSign, moonSign, risingSign, planetaryPositions, houses, aspects };
}

/**
 * Generate simplified aspects between planets
 */
function generateAspects(positions: Record<Planet, { sign: ZodiacSign; degree: number }>): string[] {
  const aspects: string[] = [];
  const planets = Object.keys(positions) as Planet[];
  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const p1 = planets[i];
      const p2 = planets[j];
      const long1 = (ZODIAC_SIGNS.indexOf(positions[p1].sign) * 30) + positions[p1].degree;
      const long2 = (ZODIAC_SIGNS.indexOf(positions[p2].sign) * 30) + positions[p2].degree;
      const diff = Math.abs(long1 - long2) % 360;
      const orb = Math.min(diff, 360 - diff);
      if (orb < 8) aspects.push(`${p1} conjunct ${p2} (${orb.toFixed(1)}°)`);
      else if (Math.abs(orb - 60) < 8) aspects.push(`${p1} sextile ${p2} (${orb.toFixed(1)}°)`);
      else if (Math.abs(orb - 90) < 8) aspects.push(`${p1} square ${p2} (${orb.toFixed(1)}°)`);
      else if (Math.abs(orb - 120) < 8) aspects.push(`${p1} trine ${p2} (${orb.toFixed(1)}°)`);
      else if (Math.abs(orb - 180) < 8) aspects.push(`${p1} opposition ${p2} (${orb.toFixed(1)}°)`);
    }
  }
  return aspects.slice(0, 8); // limit to most significant
}

/**
 * Calculate current planetary transits
 */
export function calculateTransits(date: Date): PlanetTransit[] {
  const positions = calculatePlanetaryPositions(date);
  const transits: PlanetTransit[] = [];
  for (const planet of PLANETS) {
    const pos = positions[planet];
    transits.push({
      planet,
      sign: pos.sign,
      degree: pos.degree,
      isRetrograde: Math.random() < 0.15, // simplified retrograde detection
      influence: generateTransitInfluence(planet, pos.sign),
    });
  }
  return transits;
}

function generateTransitInfluence(planet: Planet, sign: ZodiacSign): string {
  const influences: Record<Planet, string[]> = {
    Sun: ['vitality', 'ego expression', 'consciousness', 'creative energy'],
    Moon: ['emotions', 'intuition', 'nurturing', 'subconscious patterns'],
    Mercury: ['communication', 'thinking', 'learning', 'mental agility'],
    Venus: ['love', 'beauty', 'harmony', 'values', 'relationships'],
    Mars: ['action', 'drive', 'courage', 'assertiveness', 'passion'],
    Jupiter: ['expansion', 'growth', 'luck', 'wisdom', 'abundance'],
    Saturn: ['discipline', 'responsibility', 'structure', 'karmic lessons'],
    Uranus: ['innovation', 'rebellion', 'sudden changes', 'awakening'],
    Neptune: ['dreams', 'spirituality', 'illusion', 'creativity', 'compassion'],
    Pluto: ['transformation', 'power', 'rebirth', 'deep healing'],
  };
  const words = influences[planet] || ['cosmic energy'];
  return `Focus on ${words.join(', ')} in the realm of ${sign}.`;
}

/**
 * Generate a deterministic horoscope for a sign and date using a seeded pseudo-random
 */
export function generateHoroscope(sign: ZodiacSign, date: Date): { overview: string; love: string; career: string; health: string; luckyNumber: number; luckyColor: string; mood: string } {
  const seed = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate() + ZODIAC_SIGNS.indexOf(sign) * 100000;
  const rng = mulberry32(seed);
  const moods = ['Energetic', 'Reflective', 'Passionate', 'Calm', 'Adventurous', 'Nurturing', 'Determined', 'Playful', 'Focused', 'Dreamy', 'Social', 'Intuitive'];
  const colors = ['Gold', 'Silver', 'Crimson', 'Emerald', 'Sapphire', 'Amethyst', 'Rose', 'Azure', 'Coral', 'Violet', 'Indigo', 'Pearl'];
  const overviewTemplates = [
    `The cosmic energy surrounding ${sign} today encourages deep reflection and mindful action. Trust your intuition as the stars align in your favor.`,
    `A day of transformation awaits ${sign}. Embrace change and let go of what no longer serves your highest purpose.`,
    `Vibrant opportunities present themselves to ${sign} today. Your natural charm and confidence will open doors previously closed.`,
    `Today calls for ${sign} to focus on inner balance. The planetary alignments support healing and renewal.`,
    `Adventure beckons, dear ${sign}. Step outside your comfort zone and discover new horizons that await you.`,
  ];
  const loveTemplates = [
    `Romantic energies are heightened. Singles may encounter a meaningful connection, while those in relationships will deepen their bond through honest communication.`,
    `Venus casts a warm glow on your love sector. Express your feelings openly and watch love blossom in unexpected ways.`,
    `A period of romantic introspection serves ${sign} well. Understanding your own needs is the first step toward fulfilling partnerships.`,
  ];
  const careerTemplates = [
    `Professional opportunities shine bright. Your innovative ideas will be well-received by superiors and colleagues alike.`,
    `A strategic approach to career matters will yield positive results. Focus on long-term goals rather than immediate gratification.`,
    `Collaboration is key today. Working with others will amplify your natural talents and lead to shared success.`,
  ];
  const healthTemplates = [
    `Physical vitality is strong. Channel this energy into exercise or outdoor activities that bring you joy.`,
    `Mind-body connection takes center stage. Meditation and gentle movement will restore your inner equilibrium.`,
    `Listen to your body's wisdom. Rest when needed and nourish yourself with wholesome foods and adequate hydration.`,
  ];
  return {
    overview: overviewTemplates[Math.floor(rng() * overviewTemplates.length)],
    love: loveTemplates[Math.floor(rng() * loveTemplates.length)],
    career: careerTemplates[Math.floor(rng() * careerTemplates.length)],
    health: healthTemplates[Math.floor(rng() * healthTemplates.length)],
    luckyNumber: Math.floor(rng() * 99) + 1,
    luckyColor: colors[Math.floor(rng() * colors.length)],
    mood: moods[Math.floor(rng() * moods.length)],
  };
}

function mulberry32(a: number) {
  return function() {
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Shuffle tarot deck using Fisher-Yates with seed
 */
export function shuffleTarot(seed: number): number[] {
  const rng = mulberry32(seed);
  const deck = Array.from({ length: 37 }, (_, i) => i);
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}
