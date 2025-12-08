// app/layout.tsx — FINAL & 100% WORKING (with Example Habits button + modal)
'use client';

import './globals.css';
import Link from 'next/link';
import { useStore } from '../store/useStore';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { Home, Flame, User, Calendar, LogOut, Sparkles, Plus, X } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const exampleHabits = [
  { name: "Drink 2L water", icon: "Droplets", frequency: "daily", notes: "Stay hydrated!" },
  { name: "Meditate 10 min", icon: "Brain", frequency: "daily", notes: "Morning calm" },
  { name: "Exercise", icon: "Dumbbell", frequency: "daily", targettime: "30 min" },
  { name: "Read 20 pages", icon: "BookOpen", frequency: "daily" },
  { name: "Sleep 8 hours", icon: "Moon", frequency: "daily", notes: "10pm–6am" },
  { name: "Morning journal", icon: "Pen", frequency: "daily" },
  { name: "Gratitude practice", icon: "Heart", frequency: "daily" },
  { name: "Walk 10k steps", icon: "Footprints", frequency: "daily" },
  { name: "No screens after 9pm", icon: "SmartphoneNfc", frequency: "daily" },
  { name: "Cold shower", icon: "Snowflake", frequency: "daily" },
  { name: "Run 5km", icon: "Move", frequency: "weekly", days: [1, 3, 5] },
  { name: "Call a friend", icon: "Phone", frequency: "weekly", days: [0, 3] },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { user, authLoading, initAuth, saveHabits, habits } = useStore();
  const router = useRouter();
  const [showExampleHabits, setShowExampleHabits] = useState(false);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  const addExampleHabit = async (example: any) => {
    const newHabit = {
      id: crypto.randomUUID(),
      name: example.name,
      frequency: example.frequency,
      days: example.days || [],
      targettime: example.targettime || '',
      notes: example.notes || '',
      icon: example.icon,
    };
    await saveHabits([...habits, newHabit]);
    setShowExampleHabits(false);
  };

  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        {/* Header */}
        <header className="bg-white shadow-sm border-b sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              Habit Tracker & Journal
            </Link>

            {!authLoading && (
              <>
                {user ? (
                  <div className="flex items-center gap-6">
                    {/* Navigation Icons */}
                    <div className="flex gap-4">
                      <Link href="/" className="p-3 bg-blue-100 rounded-2xl hover:bg-blue-200 transition">
                        <Home className="w-7 h-7 text-blue-700" />
                      </Link>
                      <Link href="/habits" className="p-3 bg-orange-100 rounded-2xl hover:bg-orange-200 transition">
                        <Flame className="w-7 h-7 text-orange-700" />
                      </Link>
                      <Link href="/personality" className="p-3 bg-pink-100 rounded-2xl hover:bg-pink-200 transition">
                        <User className="w-7 h-7 text-pink-700" />
                      </Link>
                      <Link href="/history" className="p-3 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl shadow-xl hover:scale-105 transition">
                        <Calendar className="w-7 h-7 text-white" />
                      </Link>
                    </div>

                    {/* Example Habits + New Habit */}
                    <div className="flex gap-4">
                      <button
                        onClick={() => setShowExampleHabits(true)}
                        className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold rounded-2xl shadow-lg hover:scale-105 transition flex items-center gap-2"
                      >
                        <Sparkles className="w-6 h-6" />
                        Example Habits
                      </button>
                      <Link
                        href="/habits"
                        className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-2xl shadow-2xl hover:scale-105 transition flex items-center gap-3"
                      >
                        <Plus className="w-7 h-7" />
                        New Habit
                      </Link>
                    </div>

                    {/* User + Logout */}
                    <div className="flex items-center gap-4 border-l pl-6 border-gray-200">
                      <span className="text-gray-600 hidden sm:inline">{user.email}</span>
                      <button
                        onClick={handleLogout}
                        className="p-3 bg-red-100 rounded-2xl hover:bg-red-200 transition"
                      >
                        <LogOut className="w-6 h-6 text-red-700" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-2xl shadow-lg hover:scale-105 transition"
                  >
                    Login
                  </Link>
                )}
              </>
            )}
          </div>
        </header>

        {/* Example Habits Modal */}
        {showExampleHabits && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xl flex items-center justify-center p-6 z-50">
            <div className="bg-white rounded-3xl shadow-3xl p-12 max-w-4xl w-full max-h-screen overflow-y-auto">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-4xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Quick Start — Tap to Add
                </h2>
                <button
                  onClick={() => setShowExampleHabits(false)}
                  className="p-3 bg-gray-200 rounded-2xl hover:bg-gray-300 transition"
                >
                  <X className="w-8 h-8" />
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {exampleHabits.map((ex) => (
                  <button
                    key={ex.name}
                    onClick={() => addExampleHabit(ex)}
                    className="p-8 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl hover:scale-105 transition shadow-lg border border-white/50 text-left"
                  >
                    <div className="text-2xl font-bold mb-2">{ex.name}</div>
                    {ex.notes && <div className="text-sm text-gray-600">{ex.notes}</div>}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <main>{children}</main>
      </body>
    </html>
  );
}
