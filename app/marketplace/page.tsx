"use client"

import { useState } from "react"
import Image from "next/image"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PRODUCTS } from "@/lib/products"
import { Gift, ShoppingBag } from "lucide-react"
import Link from "next/link"

export default function MarketplacePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All")

  const categories = ["All", ...new Set(PRODUCTS.map((p) => p.category))]

  const filteredProducts =
    selectedCategory === "All" ? PRODUCTS : PRODUCTS.filter((p) => p.category === selectedCategory)

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">Exclusive Marketplace</h1>
          <p className="text-lg text-muted-foreground">Curated luxury experiences and premium items</p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Link key={product.id} href={`/product/${product.id}`}>
              <Card className="border-primary/20 overflow-hidden hover:border-primary/40 transition-all duration-300 cursor-pointer group h-full">
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center group-hover:from-primary/30 group-hover:to-primary/10 transition-colors overflow-hidden relative">
                  {product.image ? (
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <Gift className="size-12 text-primary/40 group-hover:text-primary/60 transition-colors" />
                  )}
                </div>
                <CardHeader>
                  <Badge className="w-fit mb-2 bg-primary/20 text-primary border-primary/40 text-xs">
                    {product.category}
                  </Badge>
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <CardDescription className="line-clamp-2">{product.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">${(product.priceInCents / 100).toFixed(2)}</span>
                    <Button size="sm" className="gap-2">
                      <ShoppingBag className="size-4" />
                      Buy
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
