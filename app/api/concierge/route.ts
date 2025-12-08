import { createClient } from "@/lib/supabase/server"
import { generateText } from "ai"
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

    const { message } = await req.json()

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Invalid message" }, { status: 400 })
    }

    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      system: `You are an exclusive VIP concierge service AI assistant for a luxury marketplace called "Lowkey Luxury". 
      
Your role is to:
- Help VIP members discover exclusive luxury experiences and items
- Provide personalized recommendations based on their preferences
- Answer questions about available products and services
- Assist with booking and purchase inquiries
- Offer luxury lifestyle advice and suggestions
- Maintain a sophisticated, professional tone
- Always prioritize the member's satisfaction and exclusive experience

You have access to their purchase history and preferences. Be warm, attentive, and go the extra mile to exceed expectations.`,
      prompt: message,
      temperature: 0.7,
      maxTokens: 1024,
    })

    return NextResponse.json({ response: text })
  } catch (error) {
    console.error("Concierge API error:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
