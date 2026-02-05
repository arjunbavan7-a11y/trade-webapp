"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  Bot,
  LineChart,
  Bell,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Activity,
  BookOpen,
  Key,
  HelpCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/clients", label: "Clients", icon: Users },
  { href: "/bots", label: "Bots", icon: Bot },
  { href: "/trades", label: "Trades", icon: Activity },
  { href: "/analytics", label: "Analytics", icon: LineChart },
  { href: "/alerts", label: "Alerts", icon: Bell },
  { href: "/api-keys", label: "API Keys", icon: Key },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/how-it-works", label: "How It Works", icon: HelpCircle },
  { href: "/setup", label: "Setup Guide", icon: BookOpen },
]

interface SidebarProps {
  unreadAlerts: number
}

export function Sidebar({ unreadAlerts }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-border bg-sidebar-background transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Bot className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-sidebar-foreground">MT5 Admin</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                collapsed && "justify-center px-2"
              )}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
              {!collapsed && item.href === "/alerts" && unreadAlerts > 0 && (
                <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1.5 text-xs font-medium text-destructive-foreground">
                  {unreadAlerts}
                </span>
              )}
              {collapsed && item.href === "/alerts" && unreadAlerts > 0 && (
                <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-destructive" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* User section */}
      <div className="border-t border-sidebar-border p-2">
        <button
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors",
            collapsed && "justify-center px-2"
          )}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  )
}
