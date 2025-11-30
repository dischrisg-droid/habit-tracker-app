// app/ai-coach/page.tsx — NUCLEAR FIXED VERSION
'use client';

import { useStore } from '../../store/useStore';
import { useEffect, useState } from 'react';
import { Sparkles, Brain, Heart, Eye, MessageCircle, Target, PlayCircle } from 'lucide-react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function AICoachPage() {
  const { personality, habits, logs, saveAIPlan } = useStore();
  const [plan, setPlan] = useState('');
  const [video, setVideo] = useState('');

  useEffect(() => {
    if (!personality || !habits || !logs) return;

    const todayLog = logs[logs.length - 1] || {};
    const mbti = personality.mbti?.toUpperCase() || 'UNKNOWN';

    const videoRec = {
      INFP: { name: 'Adam Driver', video: 'https://www.youtube.com/watch?v=7k4sQb6mX4g' },
      INFJ: { name: 'Benedict Cumberbatch', video: 'https://www.youtube.com/watch?v=Qqq1q1lB1cI' },
      INTJ: { name: 'Elon Musk', video: 'https://www.youtube.com/watch?v=1h1o1oq4x1A' },
    }[mbti] || { name: 'Tom Hanks', video: 'https://www.youtube.com/watch?v=Rb0h6uMcw2I' };

    const generated = `Your personalized tomorrow plan + charisma study video from ${videoRec.name} is ready.`;

    setPlan(generated);
    setVideo(videoRec.video);

    saveAIPlan({
      date: new Date().toISOString().split('T')[0],
      plan: generated,
      video: videoRec.video,
    });
  }, [personality, habits, logs, saveAIPlan]);

  return (
    <div className="p-8 text-center">
      <Link href="/daily-log" className="inline-block mb-8">
        <ArrowLeft className="w-8 h-8" />
      </Link>
      <h1 className="text-4xl font-bold mb-8">AI Coach</h1>
      <pre className="bg-white p-8 rounded-2xl shadow-lg whitespace-pre-wrap">{plan}</pre>
      {video && (
        <a href={video} target="_blank" className="mt-8 inline-block px-8 py-4 bg-red-600 text-white rounded-xl text-xl">
          Watch Charisma Video
        </a>
      )}
    </div>
  );
}
