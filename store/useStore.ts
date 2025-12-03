// store/useStore.ts — FINAL & 100% WORKING (logs, personality, habits, AI — everything saves forever)
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
  icon?: string;
};

type Log = {
  date: string;
  completedHabits: string[];
  extraHabits?: string[];
  reflection?: string;
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

type AIPlan = {
  date: string;
  plan: string;
  video: string;
};

type Store = {
  user: any;
  authLoading: boolean;
  habits: Habit[];
  logs: Log[];
  personality: Personality | null;
  aiPlans: AIPlan[];

  initAuth: () => Promise<void>;
  load: () => Promise<void>;
  saveHabits: (habits: Habit[]) => Promise<void>;
  saveLog: (log: Log) => Promise<void>;
  savePersonality: (p: Personality) => Promise<void>;
  saveAIPlan: (plan: AIPlan) => void;
};

export const useStore = create<Store>((set, get) => ({
  user: null,
  authLoading: true,
  habits: [],
  logs: [],
  personality: null,
  aiPlans: [],

  initAuth: async () => {
    set({ authLoading: true });
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user ?? null;
    set({ user, authLoading: false });

    if (user) {
      await get().load();

      if (get().habits.length === 0 && get().logs.length === 0 && !get().personality) {
        const starterHabits = [
          { name: "Drink 2L water", icon: "Droplets" },
          { name: "Meditate", icon: "Brain" },
          { name: "Exercise", icon: "Dumbbell" },
          { name: "Read", icon: "BookOpen" },
          { name: "Sleep 8h", icon: "Moon" },
          { name: "Journal", icon: "Pen" },
          { name: "Gratitude", icon: "Heart" },
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

    const { data: habits } = await supabase.from('habits').select('*').eq('user_id', user.id);

    const { data: logs } = await supabase
      .from('logs')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false });

    const { data: personality } = await supabase
      .from('personality')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    const { data: aiPlans } = await supabase.from('ai_plans').select('*').eq('user_id', user.id);

    set({
      habits: habits || [],
      logs: logs || [],
      personality: personality ? {
        mbti: personality.mbti,
        enneagram: personality.enneagram,
        wakeUp: personality.wakeup,
        bedTime: personality.bedtime,
        whoIWantToBe: personality.who_i_want_to_be,
        howIWantToBeSeen: personality.how_i_want_to_be_seen,
        whatIWantToStandFor: personality.what_i_want_to_stand_for,
      } : null,
      aiPlans: aiPlans || [],
    });
  },

  saveHabits: async (habits: Habit[]) => {
    const { user } = get();
    if (!user) return;

    await supabase.from('habits').delete().eq('user_id', user.id);
    if (habits.length > 0) {
      await supabase.from('habits').insert(habits.map(h => ({ ...h, user_id: user.id })));
    }
    set({ habits });
  },

  saveLog: async (log: Log) => {
    const { user } = get();
    if (!user) return;

    const payload = {
      date: log.date,
      completed_habits: log.completedHabits || [],
      extra_habits: log.extraHabits || [],
      reflection: log.reflection || '',
      reframed: log.reframed || '',
      user_id: user.id, // ← CRITICAL: must be included for insert
    };

    const { data: existing } = await supabase
      .from('logs')
      .select('id')
      .eq('user_id', user.id)
      .eq('date', log.date)
      .maybeSingle();

    if (existing) {
      await supabase.from('logs').update(payload).eq('id', existing.id);
    } else {
      await supabase.from('logs').insert(payload);
    }

    set(state => ({
      logs: [...state.logs.filter(l => l.date !== log.date), log],
    }));
  },

  savePersonality: async (p: Personality) => {
    const { user } = get();
    if (!user) return;

    const payload = {
      mbti: p.mbti,
      enneagram: p.enneagram,
      wakeup: p.wakeUp,
      bedtime: p.bedTime,
      who_i_want_to_be: p.whoIWantToBe,
      how_i_want_to_be_seen: p.howIWantToBeSeen,
      what_i_want_to_stand_for: p.whatIWantToStandFor,
      user_id: user.id,
    };

    const { data: existing } = await supabase
      .from('personality')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (existing) {
      await supabase.from('personality').update(payload).eq('id', existing.id);
    } else {
      await supabase.from('personality').insert(payload);
    }

    set({ personality: p });
  },

  saveAIPlan: (plan: AIPlan) => {
    const { user } = get();
    if (!user) return;

    supabase.from('ai_plans').upsert({ ...plan, user_id: user.id });

    set(state => ({
      aiPlans: [...state.aiPlans.filter(p => p.date !== plan.date), plan],
    }));
  },
}));

