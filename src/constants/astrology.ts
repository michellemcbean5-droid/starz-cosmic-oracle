import { ZodiacSign, Planet, TarotCard } from '../types';

export const ZODIAC_SIGNS: ZodiacSign[] = [
  'Aries', 'Taurus', 'Gemini', 'Cancer',
  'Leo', 'Virgo', 'Libra', 'Scorpio',
  'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
];

export const ZODIAC_EMOJIS: Record<ZodiacSign, string> = {
  Aries: '♈', Taurus: '♉', Gemini: '♊', Cancer: '♋',
  Leo: '♌', Virgo: '♍', Libra: '♎', Scorpio: '♏',
  Sagittarius: '♐', Capricorn: '♑', Aquarius: '♒', Pisces: '♓',
};

export const ZODIAC_ELEMENTS: Record<ZodiacSign, 'Fire' | 'Earth' | 'Air' | 'Water'> = {
  Aries: 'Fire', Taurus: 'Earth', Gemini: 'Air', Cancer: 'Water',
  Leo: 'Fire', Virgo: 'Earth', Libra: 'Air', Scorpio: 'Water',
  Sagittarius: 'Fire', Capricorn: 'Earth', Aquarius: 'Air', Pisces: 'Water',
};

export const ZODIAC_DATES: Record<ZodiacSign, { start: [number, number]; end: [number, number] }> = {
  Aries: { start: [3, 21], end: [4, 19] },
  Taurus: { start: [4, 20], end: [5, 20] },
  Gemini: { start: [5, 21], end: [6, 20] },
  Cancer: { start: [6, 21], end: [7, 22] },
  Leo: { start: [7, 23], end: [8, 22] },
  Virgo: { start: [8, 23], end: [9, 22] },
  Libra: { start: [9, 23], end: [10, 22] },
  Scorpio: { start: [10, 23], end: [11, 21] },
  Sagittarius: { start: [11, 22], end: [12, 21] },
  Capricorn: { start: [12, 22], end: [1, 19] },
  Aquarius: { start: [1, 20], end: [2, 18] },
  Pisces: { start: [2, 19], end: [3, 20] },
};

export const PLANETS: Planet[] = [
  'Sun', 'Moon', 'Mercury', 'Venus', 'Mars',
  'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto',
];

export const PLANET_EMOJIS: Record<Planet, string> = {
  Sun: '☉', Moon: '☽', Mercury: '☿', Venus: '♀', Mars: '♂',
  Jupiter: '♃', Saturn: '♄', Uranus: '♅', Neptune: '♆', Pluto: '♇',
};

export const PLANET_COLORS: Record<Planet, string> = {
  Sun: '#F5A623', Moon: '#E0E0E0', Mercury: '#4ECDC4', Venus: '#FF6B9D',
  Mars: '#E74C3C', Jupiter: '#F39C12', Saturn: '#D4AF37', Uranus: '#00D2FF',
  Neptune: '#1E90FF', Pluto: '#8B008B',
};

export const TAROT_DECK: TarotCard[] = [
  { id: 0, name: 'The Fool', arcana: 'Major', meaning: 'New beginnings, innocence, spontaneity.', reversed: 'Recklessness, risk-taking, naivety.', keywords: ['beginnings', 'innocence', 'spontaneity'] },
  { id: 1, name: 'The Magician', arcana: 'Major', meaning: 'Manifestation, resourcefulness, power.', reversed: 'Manipulation, poor planning, untapped talents.', keywords: ['manifestation', 'power', 'action'] },
  { id: 2, name: 'The High Priestess', arcana: 'Major', meaning: 'Intuition, sacred knowledge, divine feminine.', reversed: 'Secrets, disconnected from intuition, withdrawal.', keywords: ['intuition', 'mystery', 'wisdom'] },
  { id: 3, name: 'The Empress', arcana: 'Major', meaning: 'Fertility, nurturing, abundance, nature.', reversed: 'Creative block, dependence, emptiness.', keywords: ['abundance', 'nurturing', 'fertility'] },
  { id: 4, name: 'The Emperor', arcana: 'Major', meaning: 'Authority, structure, father figure, stability.', reversed: 'Tyranny, rigidity, coldness.', keywords: ['authority', 'structure', 'control'] },
  { id: 5, name: 'The Hierophant', arcana: 'Major', meaning: 'Tradition, spiritual guidance, conformity.', reversed: 'Rebellion, subversiveness, freedom.', keywords: ['tradition', 'guidance', 'belief'] },
  { id: 6, name: 'The Lovers', arcana: 'Major', meaning: 'Love, harmony, relationships, choices.', reversed: 'Self-love, disharmony, imbalance.', keywords: ['love', 'harmony', 'choices'] },
  { id: 7, name: 'The Chariot', arcana: 'Major', meaning: 'Control, willpower, success, determination.', reversed: 'Self-doubt, lack of direction, aggression.', keywords: ['willpower', 'victory', 'determination'] },
  { id: 8, name: 'Strength', arcana: 'Major', meaning: 'Courage, persuasion, influence, compassion.', reversed: 'Self-doubt, weakness, insecurity.', keywords: ['courage', 'patience', 'inner strength'] },
  { id: 9, name: 'The Hermit', arcana: 'Major', meaning: 'Soul-searching, introspection, guidance, solitude.', reversed: 'Isolation, loneliness, withdrawal.', keywords: ['introspection', 'solitude', 'guidance'] },
  { id: 10, name: 'Wheel of Fortune', arcana: 'Major', meaning: 'Good luck, karma, cycles, destiny.', reversed: 'Bad luck, resistance to change, breaking cycles.', keywords: ['change', 'cycles', 'destiny'] },
  { id: 11, name: 'Justice', arcana: 'Major', meaning: 'Fairness, truth, law, cause and effect.', reversed: 'Unfairness, lack of accountability, dishonesty.', keywords: ['justice', 'truth', 'balance'] },
  { id: 12, name: 'The Hanged Man', arcana: 'Major', meaning: 'Pause, surrender, letting go, new perspective.', reversed: 'Delays, resistance, stalling.', keywords: ['surrender', 'sacrifice', 'perspective'] },
  { id: 13, name: 'Death', arcana: 'Major', meaning: 'Endings, change, transformation, transition.', reversed: 'Resistance to change, inability to move on.', keywords: ['transformation', 'endings', 'change'] },
  { id: 14, name: 'Temperance', arcana: 'Major', meaning: 'Balance, moderation, patience, purpose.', reversed: 'Imbalance, excess, self-healing.', keywords: ['balance', 'moderation', 'harmony'] },
  { id: 15, name: 'The Devil', arcana: 'Major', meaning: 'Shadow self, attachment, restriction, addiction.', reversed: 'Releasing limiting beliefs, detachment.', keywords: ['addiction', 'materialism', 'bondage'] },
  { id: 16, name: 'The Tower', arcana: 'Major', meaning: 'Sudden change, upheaval, chaos, awakening.', reversed: 'Personal transformation, fear of change.', keywords: ['upheaval', 'awakening', 'destruction'] },
  { id: 17, name: 'The Star', arcana: 'Major', meaning: 'Hope, faith, purpose, renewal, spirituality.', reversed: 'Lack of faith, despair, discouragement.', keywords: ['hope', 'inspiration', 'serenity'] },
  { id: 18, name: 'The Moon', arcana: 'Major', meaning: 'Illusion, fear, anxiety, subconscious, intuition.', reversed: 'Release of fear, repressed emotion, confusion.', keywords: ['intuition', 'illusion', 'fear'] },
  { id: 19, name: 'The Sun', arcana: 'Major', meaning: 'Positivity, fun, warmth, success, vitality.', reversed: 'Inner child, feeling down, overly optimistic.', keywords: ['joy', 'success', 'vitality'] },
  { id: 20, name: 'Judgement', arcana: 'Major', meaning: 'Judgement, rebirth, inner calling, absolution.', reversed: 'Self-doubt, refusal of self-examination.', keywords: ['rebirth', 'inner calling', 'forgiveness'] },
  { id: 21, name: 'The World', arcana: 'Major', meaning: 'Completion, integration, accomplishment, travel.', reversed: 'Seeking closure, short-cuts, delays.', keywords: ['completion', 'fulfillment', 'wholeness'] },
  // Minor Arcana - Wands
  { id: 22, name: 'Ace of Wands', arcana: 'Minor', suit: 'Wands', meaning: 'Creation, willpower, inspiration, desire.', reversed: 'Lack of energy, lack of passion, boredom.', keywords: ['creation', 'desire', 'inspiration'] },
  { id: 23, name: 'Two of Wands', arcana: 'Minor', suit: 'Wands', meaning: 'Planning, decisions, discovery, future planning.', reversed: 'Fear of unknown, lack of planning.', keywords: ['planning', 'discovery', 'future'] },
  { id: 24, name: 'Three of Wands', arcana: 'Minor', suit: 'Wands', meaning: 'Expansion, foresight, overseas opportunities.', reversed: 'Obstacles, delays, frustration.', keywords: ['expansion', 'opportunity', 'leadership'] },
  { id: 25, name: 'Four of Wands', arcana: 'Minor', suit: 'Wands', meaning: 'Celebration, joy, relaxation, community.', reversed: 'Transition, lack of support, home conflict.', keywords: ['celebration', 'community', 'joy'] },
  { id: 26, name: 'Five of Wands', arcana: 'Minor', suit: 'Wands', meaning: 'Conflict, disagreements, competition, tension.', reversed: 'Reconciliation, making peace, past resentment.', keywords: ['conflict', 'competition', 'struggle'] },
  { id: 27, name: 'Six of Wands', arcana: 'Minor', suit: 'Wands', meaning: 'Victory, success, public recognition, progress.', reversed: 'Ego, pride, lack of recognition.', keywords: ['victory', 'success', 'recognition'] },
  // Minor Arcana - Cups
  { id: 28, name: 'Ace of Cups', arcana: 'Minor', suit: 'Cups', meaning: 'New feelings, spirituality, intuition, love.', reversed: 'Emotional loss, blocked creativity, emptiness.', keywords: ['love', 'new feelings', 'spirituality'] },
  { id: 29, name: 'Two of Cups', arcana: 'Minor', suit: 'Cups', meaning: 'Unity, partnership, mutual attraction.', reversed: 'Break-ups, disharmony, distrust.', keywords: ['partnership', 'union', 'attraction'] },
  { id: 30, name: 'Three of Cups', arcana: 'Minor', suit: 'Cups', meaning: 'Friendship, community, happiness, celebration.', reversed: 'Overindulgence, gossip, isolation.', keywords: ['friendship', 'celebration', 'community'] },
  // Minor Arcana - Swords
  { id: 31, name: 'Ace of Swords', arcana: 'Minor', suit: 'Swords', meaning: 'Breakthrough, clarity, sharp mind, new ideas.', reversed: 'Confusion, chaos, lack of clarity.', keywords: ['clarity', 'breakthrough', 'new ideas'] },
  { id: 32, name: 'Two of Swords', arcana: 'Minor', suit: 'Swords', meaning: 'Indecision, difficult choices, stalemate.', reversed: 'Lesser of two evils, no right choice.', keywords: ['indecision', 'choices', 'stalemate'] },
  { id: 33, name: 'Three of Swords', arcana: 'Minor', suit: 'Swords', meaning: 'Heartbreak, grief, sorrow, emotional pain.', reversed: 'Recovery, forgiveness, moving on.', keywords: ['heartbreak', 'grief', 'sorrow'] },
  // Minor Arcana - Pentacles
  { id: 34, name: 'Ace of Pentacles', arcana: 'Minor', suit: 'Pentacles', meaning: 'New financial opportunity, prosperity, abundance.', reversed: 'Lost opportunity, lack of planning, greed.', keywords: ['prosperity', 'abundance', 'new opportunity'] },
  { id: 35, name: 'Two of Pentacles', arcana: 'Minor', suit: 'Pentacles', meaning: 'Balance, adaptability, time management.', reversed: 'Overwhelm, disorganization, reprioritization.', keywords: ['balance', 'adaptability', 'juggling'] },
  { id: 36, name: 'Three of Pentacles', arcana: 'Minor', suit: 'Pentacles', meaning: 'Teamwork, collaboration, learning, implementation.', reversed: 'Lack of teamwork, disregard for skills.', keywords: ['teamwork', 'collaboration', 'learning'] },
];

export const MOON_PHASE_NAMES = [
  'New Moon', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous',
  'Full Moon', 'Waning Gibbous', 'Last Quarter', 'Waning Crescent',
];

export const MOON_PHASE_EMOJIS = ['🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘'];

export const SUBSCRIPTION_TIERS = {
  free: { name: 'Free', dailyReadings: 3, price: 0 },
  premium: { name: 'Premium', dailyReadings: -1, price: 9.99 },
  pro: { name: 'Pro', dailyReadings: -1, price: 29.99, includesBirthChart: true },
};
