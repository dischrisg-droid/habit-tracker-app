'use client';

import Link from 'next/link';
import { useStore } from '../store/useStore';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const { user, authLoading, habits } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) router.replace('/login');
  }, [authLoading, user, router]);

  // First-time user? Send to onboarding
  useEffect(() => {
    if (user && habits.length === 0) {
      router.replace('/onboarding');
    }
  }, [user, habits, router]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
        <div className="text-4xl font-bold text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-20 px-6">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-6xl md:text-8xl font-black mb-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Welcome back!
        </h1>
        <p className="text-3xl text-gray-700 mb-16">Let's make today legendary.</p>

        <div className="grid md:grid-cols-3 gap-10">
          <Link href="/habits" className="group">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-16 shadow-2xl hover:shadow-3xl hover:-translate-y-6 transition-all duration-500 border border-white/50 h-64 flex items-center justify-center flex">
              <h2 className="text-5xl font-black text-indigo-600 group-hover:scale-110 transition">My Habits</h2>
            </div>
          </Link>

          <Link href="/daily-log" className="group">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-16 shadow-2xl hover:shadow-3xl hover:-translate-y-6 transition-all duration-500 border border-white/50 h-64 items-center justify-center flex">
              <h2 className="text-5xl font-black text-purple-600 group-hover:scale-110 transition">Daily Log</h2>
            </div>
          </Link>

          <Link href="/personality" className="group">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-16 shadow-2xl hover:shadow-3xl hover:-translate-y-6 transition-all duration-500 border border-white/50 h-64 items-center justify-center flex">
              <h2 className="text-5xl font-black text-pink-600 group-hover:scale-110 transition">Personality</h2>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

