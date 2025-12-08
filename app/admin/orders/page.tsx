import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import Link from "next/link"

export default async function AdminOrdersPage() {
  const supabase = await createClient()

  const { data: orders } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .order("created_at", { ascending: false })
    .limit(50)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="glass sticky top-0 z-50 border-b border-primary/20 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground">Orders</h1>
          <p className="text-muted-foreground mt-1">Track and manage customer orders</p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {!orders || orders.length === 0 ? (
          <Card className="border-primary/20 text-center py-12">
            <p className="text-muted-foreground">No orders yet</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id} className="border-primary/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between gap-6">
                    <div className="flex-1">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Order ID</p>
                          <p className="font-mono text-sm text-foreground">{order.id.substring(0, 8)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Amount</p>
                          <p className="font-semibold text-foreground">${(order.total_price_cents / 100).toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Items</p>
                          <p className="font-semibold text-foreground">{order.order_items?.length || 0}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Status</p>
                          <Badge
                            className={
                              order.status === "completed"
                                ? "bg-green-500/20 text-green-400"
                                : "bg-primary/20 text-primary"
                            }
                          >
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Link href={`/admin/orders/${order.id}`}>
                      <Button size="sm" variant="outline" className="gap-2 bg-transparent">
                        <Eye className="size-4" />
                        View
                      </Button>
                    </Link>
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
