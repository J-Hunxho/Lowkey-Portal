// app/api/access/verify/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessKey } from '@/lib/access';

export async function POST(req: NextRequest) {
  try {
    const { key } = await req.json();
    if (!key || typeof key !== 'string') {
      return NextResponse.json({ error: 'Invalid key' }, { status: 400 });
    }

    const valid = verifyAccessKey(key);
    return NextResponse.json({ valid });
  } catch (err) {
    console.error('Access verify error:', err);
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}
