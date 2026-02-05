"use client"

import { useTradingData } from "@/hooks/use-trading-data"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { PerformanceChart } from "@/components/dashboard/performance-chart"
import { ProfitChart } from "@/components/dashboard/profit-chart"
import { WinRateChart } from "@/components/dashboard/win-rate-chart"
import { ClientDistribution } from "@/components/dashboard/client-distribution"
import { Loader2 } from "lucide-react"

export default function AnalyticsPage() {
  const {
    allBots,
    performanceHistory,
    alerts,
    isLoading,
  } = useTradingData()

  const unreadAlerts = alerts.filter((a) => !a.read).length

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading analytics...</p>
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
              <h2 className="text-2xl font-bold text-foreground">Analytics</h2>
              <p className="text-muted-foreground">Detailed performance metrics and visualizations</p>
            </div>

            {/* Performance Chart - Full Width */}
            <PerformanceChart data={performanceHistory} />

            {/* Two Column Layout */}
            <div className="grid gap-6 lg:grid-cols-2">
              <ProfitChart bots={allBots} />
              <WinRateChart bots={allBots} />
            </div>

            {/* Client Distribution */}
            <ClientDistribution bots={allBots} />
          </div>
        </main>
      </div>
    </div>
  )
}
