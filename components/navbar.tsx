"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, LogOut, ShoppingBag, User, Home, MessageCircle, Wrench } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { NotificationBell } from "@/components/notification-bell"

export function Navbar() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  return (
    <nav className="glass sticky top-0 z-50 border-b border-primary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2">
            <Image src="/images/logo.png" alt="Lowkey Luxury" width={40} height={40} className="object-contain" />
            <span className="hidden sm:inline text-sm font-semibold text-foreground">Lowkey Luxury</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-1">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="gap-2">
                <Home className="size-4" />
                Dashboard
              </Button>
            </Link>
            <Link href="/marketplace">
              <Button variant="ghost" size="sm" className="gap-2">
                <ShoppingBag className="size-4" />
                Shop
              </Button>
            </Link>
            <Link href="/concierge">
              <Button variant="ghost" size="sm" className="gap-2">
                <MessageCircle className="size-4" />
                Concierge
              </Button>
            </Link>
            <Link href="/tools">
              <Button variant="ghost" size="sm" className="gap-2">
                <Wrench className="size-4" />
                Tools
              </Button>
            </Link>
            <Link href="/profile">
              <Button variant="ghost" size="sm" className="gap-2">
                <User className="size-4" />
                Profile
              </Button>
            </Link>
            <NotificationBell />
          </div>

          {/* User Menu */}
          <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="size-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild className="md:hidden">
                <Link href="/dashboard">Dashboard</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="md:hidden">
                <Link href="/marketplace">Shop</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="md:hidden">
                <Link href="/concierge">Concierge</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="md:hidden">
                <Link href="/tools">Tools</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="md:hidden">
                <Link href="/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="md:hidden" />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                <LogOut className="size-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  )
}
