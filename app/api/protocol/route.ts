// app/api/protocol/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { notifyProtocol } from '@/lib/telegram';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    await notifyProtocol(email);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Protocol error:', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
