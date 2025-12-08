"use client"

import { useState, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PRODUCTS } from "@/lib/products"
import { startCheckoutSession, createOrderFromCheckout, getCheckoutSessionStatus } from "@/app/actions/stripe"
import { ArrowLeft, Check } from "lucide-react"
import Link from "next/link"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const productId = params.id as string

  const product = PRODUCTS.find((p) => p.id === productId)
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [checkoutComplete, setCheckoutComplete] = useState(false)
  const [sessionId, setSessionId] = useState<string>("")

  const startCheckout = useCallback(async () => {
    try {
      setIsCheckingOut(true)
      const clientSecret = await startCheckoutSession(productId)
      setSessionId(clientSecret)
    } catch (error) {
      console.error("Checkout error:", error)
      alert("Failed to start checkout")
      setIsCheckingOut(false)
    }
  }, [productId])

  const handleCheckoutSuccess = useCallback(async () => {
    try {
      // Get session status
      const status = await getCheckoutSessionStatus(sessionId)

      if (status.status === "paid") {
        // Create order in database
        await createOrderFromCheckout(status.sessionId, productId)
        setCheckoutComplete(true)
      }
    } catch (error) {
      console.error("Order creation error:", error)
      alert("Order created but there was an issue saving it")
    }
  }, [sessionId, productId])

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 py-12">
          <Link href="/marketplace">
            <Button variant="outline" className="mb-8 gap-2 bg-transparent">
              <ArrowLeft className="size-4" />
              Back to Marketplace
            </Button>
          </Link>
          <div className="text-center py-12">
            <p className="text-muted-foreground">Product not found</p>
          </div>
        </main>
      </div>
    )
  }

  if (checkoutComplete) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="max-w-2xl mx-auto px-4 py-12">
          <Card className="border-primary/20 text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <div className="bg-primary/20 p-4 rounded-full">
                  <Check className="size-8 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl">Order Confirmed</CardTitle>
              <CardDescription>Thank you for your purchase. Your exclusive item is being prepared.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-input/30 rounded-lg">
                <p className="text-sm text-muted-foreground">Item</p>
                <p className="font-semibold text-foreground mt-1">{product.name}</p>
              </div>
              <div className="p-4 bg-input/30 rounded-lg">
                <p className="text-sm text-muted-foreground">Amount Paid</p>
                <p className="font-semibold text-foreground text-xl mt-1">${(product.priceInCents / 100).toFixed(2)}</p>
              </div>
              <Button className="w-full" onClick={() => router.push("/orders")}>
                View Order Details
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  if (sessionId) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="max-w-2xl mx-auto px-4 py-12">
          <Link href={`/product/${productId}`}>
            <Button variant="outline" className="mb-8 gap-2 bg-transparent">
              <ArrowLeft className="size-4" />
              Back
            </Button>
          </Link>
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle>Secure Checkout</CardTitle>
              <CardDescription>Complete your purchase securely with Stripe</CardDescription>
            </CardHeader>
            <CardContent>
              <EmbeddedCheckoutProvider stripe={stripePromise} options={{ clientSecret: sessionId }}>
                <EmbeddedCheckout onComplete={handleCheckoutSuccess} />
              </EmbeddedCheckoutProvider>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-12">
        <Link href="/marketplace">
          <Button variant="outline" className="mb-8 gap-2 bg-transparent">
            <ArrowLeft className="size-4" />
            Back to Marketplace
          </Button>
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="aspect-square rounded-lg border border-primary/20 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center overflow-hidden relative">
            {product.image ? (
              <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
            ) : (
              <div className="text-center">
                <div className="text-6xl">✨</div>
                <p className="text-muted-foreground mt-4">{product.category}</p>
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="flex flex-col justify-between">
            <div>
              <Badge className="mb-4 bg-primary/20 text-primary border-primary/40">{product.category}</Badge>
              <h1 className="text-4xl font-bold text-foreground mb-4">{product.name}</h1>
              <p className="text-lg text-muted-foreground mb-8">{product.description}</p>

              {/* Features */}
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 p-3 bg-input/30 rounded-lg border border-border/50">
                  <Check className="size-5 text-primary" />
                  <span className="text-sm text-foreground">Exclusive to VIP Members</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-input/30 rounded-lg border border-border/50">
                  <Check className="size-5 text-primary" />
                  <span className="text-sm text-foreground">Premium Quality Guaranteed</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-input/30 rounded-lg border border-border/50">
                  <Check className="size-5 text-primary" />
                  <span className="text-sm text-foreground">Dedicated Support</span>
                </div>
              </div>
            </div>

            {/* Price & CTA */}
            <div className="space-y-4">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-primary">${(product.priceInCents / 100).toFixed(2)}</span>
                <span className="text-muted-foreground">one-time purchase</span>
              </div>
              <Button size="lg" className="w-full" onClick={startCheckout} disabled={isCheckingOut}>
                {isCheckingOut ? "Preparing checkout..." : "Proceed to Checkout"}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
