import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PRODUCTS } from "@/lib/products"
import { Calendar, DollarSign, Download, Package } from "lucide-react"

export default async function OrdersPage() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  const { data: orders } = await supabase
    .from("orders")
    .select(
      `
      *,
      order_items (
        *
      )
    `,
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">Order History</h1>
          <p className="text-lg text-muted-foreground">View all your exclusive purchases and transactions</p>
        </div>

        {/* Orders List */}
        {!orders || orders.length === 0 ? (
          <Card className="border-primary/20 text-center py-12">
            <Package className="size-12 text-primary/40 mx-auto mb-4" />
            <p className="text-muted-foreground">No orders yet</p>
            <p className="text-sm text-muted-foreground mt-1">Start exploring exclusive items in the marketplace</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card
                key={order.id}
                className="border-primary/20 overflow-hidden hover:border-primary/40 transition-colors"
              >
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-start">
                    {/* Order Info */}
                    <div className="md:col-span-2">
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-muted-foreground">Order ID</p>
                          <p className="font-mono text-sm text-foreground mt-1">{order.id.substring(0, 8)}...</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Items</p>
                          <div className="mt-2 space-y-1">
                            {order.order_items?.map((item: any) => {
                              const product = PRODUCTS.find((p) => p.id === item.product_id)
                              return (
                                <p key={item.id} className="text-sm text-foreground">
                                  {product?.name}
                                </p>
                              )
                            })}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Date */}
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Purchased</p>
                      <div className="flex items-center gap-2 text-foreground">
                        <Calendar className="size-4 text-primary" />
                        <span className="text-sm">{new Date(order.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Amount */}
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Amount</p>
                      <div className="flex items-center gap-2">
                        <DollarSign className="size-4 text-primary" />
                        <span className="text-lg font-semibold text-foreground">
                          {(order.total_price_cents / 100).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Status & Action */}
                    <div className="space-y-3">
                      <Badge
                        className={
                          order.status === "completed"
                            ? "bg-green-500/20 text-green-400 border-green-500/40"
                            : "bg-primary/20 text-primary border-primary/40"
                        }
                      >
                        {order.status === "completed" ? "Completed" : "Pending"}
                      </Badge>
                      <Button size="sm" variant="outline" className="w-full gap-2 bg-transparent">
                        <Download className="size-4" />
                        Receipt
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
