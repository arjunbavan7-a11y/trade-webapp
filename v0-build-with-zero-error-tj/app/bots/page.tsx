"use client"

import { useTradingData } from "@/hooks/use-trading-data"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { BotStatusTable } from "@/components/dashboard/bot-status-table"
import { FilterBar } from "@/components/dashboard/filter-bar"
import { Loader2 } from "lucide-react"

export default function BotsPage() {
  const {
    clients,
    bots,
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
    toggleBotStatus,
  } = useTradingData()

  const unreadAlerts = alerts.filter((a) => !a.read).length

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading bots...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar unreadAlerts={unreadAlerts} />

      <div className="flex-1 pl-16 lg:pl-64">
        <Header unreadAlerts={unreadAlerts} />

        <main className="p-6">
          <div className="mx-auto max-w-7xl space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Bots</h2>
              <p className="text-muted-foreground">Monitor and control all trading bots</p>
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

            <BotStatusTable bots={bots} onToggleBot={toggleBotStatus} />
          </div>
        </main>
      </div>
    </div>
  )
}
