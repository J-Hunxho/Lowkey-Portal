// app/api/oracle/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { question } = await req.json();
    if (!question || typeof question !== 'string') {
      return NextResponse.json({ error: 'Invalid question' }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Oracle not configured' }, { status: 500 });
    }

    const systemPrompt =
      'You are a cryptic oracle. Respond to the user with one or two short, profound, philosophical sentences. ' +
      'Do not be conversational. Be mysterious and abstract.';

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: question }
        ],
        max_tokens: 80,
        temperature: 0.9
      })
    });

    const data = await res.json();
    if (!res.ok) {
      console.error('OpenAI error:', data);
      return NextResponse.json({ error: 'Oracle upstream error' }, { status: 500 });
    }

    const answer = data.choices?.[0]?.message?.content?.trim() || 'The stream is quiet.';
    return NextResponse.json({ answer });
  } catch (err) {
    console.error('Oracle route error:', err);
    return NextResponse.json({ error: 'Unexpected oracle error' }, { status: 500 });
  }
}
