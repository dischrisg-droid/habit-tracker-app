'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push('/');
      }
    };
    checkSession();
  }, [router]);

  const handleSubmit = async () => {
    setLoading(true);
    setMessage('');
    const { error } = isSignUp
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setMessage('Error: ' + error.message);
    } else {
      router.push('/');
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '2rem',
    }}>
      <div style={{
        background: 'white',
        padding: '3rem',
        borderRadius: '1.5rem',
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
        width: '100%',
        maxWidth: '420px',
      }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '900', textAlign: 'center', marginBottom: '2rem' }}>
          {isSignUp ? 'Create Account' : 'Welcome Back'}
        </h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: '100%', padding: '1rem', marginBottom: '1rem', borderRadius: '0.75rem', border: '1px solid #d1d5db' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: '100%', padding: '1rem', marginBottom: '1.5rem', borderRadius: '0.75rem', border: '1px solid #d1d5db' }}
        />
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: '100%',
            padding: '1rem',
            background: '#667eea',
            color: 'white',
            borderRadius: '0.75rem',
            fontWeight: 'bold',
          }}
        >
          {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Log In'}
        </button>
        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.95rem' }}>
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            style={{ color: '#667eea', fontWeight: 'bold', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            {isSignUp ? 'Log In' : 'Sign Up'}
          </button>
        </p>
        {message && <p style={{ color: 'red', textAlign: 'center', marginTop: '1rem' }}>{message}</p>}
      </div>
    </div>
  );
}