// app/ai-coach/page.tsx — FINAL & 100% WORKING (ALL ICONS IMPORTED)
'use client';

import { useStore } from '../../store/useStore';
import { useEffect, useState } from 'react';
import { 
  Brain, 
  Target, 
  Eye, 
  Zap, 
  MessageCircle, 
  Heart,
  Sparkles,
  PlayCircle,
  ArrowLeft 
} from 'lucide-react';
import Link from 'next/link';

export default function AICoachPage() {
  const { personality, habits, logs, saveAIPlan } = useStore();
  const [plan, setPlan] = useState('Generating your perfect tomorrow...');

  useEffect(() => {
    if (!personality || !logs || logs.length === 0) {
      setPlan('Please save today’s log first.');
      return;
    }

    const todayLog = logs[logs.length - 1];
    const mbti = personality?.mbti?.toUpperCase() || 'UNKNOWN';
// Only change this one line in your ai-coach/page.tsx
const vision = personality?.who_i_want_to_be || 'your highest self';

    const callAI = async () => {
      const res = await fetch('/api/ai-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{
            role: 'system',
            content: `You are a world-class coach for a ${mbti} 6w5 who wants to become: "${vision}".
Today they completed ${todayLog?.completed_habits?.length || 0}/${habits.length} habits.
Journal: "${todayLog?.reflection || 'none'}"
Reframed: "${todayLog?.reframed || 'none'}"

Give a beautiful tomorrow plan using the 6 Higher Faculties (Imagination, Will, Perception, Intuition, Memory, Reason).
One short activity per faculty.
Then recommend:
• One 5–15 minute YouTube video (title + link)
• One 5–10 minute article/reading (title + link)
Finally, suggest 1–2 detailed new habits (name, frequency, time, why, how to start).

Tone: warm, wise, encouraging, slightly playful. Max 450 words.`
          }]
        }),
      });

      const data = await res.json();
      const aiPlan = data.choices?.[0]?.message?.content || 'You are becoming legendary.';

      setPlan(aiPlan.trim());
      saveAIPlan?.({
        date: new Date().toISOString().split('T')[0],
        plan: aiPlan.trim(),
        video: '',
      });
    };

    callAI();
  }, [personality, habits, logs, saveAIPlan]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b">
        <div className="max-w-5xl mx-auto px-6 py-6 flex items-center gap-6">
          <Link href="/daily-log" className="p-3 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-xl hover:scale-105 transition">
            <ArrowLeft className="w-7 h-7 text-white" />
          </Link>
          <h1 className="text-5xl font-black bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
            Your AI Coach
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-8">
        {/* Plan */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-12 border border-white/50 mb-16">
          <pre className="whitespace-pre-wrap font-sans text-lg leading-relaxed text-gray-800">
            {plan}
          </pre>
        </div>

        {/* BEAUTIFUL 6 FACULTIES — EXACTLY LIKE YOUR SCREENSHOT */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-8">
          {[
            { name: 'Imagination', icon: Brain, color: 'from-purple-500 to-pink-500' },
            { name: 'Will', icon: Target, color: 'from-orange-500 to-red-500' },
            { name: 'Perception', icon: Eye, color: 'from-cyan-500 to-blue-500' },
            { name: 'Intuition', icon: Zap, color: 'from-yellow-400 to-orange-500' },
            { name: 'Memory', icon: MessageCircle, color: 'from-green-500 to-emerald-500' },
            { name: 'Reason', icon: Heart, color: 'from-purple-500 to-indigo-600' },
          ].map((f) => (
            <div key={f.name} className="text-center">
              <div className={`w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br ${f.color} flex items-center justify-center shadow-2xl transform hover:scale-110 transition`}>
                <f.icon className="w-12 h-12 text-white" />
              </div>
              <p className="mt-4 text-lg font-bold text-gray-700">{f.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export const dynamic = 'force-dynamic';
