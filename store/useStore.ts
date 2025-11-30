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
  frequency: 'daily' | 'weekly';
  days?: number[];
  targettime?: string;
  notes?: string;
  icon?: string;  // ← new field
};

type DailyLog = {
  date: string;
  completedHabits: string[];
  extraHabits: string[];
  reflection: string;
  reframed?: string;
};

type Personality = {
  mbti?: string;
  enneagram?: string;
  wakeUp?: string;
  bedTime?: string;
  whoIWantToBe?: string;
  howIWantToBeSeen?: string;
  whatIWantToStandFor?: string;
};

export const useStore = create<{
  user: any | null;
  authLoading: boolean;
  habits: Habit[];
  logs: DailyLog[];
  personality: Personality | null;
  initAuth: () => Promise<void>;
  load: () => Promise<void>;
  saveHabits: (h: Habit[]) => Promise<void>;
  saveLog: (l: DailyLog) => Promise<void>;
  savePersonality: (p: Personality) => Promise<void>;
}>((set, get) => ({
  user: null,
  authLoading: true,
  habits: [],
  logs: [],
  personality: null,

initAuth: async () => {
  set({ authLoading: true });
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user ?? null;
  set({ user, authLoading: false });

  if (user) {
    await get().load();

    // FIRST-TIME USER? Add beautiful starter habits silently
    if (get().habits.length === 0) {
      const starterHabits = [
        { name: "Drink 2L water", icon: "Droplets" },
        { name: "Meditate", icon: "Brain" },
        { name: "Exercise", icon: "Dumbbell" },
        { name: "Read", icon: "BookOpen" },
        { name: "Sleep 8h", icon: "Moon" },
        { name: "Journal", icon: "Pen" },
        { name: "Gratitude", icon: "Heart" },
        { name: "Walk 10k steps", icon: "Footprints" },
        { name: "No phone in bed", icon: "SmartphoneNfc" },
        { name: "Cold shower", icon: "Snowflake" },
        { name: "Stretch", icon: "Move" },
        { name: "Call family", icon: "Phone" },
        { name: "Learn something", icon: "Lightbulb" },
        { name: "No sugar", icon: "CandyOff" },
        { name: "Make bed", icon: "Bed" },
        { name: "Floss", icon: "Smile" },
        { name: "5 min breathing", icon: "Wind" },
        { name: "Push-ups", icon: "Arm" },
        { name: "Nature walk", icon: "Trees" },
        { name: "Write 3 wins", icon: "Trophy" },
      ];

      const newHabits = starterHabits.map(h => ({
        id: crypto.randomUUID(),
        name: h.name,
        frequency: 'daily' as const,
        icon: h.icon,
      }));

      await get().saveHabits(newHabits);
    }
  }

  supabase.auth.onAuthStateChange((_, session) => {
    set({ user: session?.user ?? null });
    if (session?.user) get().load();
  });
},

  load: async () => {
    const { user } = get();
    if (!user) return;

    const { data: h } = await supabase.from('habits').select('*').eq('user_id', user.id);
    const { data: l } = await supabase.from('logs').select('*').eq('user_id', user.id);
    const { data: p } = await supabase.from('personality').select('*').eq('user_id', user.id).single();

    set({
      habits: h || [],
      logs: l || [],
      personality: p || null,
    });
  },

  saveHabits: async (habits) => {
    const { user } = get();
    if (!user) return;
    const toSave = habits.map(h => ({ ...h, user_id: user.id }));
    await supabase.from('habits').upsert(toSave);
    set({ habits });
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




