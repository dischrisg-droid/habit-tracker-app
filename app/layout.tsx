// app/layout.tsx — FINAL & PERFECT
'use client';

import './globals.css';
import Link from 'next/link';
import { useStore } from '../store/useStore';
import { useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { Home, Flame, User, Calendar, LogOut } from 'lucide-react'; // ← Added Calendar + LogOut

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { user, authLoading, initAuth } = useStore();
  const router = useRouter();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        {/* Header / Navigation */}
        <header className="bg-white shadow-sm border-b sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              Habit Tracker & Journal
            </Link>

            {!authLoading && (
              <>
                {user ? (
                  <div className="flex items-center gap-6">
                    {/* Main Navigation Icons */}
                    <div className="flex gap-4">
                      <Link
                        href="/"
                        className="p-3 bg-indigo-100 rounded-2xl hover:bg-indigo-200 transition"
                      >
                        <Home className="w-7 h-7 text-indigo-700" />
                      </Link>

                      <Link
                        href="/habits"
                        className="p-3 bg-orange-100 rounded-2xl hover:bg-orange-200 transition"
                      >
                        <Flame className="w-7 h-7 text-orange-700" />
                      </Link>

                      <Link
                        href="/personality"
                        className="p-3 bg-pink-100 rounded-2xl hover:bg-pink-200 transition"
                      >
                        <User className="w-7 h-7 text-pink-700" />
                      </Link>

                      {/* ← NEW: HISTORY BUTTON */}
                      <Link
                        href="/history"
                        className="p-3 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl shadow-xl hover:scale-105 transition"
                      >
                        <Calendar className="w-7 h-7 text-white" />
                      </Link>
                    </div>

                    {/* User email + Logout */}
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

        <main>{children}</main>
      </body>
    </html>
  );
}
