'use client';

import { useStore } from '../../store/useStore';
import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';

export default function DailyLogPage() {
  const { user, authLoading, habits, logs, saveLog } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) router.replace('/login');
  }, [authLoading, user, router]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-3xl">
        Loading...
      </div>
    );
  }

  const [reflection, setReflection] = useState('');
  const [reframed, setReframed] = useState('');
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [selectedDate] = useState(new Date().toISOString().split('T')[0]);

  const todayLog = useMemo(() => {
    return logs.find(log => log.date === selectedDate) || {
      completedHabits: [],
      extraHabits: [],
      reflection: '',
      reframed: '',
    };
  }, [logs, selectedDate]);

  const [completedHabits, setCompletedHabits] = useState<string[]>(todayLog.completedHabits || []);
  const [extraHabits, setExtraHabits] = useState<string[]>(todayLog.extraHabits || []);

  useEffect(() => {
    setCompletedHabits(todayLog.completedHabits || []);
    setExtraHabits(todayLog.extraHabits || []);
    setReflection(todayLog.reflection || '');
    setReframed(todayLog.reframed || '');
  }, [todayLog]);

  const handleToggleHabit = (habitId: string) => {
    setCompletedHabits(prev =>
      prev.includes(habitId) ? prev.filter(id => id !== habitId) : [...prev, habitId]
    );
  };

  const handleAddExtraHabit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
      setExtraHabits(prev => [...prev, e.currentTarget.value.trim()]);
      e.currentTarget.value = '';
    }
  };

  const handleSaveLog = async () => {
    if (!reflection.trim()) return;
    const logData = { date: selectedDate, completedHabits, extraHabits, reflection: reflection.trim(), reframed };
    try {
      await saveLog(logData);
      alert('Log saved!');
    } catch {
      alert('Save failed');
    }
  };

  const handleReframe = () => {
    if (!reflection.trim()) return;
    setIsLoadingAI(true);
    setTimeout(() => {
      setReframed(`You're doing incredible work. "${reflection}" — that took courage. Keep going.`);
      setIsLoadingAI(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Tiny Back Button */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur rounded-full shadow hover:shadow-md transition text-gray-700 text-sm font-medium hover:scale-105"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        </div>

        <h1 className="text-5xl font-black text-center mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Daily Reflection Journal
        </h1>
        <p className="text-center text-gray-600 text-lg mb-12">
          Be honest. The AI will help you reframe it with kindness.
        </p>

        <div className="bg-white/90 backdrop-blur rounded-3xl shadow-2xl p-8 mb-8">
          <div className="mb-8 text-center">
            <input
              type="date"
              value={selectedDate}
              readOnly
              className="px-6 py-3 text-lg border-2 border-purple-200 rounded-xl bg-gray-50"
            />
          </div>

          <div className="space-y-10">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Completed Habits</h2>
              <div className="grid gap-3">
                {habits.map(habit => (
                  <label key={habit.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                    <input
                      type="checkbox"
                      checked={completedHabits.includes(habit.id)}
                      onChange={() => handleToggleHabit(habit.id)}
                      className="w-6 h-6 accent-purple-600 rounded"
                    />
                    <span className="text-lg font-medium">{habit.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Extra Wins Today</h2>
              <input
                type="text"
                placeholder="Press Enter to add (e.g., Drank 2L water)"
                onKeyDown={handleAddExtraHabit}
                className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:outline-none"
              />
              <div className="flex flex-wrap gap-3 mt-4">
                {extraHabits.map((win, i) => (
                  <span key={i} className="px-5 py-3 bg-purple-100 text-purple-800 rounded-full font-medium text-sm">
                    {win}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Reflection</h2>
              <textarea
                placeholder="Let it all out — wins, struggles, feelings..."
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                rows={10}
                className="w-full px-6 py-5 text-lg border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:outline-none resize-none"
              />
            </div>

            <div className="text-center">
              <button
                onClick={handleReframe}
                disabled={isLoadingAI || !reflection.trim()}
                className="px-16 py-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-2xl rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoadingAI ? 'Thinking...' : 'AI Reframe My Day'}
              </button>
            </div>

            {reframed && (
              <div className="p-10 bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl border-2 border-purple-200">
                <h3 className="text-2xl font-bold text-purple-900 mb-4">AI Reframed Perspective:</h3>
                <p className="text-xl leading-relaxed text-gray-800 italic">{reframed}</p>
              </div>
            )}

            <div className="text-center pt-8">
              <button
                onClick={handleSaveLog}
                className="px-20 py-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-2xl font-bold rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all"
              >
                Save Today's Entry
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}