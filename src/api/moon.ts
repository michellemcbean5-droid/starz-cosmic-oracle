import { MoonPhase } from '../types';
import { calculateMoonPhase } from '../utils/astroCalculations';

export function getCurrentMoonPhase(): MoonPhase {
  return calculateMoonPhase(new Date());
}

export function getMoonPhaseForDate(date: Date): MoonPhase {
  return calculateMoonPhase(date);
}

export function getMoonPhaseCalendar(year: number, month: number): { date: string; phase: MoonPhase }[] {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const results: { date: string; phase: MoonPhase }[] = [];
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    results.push({ date: date.toISOString().split('T')[0], phase: calculateMoonPhase(date) });
  }
  return results;
}
