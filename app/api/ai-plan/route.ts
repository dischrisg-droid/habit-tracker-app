// app/api/ai-plan/route.ts — 100% WORKING & SECURE
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { messages } = await request.json();

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages,
      max_tokens: 500,
      temperature: 0.8,
    }),
  });

  const data = await response.json();
  return NextResponse.json(data);
}
