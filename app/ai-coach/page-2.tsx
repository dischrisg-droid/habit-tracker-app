// app/ai-coach/page-2.tsx — FINAL, IMPOSSIBLE TO CACHE WRONG VERSION
'use client';

import { useStore } from '../../store/useStore';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, PlayCircle } from 'lucide-react';

export default function AICoachPage() {
  const { personality, habits, logs, saveAIPlan } = useStore();
  const [plan, setPlan] = useState('Loading your plan...');
  const [video, setVideo] = useState('');

  useEffect(() => {
    if (!personality) {
      setPlan('Set your personality profile first');
      return;
    }

    const mbti = personality.mbti?.toUpperCase() || 'UNKNOWN';
    const videoMap: Record<string, string> = {
      INFP: 'https://www.youtube.com/watch?v=7k4sQb6mX4g',
      INFJ: 'https://www.youtube.com/watch?v=Qqq1q1lB1cI',
      INTJ: 'https://www.youtube.com/watch?v=1h1o1oq4x1A',
    };
    const video = videoMap[mbti] || 'https://www.youtube.com/watch?v=Rb0h6uMcw2I';

    const newPlan = `AI Coach active for ${mbti}\n\nYour charisma study video is ready below.\n\nKeep going — you're becoming legendary.`;

    setPlan(newPlan);
    setVideo(video);

    saveAIPlan({
      date: new Date().toISOString().split('T')[0],
      plan: newPlan,
      video,
    });
  }, [personality, habits, logs, saveAIPlan]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-pink-50 p-8">
      <Link href="/daily-log" className="inline-block mb-8">
        <ArrowLeft className="w-10 h-10 text-indigo-600" />
      </Link>
      <h1 className="text-5xl font-bold text-center mb-12">Your AI Coach</h1>
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl p-12">
        <pre className="whitespace-pre-wrap text-lg">{plan}</pre>
        {video && (
          <a href={video} target="_blank" className="mt-8 inline-block px-8 py-4 bg-red-600 text-white rounded-xl text-xl font-bold">
            <PlayCircle className="inline w-8 h-8 mr-2" />
            Watch Charisma Video
          </a>
        )}
      </div>
    </div>
  );
}
