// app/api/ai-plan/route.ts — FINAL & 100% WORKING
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { messages } = await request.json();

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer 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',
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
