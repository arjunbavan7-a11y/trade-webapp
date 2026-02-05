"use client"

import {
  Users,
  Bot,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Activity,
  Target,
  AlertTriangle,
} from "lucide-react"
import type { DashboardStats } from "@/lib/types"
import { cn } from "@/lib/utils"

interface StatsCardsProps {
  stats: DashboardStats
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: "Total Balance",
      value: `$${stats.totalBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      trend: stats.totalProfit >= 0 ? "up" : "down",
      trendValue: `${stats.totalProfit >= 0 ? "+" : ""}$${stats.totalProfit.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      trendLabel: "total P/L",
    },
    {
      title: "Today's Profit",
      value: `${stats.todayProfit >= 0 ? "+" : ""}$${stats.todayProfit.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      icon: stats.todayProfit >= 0 ? TrendingUp : TrendingDown,
      trend: stats.todayProfit >= 0 ? "up" : "down",
      trendValue: `${stats.totalProfitPercentage >= 0 ? "+" : ""}${stats.totalProfitPercentage}%`,
      trendLabel: "overall",
    },
    {
      title: "Active Bots",
      value: `${stats.runningBots}/${stats.totalBots}`,
      icon: Bot,
      trend: "neutral",
      trendValue: `${stats.activeClients} clients`,
      trendLabel: "active",
    },
    {
      title: "Win Rate",
      value: `${stats.overallWinRate}%`,
      icon: Target,
      trend: stats.overallWinRate >= 60 ? "up" : stats.overallWinRate >= 50 ? "neutral" : "down",
      trendValue: `${stats.totalTrades}`,
      trendLabel: "total trades",
    },
    {
      title: "Avg Drawdown",
      value: `${stats.avgDrawdown}%`,
      icon: AlertTriangle,
      trend: stats.avgDrawdown <= 2 ? "up" : stats.avgDrawdown <= 3 ? "neutral" : "down",
      trendValue: "< 4% limit",
      trendLabel: "threshold",
    },
    {
      title: "Total Clients",
      value: stats.totalClients.toString(),
      icon: Users,
      trend: "neutral",
      trendValue: `${stats.activeClients} active`,
      trendLabel: "",
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <div
            key={card.title}
            className="rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/30"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">{card.title}</span>
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-lg",
                  card.trend === "up" && "bg-primary/10 text-primary",
                  card.trend === "down" && "bg-destructive/10 text-destructive",
                  card.trend === "neutral" && "bg-muted text-muted-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold text-foreground">{card.value}</span>
            </div>
            <div className="mt-1 flex items-center gap-1">
              <span
                className={cn(
                  "text-xs font-medium",
                  card.trend === "up" && "text-primary",
                  card.trend === "down" && "text-destructive",
                  card.trend === "neutral" && "text-muted-foreground"
                )}
              >
                {card.trendValue}
              </span>
              {card.trendLabel && (
                <span className="text-xs text-muted-foreground">{card.trendLabel}</span>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
