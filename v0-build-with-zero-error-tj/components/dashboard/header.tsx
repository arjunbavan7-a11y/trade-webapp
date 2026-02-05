"use client"

import { Bell, User, Shield } from "lucide-react"
import { cn } from "@/lib/utils"

interface HeaderProps {
  unreadAlerts: number
}

export function Header({ unreadAlerts }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Monitor trading bot activity in real-time</p>
      </div>
      <div className="flex items-center gap-4">
        {/* Alerts Button */}
        <button className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background text-foreground hover:bg-muted transition-colors">
          <Bell className="h-5 w-5" />
          {unreadAlerts > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-xs font-medium text-destructive-foreground">
              {unreadAlerts}
            </span>
          )}
        </button>

        {/* Admin Badge */}
        <div className="hidden items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-3 py-1.5 sm:flex">
          <Shield className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-primary">Admin</span>
        </div>

        {/* User Avatar */}
        <button className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <User className="h-5 w-5" />
        </button>
      </div>
    </header>
  )
}
