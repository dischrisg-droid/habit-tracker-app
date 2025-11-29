'use client';

import './globals.css';  // This is the key import for all pages

import Link from 'next/link';
import { useStore } from '../store/useStore';
import { useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { user, authLoading, initAuth } = useStore();
  const router = useRouter();

  useEffect(() => {
    initAuth();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <header className="bg-white shadow-sm border-b sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              Habit Tracker & Journal
            </Link>
            {!authLoading && (
              <>
                {user ? (
                  <div className="flex items-center gap-4">
                    <span className="text-gray-600">{user.email}</span>
                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
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
