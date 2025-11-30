// app/personality/page.tsx — SAVE BUTTON FIXED
'use client';

import { useStore } from '../../store/useStore';
import { useState, useEffect } from 'react';
import { ArrowLeft, User } from 'lucide-react';
import Link from 'next/link';

export default function PersonalityPage() {
  const { personality, savePersonality } = useStore();

  const [form, setForm] = useState({
    mbti: '',
    enneagram: '',
    wakeUp: '',
    bedTime: '',
    whoIWantToBe: '',
    howIWantToBeSeen: '',
    whatIWantToStandFor: '',
  });

  // Load existing data
  useEffect(() => {
    if (personality) {
      setForm({
        mbti: personality.mbti || '',
        enneagram: personality.enneagram || '',
        wakeUp: personality.wakeUp || '',
        bedTime: personality.bedTime || '',
        whoIWantToBe: personality.whoIWantToBe || '',
        howIWantToBeSeen: personality.howIWantToBeSeen || '',
        whatIWantToStandFor: personality.whatIWantToStandFor || '',
      });
    }
  }, [personality]);

  // SAVE FUNCTION — this was missing or broken before
  const handleSave = async () => {
    await savePersonality(form);
    alert('Profile saved! ✨'); // optional feedback
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 py-20 px-6">
      {/* Header with back button */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-white/30">
        <div className="max-w-5xl mx-auto px-6 py-6 flex items-center gap-6">
          <Link href="/daily-log" className="p-3 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-xl hover:scale-105 transition">
            <ArrowLeft className="w-7 h-7 text-white" />
          </Link>
          <h1 className="text-5xl font-black bg-gradient-to-r from-pink-600 to-indigo-600 bg-clip-text text-transparent">
            Personality Profile
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto mt-12">
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-10 shadow-2xl">
            <h2 className="text-3xl font-bold mb-6">Core Identity</h2>
            <input placeholder="MBTI (e.g. INFP)" value={form.mbti} onChange={e => setForm({...form, mbti: e.target.value})} className="w-full px-6 py-4 rounded-2xl border mb-4 focus:border-indigo-500 outline-none" />
            <input placeholder="Enneagram (e.g. 4w5)" value={form.enneagram} onChange={e => setForm({...form, enneagram: e.target.value})} className="w-full px-6 py-4 rounded-2xl border focus:border-indigo-500 outline-none" />
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-10 shadow-2xl">
            <h2 className="text-3xl font-bold mb-6">Ideal Rhythm</h2>
            <input placeholder="Wake up time" value={form.wakeUp} onChange={e => setForm({...form, wakeUp: e.target.value})} className="w-full px-6 py-4 rounded-2xl border mb-4 focus:border-purple-500 outline-none" />
            <input placeholder="Bed time" value={form.bedTime} onChange={e => setForm({...form, bedTime: e.target.value})} className="w-full px-6 py-4 rounded-2xl border focus:border-purple-500 outline-none" />
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-10 shadow-2xl">
          <h2 className="text-3xl font-bold mb-8 text-center">Life Vision</h2>
          <textarea placeholder="Who do I want to become?" rows={4} value={form.whoIWantToBe} onChange={e => setForm({...form, whoIWantToBe: e.target.value})} className="w-full px-6 py-4 rounded-2xl border mb-6 resize-none focus:border-pink-500 outline-none" />
          <textarea placeholder="How do I want to be seen by others?" rows={3} value={form.howIWantToBeSeen} onChange={e => setForm({...form, howIWantToBeSeen: e.target.value})} className="w-full px-6 py-4 rounded-2xl border mb-6 resize-none focus:border-pink-500 outline-none" />
          <textarea placeholder="What do I want to stand for?" rows={3} value={form.whatIWantToStandFor} onChange={e => setForm({...form, whatIWantToStandFor: e.target.value})} className="w-full px-6 py-4 rounded-2xl border resize-none focus:border-pink-500 outline-none" />
        </div>

        {/* WORKING SAVE BUTTON */}
        <div className="text-center mt-12">
          <button
            onClick={handleSave}
            className="px-20 py-8 text-4xl font-bold text-white bg-gradient-to-r from-pink-600 to-indigo-600 rounded-3xl shadow-2xl hover:scale-110 transition"
          >
            Save Profile
          </button>
        </div>
      </div>
    </div>
  );
}


