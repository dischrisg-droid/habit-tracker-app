// app/daily-log/page.tsx — FINAL WITH FEEDBACK
'use client';

import { useStore } from '../../store/useStore';
import { useState } from 'react';
import { Check, Sparkles, Flame, User } from 'lucide-react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import toast from 'react-hot-toast';

export default function DailyLogPage() {
  const { habits, logs, saveLog } = useStore();

  const today = new Date().toISOString().split('T')[0];
  const todayLog = logs.find(l => l.date === today) || {
    completedHabits: [],
    reflection: '',
    reframed: '',
  };

  const [completedHabits, setCompletedHabits] = useState(todayLog.completedHabits || []);
  const [reflection, setReflection] = useState(todayLog.reflection || '');
  const [reframed, setReframed] = useState(todayLog.reframed || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await saveLog({
      date: today,
      completedHabits,
      reflection,
      reframed,
    });

    toast.success('Saved!', {
      icon: 'Saved!',
      style: { background: '#10b981', color: 'white' },
    });

    if (completedHabits.length === habits.length && habits.length > 0) {
      confetti({ particleCount: 300, spread: 100, origin: { y: 0.6 } });
    }
    setSaving(false);
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        {/* ... same header ... */}
        {/* ... same journal + habits ... */}

        <div className="text-center mt-16">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-20 py-8 text-4xl font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl shadow-2xl hover:scale-110 transition disabled:opacity-70"
          >
            {saving ? 'Saving...' : 'Save Today'}
          </button>
        </div>

        {/* AI Coach button */}
        <div className="text-center mt-8">
          <Link href="/ai-coach">
            <button className="px-16 py-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-2xl font-bold rounded-3xl shadow-2xl hover:scale-105 transition flex items-center gap-4 mx-auto">
              <Sparkles className="w-10 h-10" />
              Get Tomorrow’s Plan + Charisma Video
            </button>
          </Link>
        </div>
      </div>
      <Toaster position="bottom-center" />
    </>
  );
}
