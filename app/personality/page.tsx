'use client';

import { useStore } from '../../store/useStore';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PersonalityPage() {
  const { user, authLoading, personality, savePersonality } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) router.replace('/login');
  }, [authLoading, user, router]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-3xl font-light text-purple-600">
        Loading your profile...
      </div>
    );
  }

  const [mbti, setMbti] = useState(personality?.mbti || '');
  const [enneagram, setEnneagram] = useState(personality?.enneagram || '');
  const [wakeUp, setWakeUp] = useState(personality?.wakeUp || '');
  const [bedTime, setBedTime] = useState(personality?.bedTime || '');
  const [whoIWantToBe, setWhoIWantToBe] = useState(personality?.whoIWantToBe || '');
  const [howIWantToBeSeen, setHowIWantToBeSeen] = useState(personality?.howIWantToBeSeen || '');
  const [whatIWantToStandFor, setWhatIWantToStandFor] = useState(personality?.whatIWantToStandFor || '');
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    await savePersonality({
      mbti,
      enneagram,
      wakeUp,
      bedTime,
      whoIWantToBe,
      howIWantToBeSeen,
      whatIWantToStandFor,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 py-50 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Tiny Back Button */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur rounded-full shadow hover:shadow-md transition-all duration-200 text-gray-700 font-medium text-sm hover:scale-105"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        </div>

        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-black mb-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Your Personality Profile
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            The more you share about who you are and who you want to become, the better the AI can walk beside you.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          <div className="space-y-8">
            <div className="group bg-white/70 backdrop-blur-xl rounded-3xl p-10 shadow-2xl border border-indigo-100 hover:border-indigo-300 transition-all duration-500">
              <label className="block text-2xl font-bold text-indigo-900 mb-5">MBTI Type</label>
              <input
                type="text"
                placeholder="e.g., INFP, ENTJ..."
                value={mbti}
                onChange={(e) => setMbti(e.target.value.toUpperCase())}
                className="w-full px-6 py-5 text-xl bg-white/60 border-2 border-indigo-200 rounded-2xl focus:border-indigo-600 focus:outline-none transition"
              />
            </div>

            <div className="group bg-white/70 backdrop-blur-xl rounded-3xl p-10 shadow-10 shadow-2xl border border-purple-100 hover:border-purple-300 transition-all duration-500">
              <label className="block text-2xl font-bold text-purple-900 mb-5">Enneagram</label>
              <input
                type="text"
                placeholder="e.g., 4w5, 9w1..."
                value={enneagram}
                onChange={(e) => setEnneagram(e.target.value)}
                className="w-full px-6 py-5 text-xl bg-white/60 border-2 border-purple-200 rounded-2xl focus:border-purple-600 focus:outline-none transition"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-emerald-100">
                <label className="block text-xl font-bold text-emerald-900 mb-4">Wake-Up</label>
                <input
                  type="time"
                  value={wakeUp}
                  onChange={(e) => setWakeUp(e.target.value)}
                  className="w-full px-5 py-4 text-xl bg-white/60 border-2 border-emerald-200 rounded-xl focus:border-emerald-600 focus:outline-none"
                />
              </div>
              <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-rose-100">
                <label className="block text-xl font-bold text-rose-900 mb-4">Bedtime</label>
                <input
                  type="time"
                  value={bedTime}
                  onChange={(e) => setBedTime(e.target.value)}
                  className="w-full px-5 py-4 text-xl bg-white/60 border-2 border-rose-200 rounded-xl focus:border-rose-600 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="space-y-10">
            <div className="bg-gradient-to-br from-indigo-50/80 to-purple-50/80 backdrop-blur-xl rounded-3xl p-10 shadow-2xl border-2 border-indigo-200">
              <label className="block text-2xl font-bold text-indigo-900 mb-6">
                Who do you want to be in 5 years?
              </label>
              <textarea
                placeholder="The person I’m becoming is calm, confident, creative, and deeply kind..."
                value={whoIWantToBe}
                onChange={(e) => setWhoIWantToBe(e.target.value)}
                rows={5}
                className="w-full px-6 py-5 text-lg bg-white/70 border-2 border-indigo-200 rounded-2xl focus:border-indigo-600 focus:outline-none resize-none transition"
              />
            </div>

            <div className="bg-gradient-to-br from-purple-50/80 to-pink-50/80 backdrop-blur-xl rounded-3xl p-10 shadow-2xl border-2 border-purple-200">
              <label className="block text-2xl font-bold text-purple-900 mb-6">
                How do you want to be seen by others?
              </label>
              <textarea
                placeholder="I want people to say: “They make everyone feel seen and safe”"
                value={howIWantToBeSeen}
                onChange={(e) => setHowIWantToBeSeen(e.target.value)}
                rows={5}
                className="w-full px-6 py-5 text-lg bg-white/70 border-2 border-purple-200 rounded-2xl focus:border-purple-600 focus:outline-none resize-none transition"
              />
            </div>

            <div className="bg-gradient-to-br from-pink-50/80 to-rose-50/80 backdrop-blur-xl rounded-3xl p-10 shadow-2xl border-2 border-pink-200">
              <label className="block text-2xl font-bold text-pink-900 mb-6">
                What do you want to stand for?
              </label>
              <textarea
                placeholder="My life stands for courage, authenticity, and helping others rise..."
                value={whatIWantToStandFor}
                onChange={(e) => setWhatIWantToStandFor(e.target.value)}
                rows={5}
                className="w-full px-6 py-5 text-lg bg-white/70 border-2 border-pink-200 rounded-2xl focus:border-pink-600 focus:outline-none resize-none transition"
              />
            </div>
          </div>
        </div>

        <div className="text-center mt-16">
          <button
            onClick={handleSave}
            className="px-24 py-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white text-3xl font-bold rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-500"
          >
            {saved ? 'Saved!' : 'Save My True Self'}
          </button>
        </div>
      </div>
    </div>
  );
}