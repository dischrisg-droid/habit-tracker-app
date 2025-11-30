'use client';

import { useStore } from '../../store/useStore';
import { useState } from 'react';
import { Plus, Edit2, Trash2, ArrowLeft, Flame, Check } from 'lucide-react';
import Link from 'next/link';
import {
  Droplets, Brain, Dumbbell, BookOpen, Moon, Pen, Heart, Footprints,
  SmartphoneNfc, Snowflake, Move, Phone, Lightbulb, CandyOff, Bed,
  Smile, Wind, Trees, Trophy
} from 'lucide-react';

const iconMap: Record<string, any> = {
  Droplets, Brain, Dumbbell, BookOpen, Moon, Pen, Heart, Footprints,
  SmartphoneNfc, Snowflake, Move, Phone, Lightbulb, CandyOff, Bed,
  Smile, Wind, Trees, Trophy
};

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function HabitsPage() {
  const { habits, logs, saveHabits, saveLog } = useStore();

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({
    name: '',
    frequency: 'daily' as 'daily' | 'weekly',
    days: [] as number[],
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
      if (daysAgo > streak + 1) break;
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

  const openEdit = (e: React.MouseEvent, habit: any) => {
    e.stopPropagation();
    setEditing(habit);
    setForm({
      name: habit.name,
      frequency: habit.frequency || 'daily',
      days: habit.days || [],
      targettime: habit.targettime || '',
      notes: habit.notes || '',
    });
    setShowForm(true);
  };

  const deleteHabit = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Delete forever?')) saveHabits(habits.filter(h => h.id !== id));
  };

  const save = async () => {
    if (!form.name.trim()) return;
    const newHabit = editing
      ? { ...editing, ...form, name: form.name.trim() }
      : { id: crypto.randomUUID(), ...form, name: form.name.trim() };
    await saveHabits(editing ? habits.map(h => h.id === editing.id ? newHabit : h) : [...habits, newHabit]);
    setShowForm(false); setEditing(null); setForm({ name: '', frequency: 'daily', days: [], targettime: '', notes: '' });
  };

  const renderDays = (habit: any) => {
    if (habit.frequency === 'daily') return <span className="text-sm font-medium text-indigo-600">Every day</span>;
    const days = habit.days || [];
    return (
      <div className="flex gap-1 flex-wrap">
        {dayNames.map((d, i) => (
          <span key={i} className={`w-7 h-7 rounded-full text-xs flex items-center justify-center font-bold ${days.includes(i) ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
            {d[0]}
          </span>
        ))}
      </div>
    );
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        {/* Header */}
        <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b">
          <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
            <Link href="/" className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-xl">
                <ArrowLeft className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-5xl font-black bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
                My Habits
              </h1>
            </Link>
            <button
              onClick={() => { setEditing(null); setForm({ name: '', frequency: 'daily', days: [], targettime: '', notes: '' }); setShowForm(true); }}
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-2xl shadow-2xl hover:scale-105 transition flex items-center gap-3"
            >
              <Plus className="w-7 h-7" /> New Habit
            </button>
          </div>
        </div>

        {/* Habits Grid */}
        <div className="max-w-7xl mx-auto p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {habits.map((habit) => {
              const streak = getStreak(habit.id);
              const isDone = todayLog?.completedHabits.includes(habit.id);
              const Icon = iconMap[habit.icon || ''] || Flame;

              return (
                <div
                  key={habit.id}
                  onClick={() => toggleHabit(habit.id)}
                  className="group relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-8 hover:shadow-3xl hover:-translate-y-4 transition-all duration-500 cursor-pointer"
                >
                  {streak > 0 && (
                    <div className="absolute -top-8 -right-8 z-10">
                      <div className="relative">
                        <div className="absolute inset-0 bg-orange-400 rounded-full blur-2xl opacity-70 animate-ping"></div>
                        <div className="relative bg-gradient-to-br from-orange-500 to-red-600 text-white w-20 h-20 rounded-full flex items-center justify-center shadow-2xl font-black text-4xl border-4 border-white">
                          {streak}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start justify-between mb-6">
                    <div className={`w-20 h-20 rounded-3xl flex items-center justify-center transition-all ${isDone ? 'bg-green-500 shadow-xl' : 'bg-gray-100'}`}>
                      {isDone ? <Check className="w-12 h-12 text-white" /> : <Icon className="w-12 h-12 text-gray-700" />}
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-gray-800 mb-4">{habit.name}</h3>
                  <div className="mb-4">{renderDays(habit)}</div>
                  {habit.targettime && <p className="text-gray-600 text-sm">Target: {habit.targettime}</p>}

                  <div className="mt-8 flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition">
                    <button onClick={(e) => openEdit(e, habit)} className="p-3 hover:bg-indigo-100 rounded-xl">
                      <Edit2 className="w-6 h-6 text-indigo-600" />
                    </button>
                    <button onClick={(e) => deleteHabit(e, habit.id)} className="p-3 hover:bg-red-100 rounded-xl">
                      <Trash2 className="w-6 h-6 text-red-600" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* FULL EDIT MODAL — NOW WITH DAY SELECTION */}
        {showForm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xl flex items-center justify-center p-6 z-50">
            <div className="bg-white rounded-3xl shadow-3xl p-12 max-w-2xl w-full max-h-screen overflow-y-auto">
              <h2 className="text-5xl font-black text-center mb-12 bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
                {editing ? 'Edit Habit' : 'New Habit'}
              </h2>

              <input autoFocus placeholder="Habit name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-8 py-6 text-2xl rounded-2xl border-4 border-indigo-200 focus:border-indigo-500 outline-none mb-8" />

              {/* Frequency */}
              <div className="mb-8">
                <div className="flex gap-8">
                  {(['daily', 'weekly'] as const).map(f => (
                    <label key={f} className="flex items-center gap-3 cursor-pointer">
                      <input type="radio" checked={form.frequency === f} onChange={() => setForm({ ...form, frequency: f, days: f === 'daily' ? [] : form.days })} className="w-6 h-6 text-indigo-600" />
                      <span className="text-xl font-medium capitalize">{f === 'daily' ? 'Daily' : 'Choose days'}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Days selector */}
              {form.frequency === 'weekly' && (
                <div className="flex justify-center gap-4 mb-8">
                  {dayNames.map((day, i) => (
                    <label key={i} className="cursor-pointer">
                      <input type="checkbox" checked={form.days.includes(i)} onChange={e => setForm({
                        ...form,
                        days: e.target.checked ? [...form.days, i] : form.days.filter(d => d !== i)
                      })} className="sr-only" />
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold transition-all ${form.days.includes(i) ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                        {day[0]}
                      </div>
                    </label>
                  ))}
                </div>
              )}

              <input placeholder="Best time (optional)" value={form.targettime} onChange={e => setForm({ ...form, targettime: e.target.value })} className="w-full px-8 py-6 text-xl rounded-2xl border-4 border-pink-200 focus:border-pink-500 outline-none mb-8" />
              <textarea placeholder="Notes (optional)" rows={4} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className="w-full px-8 py-6 text-xl rounded-2xl border-4 border-gray-200 focus:border-indigo-500 outline-none resize-none" />

              <div className="flex gap-6 mt-12">
                <button onClick={save} className="flex-1 py-7 text-3xl font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-2xl">
                  {editing ? 'Update' : 'Create'}
                </button>
                <button onClick={() => setShowForm(false)} className="px-12 py-7 text-3xl font-bold bg-gray-200 rounded-2xl">
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




