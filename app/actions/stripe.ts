"use server"

import { stripe } from "@/lib/stripe"
import { PRODUCTS } from "@/lib/products"
import { createClient } from "@/lib/supabase/server"

export async function startCheckoutSession(productId: string) {
  const product = PRODUCTS.find((p) => p.id === productId)
  if (!product) {
    throw new Error(`Product with id "${productId}" not found`)
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("User must be authenticated to checkout")
  }

  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded",
    redirect_on_completion: "never",
    customer_email: user.email || undefined,
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            description: product.description,
          },
          unit_amount: product.priceInCents,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    metadata: {
      userId: user.id,
      productId: product.id,
    },
  })

  return session.client_secret
}

export async function getCheckoutSessionStatus(clientSecret: string) {
  const session = await stripe.checkout.sessions.retrieve(clientSecret, {
    expand: ["payment_intent"],
  })

  return {
    status: session.payment_status,
    sessionId: session.id,
    paymentIntent: session.payment_intent,
  }
}

export async function createOrderFromCheckout(sessionId: string, productId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("User must be authenticated")
  }

  const product = PRODUCTS.find((p) => p.id === productId)
  if (!product) {
    throw new Error("Product not found")
  }

  const { data: order, error } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      total_price_cents: product.priceInCents,
      status: "completed",
      stripe_session_id: sessionId,
    })
    .select()
    .single()

  if (error) {
    throw error
  }

  // Create order item
  await supabase.from("order_items").insert({
    order_id: order.id,
    product_id: productId, // Declared variable here
    quantity: 1,
    price_cents: product.priceInCents,
  })

  return order
}
