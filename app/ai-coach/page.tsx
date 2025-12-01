// app/ai-coach/page.tsx — NO VIDEO LINK, AI RECOMMENDS VIDEO + READING
'use client';

import { useStore } from '../../store/useStore';
import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function AICoachPage() {
  const { personality, habits, logs, saveAIPlan } = useStore();
  const [plan, setPlan] = useState('Generating your perfect tomorrow...');

  useEffect(() => {
    if (!personality || !logs || logs.length === 0) {
      setPlan('Please save today’s log first.');
      return;
    }

    const todayLog = logs[logs.length - 1];
    const mbti = personality.mbti?.toUpperCase() || 'UNKNOWN';

    const callAI = async () => {
      const res = await fetch('/api/ai-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{
            role: 'system',
            content: `You are a world-class coach for a ${mbti} 6w5 who wants to become: "${personality.whoIWantToBe}".
Today they completed ${todayLog.completedHabits?.length || 0}/${habits.length} habits.
Journal: "${todayLog.reflection || 'none'}"
Reframed: "${todayLog.reframed || 'none'}"

Give a beautiful tomorrow plan using the 6 Higher Faculties (Imagination, Will, Perception, Intuition, Memory, Reason).
One short activity per faculty.
Then recommend:
• One specific 5–15 minute YouTube video to study charisma today (include exact title + link)
• One 5–10 minute article or short reading on personal growth or faith (include title + link)

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
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-12 border border-white/50">
          <pre className="whitespace-pre-wrap font-sans text-lg leading-relaxed text-gray-800">
            {plan}
          </pre>
        </div>
      </div>
    </div>
  );
}

export const dynamic = 'force-dynamic';
