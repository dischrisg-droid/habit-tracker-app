// app/ai-coach/page.tsx — FINAL & WORKING (YOUR LATEST KEY)
'use client';

import { useStore } from '../../store/useStore';
import { useEffect, useState } from 'react';
import { Sparkles, PlayCircle } from 'lucide-react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function AICoachPage() {
  const { personality, habits, logs, saveAIPlan } = useStore();
  const [plan, setPlan] = useState('Generating your plan with ChatGPT...');
  const [video, setVideo] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!personality || !logs || logs.length === 0) {
      setPlan('Please save today’s log first.');
      return;
    }

    const todayLog = logs[logs.length - 1];
    const completed = todayLog.completedHabits?.length || 0;
    const total = habits.length;
    const mbti = personality.mbti?.toUpperCase() || 'UNKNOWN';
    const vision = personality.whoIWantToBe || 'your highest self';

    // Fresh charisma videos
    const videoMap: Record<string, string> = {
      INFP: 'https://www.youtube.com/watch?v=zwK6Mzm7rvY',
      INFJ: 'https://www.youtube.com/watch?v=u9uVAIod9T4',
      INTJ: 'https://www.youtube.com/watch?v=gPGZRJDVXcU',
      ENFP: 'https://www.youtube.com/watch?v=uPJTfshToOU',
      ENFJ: 'https://www.youtube.com/watch?v=WAGUSdZaE6c',
    };
    setVideo(videoMap[mbti] || 'https://www.youtube.com/watch?v=lVzxRVxIaxQ');

    // LIVE CHATGPT CALL — YOUR NEW KEY
    const callChatGPT = async () => {
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer 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',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: `You are a world-class Co-Active coach for a ${mbti} who wants to become: "${vision}".
Today they completed ${completed}/${total} habits.
Journal: "${todayLog.reflection || ''}"
Reframed: "${todayLog.reframed || ''}"

Give a beautiful tomorrow plan using the 6 Higher Faculties (Imagination, Will, Perception, Intuition, Memory, Reason).
One short, powerful activity per faculty.
End with 1–2 perfect new habit recommendations.
Tone: warm, wise, encouraging, slightly playful. Max 400 words.`
              }
            ],
            max_tokens: 450,
            temperature: 0.8,
          }),
        });

        if (!response.ok) throw new Error('API error');

        const data = await response.json();
        const aiPlan = data.choices?.[0]?.message?.content || 'Keep going — you are becoming legendary.';

        setPlan(aiPlan.trim());

        saveAIPlan?.({
          date: new Date().toISOString().split('T')[0],
          plan: aiPlan.trim(),
          video: videoMap[mbti] || 'https://www.youtube.com/watch?v=lVzxRVxIaxQ',
        });
      } catch (err) {
        setPlan('ChatGPT temporarily unavailable — here’s your fallback:\n\nKeep showing up. You are becoming the person you wrote about. That’s the real magic.');
      }
    };

    callChatGPT();
  }, [personality, habits, logs, saveAIPlan]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b">
        <div className="max-w-5xl mx-auto px-6 py-6 flex items-center gap-6">
          <Link href="/daily-log" className="p-3 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-xl hover:scale-105 transition">
            <ArrowLeft className="w-7 h-7 text-white" />
          </Link>
          <h1 className="text-5xl font-black bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
            Your AI Coach (ChatGPT)
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
