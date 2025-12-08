import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Star, TrendingUp, Gift, Lock, User, MessageCircle } from "lucide-react"

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">Welcome Back</h1>
              <p className="text-lg text-muted-foreground">{profile?.display_name || user.email}</p>
            </div>
            <Badge className="bg-primary/20 text-primary border-primary/40">VIP Member</Badge>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="luxury-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Account Status</p>
                  <p className="text-2xl font-bold text-primary mt-1">Active</p>
                </div>
                <div className="bg-primary/20 p-3 rounded-lg">
                  <Star className="size-5 text-primary" />
                </div>
              </div>
            </div>

            <div className="luxury-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Purchases</p>
                  <p className="text-2xl font-bold text-primary mt-1">12</p>
                </div>
                <div className="bg-primary/20 p-3 rounded-lg">
                  <Gift className="size-5 text-primary" />
                </div>
              </div>
            </div>

            <div className="luxury-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Lifetime Spent</p>
                  <p className="text-2xl font-bold text-primary mt-1">$48.5K</p>
                </div>
                <div className="bg-primary/20 p-3 rounded-lg">
                  <TrendingUp className="size-5 text-primary" />
                </div>
              </div>
            </div>

            <div className="luxury-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Access Level</p>
                  <p className="text-2xl font-bold text-primary mt-1">Premium</p>
                </div>
                <div className="bg-primary/20 p-3 rounded-lg">
                  <Lock className="size-5 text-primary" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Exclusive Experiences Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Exclusive Experiences</h2>
              <p className="text-sm text-muted-foreground mt-1">Curated luxury offerings for VIP members</p>
            </div>
            <Link href="/marketplace">
              <Button variant="outline" size="sm">
                Browse All
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-primary/20 overflow-hidden hover:border-primary/40 transition-colors">
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <Gift className="size-12 text-primary/40" />
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">Premium Experience {i}</CardTitle>
                  <CardDescription>Exclusive access to VIP events and private viewings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">$9,999</span>
                    <Button size="sm" variant="outline">
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6">Quick Access</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/marketplace">
              <div className="luxury-card cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">Browse Marketplace</h3>
                    <p className="text-sm text-muted-foreground mt-1">Discover curated luxury items</p>
                  </div>
                  <Gift className="size-6 text-primary flex-shrink-0" />
                </div>
              </div>
            </Link>

            <Link href="/concierge">
              <div className="luxury-card cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">Ask Concierge</h3>
                    <p className="text-sm text-muted-foreground mt-1">Get personalized recommendations</p>
                  </div>
                  <MessageCircle className="size-6 text-primary flex-shrink-0" />
                </div>
              </div>
            </Link>

            <Link href="/profile">
              <div className="luxury-card cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">View Profile</h3>
                    <p className="text-sm text-muted-foreground mt-1">Manage account and preferences</p>
                  </div>
                  <User className="size-6 text-primary flex-shrink-0" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
