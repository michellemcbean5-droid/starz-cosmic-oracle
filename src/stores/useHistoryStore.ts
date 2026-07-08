import { create } from 'zustand';
import { ReadingHistoryItem, DreamInterpretation, CompatibilityResult, NumerologyReading } from '../types';
import { Storage } from '../utils/storage';

interface HistoryState {
  history: ReadingHistoryItem[];
  dreams: DreamInterpretation[];
  compatibilities: CompatibilityResult[];
  numerologyReadings: NumerologyReading[];
  loadHistory: () => Promise<void>;
  addReading: (item: Omit<ReadingHistoryItem, 'id'>) => Promise<void>;
  addDream: (dream: Omit<DreamInterpretation, 'id'>) => Promise<void>;
  addCompatibility: (comp: CompatibilityResult) => Promise<void>;
  addNumerology: (reading: NumerologyReading) => Promise<void>;
  clearHistory: () => Promise<void>;
  clearDreams: () => Promise<void>;
  clearCompatibilities: () => Promise<void>;
  clearNumerology: () => Promise<void>;
}

export const useHistoryStore = create<HistoryState>((set) => ({
  history: [],
  dreams: [],
  compatibilities: [],
  numerologyReadings: [],

  loadHistory: async () => {
    const stored = await Storage.get<ReadingHistoryItem[]>('reading_history');
    const storedDreams = await Storage.get<DreamInterpretation[]>('dream_history');
    const storedCompat = await Storage.get<CompatibilityResult[]>('compatibility_history');
    const storedNum = await Storage.get<NumerologyReading[]>('numerology_history');
    if (stored) set({ history: stored });
    if (storedDreams) set({ dreams: storedDreams });
    if (storedCompat) set({ compatibilities: storedCompat });
    if (storedNum) set({ numerologyReadings: storedNum });
  },

  addReading: async (item) => {
    const stored = await Storage.get<ReadingHistoryItem[]>('reading_history') || [];
    const newItem: ReadingHistoryItem = { ...item, id: `reading-${Date.now()}` };
    const updated = [newItem, ...stored].slice(0, 100);
    await Storage.set('reading_history', updated);
    set({ history: updated });
  },

  addDream: async (dream) => {
    const stored = await Storage.get<DreamInterpretation[]>('dream_history') || [];
    const newItem: DreamInterpretation = { ...dream, id: `dream-${Date.now()}` };
    const updated = [newItem, ...stored].slice(0, 50);
    await Storage.set('dream_history', updated);
    set({ dreams: updated });
  },

  addCompatibility: async (comp) => {
    const stored = await Storage.get<CompatibilityResult[]>('compatibility_history') || [];
    const updated = [comp, ...stored].slice(0, 50);
    await Storage.set('compatibility_history', updated);
    set({ compatibilities: updated });
  },

  addNumerology: async (reading) => {
    const stored = await Storage.get<NumerologyReading[]>('numerology_history') || [];
    const updated = [reading, ...stored].slice(0, 50);
    await Storage.set('numerology_history', updated);
    set({ numerologyReadings: updated });
  },

  clearHistory: async () => {
    await Storage.remove('reading_history');
    set({ history: [] });
  },

  clearDreams: async () => {
    await Storage.remove('dream_history');
    set({ dreams: [] });
  },

  clearCompatibilities: async () => {
    await Storage.remove('compatibility_history');
    set({ compatibilities: [] });
  },

  clearNumerology: async () => {
    await Storage.remove('numerology_history');
    set({ numerologyReadings: [] });
  },
}));
