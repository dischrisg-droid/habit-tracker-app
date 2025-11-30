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

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
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

        <div className="max-w-7xl mx-auto p-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-6">
            {habits.map((habit) => {
              const streak = getStreak(habit.id);
              const isDone = todayLog?.completedHabits.includes(habit.id);
              const Icon = iconMap[habit.icon || ''] || Flame;

              return (
                <div
                  key={habit.id}
                  className="group relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-white/30 overflow-hidden hover:shadow-2xl hover:-translate-y-3 transition-all duration-300 cursor-pointer"
                  onClick={() => toggleHabit(habit.id)}
                >
                  {streak > 0 && (
                    <div className="absolute -top-6 -right-6 z-10">
                      <div className="relative">
                        <div className="absolute inset-0 bg-orange-400 rounded-full blur-xl opacity-70 animate-ping"></div>
                        <div className="relative bg-gradient-to-br from-orange-500 to-red-600 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-2xl font-black text-2xl border-4 border-white">
                          {streak}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="p-6 text-center">
                    <div className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center transition-all ${isDone ? 'bg-green-500 shadow-xl' : 'bg-gray-100'}`}>
                      {isDone ? <Check className="w-12 h-12 text-white" /> : <Icon className="w-12 h-12 text-gray-700" />}
                    </div>
                    <h3 className="mt-5 text-lg font-bold text-gray-800 line-clamp-2">{habit.name}</h3>
                  </div>

                  <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6">
                    <p className="text-sm mb-2">{habit.targettime || 'No time set'}</p>
                    {habit.notes && <p className="text-xs text-center line-clamp-3">{habit.notes}</p>}
                    <div className="absolute bottom-4 right-4 flex gap-3">
                      <button onClick={(e) => { e.stopPropagation(); /* edit */ }} className="p-2 bg-white/20 rounded-lg">
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); /* delete */ }} className="p-2 bg-red-500/30 rounded-lg">
                        <Trash2 className="w-5 h-5" />
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




