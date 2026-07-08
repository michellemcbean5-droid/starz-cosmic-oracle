import { enhanceHoroscope, generateLocalFortune, analyzeNumerology, generateAffirmation, interpretDream, analyzeCompatibility, analyzeSentiment } from '../src/api/ai';

describe('AI API Integration', () => {
  describe('enhanceHoroscope', () => {
    it('returns enhanced text with fallback', async () => {
      const result = await enhanceHoroscope('Base horoscope text', 'Aries');
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('generateLocalFortune', () => {
    it('returns a deterministic fortune for same seed', () => {
      const f1 = generateLocalFortune('Aries', 12345);
      const f2 = generateLocalFortune('Aries', 12345);
      expect(f1).toBe(f2);
    });

    it('returns different fortunes for different seeds', () => {
      const f1 = generateLocalFortune('Aries', 12345);
      const f2 = generateLocalFortune('Aries', 54321);
      expect(f1).not.toBe(f2);
    });

    it('includes the sign name in the fortune', () => {
      const fortune = generateLocalFortune('Leo', 999);
      expect(fortune).toContain('Leo');
    });
  });

  describe('analyzeNumerology', () => {
    it('returns a string interpretation for any number', async () => {
      const result = await analyzeNumerology(7);
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('returns fallback for invalid input', async () => {
      const result = await analyzeNumerology(NaN);
      expect(typeof result).toBe('string');
    });
  });

  describe('generateAffirmation', () => {
    it('returns an affirmation string', async () => {
      const result = await generateAffirmation('Taurus', 'Calm');
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('interpretDream', () => {
    it('returns dream interpretation', async () => {
      const result = await interpretDream('I was flying over mountains');
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('analyzeCompatibility', () => {
    it('returns compatibility analysis', async () => {
      const result = await analyzeCompatibility('Aries', 'Leo');
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('analyzeSentiment', () => {
    it('returns sentiment object with label and score', async () => {
      const result = await analyzeSentiment('I feel happy and excited');
      expect(result).toHaveProperty('label');
      expect(result).toHaveProperty('score');
      expect(typeof result.score).toBe('number');
    });
  });
});
