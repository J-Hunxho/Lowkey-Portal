// app/api/stripe/checkout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(_req: NextRequest) {
  try {
    const priceId = process.env.STRIPE_PRICE_ID;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (!priceId || !baseUrl) {
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ],
      success_url: `${baseUrl}/?status=success`,
      cancel_url: `${baseUrl}/?status=cancelled`,
      metadata: {
        product: 'Founder Key'
      }
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('Stripe checkout error:', err);
    return NextResponse.json({ error: 'Stripe error' }, { status: 500 });
  }
}
