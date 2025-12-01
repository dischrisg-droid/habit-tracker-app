// app/ai-coach/page.tsx — FINAL WORKING VERSION
'use client';

import { useStore } from '../../store/useStore';
import { useEffect, useState } from 'react';
import { Sparkles, PlayCircle } from 'lucide-react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function AICoachPage() {
  const {personality, habits, logs, saveAIPlan} = useStore();
  const [plan, setPlan] = useState('Generating your plan...');
  const [video, setVideo] = useState('');

  useEffect(() => {
    if (!personality || !logs?.length) {
      setPlan('Save today’s log first.');
      return;
    }

    const todayLog = logs[logs.length - 1];
    const mbti = personality.mbti?.toUpperCase() || 'UNKNOWN';
    const vision = personality.whoIWantToBe || 'your best self';

    const videoMap: Record<string, string> = {
      INFP: 'https://www.youtube.com/watch?v=zwK6Mzm7rvY',
      INFJ: 'https://www.youtube.com/watch?v=u9uVAIod9T4',
      INTJ: 'https://www.youtube.com/watch?v=gPGZRJDVXcU',
      ENFP: 'https://www.youtube.com/watch?v=uPJTfshToOU',
      ENFJ: 'https://www.youtube.com/watch?v=WAGUSdZaE6c',
    };
    setVideo(videoMap[mbti] || 'https://www.youtube.com/watch?v=lVzxRVxIaxQ');

    const callAI = async () => {
      const res = await fetch('/api/ai-plan', {
        method: 'POST',
        body: JSON.stringify({
          messages: [{
            role: 'system',
            content: `You are a world-class coach for a ${mbti} 6w5 who wants to become: "${vision}".
Today they completed ${todayLog.completedHabits?.length || 0}/${habits.length} habits.
Journal: "${todayLog.reflection || ''}"
Reframed: "${todayLog.reframed || ''}"

Give a beautiful tomorrow plan using the 6 Higher Faculties.
One short activity per faculty.
End with 1–2 new habit ideas.
Tone: warm, encouraging, wise. Max 350 words.`
          }]
        }),
      });

      const data = await res.json();
      const text = data.choices?.[0]?.message?.content || 'You are becoming legendary.';
      setPlan(text.trim());

      saveAIPlan?.({
        date: new Date().toISOString().split('T')[0],
        plan: text.trim(),
        video: videoMap[mbti] || 'https://www.youtube.com/watch?v=lVzxRVxIaxQ',
      });
    };

    callAI();
  }, [personality, habits, logs, saveAIPlan]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-8">
      <Link href="/daily-log" className="inline-block mb-8 text-indigo-600">
        ← Back
      </Link>
      <h1 className="text-5xl font-bold text-center mb-12">Your AI Coach</h1>
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl p-12">
        <pre className="whitespace-pre-wrap text-lg leading-relaxed">{plan}</pre>
        {video && (
          <div className="mt-12 text-center">
            <a href={video} target="_blank" className="inline-flex items-center gap-4 px-10 py-6 bg-red-600 text-white text-2xl font-bold rounded-3xl shadow-2xl hover:scale-105 transition">
              <PlayCircle className="w-12 h-12" />
              Watch Today’s Charisma Video
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export const dynamic = 'force-dynamic';
