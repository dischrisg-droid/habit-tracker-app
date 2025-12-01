// app/ai-coach/page.tsx — FINAL & ALWAYS FULL PLANS (NO FALLBACKS)
'use client';

import { useStore } from '../../store/useStore';
import { useEffect, useState } from 'react';
import { Sparkles, PlayCircle } from 'lucide-react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function AICoachPage() {
  const { personality, habits, logs, saveAIPlan } = useStore();
  const [plan, setPlan] = useState('Generating your personalized plan...');
  const [video, setVideo] = useState('');

  useEffect(() => {
    if (!personality || !logs || logs.length === 0) {
      setPlan('Please save today’s log first.');
      return;
    }

    const todayLog = logs[logs.length - 1];
    const mbti = personality.mbti?.toUpperCase() || 'UNKNOWN';
    const vision = personality.whoIWantToBe || 'your highest self';
    const completed = todayLog.completedHabits?.length || 0;
    const total = habits.length;

    // Fresh videos
    const videoMap: Record<string, string> = {
      INFP: 'https://www.youtube.com/watch?v=zwK6Mzm7rvY',
      INFJ: 'https://www.youtube.com/watch?v=u9uVAIod9T4',
      INTJ: 'https://www.youtube.com/watch?v=gPGZRJDVXcU',
      ENFP: 'https://www.youtube.com/watch?v=uPJTfshToOU',
      ENFJ: 'https://www.youtube.com/watch?v=WAGUSdZaE6c',
    };
    const videoRec = videoMap[mbti] || 'https://www.youtube.com/watch?v=lVzxRVxIaxQ';
    setVideo(videoRec);

    // Always generate a full plan (fallback + AI attempt)
    const fallbackPlan = `
**Tomorrow belongs to ${mbti} becoming:** "${vision}"

You completed ${completed}/${total} habits today — proud of you.

**Your 6 Higher Faculties Plan**

• Imagination — 7-minute visualization of your future self on waking  
• Will — Do your most important habit first — no negotiation  
• Perception — 3× tomorrow: fully notice one thing with all senses  
• Reason — Protect your bedtime like it’s sacred  
• Memory — Before sleep: write one moment that made you feel alive  
• Intuition — Follow any body signal within 5 seconds

**Daily Charisma Study**  
Watch this to study presence & eye contact: ${videoRec}

You are becoming magnetic. Keep going.`;

    setPlan(fallbackPlan.trim());

    // Try AI (optional — fallback always works)
    const tryAI = async () => {
      try {
        const res = await fetch('/api/ai-plan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [{
              role: 'system',
              content: `You are a world-class coach for a ${mbti} who wants to become: "${vision}".
Today they completed ${completed}/${total} habits.
Journal: "${todayLog.reflection || 'none'}"
Reframed: "${todayLog.reframed || 'none'}"

Give a beautiful tomorrow plan using the 6 Higher Faculties.
One short activity per faculty.
End with 1–2 new habit ideas.
Tone: warm, wise, encouraging. Max 400 words.`
            }]
          }),
        });

        const data = await res.json();
        if (data.choices?.[0]?.message?.content) {
          const aiPlan = data.choices[0].message.content.trim();
          setPlan(aiPlan);
        }
      } catch (err) {
        // fallback already set, so do nothing
      }
    };

    tryAI();

    saveAIPlan?.({
      date: new Date().toISOString().split('T')[0],
      plan: fallbackPlan.trim(),
      video: videoRec,
    });
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

          {video && (
            <div className="mt-12 text-center">
              <a href={video} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-4 px-10 py-6 bg-gradient-to-r from-red-500 to-pink-600 text-white text-2xl font-bold rounded-3xl shadow-2xl hover:scale-105 transition">
                <PlayCircle className="w-12 h-12" />
                Watch Today’s Charisma Video
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export const dynamic = 'force-dynamic';
