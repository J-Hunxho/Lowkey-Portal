import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { BarChart3, Users, ShoppingCart, Package, TrendingUp, Settings } from "lucide-react"

export default async function AdminPage() {
  const supabase = await createClient()

  // Fetch stats
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let analyticsCount = 0
  let analyticsEvents: any[] = []

  try {
    const analyticsRes = await supabase.from("analytics_events").select("*", { count: "exact", head: true })
    analyticsCount = analyticsRes.count || 0

    if (analyticsCount >= 0) {
      const eventsRes = await supabase
        .from("analytics_events")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5)
      analyticsEvents = eventsRes.data || []
    }
  } catch {
    // Analytics table may not be created yet - this is fine
    analyticsCount = 0
    analyticsEvents = []
  }

  const [ordersRes, productsRes, usersRes, toolsRes] = await Promise.all([
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("tools").select("*", { count: "exact", head: true }),
  ])

  const stats = [
    {
      label: "Total Orders",
      value: ordersRes.count || 0,
      icon: ShoppingCart,
      href: "/admin/orders",
      color: "text-blue-400",
    },
    {
      label: "Products",
      value: productsRes.count || 0,
      icon: Package,
      href: "/admin/products",
      color: "text-green-400",
    },
    {
      label: "Users",
      value: usersRes.count || 0,
      icon: Users,
      href: "/admin/users",
      color: "text-purple-400",
    },
    {
      label: "Tools",
      value: toolsRes.count || 0,
      icon: BarChart3,
      href: "/admin/tools",
      color: "text-amber-400",
    },
    {
      label: "Total Page Views",
      value: analyticsCount,
      icon: TrendingUp,
      href: "/admin/analytics",
      color: "text-pink-400",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="glass sticky top-0 z-50 border-b border-primary/20 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-muted-foreground mt-1">Manage Lowkey Luxury operations</p>
            </div>
            <Link href="/admin/settings">
              <Button variant="outline" size="icon" className="gap-2 bg-transparent">
                <Settings className="size-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <Link key={stat.href} href={stat.href}>
                <Card className="border-primary/20 cursor-pointer hover:border-primary/40 transition-colors h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <Icon className={`size-8 ${stat.color}`} />
                      <Badge variant="outline" className="text-xs">
                        View Details
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold text-foreground mt-2">{stat.value}</p>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link href="/admin/products/create">
              <div className="luxury-card cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">Create Product</h3>
                    <p className="text-sm text-muted-foreground mt-1">Add new luxury item</p>
                  </div>
                  <Package className="size-6 text-primary flex-shrink-0" />
                </div>
              </div>
            </Link>

            <Link href="/admin/users">
              <div className="luxury-card cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">Manage Users</h3>
                    <p className="text-sm text-muted-foreground mt-1">View and edit members</p>
                  </div>
                  <Users className="size-6 text-primary flex-shrink-0" />
                </div>
              </div>
            </Link>

            <Link href="/admin/orders">
              <div className="luxury-card cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">View Orders</h3>
                    <p className="text-sm text-muted-foreground mt-1">Track sales</p>
                  </div>
                  <ShoppingCart className="size-6 text-primary flex-shrink-0" />
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="size-5 text-primary" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest orders and user actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsEvents.length > 0 ? (
                analyticsEvents.map((event: any) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between py-2 border-b border-border/50 last:border-0"
                  >
                    <div>
                      <p className="text-sm font-medium">{event.event_name}</p>
                      <p className="text-xs text-muted-foreground">{event.path}</p>
                    </div>
                    <div className="text-xs text-muted-foreground">{new Date(event.created_at).toLocaleString()}</div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  No activity tracked yet. Run migration script to enable analytics.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
