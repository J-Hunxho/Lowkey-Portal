"use client"

import type React from "react"

import { useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const trackPageView = async () => {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        return
      }

      try {
        const supabase = createClient()
        const {
          data: { user },
        } = await supabase.auth.getUser()

        // Silently skip if table doesn't exist - this is normal during initial setup
        await supabase.from("analytics_events").insert({
          event_name: "page_view",
          user_id: user?.id,
          path: pathname,
          metadata: {
            search_params: searchParams.toString(),
          },
        })
      } catch {
        // Silently fail - analytics is not critical to app functionality
        // Table will be created when migration script is run
      }
    }

    trackPageView()
  }, [pathname, searchParams])

  return <>{children}</>
}
