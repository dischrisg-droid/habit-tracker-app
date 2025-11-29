// app/daily-log/page.tsx
'use client'; 

import { useStore } from '../../store/useStore';
import { useState, useEffect } from 'react';
import { Check, Plus, X, ArrowLeft, Sparkles } from 'lucide-react';
import Link from 'next/link';
import confetti from 'canvas-confetti';

export default function DailyLogPage() {
  const { habits, logs, saveLog } = useStore();

  const today = new Date().toISOString().split('T')[0];
  const todayLog = logs.find(l => l.date === today);

  const [completedHabits, setCompletedHabits] = useState<string[]>([]);
  const [extraHabits, setExtraHabits] = useState<string[]>([]);
  const [newExtra, setNewExtra] = useState('');
  const [reflection, setReflection] = useState('');
  const [reframed, setReframed] = useState('');

  useEffect(() => {
    if (todayLog) {
      setCompletedHabits(todayLog.completedHabits || []);
      setExtraHabits(todayLog.extraHabits || []);
      setReflection(todayLog.reflection || '');
      setReframed(todayLog.reframed || '');
    }
  }, [todayLog]);

  const toggleHabit = (id: string) => {
    setCompletedHabits(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const addExtra = () => {
    if (newExtra.trim()) {
      setExtraHabits(prev => [...prev, newExtra.trim()]);
      setNewExtra('');
    }
  };

  const removeExtra = (index: number) => {
    setExtraHabits(prev => prev.filter((_, i) => i !== index));
  };

  const toggleExtra = (index: number) => {
    const key = `extra-${index}`;
    setCompletedHabits(prev =>
      prev.includes(key) ? prev.filter(x => x !== key) : [...prev, key]
    );
  };

  const save = async () => {
    await saveLog({
      date: today,
      completedHabits,
      extraHabits,
      reflection,
      reframed,
    });

    // Confetti when everything is done
    if (completedHabits.length === habits.length + extraHabits.length && habits.length + extraHabits.length > 0) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#a855f7', '#ec4899'],
      });
    }
  };

  const allDone = completedHabits.length === habits.length + extraHabits.length;

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
                Daily Log
              </h1>
            </Link>
            <button
              onClick={save}
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xl font-bold rounded-2xl shadow-2xl hover:scale-105 transition"
            >
              Save Log
            </button>
          </div>
        </div>

        <div className="max-w-5xl mx-auto p-8">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold text-gray-800 mb-2">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </h2>
            {allDone && habits.length + extraHabits.length > 0 && (
              <div className="flex items-center justify-center gap-3 text-4xl font-black text-green-600">
                <Sparkles className="w-12 h-12 animate-pulse" />
                Perfect Day!
                <Sparkles className="w-12 h-12 animate-pulse" />
              </div>
            )}
          </div>

          {/* Main Habits */}
          <div className="space-y-6 mb-12">
            {habits.map(habit => {
              const done = completedHabits.includes(habit.id);
              return (
                <div
                  key={habit.id}
                  onClick={() => toggleHabit(habit.id)}
                  className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all cursor-pointer border border-white/50 flex items-center gap-6"
                >
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${done ? 'bg-green-500' : 'bg-gray-200'}`}>
                    {done && <Check className="w-10 h-10 text-white" />}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-3xl font-bold text-gray-800">{habit.name}</h3>
                    <p className="text-gray-600">{habit.targettime || 'Any time'}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Extra Habits */}
          <div className="space-y-6 mb-12">
            <h3 className="text-3xl font-bold text-purple-600 mb-6">Extra Wins</h3>
            {extraHabits.map((item, i) => {
              const done = completedHabits.includes(`extra-${i}`);
              return (
                <div
                  key={i}
                  className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all border border-white/50 flex items-center gap-6"
                >
                  <button
                    onClick={() => toggleExtra(i)}
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${done ? 'bg-purple-500' : 'bg-gray-200'}`}
                  >
                    {done && <Check className="w-10 h-10 text-white" />}
                  </button>
                  <span className="flex-1 text-2xl font-medium">{item}</span>
                  <button onClick={() => removeExtra(i)} className="text-red-500 hover:bg-red-100 p-3 rounded-2xl">
                    <X className="w-6 h-6" />
                  </button>
                </div>
              );
            })}

            <div className="flex gap-4">
              <input
                placeholder="Add an extra win..."
                value={newExtra}
                onChange={e => setNewExtra(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addExtra()}
                className="flex-1 px-6 py-4 rounded-2xl border-2 border-gray-200 focus:border-purple-500 outline-none text-xl"
              />
              <button onClick={addExtra} className="p-4 bg-purple-600 text-white rounded-2xl hover:bg-purple-700">
                <Plus className="w-8 h-8" />
              </button>
            </div>
          </div>

          {/* Reflection */}
          <div className="space-y-8">
            <textarea
              placeholder="How are you feeling today? What went well? What could be better?"
              value={reflection}
              onChange={e => setReflection(e.target.value)}
              rows={5}
              className="w-full px-8 py-6 rounded-3xl border-2 border-gray-200 focus:border-indigo-500 outline-none text-xl resize-none bg-white/80 backdrop-blur"
            />
            <textarea
              placeholder="Reframed: How can you see today positively?"
              value={reframed}
              onChange={e => setReframed(e.target.value)}
              rows={3}
              className="w-full px-8 py-6 rounded-3xl border-2 border-gray-200 focus:border-pink-500 outline-none text-xl resize-none bg-white/80 backdrop-blur"
            />
          </div>
        </div>
      </div>
    </>
  );
}
