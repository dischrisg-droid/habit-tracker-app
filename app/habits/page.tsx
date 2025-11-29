'use client';

import { useStore } from '../../store/useStore';
import { useState } from 'react';
import { Plus, Edit2, Trash2, Flame, ArrowLeft, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function HabitsPage() {
  const { habits, logs, saveHabits } = useStore();

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  const [form, setForm] = useState<{
    name: string;
    frequency: 'daily' | 'weekly';
    days: number[];
    targettime: string;
    notes: string;
  }>({
    name: '',
    frequency: 'daily',
    days: [],
    targettime: '',
    notes: '',
  });

  const today = new Date().toISOString().split('T')[0];
  const todayLog = logs.find((l) => l.date === today);

  const getStreak = (habitId: string) => {
    let streak = 0;
    const sorted = [...logs].sort((a, b) => b.date.localeCompare(a.date));
    for (const log of sorted) {
      const daysAgo = Math.floor(
        (Date.now() - new Date(log.date).getTime()) / 86400000
      );
      if (daysAgo > streak) break;
      if (log.completedHabits?.includes(habitId)) streak++;
      else if (daysAgo === 0) break;
      else break;
    }
    return streak;
  };

  const handleSave = async () => {
    if (!form.name.trim()) return;

    const newHabit = editing
      ? { ...editing, ...form, name: form.name.trim() }
      : { id: crypto.randomUUID(), ...form, name: form.name.trim() };

    await saveHabits(
      editing
        ? habits.map((h) => (h.id === editing.id ? newHabit : h))
        : [...habits, newHabit]
    );

    setShowForm(false);
    setEditing(null);
    setForm({ name: '', frequency: 'daily', days: [], targettime: '', notes: '' });
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        {/* Header */}
        <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-white/30">
          <div className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-xl">
                <ArrowLeft className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-5xl font-black bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
                My Habits
              </h1>
            </Link>

            <button
              onClick={() => {
                setEditing(null);
                setForm({ name: '', frequency: 'daily', days: [], targettime: '', notes: '' });
                setShowForm(true);
              }}
              className="px-8 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-2xl font-bold rounded-2xl shadow-2xl hover:scale-105 transition flex items-center gap-3"
            >
              <Plus className="w-8 h-8" />
              New Habit
            </button>
          </div>
        </div>

        <div className="max-w-5xl mx-auto p-8">
          {habits.length === 0 ? (
            <div className="text-center py-40">
              <h2 className="text-7xl font-black text-gray-800 mb-8">No habits yet</h2>
              <button
                onClick={() => setShowForm(true)}
                className="px-20 py-10 text-4xl font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl shadow-2xl hover:scale-110 transition"
              >
                Start Building
              </button>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {habits.map((habit) => {
                const streak = getStreak(habit.id);
                const isDone = todayLog?.completedHabits.includes(habit.id);

                return (
                  <div
                    key={habit.id}
                    className="group relative bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden hover:-translate-y-4 hover:shadow-3xl transition-all duration-500"
                  >
                    {streak > 0 && (
                      <div className="absolute -top-6 -right-6 bg-gradient-to-br from-orange-500 to-pink-600 text-white px-7 py-4 rounded-full font-black text-3xl shadow-2xl flex items-center gap-2 animate-pulse">
                        <Flame className="w-10 h-10" />
                        {streak}
                        {streak >= 21 && <Sparkles className="w-9 h-9" />}
                      </div>
                    )}

                    <div className="p-10">
                      <h3 className="text-4xl font-bold text-gray-800 mb-6">{habit.name}</h3>

                      <div className="space-y-4 text-lg">
                        <p>
                          <span className="font-semibold text-indigo-600">Frequency:</span>{' '}
                          {habit.frequency === 'daily' ? 'Daily' : 'Specific days'}
                        </p>
                        {habit.targettime && (
                          <p>
                            <span className="font-semibold text-pink-600">Best time:</span>{' '}
                            {habit.targettime}
                          </p>
                        )}
                        {habit.notes && (
                          <p className="italic text-gray-600 bg-gray-50 px-5 py-3 rounded-2xl">
                            “{habit.notes}”
                          </p>
                        )}
                      </div>

                      <div className="mt-10 flex items-center justify-between">
                        <span className={`text-2xl font-bold ${isDone ? 'text-green-600' : 'text-gray-400'}`}>
                          {isDone ? 'Done today' : 'Not done yet'}
                        </span>

                        <div className="flex gap-4">
                          <button
                            onClick={() => {
                              setEditing(habit);
                              setForm({
                                name: habit.name,
                                frequency: habit.frequency as 'daily' | 'weekly',
                                days: habit.days ?? [],
                                targettime: habit.targettime ?? '',
                                notes: habit.notes ?? '',
                              });
                              setShowForm(true);
                            }}
                            className="p-4 bg-indigo-100 rounded-2xl hover:bg-indigo-200 transition"
                          >
                            <Edit2 className="w-7 h-7 text-indigo-700" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('Delete forever?')) {
                                saveHabits(habits.filter((h) => h.id !== habit.id));
                              }
                            }}
                            className="p-4 bg-red-100 rounded-2xl hover:bg-red-200 transition"
                          >
                            <Trash2 className="w-7 h-7 text-red-600" />
                          </button>
                        </div>
                      </div>

                      {streak >= 21 && (
                        <div className="mt-8 text-center text-4xl font-black bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent">
                          {streak >= 50 ? 'Legendary' : 'On Fire'}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xl flex items-center justify-center p-6 z-50">
            <div className="bg-white rounded-3xl shadow-3xl p-12 max-w-2xl w-full max-h-screen overflow-y-auto">
              <h2 className="text-5xl font-black text-center mb-12 bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
                {editing ? 'Edit Habit' : 'New Habit'}
              </h2>

              <input
                autoFocus
                placeholder="Habit name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-8 py-6 text-2xl rounded-2xl border-4 border-indigo-200 focus:border-indigo-500 outline-none mb-8"
              />

              <div className="grid grid-cols-2 gap-8 mb-10">
                {(['daily', 'weekly'] as const).map((f) => (
                  <label key={f} className="flex items-center gap-4 text-xl">
                    <input
                      type="radio"
                      checked={form.frequency === f}
                      onChange={() => setForm({ ...form, frequency: f, days: f === 'daily' ? [] : form.days })}
                      className="w-6 h-6 text-indigo-600"
                    />
                    <span className="font-bold capitalize">{f === 'daily' ? 'Daily' : 'Choose days'}</span>
                  </label>
                ))}
              </div>

              {form.frequency === 'weekly' && (
                <div className="flex justify-center gap-6 mb-10">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                    <label key={i} className="text-xl font-bold">
                      <input
                        type="checkbox"
                        checked={form.days.includes(i)}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            days: e.target.checked
                              ? [...form.days, i]
                              : form.days.filter((d) => d !== i),
                          })
                        }
                        className="w-6 h-6 mb-2"
                      />
                      <div>{day}</div>
                    </label>
                  ))}
                </div>
              )}

              <input
                placeholder="Best time (optional)"
                value={form.targettime}
                onChange={(e) => setForm({ ...form, targettime: e.target.value })}
                className="w-full px-8 py-6 text-xl rounded-2xl border-4 border-pink-200 focus:border-pink-500 outline-none mb-8"
              />

              <textarea
                placeholder="Why this habit matters (optional)"
                rows={4}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="w-full px-8 py-6 text-xl rounded-2xl border-4 border-gray-200 focus:border-indigo-500 outline-none resize-none"
              />

              <div className="flex gap-6 mt-12">
                <button
                  onClick={handleSave}
                  className="flex-1 py-7 text-3xl font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-2xl hover:scale-105 transition"
                >
                  {editing ? 'Update' : 'Create'} Habit
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="px-12 py-7 text-3xl font-bold bg-gray-200 rounded-2xl hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
