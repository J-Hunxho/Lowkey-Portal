import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import type { ReactNode } from "react"

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: admin } = await supabase.from("admin_users").select("*").eq("id", user.id).single()

  if (!admin) {
    redirect("/dashboard")
  }

  return <>{children}</>
}
