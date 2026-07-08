/**
 * AI API Integration for Starz Cosmic Oracle
 * Uses free HuggingFace Inference API and other open-source endpoints
 */

const HF_API_BASE = 'https://api-inference.huggingface.co/models';

// Free tier: 10,000 requests/month per token
// Get token at https://huggingface.co/settings/tokens
const HF_TOKEN = process.env.HF_API_TOKEN || '';

interface HFResponse {
  generated_text?: string;
  summary_text?: string;
  translation_text?: string;
  label?: string;
  score?: number;
}

async function hfInference(model: string, inputs: string | object): Promise<HFResponse[]> {
  const res = await fetch(`${HF_API_BASE}/${model}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(HF_TOKEN ? { Authorization: `Bearer ${HF_TOKEN}` } : {}),
    },
    body: JSON.stringify({ inputs }),
  });
  if (!res.ok) throw new Error(`HF API error: ${res.status}`);
  return res.json();
}

/**
 * AI-Powered Horoscope Enhancement
 * Uses a lightweight text-generation model to add poetic flair
 */
export async function enhanceHoroscope(baseText: string, sign: string): Promise<string> {
  try {
    const prompt = `As a mystical astrologer, write a short poetic enhancement for ${sign}: ${baseText}`;
    const result = await hfInference('gpt2', prompt);
    const generated = result?.[0]?.generated_text || '';
    // Truncate to first 2 sentences to keep it concise
    const sentences = generated.split(/[.!?]/).filter(s => s.trim().length > 10);
    if (sentences.length > 0) {
      return `${baseText}\n\n✨ Cosmic Whisper: ${sentences.slice(0, 2).join('. ')}.`;
    }
    return baseText;
  } catch {
    return baseText; // Fallback to original
  }
}

/**
 * AI Tarot Interpretation Enhancement
 * Generates deeper, more personalized tarot readings
 */
export async function enhanceTarotReading(cards: string[], question?: string): Promise<string> {
  try {
    const prompt = question
      ? `Tarot reading for: "${question}". Cards drawn: ${cards.join(', ')}. Provide a mystical interpretation in 3 sentences.`
      : `Tarot cards: ${cards.join(', ')}. Provide a mystical interpretation in 3 sentences.`;
    const result = await hfInference('gpt2', prompt);
    const generated = result?.[0]?.generated_text || '';
    const sentences = generated.split(/[.!?]/).filter(s => s.trim().length > 10);
    if (sentences.length > 0) {
      return `🔮 The cards speak:\n\n${sentences.slice(0, 3).join('. ')}.`;
    }
    return '';
  } catch {
    return '';
  }
}

/**
 * AI-Powered Compatibility Analysis
 * Analyzes compatibility between two zodiac signs
 */
export async function analyzeCompatibility(sign1: string, sign2: string): Promise<string> {
  try {
    const prompt = `Astrological compatibility between ${sign1} and ${sign2}: describe their cosmic connection in 2 sentences.`;
    const result = await hfInference('gpt2', prompt);
    const generated = result?.[0]?.generated_text || '';
    const sentences = generated.split(/[.!?]/).filter(s => s.trim().length > 10);
    if (sentences.length > 0) {
      return sentences.slice(0, 2).join('. ') + '.';
    }
    return `The cosmic energies of ${sign1} and ${sign2} create a unique and powerful connection.`;
  } catch {
    return `The cosmic energies of ${sign1} and ${sign2} create a unique and powerful connection.`;
  }
}

/**
 * AI Dream Interpretation
 * Interprets dreams based on user input using free AI
 */
export async function interpretDream(dreamText: string): Promise<string> {
  try {
    const prompt = `As a dream interpreter, analyze this dream: "${dreamText}". Provide a mystical interpretation in 2-3 sentences.`;
    const result = await hfInference('gpt2', prompt);
    const generated = result?.[0]?.generated_text || '';
    const sentences = generated.split(/[.!?]/).filter(s => s.trim().length > 10);
    if (sentences.length > 0) {
      return `🌙 Dream Interpretation:\n\n${sentences.slice(0, 3).join('. ')}.`;
    }
    return 'The dream realm holds mysteries that unfold with patience and reflection.';
  } catch {
    return 'The dream realm holds mysteries that unfold with patience and reflection.';
  }
}

/**
 * AI Affirmation Generator
 * Generates personalized affirmations based on zodiac sign and mood
 */
export async function generateAffirmation(sign: string, mood: string): Promise<string> {
  try {
    const prompt = `Write a powerful, uplifting affirmation for a ${sign} who is feeling ${mood}. Keep it under 20 words.`;
    const result = await hfInference('gpt2', prompt);
    const generated = result?.[0]?.generated_text || '';
    const clean = generated.replace(prompt, '').trim();
    if (clean.length > 10) {
      return `✨ Your Cosmic Affirmation:\n\n"${clean.split(/[.!?]/)[0].trim()}"`;
    }
    return `✨ Your Cosmic Affirmation:\n\n"I am ${sign}, and I embrace the cosmic energy flowing through me."`;
  } catch {
    return `✨ Your Cosmic Affirmation:\n\n"I am ${sign}, and I embrace the cosmic energy flowing through me."`;
  }
}

/**
 * AI Numerology Analysis
 * Analyzes numbers for spiritual significance
 */
export async function analyzeNumerology(number: number): Promise<string> {
  try {
    const prompt = `In numerology, the number ${number} represents:`;
    const result = await hfInference('gpt2', prompt);
    const generated = result?.[0]?.generated_text || '';
    const sentences = generated.split(/[.!?]/).filter(s => s.trim().length > 10);
    if (sentences.length > 0) {
      return `🔢 Numerology Insight: ${sentences.slice(0, 2).join('. ')}.`;
    }
    return `🔢 Numerology Insight: The number ${number} carries unique vibrational energy in the cosmic realm.`;
  } catch {
    return `🔢 Numerology Insight: The number ${number} carries unique vibrational energy in the cosmic realm.`;
  }
}

/**
 * Sentiment Analysis for User Journal Entries
 * Uses free HuggingFace sentiment model
 */
export async function analyzeSentiment(text: string): Promise<{ label: string; score: number }> {
  try {
    const result = await hfInference('distilbert-base-uncased-finetuned-sst-2-english', text);
    const item = result?.[0];
    if (item && item.label && item.score !== undefined) {
      return { label: item.label, score: item.score };
    }
    return { label: 'NEUTRAL', score: 0.5 };
  } catch {
    return { label: 'NEUTRAL', score: 0.5 };
  }
}

/**
 * Local AI: Lightweight deterministic fortune generator
 * No API call needed — completely offline
 */
export function generateLocalFortune(sign: string, seed: number): string {
  const fortunes = [
    `The stars align in your favor today, ${sign}. Trust your instincts.`,
    `A cosmic shift brings new opportunities to ${sign}. Stay open to change.`,
    `${sign}, your inner light shines brighter than ever. Share it with the world.`,
    `Patience is your cosmic gift today, ${sign}. Good things are unfolding.`,
    `The universe whispers secrets to ${sign}. Listen closely to your dreams.`,
    `A journey of self-discovery awaits ${sign}. Embrace the unknown with courage.`,
    `Cosmic energy surrounds ${sign} today. Channel it into creative pursuits.`,
    `The celestial bodies conspire to bring joy to ${sign}. Accept it gratefully.`,
  ];
  const index = Math.abs(seed) % fortunes.length;
  return fortunes[index];
}

/**
 * AI-Powered Daily Cosmic Summary
 * Combines multiple AI features into one daily reading
 */
export async function generateCosmicSummary(sign: string, mood: string, luckyNumber: number): Promise<{
  affirmation: string;
  numerology: string;
  fortune: string;
  sentiment: { label: string; score: number };
}> {
  const [affirmation, numerology] = await Promise.all([
    generateAffirmation(sign, mood),
    analyzeNumerology(luckyNumber),
  ]);
  const fortune = generateLocalFortune(sign, luckyNumber * 7);
  const sentiment = { label: 'POSITIVE', score: 0.85 }; // Default positive for cosmic app

  return {
    affirmation,
    numerology,
    fortune,
    sentiment,
  };
}
