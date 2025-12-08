"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { Lock, Unlock, CheckCircle2, PenTool, Zap } from "lucide-react"
import { useRouter } from "next/navigation"

interface ToolInterface {
  id: string
  name: string
  description: string
  access_level: "public" | "premium" | "vip" | "elite"
  created_at: string
  updated_at: string
}

const ACCESS_LEVELS = {
  public: { label: "Public", color: "bg-muted/20", textColor: "text-muted-foreground" },
  premium: { label: "Premium", color: "bg-primary/20", textColor: "text-primary" },
  vip: { label: "VIP", color: "bg-amber-500/20", textColor: "text-amber-400" },
  elite: { label: "Elite", color: "bg-purple-500/20", textColor: "text-purple-400" },
}

const TIER_BENEFITS = {
  premium: ["Market Intelligence", "Wellness Concierge", "Luxury Fleet"],
  vip: ["All Premium Tools", "Lifestyle Planner", "Private Events", "Travel Elite"],
  elite: ["All VIP Tools", "Investment Advisory", "Art Acquisition"],
}

export default function ToolsPage() {
  const router = useRouter()
  const [tools, setTools] = useState<ToolInterface[]>([])
  const [userTools, setUserTools] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [userTier, setUserTier] = useState<string>("premium")

  useEffect(() => {
    async function loadData() {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      // Load all tools
      const { data: toolsData } = await supabase.from("tools").select("*").order("created_at")

      setTools(toolsData || [])

      // Load user's tools
      const { data: userToolsData } = await supabase.from("user_tools").select("tool_id").eq("user_id", user.id)

      const accessedToolIds = userToolsData?.map((ut) => ut.tool_id) || []
      setUserTools(accessedToolIds)

      // For demo, set user tier to VIP (in real app, fetch from profile or subscription)
      setUserTier("vip")

      setLoading(false)
    }

    loadData()
  }, [router])

  const grantToolAccess = async (toolId: string) => {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    const { error } = await supabase.from("user_tools").insert({
      user_id: user.id,
      tool_id: toolId,
    })

    if (!error) {
      setUserTools((prev) => [...prev, toolId])
    }
  }

  const revokeToolAccess = async (toolId: string) => {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    await supabase.from("user_tools").delete().eq("user_id", user.id).eq("tool_id", toolId)

    setUserTools((prev) => prev.filter((id) => id !== toolId))
  }

  const canAccessTool = (toolAccessLevel: string) => {
    const accessHierarchy = ["public", "premium", "vip", "elite"]
    const userTierIndex = accessHierarchy.indexOf(userTier)
    const toolTierIndex = accessHierarchy.indexOf(toolAccessLevel)
    return userTierIndex >= toolTierIndex
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex items-center justify-center">
          <Spinner className="size-8 text-primary" />
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">Luxury Tools Hub</h1>
          <p className="text-lg text-muted-foreground mb-6">Exclusive tools and services for your VIP membership</p>
          <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/40">
            Your Tier: {ACCESS_LEVELS[userTier as keyof typeof ACCESS_LEVELS].label}
          </Badge>
        </div>

        {/* Tier Benefits Info */}
        <Card className="border-primary/20 mb-12 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="size-5 text-primary" />
              Your Available Tools
            </CardTitle>
            <CardDescription>
              As a {ACCESS_LEVELS[userTier as keyof typeof ACCESS_LEVELS].label} member, you have access to:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {TIER_BENEFITS[userTier as keyof typeof TIER_BENEFITS]?.map((benefit) => (
                <Badge key={benefit} variant="outline" className="text-sm">
                  {benefit}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => {
            const hasAccess = userTools.includes(tool.id)
            const canAccess = canAccessTool(tool.access_level)
            const tierConfig = ACCESS_LEVELS[tool.access_level as keyof typeof ACCESS_LEVELS]

            return (
              <Card key={tool.id} className="border-primary/20 overflow-hidden hover:border-primary/40 transition-all">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2 mb-2">
                        <PenTool className="size-5 text-primary" />
                        {tool.name}
                      </CardTitle>
                      <CardDescription>{tool.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Access Level Badge */}
                  <Badge className={`${tierConfig.color} ${tierConfig.textColor} border-current/20`}>
                    {tierConfig.label}
                  </Badge>

                  {/* Status & Action */}
                  <div className="pt-2 border-t border-border/50">
                    {!canAccess ? (
                      <div className="flex items-center gap-2 text-sm text-destructive">
                        <Lock className="size-4" />
                        <span>Requires {tierConfig.label} tier</span>
                      </div>
                    ) : hasAccess ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-green-400">
                          <CheckCircle2 className="size-4" />
                          <span>Activated</span>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => revokeToolAccess(tool.id)}>
                          Disable
                        </Button>
                      </div>
                    ) : (
                      <Button size="sm" className="w-full gap-2" onClick={() => grantToolAccess(tool.id)}>
                        <Unlock className="size-4" />
                        Activate Access
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {tools.length === 0 && (
          <Card className="border-primary/20 text-center py-12">
            <PenTool className="size-12 text-primary/40 mx-auto mb-4" />
            <p className="text-muted-foreground">No tools available yet</p>
          </Card>
        )}
      </main>
    </div>
  )
}
