"use client"

import { useState } from "react"
import {
  ChevronDown,
  ChevronUp,
  Play,
  Pause,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react"
import type { BotInstance } from "@/lib/types"
import { cn } from "@/lib/utils"

interface BotStatusTableProps {
  bots: BotInstance[]
  onToggleBot: (botId: string) => void
}

type SortField = "clientName" | "profit" | "profitPercentage" | "winRate" | "currentBalance"
type SortDirection = "asc" | "desc"

export function BotStatusTable({ bots, onToggleBot }: BotStatusTableProps) {
  const [sortField, setSortField] = useState<SortField>("profit")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  const sortedBots = [...bots].sort((a, b) => {
    const multiplier = sortDirection === "asc" ? 1 : -1
    if (sortField === "clientName") {
      return a.clientName.localeCompare(b.clientName) * multiplier
    }
    return (a[sortField] - b[sortField]) * multiplier
  })

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null
    return sortDirection === "asc" ? (
      <ChevronUp className="h-4 w-4" />
    ) : (
      <ChevronDown className="h-4 w-4" />
    )
  }

  const StatusIcon = ({ status }: { status: BotInstance["status"] }) => {
    switch (status) {
      case "running":
        return <CheckCircle className="h-4 w-4 text-primary" />
      case "paused":
        return <Pause className="h-4 w-4 text-warning" />
      case "stopped":
        return <XCircle className="h-4 w-4 text-destructive" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-destructive" />
    }
  }

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="border-b border-border p-4">
        <h3 className="text-lg font-semibold text-foreground">Bot Status Overview</h3>
        <p className="text-sm text-muted-foreground">Real-time status of all trading bots</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort("clientName")}
                  className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  Client
                  <SortIcon field="clientName" />
                </button>
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                Status
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                Symbol
              </th>
              <th className="px-4 py-3 text-right">
                <button
                  onClick={() => handleSort("currentBalance")}
                  className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground ml-auto"
                >
                  Balance
                  <SortIcon field="currentBalance" />
                </button>
              </th>
              <th className="px-4 py-3 text-right">
                <button
                  onClick={() => handleSort("profit")}
                  className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground ml-auto"
                >
                  P/L
                  <SortIcon field="profit" />
                </button>
              </th>
              <th className="px-4 py-3 text-right">
                <button
                  onClick={() => handleSort("profitPercentage")}
                  className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground ml-auto"
                >
                  P/L %
                  <SortIcon field="profitPercentage" />
                </button>
              </th>
              <th className="px-4 py-3 text-right">
                <button
                  onClick={() => handleSort("winRate")}
                  className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground ml-auto"
                >
                  Win Rate
                  <SortIcon field="winRate" />
                </button>
              </th>
              <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedBots.map((bot) => (
              <tr
                key={bot.id}
                className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
              >
                <td className="px-4 py-3">
                  <div>
                    <div className="font-medium text-foreground">{bot.clientName}</div>
                    <div className="text-xs text-muted-foreground">{bot.id}</div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <StatusIcon status={bot.status} />
                    <span
                      className={cn(
                        "text-sm capitalize",
                        bot.status === "running" && "text-primary",
                        bot.status === "paused" && "text-warning",
                        (bot.status === "stopped" || bot.status === "error") && "text-destructive"
                      )}
                    >
                      {bot.status}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium text-foreground">
                    {bot.symbol}
                  </span>
                </td>
                <td className="px-4 py-3 text-right font-mono text-sm text-foreground">
                  ${bot.currentBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </td>
                <td
                  className={cn(
                    "px-4 py-3 text-right font-mono text-sm",
                    bot.profit >= 0 ? "text-primary" : "text-destructive"
                  )}
                >
                  {bot.profit >= 0 ? "+" : ""}${bot.profit.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </td>
                <td
                  className={cn(
                    "px-4 py-3 text-right font-mono text-sm",
                    bot.profitPercentage >= 0 ? "text-primary" : "text-destructive"
                  )}
                >
                  {bot.profitPercentage >= 0 ? "+" : ""}{bot.profitPercentage}%
                </td>
                <td className="px-4 py-3 text-right font-mono text-sm text-foreground">
                  {bot.winRate}%
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => onToggleBot(bot.id)}
                    disabled={bot.status === "stopped" || bot.status === "error"}
                    className={cn(
                      "inline-flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
                      bot.status === "running"
                        ? "bg-warning/10 text-warning hover:bg-warning/20"
                        : "bg-primary/10 text-primary hover:bg-primary/20",
                      (bot.status === "stopped" || bot.status === "error") &&
                        "cursor-not-allowed opacity-50"
                    )}
                  >
                    {bot.status === "running" ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {sortedBots.length === 0 && (
        <div className="p-8 text-center text-muted-foreground">
          No bots match your current filters
        </div>
      )}
    </div>
  )
}
