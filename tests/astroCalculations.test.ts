import {
  toJulianDay,
  calculateMoonPhase,
  calculateSunLongitude,
  longitudeToSign,
  calculateSunSign,
  calculateMoonSign,
  calculateRisingSign,
  generateBirthChart,
  calculateTransits,
  generateHoroscope,
  shuffleTarot,
} from '../src/utils/astroCalculations';
import { ZODIAC_SIGNS } from '../src/constants/astrology';

describe('toJulianDay', () => {
  it('returns correct JD for a known date', () => {
    const date = new Date(Date.UTC(2000, 0, 1, 12, 0, 0));
    const jd = toJulianDay(date);
    expect(jd).toBeGreaterThan(2451544);
    expect(jd).toBeLessThan(2451546);
  });
});

describe('calculateMoonPhase', () => {
  it('returns valid phase for today', () => {
    const phase = calculateMoonPhase(new Date());
    expect(phase).toHaveProperty('phase');
    expect(phase).toHaveProperty('illumination');
    expect(phase).toHaveProperty('age');
    expect(phase).toHaveProperty('emoji');
    expect(phase.illumination).toBeGreaterThanOrEqual(0);
    expect(phase.illumination).toBeLessThanOrEqual(100);
  });

  it('returns New Moon around known new moon date', () => {
    const date = new Date(Date.UTC(2000, 0, 6, 18, 14, 0));
    const phase = calculateMoonPhase(date);
    expect(phase.phase).toBe('New Moon');
  });

  it('returns Full Moon ~14.77 days after new moon', () => {
    const date = new Date(Date.UTC(2000, 0, 21, 0, 0, 0));
    const phase = calculateMoonPhase(date);
    expect(phase.phase).toBe('Full Moon');
  });
});

describe('calculateSunLongitude', () => {
  it('returns value between 0 and 360', () => {
    const long = calculateSunLongitude(new Date());
    expect(long).toBeGreaterThanOrEqual(0);
    expect(long).toBeLessThan(360);
  });
});

describe('longitudeToSign', () => {
  it('maps 0° to Aries', () => {
    expect(longitudeToSign(0)).toBe('Aries');
  });
  it('maps 30° to Taurus', () => {
    expect(longitudeToSign(30)).toBe('Taurus');
  });
  it('maps 330° to Pisces', () => {
    expect(longitudeToSign(330)).toBe('Pisces');
  });
});

describe('calculateSunSign', () => {
  it('returns correct sign for March 21', () => {
    const sign = calculateSunSign(new Date('2024-03-21'));
    expect(sign).toBe('Aries');
  });
  it('returns correct sign for August 15', () => {
    const sign = calculateSunSign(new Date('2024-08-15'));
    expect(sign).toBe('Leo');
  });
  it('returns correct sign for December 25', () => {
    const sign = calculateSunSign(new Date('2024-12-25'));
    expect(sign).toBe('Capricorn');
  });
});

describe('calculateMoonSign', () => {
  it('returns a valid zodiac sign', () => {
    const sign = calculateMoonSign(new Date());
    expect(ZODIAC_SIGNS).toContain(sign);
  });
});

describe('calculateRisingSign', () => {
  it('returns a valid zodiac sign', () => {
    const sign = calculateRisingSign(new Date('2024-06-15T12:00'));
    expect(ZODIAC_SIGNS).toContain(sign);
  });
});

describe('generateBirthChart', () => {
  it('returns all required chart components', () => {
    const chart = generateBirthChart(new Date('1990-06-15T08:30'), '08:30', 'New York');
    expect(chart).toHaveProperty('sunSign');
    expect(chart).toHaveProperty('moonSign');
    expect(chart).toHaveProperty('risingSign');
    expect(chart).toHaveProperty('planetaryPositions');
    expect(chart).toHaveProperty('houses');
    expect(chart).toHaveProperty('aspects');
    expect(chart.houses).toHaveLength(12);
  });
});

describe('calculateTransits', () => {
  it('returns transit for all planets', () => {
    const transits = calculateTransits(new Date());
    expect(transits).toHaveLength(10);
    transits.forEach((t) => {
      expect(t).toHaveProperty('planet');
      expect(t).toHaveProperty('sign');
      expect(t).toHaveProperty('degree');
      expect(t).toHaveProperty('influence');
    });
  });
});

describe('generateHoroscope', () => {
  it('generates deterministic horoscope for same inputs', () => {
    const date = new Date('2024-01-15');
    const h1 = generateHoroscope('Aries', date);
    const h2 = generateHoroscope('Aries', date);
    expect(h1.overview).toBe(h2.overview);
    expect(h1.luckyNumber).toBe(h2.luckyNumber);
  });

  it('generates different horoscopes for different signs', () => {
    const date = new Date('2024-01-15');
    const h1 = generateHoroscope('Aries', date);
    const h2 = generateHoroscope('Taurus', date);
    expect(h1.overview).not.toBe(h2.overview);
  });

  it('includes all required fields', () => {
    const h = generateHoroscope('Leo', new Date());
    expect(h).toHaveProperty('overview');
    expect(h).toHaveProperty('love');
    expect(h).toHaveProperty('career');
    expect(h).toHaveProperty('health');
    expect(h).toHaveProperty('luckyNumber');
    expect(h).toHaveProperty('luckyColor');
    expect(h).toHaveProperty('mood');
  });
});

describe('shuffleTarot', () => {
  it('returns a deck of 37 unique cards', () => {
    const deck = shuffleTarot(12345);
    expect(deck).toHaveLength(37);
    const unique = new Set(deck);
    expect(unique.size).toBe(37);
  });

  it('is deterministic for same seed', () => {
    const d1 = shuffleTarot(99999);
    const d2 = shuffleTarot(99999);
    expect(d1).toEqual(d2);
  });

  it('is different for different seeds', () => {
    const d1 = shuffleTarot(11111);
    const d2 = shuffleTarot(22222);
    expect(d1).not.toEqual(d2);
  });
});
