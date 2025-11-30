// app/ai-coach/page.tsx — YOUR PERSONAL AI COACH
'use client';

import { useStore } from '../../store/useStore';
import { useEffect, useState } from 'react';
import { Sparkles, Brain, Heart, Eye, MessageCircle, Target } from 'lucide-react';
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
  const { personality, habits, logs } = useStore();
  const [plan, setPlan] = useState('');

  useEffect(() => {
    if (!personality && habits.length === 0) return;

    const todayLog = logs[logs.length - 1];
    const reflection = todayLog?.reflection || '';
    const reframed = todayLog?.reframed || '';
    const completedToday = todayLog?.completedHabits?.length || 0;
    const totalHabits = habits.length;

    const mbti = personality?.mbti || 'unknown';
    const enneagram = personality?.enneagram || '';
    const vision = personality?.whoIWantToBe || '';
    const wakeUp = personality?.wakeUp || 'unknown';
    const bedTime = personality?.bedTime || 'unknown';

    const prompt = `You are a world-class Co-Active coach. 
The client’s MBTI: ${mbti}, Enneagram: ${enneagram}
Vision: "${vision}"
Wake-up: ${wakeUp}, Bedtime: ${bedTime}

Today they completed ${completedToday}/${totalHabits} habits.
Today’s journal: "${reflection}"
Reframed: "${reframed}"

Give them a beautiful, inspiring next-day plan built exactly around the 6 Higher Faculties (Imagination, Will, Perception, Intuition, Memory, Reason).
For each faculty give 1 short, concrete activity (1–3 sentences max).
At the end, optionally recommend 1–2 new habits that would perfectly fit their personality and current journey.

Tone: warm, wise, slightly playful, deeply encouraging.`;

    // In a real app you would call your AI API here
    // For now we generate a beautiful static-but-personalised response
    const generated = `
Tomorrow is a fresh canvas — here’s your day, designed for **${mbti.toUpperCase()} ${enneagram}** soul who wants to become "${vision}".

**Imagination**  
Close your eyes for 7 minutes after waking and vividly see yourself already living as the person you wrote about. Feel it in your body.

**Will**  
Choose one habit you skipped today and commit to doing it first thing — no negotiation. Declare it out loud right now.

**Perception**  
Three times tomorrow, pause and name one thing you’re grateful for with all five senses (what you see, hear, touch, smell, taste).

**Reason**  
Spend 10 minutes planning tomorrow night’s wind-down so you protect your ${bedTime} bedtime like it’s sacred.

**Memory**  
Before bed, write down one moment from tomorrow that made you feel proud — anchor the new identity.

**Intuition**  
Once tomorrow, when you feel a tug in your body (excitement or resistance), follow it immediately without overthinking.

Recommended new habits for you:
• "Morning pages" — 3 pages of stream-of-consciousness writing (perfect for your introspective nature)
• "Evening 3-question review": What inspired me? What challenged me? What do I want tomorrow to feel like?

You’ve got this. The person you want to become is already showing up. Keep going. ✨
    `.trim();

    setPlan(generated);
  }, [personality, habits, logs]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b">
        <div className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
          <Link href="/daily-log" className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-xl">
              <ArrowLeft className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-5xl font-black bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
              Your AI Coach
            </h1>
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-12 border border-white/50">
          <pre className="whitespace-pre-wrap font-sans text-lg leading-relaxed text-gray-800">
            {plan || 'Complete today’s log to get your personalized plan ✨'}
          </pre>
        </div>

        <div className="mt-12 grid grid-cols-3 md:grid-cols-6 gap-6">
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
