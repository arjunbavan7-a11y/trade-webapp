"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import type {
  Client,
  BotInstance,
  Trade,
  DashboardStats,
  PerformanceDataPoint,
  AlertNotification,
  TimeFilter,
  StatusFilter,
} from "@/lib/types"

// API fetch function
async function fetchFromAPI<T>(endpoint: string): Promise<T | null> {
  try {
    const response = await fetch(endpoint, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    })
    if (!response.ok) throw new Error(`API error: ${response.status}`)
    const data = await response.json()
    return data.data as T
  } catch (error) {
    console.error(`[v0] Failed to fetch ${endpoint}:`, error)
    return null
  }
}

export function useTradingData() {
  const [clients, setClients] = useState<Client[]>([])
  const [bots, setBots] = useState<BotInstance[]>([])
  const [trades, setTrades] = useState<Trade[]>([])
  const [performanceHistory, setPerformanceHistory] = useState<PerformanceDataPoint[]>([])
  const [alerts, setAlerts] = useState<AlertNotification[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  
  // Filters
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("24h")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const [clientFilter, setClientFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  
  const updateIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const performanceHistoryRef = useRef<PerformanceDataPoint[]>([])

  // Fetch real data from API
  const fetchData = useCallback(async () => {
    try {
      const [botsData, tradesData, alertsData] = await Promise.all([
        fetchFromAPI<BotInstance[]>("/api/bots"),
        fetchFromAPI<Trade[]>("/api/trades"),
        fetchFromAPI<AlertNotification[]>("/api/alerts"),
      ])

      if (botsData) {
        // Convert date strings to Date objects
        const processedBots = botsData.map((bot) => ({
          ...bot,
          lastTradeTime: bot.lastTradeTime ? new Date(bot.lastTradeTime) : undefined,
          startedAt: bot.startedAt ? new Date(bot.startedAt) : undefined,
        }))
        setBots(processedBots)
        
        // Extract unique clients from bots
        const uniqueClients = new Map<string, Client>()
        for (const bot of processedBots) {
          if (bot.clientId && !uniqueClients.has(bot.clientId)) {
            uniqueClients.set(bot.clientId, {
              id: bot.clientId,
              name: bot.clientName || `Client ${bot.clientId}`,
              email: "",
              accountNumber: bot.accountNumber || "",
              broker: "Exness",
              status: bot.status === "running" ? "active" : bot.status === "paused" ? "paused" : "stopped",
              createdAt: bot.startedAt || new Date(),
            })
          }
        }
        setClients(Array.from(uniqueClients.values()))

        // Update performance history with real data
        if (processedBots.length > 0) {
          const totalBalance = processedBots.reduce((sum, bot) => sum + (bot.currentBalance || 0), 0)
          const totalProfit = processedBots.reduce((sum, bot) => sum + (bot.profit || 0), 0)
          const activeBots = processedBots.filter((b) => b.status === "running").length
          const totalTrades = processedBots.reduce((sum, bot) => sum + (bot.totalTrades || 0), 0)

          const newPoint: PerformanceDataPoint = {
            timestamp: new Date(),
            totalBalance: Math.round(totalBalance * 100) / 100,
            totalProfit: Math.round(totalProfit * 100) / 100,
            activeBots,
            totalTrades,
          }

          performanceHistoryRef.current = [...performanceHistoryRef.current, newPoint].slice(-100)
          setPerformanceHistory(performanceHistoryRef.current)
        }

        setIsConnected(true)
      }

      if (tradesData) {
        const processedTrades = tradesData.map((trade) => ({
          ...trade,
          openTime: new Date(trade.openTime),
          closeTime: trade.closeTime ? new Date(trade.closeTime) : null,
        }))
        setTrades(processedTrades)
      }

      if (alertsData) {
        const processedAlerts = alertsData.map((alert) => ({
          ...alert,
          timestamp: new Date(alert.timestamp),
        }))
        setAlerts(processedAlerts)
      }

      setLastUpdate(new Date())
    } catch (error) {
      console.error("[v0] Error fetching data:", error)
      setIsConnected(false)
    }
  }, [])

  // Initial fetch and polling
  useEffect(() => {
    fetchData()

    // Poll for updates every 5 seconds
    updateIntervalRef.current = setInterval(fetchData, 5000)

    return () => {
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current)
      }
    }
  }, [fetchData])

  // Calculate dashboard stats from real data
  const stats: DashboardStats = {
    totalClients: clients.length,
    activeClients: clients.filter((c) => c.status === "active").length,
    totalBots: bots.length,
    runningBots: bots.filter((b) => b.status === "running").length,
    totalBalance: Math.round(bots.reduce((sum, bot) => sum + (bot.currentBalance || 0), 0) * 100) / 100,
    totalProfit: Math.round(bots.reduce((sum, bot) => sum + (bot.profit || 0), 0) * 100) / 100,
    totalProfitPercentage:
      Math.round(
        (bots.reduce((sum, bot) => sum + (bot.profit || 0), 0) /
          Math.max(bots.reduce((sum, bot) => sum + (bot.initialCapital || 0), 0), 1)) *
          100 *
          100
      ) / 100,
    todayProfit: Math.round(bots.reduce((sum, bot) => sum + (bot.todayProfit || 0), 0) * 100) / 100,
    totalTrades: bots.reduce((sum, bot) => sum + (bot.totalTrades || 0), 0),
    overallWinRate:
      bots.length > 0
        ? Math.round((bots.reduce((sum, bot) => sum + (bot.winRate || 0), 0) / bots.length) * 100) / 100
        : 0,
    avgDrawdown:
      bots.length > 0
        ? Math.round((bots.reduce((sum, bot) => sum + (bot.maxDrawdown || 0), 0) / bots.length) * 100) / 100
        : 0,
  }

  // Filter bots based on current filters
  const filteredBots = bots.filter((bot) => {
    if (statusFilter !== "all" && bot.status !== statusFilter) return false
    if (clientFilter !== "all" && bot.clientId !== clientFilter) return false
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        (bot.clientName?.toLowerCase().includes(query) ?? false) ||
        (bot.symbol?.toLowerCase().includes(query) ?? false) ||
        (bot.id?.toLowerCase().includes(query) ?? false)
      )
    }
    return true
  })

  // Filter trades based on current filters
  const filteredTrades = trades.filter((trade) => {
    if (clientFilter !== "all" && trade.clientId !== clientFilter) return false
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        (trade.clientName?.toLowerCase().includes(query) ?? false) ||
        (trade.symbol?.toLowerCase().includes(query) ?? false)
      )
    }
    
    // Time filter
    const now = Date.now()
    const tradeTime = trade.openTime.getTime()
    switch (timeFilter) {
      case "1h":
        return now - tradeTime <= 3600000
      case "24h":
        return now - tradeTime <= 86400000
      case "7d":
        return now - tradeTime <= 604800000
      case "30d":
        return now - tradeTime <= 2592000000
      default:
        return true
    }
  })

  // Mark alert as read
  const markAlertRead = useCallback(async (alertId: string) => {
    try {
      await fetch(`/api/alerts?id=${alertId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: true }),
      })
      setAlerts((prev) =>
        prev.map((alert) => (alert.id === alertId ? { ...alert, read: true } : alert))
      )
    } catch (error) {
      console.error("[v0] Error marking alert read:", error)
    }
  }, [])

  // Clear all alerts
  const clearAlerts = useCallback(async () => {
    try {
      await fetch("/api/alerts", { method: "DELETE" })
      setAlerts([])
    } catch (error) {
      console.error("[v0] Error clearing alerts:", error)
    }
  }, [])

  // Toggle bot status (sends command to MT5 if connected)
  const toggleBotStatus = useCallback((botId: string) => {
    setBots((prev) =>
      prev.map((bot) => {
        if (bot.id !== botId) return bot
        const newStatus = bot.status === "running" ? "paused" : "running"
        return { ...bot, status: newStatus }
      })
    )
  }, [])

  return {
    clients,
    bots: filteredBots,
    allBots: bots,
    trades: filteredTrades,
    allTrades: trades,
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
    refreshData: fetchData,
  }
}
