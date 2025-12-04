// app/history/page.tsx — FULL HISTORY OF LOGS + AI PLANS
'use client';

import { useStore } from '../../store/useStore';
import Link from 'next/link';
import { ArrowLeft, Calendar, Brain, MessageSquare } from 'lucide-react';

export default function HistoryPage() {
  const { logs, aiPlans } = useStore();

  // Sort by date descending
  const sortedLogs = [...logs].sort((a, b) => b.date.localeCompare(a.date));
  const sortedPlans = [...aiPlans].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center gap-6">
          <Link href="/" className="p-3 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-xl hover:scale-105 transition">
            <ArrowLeft className="w-7 h-7 text-white" />
          </Link>
          <h1 className="text-5xl font-black bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
            Your Journey
          </h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-8">
        {sortedLogs.length === 0 ? (
          <div className="text-center py-32">
            <Calendar className="w-24 h-24 mx-auto text-gray-400 mb-8" />
            <p className="text-3xl text-gray-600">No logs yet. Start your journey!</p>
          </div>
        ) : (
          <div className="space-y-12">
            {sortedLogs.map((log) => {
              const plan = sortedPlans.find(p => p.date === log.date);
              const date = new Date(log.date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              });

              return (
                <div key={log.date} className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
                  <div className="bg-gradient-to-r from-indigo-100 to-purple-100 p-8">
                    <h2 className="text-4xl font-black text-indigo-900">{date}</h2>
                  </div>

                  <div className="p-10 space-y-10">
                    {/* Reflection */}
                    {log.reflection && (
                      <div>
                        <div className="flex items-center gap-4 mb-4">
                          <MessageSquare className="w-8 h-8 text-indigo-600" />
                          <h3 className="text-2xl font-bold">Reflection</h3>
                        </div>
                        <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">
                          {log.reflection}
                        </p>
                      </div>
                    )}

                    {/* Reframed */}
                    {log.reframed && (
                      <div>
                        <div className="flex items-center gap-4 mb-4">
                          <Brain className="w-8 h-8 text-purple-600" />
                          <h3 className="text-2xl font-bold">Reframed</h3>
                        </div>
                        <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">
                          {log.reframed}
                        </p>
                      </div>
                    )}

                    {/* AI Plan */}
                    {plan && (
                      <div>
                        <div className="flex items-center gap-4 mb-4">
                          <Sparkles className="w-8 h-8 text-pink-600" />
                          <h3 className="text-2xl font-bold">Tomorrow's Plan</h3>
                        </div>
                        <pre className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap font-sans">
                          {plan.plan}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
