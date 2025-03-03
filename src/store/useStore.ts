import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface Group {
  id: string;
  name: string;
  team_code: string;
  total_points: number;
}

interface Event {
  id: string;
  name: string;
  type: 'individual' | 'dual' | 'group';
  max_winners: number;
  stage?: string;
  start_time?: string;
}

interface Result {
  id: string;
  event_id: string;
  group_id: string;
  position: number;
  points: number;
  participant_name?: string;
}

interface Store {
  groups: Group[];
  events: Event[];
  results: Result[];
  darkMode: boolean;
  loading: boolean;
  error: string | null;
  fetchGroups: () => Promise<void>;
  fetchEvents: () => Promise<void>;
  fetchResults: () => Promise<void>;
  toggleDarkMode: () => void;
}

export const useStore = create<Store>((set, get) => ({
  groups: [],
  events: [],
  results: [],
  darkMode: false,
  loading: false,
  error: null,

  fetchGroups: async () => {
    try {
      set({ loading: true });
      const { data, error } = await supabase.from('groups').select('*');
      if (error) throw error;
      set({ groups: data, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  fetchEvents: async () => {
    try {
      set({ loading: true });
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('start_time', { ascending: true });
      if (error) throw error;
      set({ events: data, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  fetchResults: async () => {
    try {
      set({ loading: true });
      const { data, error } = await supabase.from('results').select('*');
      if (error) throw error;
      set({ results: data, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
}));