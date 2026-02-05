"use client"

import { useTradingData } from "@/hooks/use-trading-data"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { FilterBar } from "@/components/dashboard/filter-bar"
import { Loader2, ArrowUpRight, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

export default function TradesPage() {
  const {
    clients,
    trades,
    alerts,
    isLoading,
    isConnected,
    timeFilter,
    setTimeFilter,
    statusFilter,
    setStatusFilter,
    clientFilter,
    setClientFilter,
    searchQuery,
    setSearchQuery,
  } = useTradingData()

  const unreadAlerts = alerts.filter((a) => !a.read).length

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading trades...</p>
        </div>
      </div>
    )
  }

  const formatTime = (date: Date) => {
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar unreadAlerts={unreadAlerts} />

      <div className="flex-1 pl-16 lg:pl-64">
        <Header unreadAlerts={unreadAlerts} />

        <main className="p-6">
          <div className="mx-auto max-w-7xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Trades</h2>
                <p className="text-muted-foreground">Complete trading history across all bots</p>
              </div>
              <div className="text-sm text-muted-foreground">
                {trades.length} trades shown
              </div>
            </div>

            <FilterBar
              clients={clients}
              timeFilter={timeFilter}
              onTimeFilterChange={setTimeFilter}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              clientFilter={clientFilter}
              onClientFilterChange={setClientFilter}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              isConnected={isConnected}
            />

            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Client</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Symbol</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Type</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Lot Size</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Open Price</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Close Price</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">P/L</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trades.map((trade) => (
                      <tr
                        key={trade.id}
                        className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <span className="font-medium text-foreground">{trade.clientName}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium text-foreground">
                            {trade.symbol}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <ArrowUpRight className="h-4 w-4 text-primary" />
                            <span className="text-sm text-foreground">{trade.type}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-sm text-foreground">
                          {trade.lotSize}
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-sm text-foreground">
                          {trade.openPrice}
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-sm text-foreground">
                          {trade.closePrice ?? "-"}
                        </td>
                        <td
                          className={cn(
                            "px-4 py-3 text-right font-mono text-sm",
                            trade.profit === null
                              ? "text-muted-foreground"
                              : trade.profit >= 0
                                ? "text-primary"
                                : "text-destructive"
                          )}
                        >
                          {trade.profit !== null
                            ? `${trade.profit >= 0 ? "+" : ""}$${trade.profit.toFixed(2)}`
                            : "-"}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={cn(
                              "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
                              trade.status === "open" && "bg-chart-2/10 text-chart-2",
                              trade.status === "closed" && "bg-muted text-muted-foreground",
                              trade.status === "pending" && "bg-warning/10 text-warning"
                            )}
                          >
                            {trade.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {formatTime(trade.openTime)}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {trades.length === 0 && (
                <div className="p-8 text-center text-muted-foreground">
                  No trades match your current filters
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
