"use client"

import { useState, useEffect } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { createClient } from "@/lib/supabase/client"
import { Badge } from "@/components/ui/badge"

type Notification = {
  id: string
  title: string
  message: string
  is_read: boolean
  created_at: string
}

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [notificationsAvailable, setNotificationsAvailable] = useState(true)

  const supabase =
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? createClient() : null

  const fetchNotifications = async () => {
    if (!supabase) return

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const { data } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5)

      if (data) {
        setNotifications(data)
        setUnreadCount(data.filter((n) => !n.is_read).length)
      }
    } catch {
      setNotificationsAvailable(false)
    }
  }

  const markAsRead = async (id: string) => {
    if (!supabase || !notificationsAvailable) return
    try {
      await supabase.from("notifications").update({ is_read: true }).eq("id", id)
      fetchNotifications()
    } catch {
      // Silently fail
    }
  }

  useEffect(() => {
    if (!supabase) return

    fetchNotifications()

    if (!notificationsAvailable) return

    try {
      const channel = supabase
        .channel("notifications")
        .on("postgres_changes", { event: "INSERT", schema: "public", table: "notifications" }, () => {
          fetchNotifications()
        })
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    } catch {
      // Subscription failed - table doesn't exist
    }
  }, [notificationsAvailable])

  if (!supabase || !notificationsAvailable) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="size-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 h-3 w-3 rounded-full bg-destructive border-2 border-background" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">No notifications</div>
        ) : (
          notifications.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              className="flex flex-col items-start p-4 cursor-pointer"
              onClick={() => markAsRead(notification.id)}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span className={`font-medium ${notification.is_read ? "text-muted-foreground" : "text-foreground"}`}>
                  {notification.title}
                </span>
                {!notification.is_read && <Badge variant="secondary" className="h-2 w-2 rounded-full p-0" />}
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2">{notification.message}</p>
              <span className="text-xs text-muted-foreground/50 mt-2">
                {new Date(notification.created_at).toLocaleDateString()}
              </span>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
