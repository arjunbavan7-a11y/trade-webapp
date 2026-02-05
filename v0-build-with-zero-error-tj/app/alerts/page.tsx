"use client"

import { useTradingData } from "@/hooks/use-trading-data"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { AlertsPanel } from "@/components/dashboard/alerts-panel"
import { Loader2 } from "lucide-react"

export default function AlertsPage() {
  const {
    alerts,
    isLoading,
    markAlertRead,
    clearAlerts,
  } = useTradingData()

  const unreadAlerts = alerts.filter((a) => !a.read).length

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading alerts...</p>
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
          <div className="mx-auto max-w-3xl space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Alerts</h2>
              <p className="text-muted-foreground">System notifications and trading alerts</p>
            </div>

            <AlertsPanel
              alerts={alerts}
              onMarkRead={markAlertRead}
              onClearAll={clearAlerts}
            />
          </div>
        </main>
      </div>
    </div>
  )
}
