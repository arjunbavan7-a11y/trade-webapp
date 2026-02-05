"use client"

import { ArrowUpRight, Clock } from "lucide-react"
import type { Trade } from "@/lib/types"
import { cn } from "@/lib/utils"

interface RecentTradesProps {
  trades: Trade[]
}

export function RecentTrades({ trades }: RecentTradesProps) {
  const recentTrades = trades.slice(0, 10)

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)

    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="border-b border-border p-4">
        <h3 className="text-lg font-semibold text-foreground">Recent Trades</h3>
        <p className="text-sm text-muted-foreground">Latest trading activity</p>
      </div>
      <div className="divide-y divide-border">
        {recentTrades.map((trade) => (
          <div
            key={trade.id}
            className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-lg",
                  trade.status === "open"
                    ? "bg-chart-2/10"
                    : trade.profit && trade.profit >= 0
                      ? "bg-primary/10"
                      : "bg-destructive/10"
                )}
              >
                <ArrowUpRight
                  className={cn(
                    "h-5 w-5",
                    trade.status === "open"
                      ? "text-chart-2"
                      : trade.profit && trade.profit >= 0
                        ? "text-primary"
                        : "text-destructive"
                  )}
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">{trade.clientName}</span>
                  <span className="inline-flex items-center rounded bg-muted px-1.5 py-0.5 text-xs font-medium text-foreground">
                    {trade.symbol}
                  </span>
                  {trade.status === "open" && (
                    <span className="inline-flex items-center rounded bg-chart-2/10 px-1.5 py-0.5 text-xs font-medium text-chart-2">
                      OPEN
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{trade.type} {trade.lotSize} lots @ {trade.openPrice}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatTime(trade.openTime)}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              {trade.status === "closed" && trade.profit !== null ? (
                <span
                  className={cn(
                    "font-mono text-sm font-medium",
                    trade.profit >= 0 ? "text-primary" : "text-destructive"
                  )}
                >
                  {trade.profit >= 0 ? "+" : ""}${trade.profit.toFixed(2)}
                </span>
              ) : (
                <span className="text-sm text-chart-2 font-medium">Active</span>
              )}
              {trade.closePrice && (
                <div className="text-xs text-muted-foreground">
                  Closed @ {trade.closePrice}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      {recentTrades.length === 0 && (
        <div className="p-8 text-center text-muted-foreground">
          No recent trades
        </div>
      )}
    </div>
  )
}
