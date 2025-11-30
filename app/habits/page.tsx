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

const dayLetters = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

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

  const getCalendarData = (habitId: string) => {
    const data = [];
    for (let i = 41; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const log = logs.find(l => l.date === dateStr);
      const done = log?.completedHabits.includes(habitId);
      data.push({ done: !!done, isToday: i === 0, date });
    }
    return data;
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
      <div className="flex gap-1">
        {dayLetters.map((letter, i) => (
          <span
            key={i}
            className={`w-7 h-7 rounded-full text-xs flex items-center justify-center font-bold ${
              days.includes(i) ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'
            }`}
          >
            {letter}
          </span>
        ))}
      </div>
    );
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
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
          {habits.map((habit) => {
            const calendar = getCalendarData(habit.id);
            const streak = calendar.filter(c => c.done).length;
            const isDoneToday = calendar[41].done;
            const Icon = iconMap[habit.icon || ''] || Flame;

            return (
              <div key={habit.id} className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
                {/* Header */}
                <div className="p-6 flex items-center justify-between border-b bg-gradient-to-r from-indigo-50 to-purple-50">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => toggleHabit(habit.id)}
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${isDoneToday ? 'bg-green-500 shadow-xl' : 'bg-gray-100'}`}
                    >
                      {isDoneToday ? <Check className="w-10 h-10 text-white" /> : <Icon className="w-10 h-10 text-gray-700" />}
                    </button>
                    <div>
                      <h3 className="text-2xl font-bold">{habit.name}</h3>
                      <div className="text-sm text-gray-600">{renderDays(habit)}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={(e) => openEdit(e, habit)} className="p-2 hover:bg-indigo-100 rounded-lg">
                      <Edit2 className="w-5 h-5 text-indigo-600" />
                    </button>
                    <button onClick={(e) => deleteHabit(e, habit.id)} className="p-2 hover:bg-red-100 rounded-lg">
                      <Trash2 className="w-5 h-5 text-red-600" />
                    </button>
                  </div>
                </div>

                {/* Calendar with letters above */}
                <div className="p-6">
                  {/* Day letters */}
                  <div className="grid grid-cols-7 gap-1.5 mb-3">
                    {dayLetters.map((letter) => (
                      <div key={letter} className="text-center text-xs font-bold text-gray-600">
                        {letter}
                      </div>
                    ))}
                  </div>

                  {/* 42-day grid */}
                  <div className="grid grid-cols-7 gap-1.5">
                    {calendar.map((day, i) => (
                      <div
                        key={i}
                        className={`aspect-square rounded-lg flex items-center justify-center text-xs font-medium transition-all ${
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

      {/* Modal — keep your current one */}
      {showForm && (
        // ... your full modal code from before ...
      )}
    </div>
  );
}


