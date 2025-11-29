'use client';

import { create } from 'zustand';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Habit = {
  id: string;
  name: string;
  frequency: string;
  days?: number[];
  targettime?: string;
  notes?: string;
};

type DailyLog = {
  date: string;
  completedHabits: string[];
  extraHabits: string[];
  reflection: string;
};

type Personality = {
  mbti?: string;
  enneagram?: string;
  wakeUp?: string;
  bedTime?: string;
};

export const useStore = create<{
  user: any | null;
  authLoading: boolean;
  habits: Habit[];
  logs: DailyLog[];
  personality: Personality | null;
  load: () => Promise<void>;
  saveHabits: (h: Habit[]) => Promise<void>;
  saveLog: (l: DailyLog) => Promise<void>;
  savePersonality: (p: Personality) => Promise<void>;
  initAuth: () => Promise<void>;
}>((set, get) => ({
  user: null,  // ← Start as null to avoid undefined
  authLoading: true,
  habits: [],
  logs: [],
  personality: null,
  initAuth: async () => {
    set({ authLoading: true });
    const { data: { session } } = await supabase.auth.getSession();
    set({ user: session?.user ?? null });
    if (session?.user) await get().load();
    supabase.auth.onAuthStateChange((_, session) => {
      set({ user: session?.user ?? null });
      if (session?.user) get().load();
    });
    set({ authLoading: false });
  },
  load: async () => {
    const { user } = get();
    if (!user) return set({ habits: [], logs: [], personality: null });
    const { data: h } = await supabase.from('habits').select('*').eq('user_id', user.id);
    const { data: l } = await supabase.from('logs').select('*').eq('user_id', user.id);
    const { data: p } = await supabase.from('personality').select('*').eq('user_id', user.id).single();
    set({ habits: h || [], logs: l || [], personality: p || null });
  },
  saveHabits: async (habits) => {
    const { user } = get();
    if (!user) return;
    const habitsToSave = habits.map(h => ({
      ...h,
      user_id: user.id,
    }));
    const { error } = await supabase.from('habits').upsert(habitsToSave);
    if (error) console.error('Save habits error:', error);
    else set({ habits });
  },
  saveLog: async (log) => {
    const { user } = get();
    if (!user) return;
    await supabase.from('logs').upsert({ ...log, user_id: user.id });
  },
  savePersonality: async (p) => {
    const { user } = get();
    if (!user) return;
    await supabase.from('personality').upsert({ ...p, user_id: user.id });
    set({ personality: p });
  },
}));