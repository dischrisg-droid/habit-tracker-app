// app/api/ai-plan/route.ts — 100% WORKING VERSION
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        max_tokens: 500,
        temperature: 0.8,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('OpenAI error:', data);
      return NextResponse.json({ error: data.error?.message || 'OpenAI error' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Route error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
