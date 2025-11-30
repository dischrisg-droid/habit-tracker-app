'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '../store/useStore';  // ← this was the problem

export default function Home() {
  const router = useRouter();
  const { user, authLoading } = useStore();

  useEffect(() => {
    if (!authLoading) {
      if (!user) router.replace('/login');
      else router.replace('/daily-log');
    }
  }, [user, authLoading, router]);

  return null;
}




