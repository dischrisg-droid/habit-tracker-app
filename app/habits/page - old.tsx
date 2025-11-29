// app/habits/page.tsx ← Replace everything with this
'use client';

import { useStore } from '@/store/useStore';
import { useEffect, useState } from 'react';
import { format, differenceInDays, parseISO } from 'date-fns';
import {
  Plus, Edit2, Trash2, GripVertical, Flame, ArrowLeft, Sparkles,
} from 'lucide-react';
import Link from 'next/link';

export default function HabitsPage() {
  const { habits, logs, saveHabits } = useStore();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<any>({
    name: '', frequency: 'daily', days: [], targettime: '', notes: '',
  });

  const today = format(new Date(), 'yyyy-MM-dd');
  const todayLog = logs.find(l => l.date === today);

  const calculateStreak = (habit: any) => {
    if (logs.length === 0) return 0;
    const sorted = logs.map(l => l.date).sort((a, b) => b.localeCompare(a));
    let streak = 0;
    let check = new Date();

    for (const date of sorted) {
      const logDate = parseISO(date);
      const diff = differenceInDays(check, logDate);
      if (diff > 1) break;

      const done = logs.find(l => l.date === date)?.completedHabits.includes(habit.id);
      if (done) streak++;
      else if (diff === 0) break;
      else break;

      check.setDate(check.getDate() - 1);
    }
    return streak;
  };

  const handleSave = async () => {
    if (!form.name?.trim()) return;
    const habit = {
      id: editingId || crypto.randomUUID(),
      name: form.name.trim(),
      frequency: form.frequency,
      days: form.days || undefined,
      targettime: form.targettime || undefined,
      notes: form.notes || undefined,
    };
    const updated = editingId
      ? habits.map(h => h.id === editingId ? habit : h)
      : [...habits, habit];
    await saveHabits(updated);
    setIsAdding(false);
    setEditingId(null);
    setForm({ name: '', frequency: 'daily', days: [], targettime: '', notes: '' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this habit forever?')) return;
    await saveHabits(habits.filter(h => h.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-100 via-pink-50 to-amber-50">
      {/* Gorgeous Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg group-hover:scale-110 transition">
              <ArrowLeft className="w-5 h-5" />
            </div>
            <h1 className="text-4xl font-black bg-gradient bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              My Habits
            </h1>
          </Link>

          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-3 px-7 py-4 bg-gradient-to-r from-indigo-600 to-purple-700 text-white rounded-2xl font-bold text-lg shadow-2xl hover:shadow-purple-500/30 hover:scale-105 transition-all"
          >
            <Plus className="w-6 h-6" />
            New Habit
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">
        {habits.length === 0 ? (
          <div className="text-center py-32">
            <div className="text-8xl mb-6">No habits yet</div>
            <p className="text-2xl text-gray-600 mb-12">Start building the version of yourself you’re proud of.</p>
            <button
              onClick={() => setIsAdding(true)}
              className="px-12 py-6 text-2xl font-bold text-white bg-gradient-to-r from-indigo-600 to-pink-600 rounded-3xl shadow-2xl hover:shadow-pink-500/40 hover:scale-110 transition-all"
            >
              Create Your First Habit
            </button>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {habits.map((habit) => {
              const streak = calculateStreak(habit);
              const doneToday = todayLog?.completedHabits.includes(habit.id);

              return (
                <div
                  key={habit.id}
                  className="group relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 overflow-hidden border border-white/50"
                >
                  {/* Streak Fire Badge */}
                  {streak > 0 && (
                    <div className={`absolute -top-3 -right-3 flex items-center gap-2 px-5 py-3 rounded-full font-black text-white shadow-2xl animate-pulse
                      ${streak >= 100 ? 'bg-gradient-to-r from-yellow-400 via-red-500 to-pink-600' :
                        streak >= 50 ? 'bg-gradient-to-r from-orange-500 to-red-600' :
                        streak >= 21 ? 'bg-gradient-to-r from-pink-500 to-rose-600' :
                        'bg-gradient-to-r from-amber-500 to-orange-600'}`}
                  >
                    <Flame className="w-7 h-7" />
                    <span className="text-xl">{streak}</span>
                    {streak >= 21 && <Sparkles className="w-6 h-6" />}
                  </div>
                  )}

                  <div className="p-8">
                    <div className="flex items-center gap-4 mb-5">
                      <GripVertical className="w-7 h-7 text-gray-300 group-hover:text-gray-500 transition" />
                      <h2 className="text-3xl font-bold text-gray-800">{habit.name}</h2>
                    </div>

                    <div className="space-y-3 text-gray-700">
                      <p className="text-lg">
                        <span className="font-semibold text-indigo-600">Frequency</span>{' '}
                        {habit.frequency === 'daily' ? 'Daily' : 'Specific days'}
                      </p>
                      {habit.targettime && (
                        <p className="text-lg">
                          <span className="font-semibold text-purple-600">Best time</span> {habit.targettime}
                        </p>
                      )}
                      {habit.notes && (
                        <p className="italic text-gray-600 bg-gray-50 px-4 py-3 rounded-2xl">
                          “{habit.notes}”
                        </p>
                      )}
                    </div>

                    <div className="mt-8 flex items-center justify-between">
                      <span className={`text-xl font-bold ${doneToday ? 'text-emerald-600' : 'text-gray-400'}`}>
                        {doneToday ? 'Done today' : 'Not done yet'}
                      </span>

                      <div className="flex gap-3">
                        <button
                          onClick={() => { setEditingId(habit.id); setForm(habit); setIsAdding(true); }}
                          className="p-4 bg-indigo-100 rounded-2xl hover:bg-indigo-200 transition"
                        >
                          <Edit2 className="w-6 h-6 text-indigo-700" />
                        </button>
                        <button
                          onClick={() => handleDelete(habit.id)}
                          className="p-4 bg-rose-100 rounded-2xl hover:bg-rose-200 transition"
                        >
                          <Trash2 className="w-6 h-6 text-rose-700" />
                        </button>
                      </div>
                    </div>

                    {streak >= 21 && (
                      <div className="mt-6 text-center text-2xl font-black bg-gradient-to-r from-pink-500 to-rose-600 bg-clip-text text-transparent">
                        {streak >= 100 ? 'GOD TIER' : streak >= 50 ? 'Legendary' : 'On Fire'}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Premium Modal */}
      {isAdding && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-xl w-full">
            <h2 className="text-5xl font-black mb-10 text-center bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
              {editingId ? 'Edit Habit' : 'Create New Habit'}
            </h2>

            <input
              autoFocus
              placeholder="What habit are you building?"
              value={form.name || ''}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full px-6 py-5 mb-6 text-xl rounded-2xl border-2 border-gray-200 focus:border-indigo-500 outline-none font-medium"
            />

            <div className="grid grid-cols-2 gap-6 mb-8">
              {(['daily', 'weekly'] as const).map(f => (
                <label key={f} className="flex items-center gap-4 cursor-pointer">
                  <input
                    type="radio"
                    name="freq"
                    checked={form.frequency === f}
                    onChange={() => setForm({ ...form, frequency: f, days: f === 'daily' ? [] : form.days })}
                    className="w-6 h-6 text-indigo-600"
                  />
                  <span className="text-xl font-semibold capitalize">{f === 'daily' ? 'Daily' : 'Choose days'}</span>
                </label>
              ))}
            </div>

            {form.frequency === 'weekly' && (
              <div className="mb-8">
                <p className="text-lg font-semibold mb-4">Repeat on</p>
                <div className="grid grid-cols-7 gap-4">
                  {['S','M','T','W','T','F','S'].map((d, i) => (
                    <label key={i} className="flex flex-col items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.days?.includes(i) ?? false}
                        onChange={e => {
                          const newDays = e.target.checked
                            ? [...(form.days || []), i]
                            : form.days?.filter((x: number) => x !== i) || [];
                          setForm({ ...form, days: newDays });
                        }}
                        className="w-8 h-8 text-indigo-600 rounded-xl"
                      />
                      <span className="mt-3 text-lg font-bold">{d}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <input
              placeholder="Ideal time (e.g. 7:00 AM)"
              value={form.targettime || ''}
              onChange={e => setForm({ ...form, targettime: e.target.value })}
              className="w-full px-6 py-5 mb-6 text-xl rounded-2xl border-200 focus:border-indigo-500 outline-none"
            />

            <textarea
              placeholder="Why does this matter to you? (optional)"
              rows={4}
              value={form.notes || ''}
              onChange={e => setForm({ ...form, notes: e.target.value })}
              className="w-full px-6 py-5 text-xl rounded-2xl border-2 border-gray-200 focus:border-indigo-500 outline-none resize-none"
            />

            <div className="flex gap-5 mt-10">
              <button
                onClick={handleSave}
                className="flex-1 py-6 text-2xl font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl shadow-2xl hover:shadow-purple-600/50 hover:scale-105 transition-all"
              >
                {editingId ? 'Update Habit' : 'Create Habit'}
              </button>
              <button
                onClick={() => { setIsAdding(false); setEditingId(null); }}
                className="px-10 py-6 text-2xl font-bold text-gray-700 bg-gray-100 rounded-2xl hover:bg-gray-200 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}