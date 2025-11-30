// app/habits/page.tsx — FINAL VERSION
'use client';

import { useStore } from '../../store/useStore';
import { useState } from 'react';
import { Plus, Edit2, Trash2, ArrowLeft, Flame, Check } from 'lucide-react';
import Link from 'next/link';
import * as lucideIcons from 'lucide-react';

export default function HabitsPage() {
  const { habits, logs, saveHabits } = useStore();

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({
    name: '',
    frequency: 'daily' as const,
    targettime: '',
    notes: '',
  });

  const today = new Date().toISOString().split('T')[0];
  const todayLog = logs.find(l => l.date === today);

  const getStreak = (habitId: string) => {
    let streak = 0;
    const sorted = [...logs].sort((a, b) => b.date.localeCompare(a.date));
    for (const log of sorted) {
      const daysAgo = Math.floor((Date.now() - new Date(log.date).getTime()) / 86400000);
      if (daysAgo > streak) break;
      if (log.completedHabits?.includes(habitId)) streak++;
      else if (daysAgo === 0) break;
      else break;
    }
    return streak;
  };

  const toggleHabit = (id: string) => {
    if (!todayLog) return;
    const updated = todayLog.completedHabits.includes(id)
      ? todayLog.completedHabits.filter(x => x !== id)
      : [...todayLog.completedHabits, id];
    saveLog({ ...todayLog, completedHabits: updated });
  };

  const deleteHabit = async (id: string) => {
    if (!confirm('Delete forever?')) return;
    await saveHabits(habits.filter(h => h.id !== id));
  };

  const editHabit = (habit: any) => {
    setEditing(habit);
    setForm({
      name: habit.name,
      frequency: habit.frequency,
      targettime: habit.targettime || '',
      notes: habit.notes || '',
    });
    setShowForm(true);
  };

  const save = async () => {
    if (!form.name.trim()) return;
    const newHabit = editing
      ? { ...editing, ...form, name: form.name.trim() }
      : { id: crypto.randomUUID(), ...form, name: form.name.trim() };

    await saveHabits(
      editing
        ? habits.map(h => (h.id === editing.id ? newHabit : h))
        : [...habits, newHabit]
    );

    setShowForm(false);
    setEditing(null);
    setForm({ name: '', frequency: 'daily', targettime: '', notes: '' });
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        {/* Header */}
        <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-white/30">
          <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
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
                setForm({ name: '', frequency: 'daily', targettime: '', notes: '' });
                setShowForm(true);
              }}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-2xl shadow-xl hover:scale-105 transition flex items-center gap-2"
            >
              <Plus className="w-6 h-6" />
              New Habit
            </button>
          </div>
        </div>

        <div className="max-w-6xl mx-auto p-8">
          {habits.length === 0 ? (
            <div className="text-center py-32">
              <h2 className="text-6xl font-black text-gray-700 mb-8">No habits yet</h2>
              <button
                onClick={() => setShowForm(true)}
                className="px-12 py-6 text-3xl font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl shadow-2xl hover:scale-110 transition"
              >
                Create Your First One
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {habits.map((habit) => {
                const streak = getStreak(habit.id);
                const isDone = todayLog?.completedHabits.includes(habit.id);
                const Icon = habit.icon && lucideIcons[habit.icon as keyof typeof lucideIcons]
                  ? lucideIcons[habit.icon as keyof typeof lucideIcons]
                  : Flame;

                return (
                  <div
                    key={habit.id}
                    className="group relative bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-5 hover:shadow-2xl hover:-translate-y-3 transition-all duration-300"
                  >
                    {/* Streak Badge */}
                    {streak > 0 && (
                      <div className="absolute -top-5 -right-5 z-10">
                        <div className="relative">
                          <div className="absolute inset-0 bg-orange-400 rounded-full blur-xl opacity-70 animate-ping"></div>
                          <div className="relative bg-gradient-to-br from-orange-500 to-red-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-2xl font-black text-2xl border-4 border-white">
                            {streak}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => toggleHabit(habit.id)}
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${isDone ? 'bg-green-500 text-white shadow-lg' : 'bg-gray-100'}`}
                      >
                        {isDone ? <Check className="w-8 h-8" /> : <Icon className="w-8 h-8 text-gray-600" />}
                      </button>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg truncate">{habit.name}</h3>
                        {habit.targettime && <p className="text-xs text-gray-500">{habit.targettime}</p>}
                      </div>

                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                        <button onClick={() => editHabit(habit)} className="p-2 hover:bg-indigo-100 rounded-lg">
                          <Edit2 className="w-5 h-5 text-indigo-600" />
                        </button>
                        <button onClick={() => deleteHabit(habit.id)} className="p-2 hover:bg-red-100 rounded-lg">
                          <Trash2 className="w-5 h-5 text-red-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Your existing modal code stays the same */}
        {showForm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xl flex items-center justify-center p-6 z-50">
            <div className="bg-white rounded-3xl shadow-3xl p-12 max-w-2xl w-full max-h-screen overflow-y-auto">
              <h2 className="text-5xl font-black text-center mb-12 bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
                {editing ? 'Edit Habit' : 'New Habit'}
              </h2>
              {/* ... your existing form fields ... */}
              {/* (keep exactly as you had before) */}
              <div className="flex gap-6 mt-12">
                <button onClick={save} className="flex-1 py-6 text-3xl font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-2xl">
                  {editing ? 'Update' : 'Create'}
                </button>
                <button onClick={() => setShowForm(false)} className="px-12 py-6 text-3xl font-bold bg-gray-200 rounded-2xl">
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



