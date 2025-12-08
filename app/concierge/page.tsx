"use client"

import { useState, useEffect, useRef } from "react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Spinner } from "@/components/ui/spinner"
import { Send, MessageCircle, Zap } from "lucide-react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

const SUGGESTED_PROMPTS = [
  "What luxury experiences would suit my lifestyle?",
  "Tell me about your VIP membership benefits",
  "I'm interested in wellness retreats. What do you recommend?",
  "Help me plan an exclusive vacation",
]

export default function ConciergePage() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push("/auth/login")
      } else {
        setIsAuthenticated(true)
      }
    }
    checkAuth()
  }, [router])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const sendMessage = async (messageText?: string) => {
    const finalMessage = messageText || input
    if (!finalMessage.trim() || isLoading) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: finalMessage,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/concierge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: finalMessage }),
      })

      if (!response.ok) throw new Error("Failed to get response")

      const data = await response.json()
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error sending message:", error)
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        role: "assistant",
        content: "I apologize, but I'm currently unavailable. Please try again shortly.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center space-y-8">
            {/* Header */}
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-primary/20 p-4 rounded-full">
                  <MessageCircle className="size-8 text-primary" />
                </div>
              </div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Your Personal Concierge</h1>
              <p className="text-muted-foreground max-w-lg">
                Welcome to your exclusive VIP concierge service. Ask me anything about luxury experiences, personalized
                recommendations, or your account.
              </p>
            </div>

            {/* Suggested Prompts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
              {SUGGESTED_PROMPTS.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(prompt)}
                  className="luxury-card text-left hover:border-primary/60 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <Zap className="size-5 text-primary flex-shrink-0 mt-1" />
                    <p className="text-sm text-foreground">{prompt}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Messages */}
            <ScrollArea className="flex-1 mb-8">
              <div className="space-y-4 pr-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-md lg:max-w-2xl px-4 py-3 rounded-lg ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground rounded-br-none"
                          : "bg-input/50 text-foreground rounded-bl-none"
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-input/50 text-foreground px-4 py-3 rounded-lg rounded-bl-none">
                      <Spinner className="size-4" />
                    </div>
                  </div>
                )}
                <div ref={scrollRef} />
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="flex gap-3">
              <Input
                placeholder="Ask your concierge anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    sendMessage()
                  }
                }}
                disabled={isLoading}
                className="bg-input/50"
              />
              <Button onClick={() => sendMessage()} disabled={isLoading || !input.trim()} className="gap-2">
                {isLoading ? <Spinner className="size-4" /> : <Send className="size-4" />}
              </Button>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
