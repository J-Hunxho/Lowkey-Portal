// app/api/vault/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(_req: NextRequest) {
  try {
    // In the real version, you'd validate a token / session here
    // and fetch items from a DB or storage provider.
    const items = [
      {
        id: 'lk-doc-001',
        name: 'Protocol: Silent Expansion',
        description: 'Internal doctrine on scaling without spectacle.',
        url: '#'
      },
      {
        id: 'lk-pack-ghost',
        name: 'Ghost Toolkit',
        description: 'A curated bundle of utilities for operating below the feed.',
        url: '#'
      },
      {
        id: 'lk-key-ops',
        name: 'Keyholder Operations Manual',
        description: 'How to move as if nothing has changed, after everything has.',
        url: '#'
      }
    ];

    return NextResponse.json({ items });
  } catch (err) {
    console.error('Vault error:', err);
    return NextResponse.json({ error: 'Vault error' }, { status: 500 });
  }
}
