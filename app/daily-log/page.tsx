// app/daily-log/page.tsx — NOW THE MAIN FOCUS
'use client';

import { useStore } from '../../store/useStore';
import { useState, useEffect } from 'react';
import { Check, Plus, X, ArrowLeft, Sparkles, Calendar, User, Flame } from 'lucide-react';
import Link from 'next/link';
import confetti from 'canvas-confetti';

export default function DailyLogPage() {
  const { habits, logs, saveLog } = useStore();
  const today = new Date().toISOString().split('T')[0];
  const todayLog = logs.find(l => l.date === today) || { completedHabits: [], extraHabits: [], reflection: '', reframed: '' };

  const [completedHabits, setCompletedHabits] = useState<string[]>(todayLog.completedHabits || []);
  const [extraHabits, setExtraHabits] = useState<string[]>(todayLog.extraHabits || []);
  const [newExtra, setNewExtra] = useState('');
  const [reflection, setReflection] = useState(todayLog.reflection || '');
  const [reframed, setReframed] = useState(todayLog.reframed || '');

  const save = async () => {
    await saveLog({ date: today, completedHabits, extraHabits, reflection, reframed });
    if (completedHabits.length === habits.length + extraHabits.length && habits.length + extraHabits.length > 0) {
      confetti({ particleCount: 200, spread: 80, origin: { y: 0.6 } });
    }
  };

  const allDone = completedHabits.length === habits.length + extraHabits.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b">
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
        {/* Date & Status */}
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-gray-800 mb-4">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </h2>
          {allDone && (habits.length + extraHabits.length > 0) && (
            <div className="text-5xl font-black text-green-600 flex items-center justify-center gap-4">
              <Sparkles className="w-16 h-16 animate-pulse" />
              Perfect Day!
              <Sparkles className="w-16 h-16 animate-pulse" />
            </div>
          )}
        </div>

        {/* JOURNALING — TOP PRIORITY, HUGE */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-12 shadow-2xl mb-12 border border-white/50">
          <h2 className="text-4xl font-black mb-8 text-center bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
            How was your day?
          </h2>
          <textarea
            placeholder="Write freely — what went well, what didn't, how you feel..."
            value={reflection}
            onChange={e => setReflection(e.target.value)}
            rows={10}
            className="w-full px-8 py-6 text-xl rounded-3xl border-2 border-indigo-200 focus:border-indigo-500 outline-none resize-none"
          />
          <textarea
            placeholder="Reframed: How can you see today positively?"
            value={reframed}
            onChange={e => setReframed(e.target.value)}
            rows={4}
            className="w-full px-8 py-6 text-xl rounded-3xl border-2 border-pink-200 focus:border-pink-500 outline-none resize-none mt-8"
          />
        </div>

        {/* Quick Habits Checklist */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl">
          <h3 className="text-3xl font-bold mb-8 text-center">Quick Check</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {habits.map(h => {
              const done = completedHabits.includes(h.id);
              return (
                <button
                  key={h.id}
                  onClick={() => setCompletedHabits(prev => prev.includes(h.id) ? prev.filter(x => x !== h.id) : [...prev, h.id])}
                  className={`p-6 rounded-2xl transition-all ${done ? 'bg-green-500 text-white shadow-xl' : 'bg-gray-100'}`}
                >
                  <div className="text-2xl font-bold">{h.name}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Save Button */}
        <div className="text-center mt-16">
          <button
            onClick={save}
            className="px-20 py-8 text-4xl font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl shadow-2xl hover:scale-110 transition"
          >
            Save Today
          </button>
          <div className="text-center mt-8">
  <Link href="/ai-coach">
    <button className="px-12 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xl font-bold rounded-2xl shadow-xl hover:scale-105 transition flex items-center gap-3 mx-auto">
      <Sparkles className="w-6 h-6" />
      Get Tomorrow’s Plan from Your AI Coach
    </button>
  </Link>
</div>
        </div>
      </div>
    </div>
  );
}
