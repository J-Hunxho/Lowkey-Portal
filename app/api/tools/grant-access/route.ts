import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { toolId } = await req.json()

    if (!toolId) {
      return NextResponse.json({ error: "Tool ID required" }, { status: 400 })
    }

    // Check if tool exists
    const { data: tool, error: toolError } = await supabase.from("tools").select("*").eq("id", toolId).single()

    if (toolError || !tool) {
      return NextResponse.json({ error: "Tool not found" }, { status: 404 })
    }

    // Grant access
    const { error } = await supabase.from("user_tools").insert({
      user_id: user.id,
      tool_id: toolId,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Tool access error:", error)
    return NextResponse.json({ error: "Failed to grant access" }, { status: 500 })
  }
}
