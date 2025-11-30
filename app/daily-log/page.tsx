// app/daily-log/page.tsx — FINAL & PERFECT (NO ERRORS)
'use client';

import { useStore } from '../../store/useStore';
import { useState } from 'react';
import { Check, Sparkles, Flame, User } from 'lucide-react';
import Link from 'next/link';
import confetti from 'canvas-confetti'; // ← THIS IS THE CORRECT IMPORT

export default function DailyLogPage() {
  const { habits, logs, saveLog } = useStore();

  const today = new Date().toISOString().split('T')[0];
  const todayLog = logs.find(l => l.date === today) || {
    completedHabits: [],
    reflection: '',
    reframed: '',
  };

  const [completedHabits, setCompletedHabits] = useState<string[]>(todayLog.completedHabits || []);
  const [reflection, setReflection] = useState(todayLog.reflection || '');
  const [reframed, setReframed] = useState(todayLog.reframed || '');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const handleSave = async () => {
    setSaveStatus('saving');
    await saveLog({
      date: today,
      completedHabits,
      reflection,
      reframed,
    });
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 3000);

    if (completedHabits.length === habits.length && habits.length > 0) {
      confetti({
        particleCount: 400,
        spread: 120,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#a855f7', '#ec4899', '#10b981', '#f59e0b'],
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-white/20">
        <div className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
          <h1 className="text-5xl font-black bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
            Daily Log
          </h1>
          <div className="flex gap-4">
            <Link href="/habits" className="p-3 bg-indigo-100 rounded-2xl hover:bg-indigo-200 transition">
              <Flame className="w-7 h-7 text-indigo-700" />
            </Link>
            <Link href="/personality" className="p-3 bg-pink-100 rounded-2xl hover:bg-pink-200 transition">
              <User className="w-7 h-7 text-pink-700" />
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-8 pb-32">
        {/* Date */}
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-gray-800 mb-4">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </h2>
        </div>

        {/* Journal */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-12 shadow-2xl mb-12 border border-white/50">
          <textarea
            placeholder="How was your day? Write freely..."
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            rows={12}
            className="w-full px-8 py-6 text-xl rounded-3xl border-2 border-indigo-200 focus:border-indigo-500 outline-none resize-none"
          />
          <textarea
            placeholder="Reframed: How can you see today positively?"
            value={reframed}
            onChange={(e) => setReframed(e.target.value)}
            rows={4}
            className="w-full px-8 py-6 text-xl rounded-3xl border-2 border-pink-200 focus:border-pink-500 outline-none resize-none mt-8"
          />
        </div>

        {/* Quick Habits */}
        {habits.length > 0 && (
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl mb-12">
            <h3 className="text-3xl font-bold mb-8 text-center text-gray-800">Quick Check</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {habits.map((habit: any) => {
                const done = completedHabits.includes(habit.id);
                return (
                  <button
                    key={habit.id}
                    onClick={() =>
                      setCompletedHabits((prev: string[]) =>
                        prev.includes(habit.id) ? prev.filter((x) => x !== habit.id) : [...prev, habit.id]
                      )
                    }
                    className={`p-10 rounded-3xl text-2xl font-bold transition-all transform hover:scale-105 ${
                      done
                        ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-2xl'
                        : 'bg-gray-100 text-gray-700 shadow-lg'
                    }`}
                  >
                    {done && <Check className="w-14 h-14 mx-auto mb-3" />}
                    <div className="font-bold">{habit.name}</div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Save + AI Coach Buttons */}
        <div className="text-center space-y-10">
          <button
            onClick={handleSave}
            disabled={saveStatus === 'saving'}
            className="relative px-24 py-10 text-5xl font-black text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl shadow-2xl hover:scale-110 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved!' : 'Save Today'}
          </button>

          <div className="pt-8">
            <Link href="/ai-coach?instant=true">
              <button className="px-20 py-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-3xl font-bold rounded-3xl shadow-2xl hover:scale-110 transition flex items-center gap-6 mx-auto">
                <Sparkles className="w-12 h-12" />
                Get Tomorrow’s Plan + Charisma Video
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
