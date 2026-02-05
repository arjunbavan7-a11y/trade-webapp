"use client"

import { useTradingData } from "@/hooks/use-trading-data"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { PerformanceChart } from "@/components/dashboard/performance-chart"
import { BotStatusTable } from "@/components/dashboard/bot-status-table"
import { RecentTrades } from "@/components/dashboard/recent-trades"
import { AlertsPanel } from "@/components/dashboard/alerts-panel"
import { FilterBar } from "@/components/dashboard/filter-bar"
import { ClientDistribution } from "@/components/dashboard/client-distribution"
import { Loader2, Radio, WifiOff, Bot, ArrowRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function DashboardPage() {
  const {
    clients,
    bots,
    allBots,
    trades,
    performanceHistory,
    alerts,
    stats,
    isLoading,
    isConnected,
    lastUpdate,
    timeFilter,
    setTimeFilter,
    statusFilter,
    setStatusFilter,
    clientFilter,
    setClientFilter,
    searchQuery,
    setSearchQuery,
    markAlertRead,
    clearAlerts,
    toggleBotStatus,
    refreshData,
  } = useTradingData()

  const unreadAlerts = alerts.filter((a) => !a.read).length
  const hasData = allBots.length > 0

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar unreadAlerts={unreadAlerts} />

      {/* Main Content */}
      <div className="flex-1 pl-16 lg:pl-64">
        <Header unreadAlerts={unreadAlerts} />

        <main className="p-6">
          <div className="mx-auto max-w-7xl space-y-6">
            {/* Connection Status Banner */}
            <div className={`flex items-center justify-between rounded-lg border p-4 ${
              hasData 
                ? "border-emerald-500/30 bg-emerald-500/10" 
                : "border-amber-500/30 bg-amber-500/10"
            }`}>
              <div className="flex items-center gap-3">
                {hasData ? (
                  <>
                    <div className="relative">
                      <Radio className="h-5 w-5 text-emerald-500" />
                      <span className="absolute -right-0.5 -top-0.5 h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                    </div>
                    <div>
                      <p className="font-medium text-emerald-500">Live Data Connected</p>
                      <p className="text-sm text-muted-foreground">
                        Receiving real-time updates from {allBots.length} bot{allBots.length !== 1 ? "s" : ""}
                        {lastUpdate && ` - Last update: ${lastUpdate.toLocaleTimeString()}`}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <WifiOff className="h-5 w-5 text-amber-500" />
                    <div>
                      <p className="font-medium text-amber-500">Waiting for MT5 Connection</p>
                      <p className="text-sm text-muted-foreground">
                        No bots connected yet. Start your MT5 Expert Advisor to see live data.
                      </p>
                    </div>
                  </>
                )}
              </div>
              <Button variant="outline" size="sm" onClick={refreshData}>
                Refresh
              </Button>
            </div>

            {/* Show empty state or dashboard */}
            {!hasData ? (
              <Card className="border-dashed">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                    <Bot className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <CardTitle className="text-2xl">No Active Bots</CardTitle>
                  <CardDescription className="max-w-md mx-auto">
                    Your dashboard is ready to display real-time trading data. 
                    Start your MT5 Expert Advisor to begin receiving live updates.
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-6">
                  <div className="grid gap-4 md:grid-cols-3 max-w-2xl mx-auto">
                    <div className="rounded-lg border bg-card p-4 text-left">
                      <div className="text-3xl font-bold text-primary mb-1">1</div>
                      <p className="text-sm font-medium">Generate API Key</p>
                      <p className="text-xs text-muted-foreground">Go to API Keys page</p>
                    </div>
                    <div className="rounded-lg border bg-card p-4 text-left">
                      <div className="text-3xl font-bold text-primary mb-1">2</div>
                      <p className="text-sm font-medium">Configure MT5 EA</p>
                      <p className="text-xs text-muted-foreground">Add URL and API key</p>
                    </div>
                    <div className="rounded-lg border bg-card p-4 text-left">
                      <div className="text-3xl font-bold text-primary mb-1">3</div>
                      <p className="text-sm font-medium">Start Trading</p>
                      <p className="text-xs text-muted-foreground">Attach EA to chart</p>
                    </div>
                  </div>
                  <div className="flex justify-center gap-4">
                    <Button asChild>
                      <Link href="/api-keys">
                        Generate API Key
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href="/setup">View Setup Guide</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Filter Bar */}
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

                {/* Stats Cards */}
                <StatsCards stats={stats} />

                {/* Charts Row */}
                <div className="grid gap-6 lg:grid-cols-3">
                  <div className="lg:col-span-2">
                    <PerformanceChart data={performanceHistory} />
                  </div>
                  <div>
                    <ClientDistribution bots={allBots} />
                  </div>
                </div>

                {/* Bot Status Table */}
                <BotStatusTable bots={bots} onToggleBot={toggleBotStatus} />

                {/* Bottom Row */}
                <div className="grid gap-6 lg:grid-cols-2">
                  <RecentTrades trades={trades} />
                  <AlertsPanel
                    alerts={alerts}
                    onMarkRead={markAlertRead}
                    onClearAll={clearAlerts}
                  />
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
