import { TarotCard, TarotReading } from '../types';
import { TAROT_DECK } from '../constants/astrology';
import { shuffleTarot } from '../utils/astroCalculations';
import { enhanceTarotReading } from './ai';

export function getTarotDeck(): TarotCard[] {
  return TAROT_DECK;
}

export async function drawTarotCards(count: number = 3, question?: string): Promise<TarotReading> {
  const seed = Date.now();
  const shuffled = shuffleTarot(seed);
  const cards = shuffled.slice(0, count).map((index) => TAROT_DECK[index % TAROT_DECK.length]);
  const interpretation = generateTarotInterpretation(cards, question);
  const aiEnhancement = await enhanceTarotReading(cards.map(c => c.name), question);
  const fullInterpretation = aiEnhancement
    ? `${interpretation}\n\n${aiEnhancement}`
    : interpretation;

  return {
    id: `tarot-${seed}`,
    date: new Date().toISOString().split('T')[0],
    cards,
    question: question || 'General reading',
    interpretation: fullInterpretation,
  };
}

function generateTarotInterpretation(cards: TarotCard[], question?: string): string {
  const positions = ['Past / Foundation', 'Present / Challenge', 'Future / Outcome'];
  const parts = cards.map((card, i) => {
    const position = positions[i] || 'Additional insight';
    return `${position}: ${card.name} — ${card.meaning}`;
  });
  const questionIntro = question
    ? `For your question "${question}", the cards reveal:\n\n`
    : 'The cosmic cards reveal:\n\n';
  return questionIntro + parts.join('\n\n') + '\n\nTrust the wisdom of the universe as you move forward.';
}
