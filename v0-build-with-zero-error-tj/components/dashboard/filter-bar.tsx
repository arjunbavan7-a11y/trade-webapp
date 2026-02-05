"use client"

import { Search, RefreshCw } from "lucide-react"
import type { Client, TimeFilter, StatusFilter } from "@/lib/types"
import { cn } from "@/lib/utils"

interface FilterBarProps {
  clients: Client[]
  timeFilter: TimeFilter
  onTimeFilterChange: (filter: TimeFilter) => void
  statusFilter: StatusFilter
  onStatusFilterChange: (filter: StatusFilter) => void
  clientFilter: string
  onClientFilterChange: (filter: string) => void
  searchQuery: string
  onSearchChange: (query: string) => void
  isConnected: boolean
}

export function FilterBar({
  clients,
  timeFilter,
  onTimeFilterChange,
  statusFilter,
  onStatusFilterChange,
  clientFilter,
  onClientFilterChange,
  searchQuery,
  onSearchChange,
  isConnected,
}: FilterBarProps) {
  const timeOptions: { value: TimeFilter; label: string }[] = [
    { value: "1h", label: "1H" },
    { value: "24h", label: "24H" },
    { value: "7d", label: "7D" },
    { value: "30d", label: "30D" },
    { value: "all", label: "All" },
  ]

  const statusOptions: { value: StatusFilter; label: string }[] = [
    { value: "all", label: "All Status" },
    { value: "running", label: "Running" },
    { value: "paused", label: "Paused" },
    { value: "stopped", label: "Stopped" },
    { value: "error", label: "Error" },
  ]

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-3">
        {/* Connection Status */}
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "h-2 w-2 rounded-full",
              isConnected ? "bg-primary animate-pulse" : "bg-destructive"
            )}
          />
          <span className="text-sm text-muted-foreground">
            {isConnected ? "Live" : "Disconnected"}
          </span>
        </div>

        {/* Time Filter */}
        <div className="flex items-center rounded-lg border border-border bg-background p-1">
          {timeOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onTimeFilterChange(option.value)}
              className={cn(
                "rounded-md px-3 py-1 text-sm font-medium transition-colors",
                timeFilter === option.value
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value as StatusFilter)}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Client Filter */}
        <select
          value={clientFilter}
          onChange={(e) => onClientFilterChange(e.target.value)}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="all">All Clients</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name}
            </option>
          ))}
        </select>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search clients, bots..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-lg border border-border bg-background py-2 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary sm:w-64"
        />
      </div>
    </div>
  )
}
