import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import Link from "next/link"

export default async function AdminUsersPage() {
  const supabase = await createClient()

  const { data: profiles } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="glass sticky top-0 z-50 border-b border-primary/20 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground">Users</h1>
          <p className="text-muted-foreground mt-1">Manage VIP members</p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {!profiles || profiles.length === 0 ? (
          <Card className="border-primary/20 text-center py-12">
            <p className="text-muted-foreground">No users yet</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {profiles.map((profile) => (
              <Card key={profile.id} className="border-primary/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between gap-6">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">{profile.display_name || "User"}</h3>
                      <p className="text-sm text-muted-foreground font-mono mb-2">ID: {profile.id.substring(0, 12)}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          VIP
                        </Badge>
                        <Badge className="bg-green-500/20 text-green-400 text-xs">Active</Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/admin/users/${profile.id}`}>
                        <Button size="sm" variant="outline" className="gap-2 bg-transparent">
                          <Eye className="size-4" />
                          View
                        </Button>
                      </Link>
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
