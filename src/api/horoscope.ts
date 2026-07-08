import { ZodiacSign, HoroscopeReading } from '../types';
import { generateHoroscope } from '../utils/astroCalculations';
import { ZODIAC_EMOJIS } from '../constants/astrology';

/**
 * Fetch daily horoscope for a zodiac sign
 * In production, this would call a real astrology API
 */
export async function fetchDailyHoroscope(sign: ZodiacSign): Promise<HoroscopeReading> {
  const date = new Date();
  const data = generateHoroscope(sign, date);
  return {
    id: `horo-${sign}-${date.toISOString().split('T')[0]}`,
    sign,
    date: date.toISOString().split('T')[0],
    ...data,
  };
}

export async function fetchWeeklyHoroscope(sign: ZodiacSign): Promise<HoroscopeReading[]> {
  const readings: HoroscopeReading[] = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const data = generateHoroscope(sign, date);
    readings.push({
      id: `horo-${sign}-${date.toISOString().split('T')[0]}`,
      sign,
      date: date.toISOString().split('T')[0],
      ...data,
    });
  }
  return readings;
}
