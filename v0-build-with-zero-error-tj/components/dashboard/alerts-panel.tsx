"use client"

import { AlertTriangle, CheckCircle, Info, XCircle, X, Bell } from "lucide-react"
import type { AlertNotification } from "@/lib/types"
import { cn } from "@/lib/utils"

interface AlertsPanelProps {
  alerts: AlertNotification[]
  onMarkRead: (id: string) => void
  onClearAll: () => void
}

export function AlertsPanel({ alerts, onMarkRead, onClearAll }: AlertsPanelProps) {
  const unreadCount = alerts.filter((a) => !a.read).length

  const getAlertIcon = (type: AlertNotification["type"]) => {
    switch (type) {
      case "error":
        return <XCircle className="h-5 w-5 text-destructive" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-warning" />
      case "success":
        return <CheckCircle className="h-5 w-5 text-primary" />
      case "info":
        return <Info className="h-5 w-5 text-chart-2" />
    }
  }

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
      <div className="flex items-center justify-between border-b border-border p-4">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-foreground" />
          <h3 className="text-lg font-semibold text-foreground">Alerts</h3>
          {unreadCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1.5 text-xs font-medium text-destructive-foreground">
              {unreadCount}
            </span>
          )}
        </div>
        {alerts.length > 0 && (
          <button
            onClick={onClearAll}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Clear all
          </button>
        )}
      </div>
      <div className="max-h-[400px] overflow-y-auto divide-y divide-border">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={cn(
              "flex gap-3 p-4 hover:bg-muted/30 transition-colors",
              !alert.read && "bg-muted/20"
            )}
          >
            <div className="flex-shrink-0 mt-0.5">{getAlertIcon(alert.type)}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-medium text-foreground">{alert.title}</h4>
                  <p className="text-sm text-muted-foreground mt-0.5">{alert.message}</p>
                </div>
                {!alert.read && (
                  <button
                    onClick={() => onMarkRead(alert.id)}
                    className="flex-shrink-0 rounded p-1 hover:bg-muted transition-colors"
                  >
                    <X className="h-4 w-4 text-muted-foreground" />
                  </button>
                )}
              </div>
              <span className="text-xs text-muted-foreground mt-1 block">
                {formatTime(alert.timestamp)}
              </span>
            </div>
          </div>
        ))}
      </div>
      {alerts.length === 0 && (
        <div className="p-8 text-center">
          <Bell className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground">No alerts</p>
        </div>
      )}
    </div>
  )
}
