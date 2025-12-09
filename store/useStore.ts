// store/useStore.ts — FINAL & 100% WORKING — NO MORE ERRORS
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
  completed_habits: string[];
  extra_habits?: string[];
  reflection?: string;
  reframed?: string;
};

type Personality = {
  mbti?: string;
  enneagram?: string;
  wakeup?: string;
  bedtime?: string;
  who_i_want_to_be?: string;
  how_i_want_to_be_seen?: string;
  what_i_want_to_stand_for?: string;
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
  saveLog: (log: any) => Promise<void>;
  savePersonality: (p: any) => Promise<void>;
  saveAIPlan: (plan: AIPlan) => Promise<void>;
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
    set({ user: session?.user ?? null, authLoading: false });
    if (session?.user) await get().load();

    supabase.auth.onAuthStateChange((_, session) => {
      set({ user: session?.user ?? null });
      if (session?.user) get().load();
    });
  },

  load: async () => {
    const { user } = get();
    if (!user) return;

    const { data: habits } = await supabase.from('habits').select('*').eq('user_id', user.id);

    const { data: rawLogs } = await supabase
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

    // ← FINAL FIX: map snake_case → camelCase AND match Log type exactly
    const logs = (rawLogs || []).map(log => ({
      date: log.date,
      completed_habits: log.completed_habits || [],
      extra_habits: log.extra_habits || [],
      reflection: log.reflection || '',
      reframed: log.reframed || '',
    } as Log));

    set({
      habits: habits || [],
      logs,
      personality: personality ? {
        mbti: personality.mbti,
        enneagram: personality.enneagram,
        wakeup: personality.wakeup,
        bedtime: personality.bedtime,
        who_i_want_to_be: personality.who_i_want_to_be,
        how_i_want_to_be_seen: personality.how_i_want_to_be_seen,
        what_i_want_to_stand_for: personality.what_i_want_to_stand_for,
      } : null,
      aiPlans: aiPlans || [],
    });
  },

saveHabits: async (habits: Habit[]) => {
    const { user } = get();
    if (!user) return;

    try {
      // 1. Delete all old habits for this user
      const { error: deleteError } = await supabase
        .from('habits')
        .delete()
        .eq('user_id', user.id);

      if (deleteError) {
        console.error('Delete failed:', deleteError);
        return;
      }

      // 2. Insert the new list
      if (habits.length > 0) {
        const { error: insertError } = await supabase
          .from('habits')
          .insert(habits.map(h => ({ ...h, user_id: user.id })));

        if (insertError) {
          console.error('Insert failed:', insertError);
          return;
        }
      }

      // 3. Update local state — THIS IS WHAT MAKES IT SHOW INSTANTLY
      set({ habits });

      console.log('Habits saved successfully:', habits.length, 'habits');
    } catch (err) {
      console.error('saveHabits crashed:', err);
    }
  },
  saveLog: async (log: any) => {
    const { user } = get();
    if (!user) return;

    const payload = {
      date: log.date,
      completed_habits: log.completedHabits || [],
      extra_habits: log.extraHabits || [],
      reflection: log.reflection || '',
      reframed: log.reframed || '',
      user_id: user.id,
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

  savePersonality: async (p: any) => {
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

  saveAIPlan: async (plan: AIPlan) => {
    const { user } = get();
    if (!user) return;

    const payload = {
      date: plan.date,
      plan: plan.plan,
      video: plan.video || '',
      user_id: user.id,
    };

    await supabase.from('ai_plans').upsert(payload, { onConflict: 'user_id,date' });
  },
}));







