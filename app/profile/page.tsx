import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Mail, User, Calendar, LogOut } from "lucide-react"

export default async function ProfilePage() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  const initials =
    profile?.display_name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || user.email?.[0]?.toUpperCase()

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Profile Header */}
        <div className="mb-12">
          <div className="flex items-center gap-6 mb-8">
            <Avatar className="size-24">
              <AvatarFallback className="text-xl font-semibold text-primary-foreground bg-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">{profile?.display_name || "User Profile"}</h1>
              <Badge className="bg-primary/20 text-primary border-primary/40">VIP Member</Badge>
            </div>
          </div>
        </div>

        {/* Account Information */}
        <Card className="border-primary/20 mb-6">
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Your personal account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-input/30 rounded-lg border border-border/50">
              <Mail className="size-5 text-primary" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium text-foreground">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-input/30 rounded-lg border border-border/50">
              <Calendar className="size-5 text-primary" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Member Since</p>
                <p className="font-medium text-foreground">
                  {new Date(user.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-input/30 rounded-lg border border-border/50">
              <User className="size-5 text-primary" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Display Name</p>
                <p className="font-medium text-foreground">{profile?.display_name || "Not set"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Membership Details */}
        <Card className="border-primary/20 mb-6">
          <CardHeader>
            <CardTitle>Membership Details</CardTitle>
            <CardDescription>Your VIP membership information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                <p className="text-sm text-muted-foreground mb-1">Tier</p>
                <p className="text-xl font-bold text-primary">VIP</p>
              </div>
              <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                <p className="text-sm text-muted-foreground mb-1">Status</p>
                <p className="text-xl font-bold text-primary">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive/20 bg-destructive/5">
          <CardHeader>
            <CardTitle className="text-destructive">Sign Out</CardTitle>
            <CardDescription>End your current session</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="destructive" className="gap-2">
              <LogOut className="size-4" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
