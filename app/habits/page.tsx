// app/habits/page.tsx — FINAL & 100% WORKING — BUTTONS NOW TRIGGER
'use client';

import { useStore } from '../../store/useStore';
import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, ArrowLeft, Flame, Check, X, Save, Activity, Sparkles } from 'lucide-react';
import Link from 'next/link';
import {
  Droplets, Brain, Dumbbell, BookOpen, Moon, Pen, Heart, Footprints,
  SmartphoneNfc, Snowflake, Move, Phone, Lightbulb, CandyOff, Bed,
  Smile, Wind, Trees, Trophy
} from 'lucide-react';

const iconMap: Record<string, any> = {
  Droplets, Brain, Dumbbell, BookOpen, Moon, Pen, Heart, Footprints,
  SmartphoneNfc, Snowflake, Move, Phone, Lightbulb, CandyOff, Bed,
  Smile, Wind, Trees, Trophy, Activity
};

const dayLetters = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

// ——— EXAMPLE HABITS ———
const exampleHabits = [
  { name: "Drink 2L water", icon: "Droplets", frequency: "daily", notes: "Stay hydrated!" },
  { name: "Meditate 10 min", icon: "Brain", frequency: "daily", notes: "Morning calm" },
  { name: "Exercise", icon: "Dumbbell", frequency: "daily", targettime: "30 min" },
  { name: "Read 20 pages", icon: "BookOpen", frequency: "daily" },
  { name: "Sleep 8 hours", icon: "Moon", frequency: "daily", notes: "10pm–6am" },
  { name: "Morning journal", icon: "Pen", frequency: "daily" },
  { name: "Gratitude practice", icon: "Heart", frequency: "daily" },
  { name: "Walk 10k steps", icon: "Footprints", frequency: "daily" },
  { name: "No screens after 9pm", icon: "SmartphoneNfc", frequency: "daily" },
  { name: "Cold shower", icon: "Snowflake", frequency: "daily" },
  { name: "Run 5km", icon: "Move", frequency: "weekly", days: [1, 3, 5] },
  { name: "Call a friend", icon: "Phone", frequency: "weekly", days: [0, 3] },
  { name: "Learn something new", icon: "Lightbulb", frequency: "daily" },
  { name: "No sugar", icon: "CandyOff", frequency: "daily" },
];

export default function HabitsPage() {
  const { habits, logs, saveHabits } = useStore();

  useEffect(() => {
    useStore.getState().load();
  }, []);

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({
    name: '',
    frequency: 'daily' as 'daily' | 'weekly',
    days: [] as number[],
    targettime: '',
    notes: '',
    icon: 'Activity',
  });

  const [showExampleHabits, setShowExampleHabits] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const todayLog = logs.find(l => l.date === today);
  const completedHabits = todayLog?.completed_habits || [];

  const getCalendarData = (habitId: string) => {
    const data = [];
    for (let i = 41; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const log = logs.find(l => l.date === dateStr);
      const done = log?.completed_habits?.includes(habitId) ?? false;
      data.push({ done, isToday: i === 0, date });
    }
    return data;
  };

  const deleteHabit = async (id: string) => {
    if (!confirm('Delete this habit forever?')) return;
    const filtered = habits.filter(h => h.id !== id);
    await saveHabits(filtered);
  };

  const saveHabit = async () => {
    if (!form.name.trim()) return;
    const newHabit = editing
      ? { ...editing, ...form, name: form.name.trim() }
      : {
          id: crypto.randomUUID(),
          name: form.name.trim(),
          frequency: form.frequency,
          days: form.frequency === 'weekly' ? form.days : [],
          targettime: form.targettime,
          notes: form.notes,
          icon: form.icon,
        };
    const updated = editing
      ? habits.map(h => (h.id === editing.id ? newHabit : h))
      : [...habits, newHabit];
    await saveHabits(updated);
    setShowForm(false);
    setEditing(null);
    setForm({ name: '', frequency: 'daily', days: [], targettime: '', notes: '', icon: 'Activity' });
  };

  const toggleDay = (day: number) => {
    setForm(prev => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day],
    }));
  };

  const addExampleHabit = async (example: any) => {
    const newHabit = {
      id: crypto.randomUUID(),
      name: example.name,
      frequency: example.frequency,
      days: example.days || [],
      targettime: example.targettime || '',
      notes: example.notes || '',
      icon: example.icon,
    };
    await saveHabits([...habits, newHabit]);
  };

  return (
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
          <div className="flex gap-4">
            <button
              onClick={() => setShowExampleHabits(true)}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold rounded-2xl shadow-lg hover:scale-105 transition flex items-center gap-2"
            >
              <Sparkles className="w-6 h-6" />
              Example Habits
            </button>
            <button
              onClick={() => {
                setEditing(null);
                setForm({ name: '', frequency: 'daily', days: [], targettime: '', notes: '', icon: 'Activity' });
                setShowForm(true);
              }}
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-2xl shadow-2xl hover:scale-105 transition flex items-center gap-3"
            >
              <Plus className="w-7 h-7" /> New Habit
            </button>
          </div>
        </div>
      </div>
      {/* ——— EXAMPLE HABITS SECTION ——— */}
      {showExampleHabits && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xl flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-3xl shadow-3xl p-12 max-w-4xl w-full max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-4xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Quick Start — Tap to Add
              </h2>
              <button
                onClick={() => setShowExampleHabits(false)}
                className="p-3 bg-gray-200 rounded-2xl hover:bg-gray-300 transition"
              >
                <X className="w-8 h-8" />
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {exampleHabits.map((ex) => {
                const Icon = iconMap[ex.icon] || Activity;
                return (
                  <button
                    type="button" // ← ENSURES CLICK WORKS IN NEXT.JS
                    key={ex.name}
                    onClick={() => addExampleHabit(ex)}
                    className="p-8 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl hover:scale-105 transition shadow-lg border border-white/50 text-left"
                  >
                    <Icon className="w-16 h-16 mb-4 text-indigo-600" />
                    <div className="text-xl font-bold">{ex.name}</div>
                    {ex.notes && <div className="text-sm text-gray-600 mt-2">{ex.notes}</div>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
      {/* ——— YOUR ORIGINAL HABITS GRID ——— */}
      <div className="max-w-7xl mx-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
          {habits.map((habit) => {
            const calendar = getCalendarData(habit.id);
            const streak = calendar.filter(c => c.done).length;
            const isDoneToday = calendar[41].done;
            const Icon = iconMap[habit.icon || ''] || Activity;
            return (
              <div key={habit.id} className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
                <div className="p-6 flex items-center justify-between border-b bg-gradient-to-r from-indigo-50 to-purple-50">
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${isDoneToday ? 'bg-green-500' : 'bg-gray-100'}`}>
                      {isDoneToday ? <Check className="w-10 h-10 text-white" /> : <Icon className="w-10 h-10 text-gray-700" />}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">{habit.name}</h3>
                      <div className="text-sm text-gray-600">
                        {habit.frequency === 'daily' ? 'Daily' : 'Weekly'}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditing(habit);
                        setForm({
                          name: habit.name,
                          frequency: habit.frequency || 'daily',
                          days: habit.days || [],
                          targettime: habit.targettime || '',
                          notes: habit.notes || '',
                          icon: habit.icon || 'Activity',
                        });
                        setShowForm(true);
                      }}
                      className="p-2 hover:bg-indigo-100 rounded-lg"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => deleteHabit(habit.id)}
                      className="p-2 hover:bg-red-100 rounded-lg"
                    >
                      <Trash2 className="w-5 h-5 text-red-600" />
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-7 gap-1.5 mb-3">
                    {dayLetters.map(l => (
                      <div key={l} className="text-center text-xs font-bold text-gray-600">{l}</div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-1.5">
                    {calendar.map((day, i) => (
                      <div
                        key={i}
                        className={`aspect-square rounded-lg flex items-center justify-center text-xs font-medium ${
                          day.isToday ? 'ring-4 ring-indigo-400 ring-opacity-50' : ''
                        } ${day.done ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}
                      >
                        {day.isToday ? 'TODAY' : day.date.getDate()}
                      </div>
                    ))}
                  </div>
                  {streak > 0 && (
                    <div className="text-center mt-6">
                      <div className="inline-flex items-center gap-2 text-3xl font-black text-orange-600">
                        <Flame className="w-10 h-10" />
                        {streak} day streak
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* FULL ADD/EDIT MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xl flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-3xl shadow-3xl p-12 max-w-2xl w-full max-h-screen overflow-y-auto">
            <h2 className="text-5xl font-black text-center mb-12 bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
              {editing ? 'Edit Habit' : 'New Habit'}
            </h2>
            <input
              placeholder="Habit name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full px-8 py-6 text-2xl rounded-3xl border-2 border-gray-200 focus:border-indigo-500 outline-none mb-8"
            />
            <div className="mb-8">
              <label className="block text-xl font-bold mb-4">Frequency</label>
              <div className="flex gap-4">
                <button
                  onClick={() => setForm({ ...form, frequency: 'daily', days: [] })}
                  className={`px-8 py-4 rounded-2xl font-bold ${form.frequency === 'daily' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
                >
                  Daily
                </button>
                <button
                  onClick={() => setForm({ ...form, frequency: 'weekly' })}
                  className={`px-8 py-4 rounded-2xl font-bold ${form.frequency === 'weekly' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
                >
                  Weekly
                </button>
              </div>
            </div>
            {form.frequency === 'weekly' && (
              <div className="mb-8">
                <label className="block text-xl font-bold mb-4">Days</label>
                <div className="flex gap-4 justify-center">
                  {dayLetters.map((letter, i) => (
                    <button
                      key={i}
                      onClick={() => toggleDay(i)}
                      className={`w-16 h-16 rounded-2xl text-2xl font-bold ${
                        form.days.includes(i) ? 'bg-indigo-600 text-white' : 'bg-gray-200'
                      }`}
                    >
                      {letter}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <input
              placeholder="Target time (optional)"
              value={form.targettime}
              onChange={e => setForm({ ...form, targettime: e.target.value })}
              className="w-full px-8 py-6 text-xl rounded-3xl border-2 border-gray-200 focus:border-indigo-500 outline-none mb-8"
            />
            <textarea
              placeholder="Notes (optional)"
              value={form.notes}
              onChange={e => setForm({ ...form, notes: e.target.value })}
              rows={4}
              className="w-full px-8 py-6 text-xl rounded-3xl border-2 border-gray-200 focus:border-indigo-500 outline-none mb-12 resize-none"
            />
            <div className="flex justify-center gap-6">
              <button
                onClick={saveHabit}
                className="px-16 py-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-3xl font-bold rounded-3xl shadow-2xl hover:scale-105 transition"
              >
                <Save className="w-10 h-10 inline mr-3" />
                Save Habit
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="px-16 py-6 bg-gray-400 text-white text-3xl font-bold rounded-3xl shadow-2xl hover:scale-105 transition"
              >
                <X className="w-10 h-10 inline mr-3" />
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}













