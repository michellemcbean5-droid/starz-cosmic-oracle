import { BirthChartData } from '../types';
import { generateBirthChart } from '../utils/astroCalculations';

export function calculateBirthChart(birthDate: Date, birthTime: string, birthLocation?: string): BirthChartData {
  return generateBirthChart(birthDate, birthTime, birthLocation);
}
