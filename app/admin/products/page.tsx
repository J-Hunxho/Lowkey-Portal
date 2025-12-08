import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Plus, Edit, Trash2 } from "lucide-react"

export default async function AdminProductsPage() {
  const supabase = await createClient()

  const { data: products } = await supabase.from("products").select("*").order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="glass sticky top-0 z-50 border-b border-primary/20 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Products</h1>
              <p className="text-muted-foreground mt-1">Manage luxury items and experiences</p>
            </div>
            <Link href="/admin/products/create">
              <Button className="gap-2">
                <Plus className="size-4" />
                Add Product
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {!products || products.length === 0 ? (
          <Card className="border-primary/20 text-center py-12">
            <p className="text-muted-foreground">No products yet</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {products.map((product) => (
              <Card key={product.id} className="border-primary/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between gap-6">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">{product.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{product.description}</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="text-xs">
                          {product.category}
                        </Badge>
                        <Badge className="bg-primary/20 text-primary text-xs">
                          ${(product.price_cents / 100).toFixed(2)}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/admin/products/${product.id}/edit`}>
                        <Button size="sm" variant="outline" className="gap-2 bg-transparent">
                          <Edit className="size-4" />
                          Edit
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-2 text-destructive hover:text-destructive bg-transparent"
                      >
                        <Trash2 className="size-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
