// app/habits/page.tsx — FINAL, NO ERRORS, shows days clearly
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
              days.includes(i)
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-500'
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
              onClick={() => window.location.href = '/habits/new'}
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
                <div key={habit.id} className="relative group">
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

                  {/* Habit Card */}
                  <div
                    onClick={() => toggleHabit(habit.id)}
                    className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl hover:shadow-3xl hover:-translate-y-4 transition-all duration-500 border border-white/50 cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div className={`w-20 h-20 rounded-3xl flex items-center justify-center transition-all ${isDone ? 'bg-green-500 shadow-xl' : 'bg-gray-100'}`}>
                        {isDone ? <Check className="w-12 h-12 text-white" /> : <Icon className="w-12 h-12 text-gray-700" />}
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold text-gray-800 mb-4">{habit.name}</h3>

                    {/* DAYS — ALWAYS VISIBLE */}
                    <div className="mb-4">
                      {renderDays(habit)}
                    </div>

                    {habit.targettime && (
                      <p className="text-gray-600 text-sm">Target: {habit.targettime}</p>
                    )}

                    {/* Hover actions */}
                    <div className="mt-8 flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition">
                      <button className="p-2 hover:bg-indigo-100 rounded-lg">
                        <Edit2 className="w-5 h-5 text-indigo-600" />
                      </button>
                      <button className="p-2 hover:bg-red-100 rounded-lg">
                        <Trash2 className="w-5 h-5 text-red-600" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}




