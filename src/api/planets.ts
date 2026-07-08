import { PlanetTransit } from '../types';
import { calculateTransits } from '../utils/astroCalculations';

export function getCurrentTransits(): PlanetTransit[] {
  return calculateTransits(new Date());
}

export function getTransitsForDate(date: Date): PlanetTransit[] {
  return calculateTransits(date);
}
