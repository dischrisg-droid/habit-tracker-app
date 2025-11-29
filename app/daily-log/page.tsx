'use client';

import { useStore } from '../../store/useStore';
import { useState, useEffect } from 'react';
import { format, addDays, parseISO } from 'date-fns';
import { Check, X, Plus, ArrowLeft, Sparkles } from 'lucide-react';
import Link from 'next/link';
import confetti from 'canvas-confetti';

export default function DailyLogPage() {
  const { habits, logs, saveLog } = useStore();
  const [completedHabits, setCompletedHabits] = useState<string[]>([]);
  const [extraHabits, setExtraHabits] = useState<string[]>([]);
  const [reflection, setReflection] = useState('');
  const [reframed, setReframed] = useState('');
  const [newHabit, setNewHabit] = useState('');

  const today = format(new Date(), 'yyyy-MM-dd');
  const todayLog = logs.find(l => l.date === today);

  useEffect(() => {
    if (todayLog) {
      setCompletedHabits(todayLog.completedHabits || []);
      setExtraHabits(todayLog.extraHabits || []);
      setReflection(todayLog.reflection || '');
      setReframed(todayLog.reframed || '');
    }
  }, [todayLog]);

  const handleToggleHabit = (habitId: string) => {
    setCompletedHabits(prev => 
      prev.includes(habitId) 
        ? prev.filter(id => id !== habitId)
        : [...prev, habitId]
    );
  };

  const addExtraHabit = () => {
    if (newHabit.trim()) {
      setExtraHabits(prev => [...prev, newHabit.trim()]);
      setNewHabit('');
    }
  };

  const removeExtraHabit = (index: number) => {
    setExtraHabits(prev => prev.filter((_, i) => i !== index));
  };

  const toggleExtraHabit = (index: number) => {
    setCompletedHabits(prev => 
      prev.includes(`extra-${index}`)
        ? prev.filter(id => id !== `extra-${index}`)
        : [...prev, `extra-${index}`]
    );
  };

  const save = async () => {
    const log = {
      date: today,
      completedHabits,
      extraHabits,
      reflection,
      reframed,
    };
    await saveLog(log);

    if (completedHabits.length === habits.length + extraHabits.length) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  const isComplete = completedHabits.length === habits.length + extraHabits.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="sticky top-0 z-50 bg-white/70 backdrop-blur-lg border-b border-white/50">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 text-gray-700 hover:text-gray-900 transition">
            <ArrowLeft className="w-6 h-6" />
            <h1 className="text-3xl font-black bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
              Daily Log
            </h1>
          </Link>
          <button
            onClick={save}
            disabled={!isComplete && !reflection}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl transition disabled:opacity-50"
          >
            {isComplete ? 'Save & Celebrate!' : 'Save Reflection'}
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-black text-gray-800 mb-4">{format(new Date(), 'EEEE, MMMM do')}</h2>
          <div className="text-2xl text-gray-600">What did you accomplish today?</div>
        </div>

        {/* Habits Checklist */}
        <div className="space-y-6 mb-12">
          <h3 className="text-3xl font-bold text-indigo-600 mb-6">Today's Habits</h3>
          {habits.map(habit => {
            const isDone = completedHabits.includes(habit.id);
            return (
              <div key={habit.id} className="bg-white rounded-3xl shadow-xl p-6 flex items-center justify-between hover:shadow-2xl transition">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleToggleHabit(habit.id)}
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                      isDone
                        ? 'bg-green-500 text-white shadow-lg'
                        : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                    }`}
                  >
                    {isDone ? <Check className="w-6 h-6" /> : <div className="w-2 h-2 rounded-full bg-gray-400" />}
                  </button>
                  <div>
                    <h4 className="text-xl font-bold text-gray-800">{habit.name}</h4>
                    <p className="text-gray-600">{habit.frequency === 'daily' ? 'Daily' : 'Weekly'} {habit.targettime && `· ${habit.targettime}`}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Extra Habits */}
        <div className="space-y-4 mb-12">
          <h3 className="text-3xl font-bold text-purple-600 mb-6">Extra Wins Today</h3>
          {extraHabits.map((habit, index) => {
            const isDone = completedHabits.includes(`extra-${index}`);
            return (
              <div key={index} className="bg-white rounded-3xl shadow-xl p-6 flex items-center justify-between hover:shadow-2xl transition">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => toggleExtraHabit(index)}
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                      isDone
                        ? 'bg-purple-500 text-white shadow-lg'
                        : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                    }`}
                  >
                    {isDone ? <Check className="w-6 h-6" /> : <div className="w-2 h-2 rounded-full bg-gray-400" />}
                  </button>
                  <h4 className="text-xl font-bold text-gray-800 flex-1">{habit}</h4>
                  <button
                    onClick={() => removeExtraHabit(index)}
                    className="p-2 text-red-500 hover:bg-red-100 rounded-2xl transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            );
          })}

          {/* Add Extra Habit */}
          <div className="bg-white rounded-3xl shadow-xl p-6 flex gap-4">
            <input
              placeholder="Add a win, e.g. 'Called mom'"
              value={newHabit}
              onChange={e => setNewHabit(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && addExtraHabit()}
              className="flex-1 px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-purple-500 outline-none text-lg"
            />
            <button
              onClick={addExtraHabit}
              className="p-3 bg-purple-600 text-white rounded-2xl hover:bg-purple-700 transition"
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Reflection */}
        <div className="space-y-4">
          <h3 className="text-3xl font-bold text-pink-600 mb-6">Reflection</h3>
          <textarea
            placeholder="How do you feel about today? What went well? What can you improve?"
            value={reflection}
            onChange={e => setReflection(e.target.value)}
            rows={6}
            className="w-full px-6 py-5 rounded-3xl border-2 border-gray-200 focus:border-pink-500 outline-none text-lg resize-none"
          />
          <textarea
            placeholder="Reframed: How can you see this day positively?"
            value={reframed}
            onChange={e => setReframed(e.target.value)}
            rows={3}
            className="w-full px-6 py-5 rounded-3xl border-2 border-gray-200 focus:border-pink-500 outline-none text-lg resize-none"
          />
        </div>

        {isComplete && (
          <div className="mt-12 text-center">
            <Sparkles className="w-16 h-16 text-yellow-500 mx-auto mb-4 animate-pulse" />
            <h3 className="text-4xl font-bold text-green-600 mb-2">Perfect Day!</h3>
            <p className="text-xl text-gray-600">All habits completed. You're on fire!</p>
          </div>
        )}
      </div>
    </div>
  );
}
