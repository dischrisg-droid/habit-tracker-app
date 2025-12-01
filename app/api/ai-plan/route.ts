// app/api/ai-plan/route.ts — GROK 4.1 (CURRENT MODEL)
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid request: missing messages' }, { status: 400 });
    }

    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.GROK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'grok-4-1-fast', // Current model (as of Dec 2025)
        messages,
        max_tokens: 500,
        temperature: 0.8,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Grok error:', data);
      return NextResponse.json({ error: data.error?.message || 'Grok API error' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
