// app/habits/page.tsx — EDIT BUTTON FIXED + days visible
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
  const [form, setForm] = useState({ name: '', targettime: '', notes: '' });

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
    e.stopPropagation(); // ← THIS IS THE KEY FIX
    setEditing(habit);
    setForm({ name: habit.name, targettime: habit.targettime || '', notes: habit.notes || '' });
    setShowForm(true);
  };

  const deleteHabit = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Delete forever?')) {
      saveHabits(habits.filter(h => h.id !== id));
    }
  };

  const renderDays = (habit: any) => {
    if (habit.frequency === 'daily') {
      return <span className="text-sm font-medium text-indigo-600">Every day</span>;
    }
    const days = habit.days || [];
    return (
      <div className="flex gap-1 flex-wrap">
        {dayNames.map((day, i) => (
          <span
            key={i}
            className={`w-7 h-7 rounded-full text-xs flex items-center justify-center font-bold ${
              days.includes(i) ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'
            }`}
          >
            {day[0]}
          </span>
        ))}
      </div>
    );
  };

  return (
    <>
      {/* ... header stays the same ... */}

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
                {/* Fire Badge */}
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

                {/* Edit/Delete — now work perfectly */}
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

      {/* Modal stays exactly as you had it */}
      {showForm && (
        // ... your modal code ...
      )}
    </>
  );
}





