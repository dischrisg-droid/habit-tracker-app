// app/ai-coach/page.tsx — FINAL VERSION (NO ERRORS)
'use client';

import { useStore } from '../../store/useStore';
import { useEffect, useState } from 'react';
import { Sparkles, Brain, Heart, Eye, MessageCircle, Target, PlayCircle } from 'lucide-react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const faculties = [
  { name: 'Imagination', icon: Brain, color: 'from-purple-500 to-pink-500' },
  { name: 'Will', icon: Target, color: 'from-red-500 to-orange-500' },
  { name: 'Perception', icon: Eye, color: 'from-blue-500 to-cyan-500' },
  { name: 'Intuition', icon: Sparkles, color: 'from-yellow-400 to-amber-500' },
  { name: 'Memory', icon: MessageCircle, color: 'from-green-500 to-emerald-500' },
  { name: 'Reason', icon: Heart, color: 'from-indigo-500 to-purple-500' },
];

export default function AICoachPage() {
  const { personality, habits, logs, saveAIPlan } = useStore(); // ← CORRECT NAME
  const [plan, setPlan] = useState('');
  const [video, setVideo] = useState('');

  useEffect(() => {
    if (!personality) return;

    const todayLog = logs[logs.length - 1];
    const reflection = todayLog?.reflection || '';
    const reframed = todayLog?.reframed || '';
    const completed = todayLog?.completedHabits?.length || 0;
    const total = habits.length;

    const mbti = personality.mbti?.toUpperCase() || 'UNKNOWN';
    const enneagram = personality.enneagram || '';

    // DAILY CHARISMA VIDEO RECOMMENDATION
    const charismaVideos: Record<string, { name: string; video: string }> = {
      INFP: { name: 'Adam Driver', video: 'https://www.youtube.com/watch?v=7k4sQb6mX4g' },
      INFJ: { name: 'Benedict Cumberbatch', video: 'https://www.youtube.com/watch?v=Qqq1q1lB1cI' },
      INTJ: { name: 'Elon Musk', video: 'https://www.youtube.com/watch?v=1h1o1oq4x1A' },
      INTP: { name: 'Edward Snowden', video: 'https://www.youtube.com/watch?v=5eIb0J2lB3A' },
      ENFP: { name: 'Robin Williams', video: 'https://www.youtube.com/watch?v=2y1jP6M2y2Y' },
      ENFJ: { name: 'Oprah Winfrey', video: 'https://www.youtube.com/watch?v=8tXm2J8g2zE' },
      ENTP: { name: 'Robert Downey Jr.', video: 'https://www.youtube.com/watch?v=3p8EBPVZ2Iw' },
      ENTJ: { name: 'Steve Jobs', video: 'https://www.youtube.com/watch?v=8rwsuXEp1J8' },
    };

    const videoRec = charismaVideos[mbti] || { name: 'Tom Hanks (universal charisma)', video: 'https://www.youtube.com/watch?v=Rb0h6uMcw2I' };

    const generatedPlan = `
Tomorrow belongs to **${mbti} ${enneagram}** becoming: "${personality.whoIWantToBe}"

You completed ${completed}/${total} habits today — proud of you.

**6 Higher Faculties – Your Plan for Tomorrow**

**Imagination**  
7-minute visualization: see yourself already living as that person. Feel it.

**Will**  
Choose the one habit you care about most and do it first — no negotiation.

**Perception**  
Three times tomorrow, pause and fully notice one thing with all senses.

**Reason**  
Protect your ${personality.bedTime || 'bedtime'} like it’s sacred.

**Memory**  
Before sleep, write one moment that made you feel alive.

**Intuition**  
When you feel a body signal (excitement/resistance), follow it within 5 seconds.

**Daily Charisma Study**  
Watch this clip of **${videoRec.name}** — study presence, pauses, eye contact:
${videoRec.video}

You are becoming magnetic. Keep going. ✨
    `.trim();

    setPlan(generatedPlan);
    setVideo(videoRec.video);

    // SAVE THE PLAN
    saveAIPlan({
      date: new Date().toISOString().split('T')[0],
      plan: generatedPlan,
      video: videoRec.video,
    });
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
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-12 border border-white/50">
          <pre className="whitespace-pre-wrap font-sans text-lg leading-relaxed text-gray-800">
            {plan || 'Complete today’s log to get your personalized plan'}
          </pre>

          {video && (
            <div className="mt-12 text-center">
              <a
                href={video}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-4 px-10 py-6 bg-gradient-to-r from-red-500 to-pink-600 text-white text-2xl font-bold rounded-3xl shadow-2xl hover:scale-105 transition"
              >
                <PlayCircle className="w-12 h-12" />
                Watch Today’s Charisma Video
              </a>
            </div>
          )}
        </div>

        {/* 6 Faculties Icons */}
        <div className="mt-16 grid grid-cols-3 md:grid-cols-6 gap-6">
          {faculties.map(f => (
            <div key={f.name} className="text-center">
              <div className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center shadow-lg`}>
                <f.icon className="w-10 h-10 text-white" />
              </div>
              <p className="mt-3 text-sm font-bold text-gray-700">{f.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
