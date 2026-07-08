import { create } from 'zustand';
import { ReadingHistoryItem } from '../types';
import { Storage } from '../utils/storage';

interface HistoryState {
  history: ReadingHistoryItem[];
  loadHistory: () => Promise<void>;
  addReading: (item: Omit<ReadingHistoryItem, 'id'>) => Promise<void>;
  clearHistory: () => Promise<void>;
}

export const useHistoryStore = create<HistoryState>((set) => ({
  history: [],

  loadHistory: async () => {
    const stored = await Storage.get<ReadingHistoryItem[]>('reading_history');
    if (stored) set({ history: stored });
  },

  addReading: async (item) => {
    const stored = await Storage.get<ReadingHistoryItem[]>('reading_history') || [];
    const newItem: ReadingHistoryItem = { ...item, id: `reading-${Date.now()}` };
    const updated = [newItem, ...stored].slice(0, 100); // keep last 100
    await Storage.set('reading_history', updated);
    set({ history: updated });
  },

  clearHistory: async () => {
    await Storage.remove('reading_history');
    set({ history: [] });
  },
}));
