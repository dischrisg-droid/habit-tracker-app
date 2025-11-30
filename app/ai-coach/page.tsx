// app/ai-coach/page.tsx — LIVE GROK AI + YOUR API KEY
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
  const { personality, habits, logs, saveAIPlan } = useStore();
  const [plan, setPlan] = useState('Generating your personalized plan with Grok...');
  const [video, setVideo] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!personality || !logs || logs.length === 0) {
      setPlan('Please save a daily log first.');
      return;
    }

    const todayLog = logs[logs.length - 1];
    const mbti = personality.mbti?.toUpperCase() || 'UNKNOWN';
    const vision = personality.whoIWantToBe || 'your highest self';

    // Fresh charisma videos
    const videoMap: Record<string, { name: string; url: string }> = {
      INFP: { name: 'Adam Driver', url: 'https://www.youtube.com/watch?v=zwK6Mzm7rvY' },
      INFJ: { name: 'Benedict Cumberbatch', url: 'https://www.youtube.com/watch?v=u9uVAIod9T4' },
      INTJ: { name: 'Elon Musk', url: 'https://www.youtube.com/watch?v=gPGZRJDVXcU' },
      ENFP: { name: 'Robin Williams', url: 'https://www.youtube.com/watch?v=uPJTfshToOU' },
      ENFJ: { name: 'Oprah Winfrey', url: 'https://www.youtube.com/watch?v=WAGUSdZaE6c' },
    };
    const videoRec = videoMap[mbti] || { name: 'Tom Hanks', url: 'https://www.youtube.com/watch?v=lVzxRVxIaxQ' };
    setVideo(videoRec.url);

    // LIVE GROK API CALL
    const callGrok = async () => {
      try {
        const response = await fetch('https://api.x.ai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer xai-VHH7AsnitnZiGm7kfRCRZDntoQuKwKQIzmTIWoMKk3EVahCe40ZomzxkB0AQeawIeVtsO3WzzuODTA7d',
          },
          body: JSON.stringify({
            model: 'grok-beta',
            messages: [
              {
                role: 'system',
                content: `You are a world-class Co-Active coach for a ${mbti} who wants to become: "${vision}". 
They completed ${todayLog.completedHabits?.length || 0}/${habits.length} habits today.
Journal: "${todayLog.reflection || 'none'}"
Reframed: "${todayLog.reframed || 'none'}"

Give a beautiful tomorrow plan using the 6 Higher Faculties: Imagination, Will, Perception, Intuition, Memory, Reason.
One short, powerful activity per faculty.
End with 1–2 new habit suggestions that fit them perfectly.
Tone: warm, wise, encouraging, slightly playful.`
              }
            ],
            max_tokens: 400,
            temperature: 0.8,
          }),
        });

        const data = await response.json();
        const aiResponse = data.choices?.[0]?.message?.content || 'Grok is thinking...';

        setPlan(aiResponse.trim());
        saveAIPlan?.({
          date: new Date().toISOString().split('T')[0],
          plan: aiResponse.trim(),
          video: videoRec.url,
        });
      } catch (error) {
        setPlan('AI temporarily unavailable — using fallback plan.\n\nKeep going — you are becoming legendary.');
      }
    };

    callGrok();
  }, [personality, habits, logs, saveAIPlan]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b">
        <div className="max-w-5xl mx-auto px-6 py-6 flex items-center gap-6">
          <Link href="/daily-log" className="p-3 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-xl hover:scale-105 transition">
            <ArrowLeft className="w-7 h-7 text-white" />
          </Link>
          <h1 className="text-5xl font-black bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
            Your AI Coach (Live with Grok)
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

export const dynamic = 'force-dynamic';
