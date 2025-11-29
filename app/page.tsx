'use client';

import { useStore } from '../store/useStore';
import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';



export default function HomePage() {
  const { user, initAuth, authLoading } = useStore();
  const router = useRouter();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login');  // Replace to avoid back button loop
    }
  }, [authLoading, user, router]);

  if (authLoading || !user) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Loading...
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f9fafb 0%, #e5e7eb 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
    }}>
      <div style={{ maxWidth: '400px', width: '100%', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          Welcome back!
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#6b7280', marginBottom: '3rem' }}>
          Let's make today count.
        </p>
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          <Link
            href="/habits"
            style={{
              padding: '1.5rem',
              background: 'white',
              borderRadius: '0.75rem',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              fontSize: '1.25rem',
              fontWeight: 'bold',
              color: '#3b82f6',
              textDecoration: 'none',
              transition: 'transform 0.2s',
            }}
          >
            My Habits
          </Link>
          <Link
            href="/daily-log"
            style={{
              padding: '1.5rem',
              background: 'white',
              borderRadius: '0.75rem',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              fontSize: '1.25rem',
              fontWeight: 'bold',
              color: '#8b5cf6',
              textDecoration: 'none',
              transition: 'transform 0.2s',
            }}
          >
            Daily Log
          </Link>
          <Link
            href="/personality"
            style={{
              padding: '1.5rem',
              background: 'white',
              borderRadius: '0.75rem',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              fontSize: '1.25rem',
              fontWeight: 'bold',
              color: '#10b981',
              textDecoration: 'none',
              transition: 'transform 0.2s',
            }}
          >
            Personality Profile
          </Link>
        </div>
      </div>
    </div>
  );
}