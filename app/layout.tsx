'use client';

import './globals.css';
import Link from 'next/link';
import { useStore } from '../store/useStore';
import { useEffect } from 'react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, authLoading, initAuth } = useStore();

  useEffect(() => {
    initAuth();
  }, []);

  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif', background: '#f9fafb' }}>
        <header style={{
          padding: '1rem 2rem',
          background: 'white',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}>
          <Link href="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b', textDecoration: 'none' }}>
            Habit Tracker & Journal
          </Link>
          {!authLoading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {user ? (
                <>
                  <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>{user.email}</span>
                  <form action="/auth/signout" method="post">
                    <button style={{
                      padding: '0.5rem 1rem',
                      background: '#ef4444',
                      color: 'white',
                      borderRadius: '0.5rem',
                      border: 'none',
                      fontWeight: 'bold',
                    }}>
                      Logout
                    </button>
                  </form>
                </>
              ) : (
                <Link href="/login" style={{
                  padding: '0.5rem 1rem',
                  background: '#3b82f6',
                  color: 'white',
                  borderRadius: '0.5rem',
                  textDecoration: 'none',
                  fontWeight: 'bold',
                }}>
                  Login
                </Link>
              )}
            </div>
          )}
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}