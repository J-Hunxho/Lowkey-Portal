import { createBrowserClient } from "@supabase/ssr"

let adminClient: ReturnType<typeof createBrowserClient> | null = null

export function getAdminClient() {
  if (!adminClient) {
    adminClient = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
  }
  return adminClient
}

export async function checkAdminAccess() {
  const client = getAdminClient()
  const {
    data: { user },
  } = await client.auth.getUser()

  if (!user) return false

  const { data: admin } = await client.from("admin_users").select("*").eq("id", user.id).single()

  return !!admin
}
