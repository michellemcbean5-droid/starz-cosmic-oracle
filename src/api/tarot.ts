import { TarotCard, TarotReading } from '../types';
import { TAROT_DECK } from '../constants/astrology';
import { shuffleTarot } from '../utils/astroCalculations';

export function getTarotDeck(): TarotCard[] {
  return TAROT_DECK;
}

export function drawTarotCards(count: number = 3, question?: string): TarotReading {
  const seed = Date.now();
  const shuffled = shuffleTarot(seed);
  const cards = shuffled.slice(0, count).map((index) => TAROT_DECK[index % TAROT_DECK.length]);
  const interpretation = generateTarotInterpretation(cards, question);
  return {
    id: `tarot-${seed}`,
    date: new Date().toISOString().split('T')[0],
    cards,
    question: question || 'General reading',
    interpretation,
  };
}

function generateTarotInterpretation(cards: TarotCard[], question?: string): string {
  const positions = ['Past / Foundation', 'Present / Challenge', 'Future / Outcome'];
  const parts = cards.map((card, i) => {
    const position = positions[i] || 'Additional insight';
    return `${position}: ${card.name} — ${card.meaning}`;
  });
  const questionIntro = question ? `For your question "${question}", the cards reveal:

` : 'The cosmic cards reveal:

';
  return questionIntro + parts.join('

') + '

Trust the wisdom of the universe as you move forward.';
}
