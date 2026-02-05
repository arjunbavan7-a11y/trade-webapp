export interface Client {
  id: string
  name: string
  email: string
  accountNumber: string
  broker: string
  status: "active" | "paused" | "stopped"
  createdAt: Date
}

export interface BotInstance {
  id: string
  clientId: string
  clientName: string
  symbol: string
  status: "running" | "paused" | "stopped" | "error"
  initialCapital: number
  currentBalance: number
  profit: number
  profitPercentage: number
  totalTrades: number
  winningTrades: number
  losingTrades: number
  winRate: number
  maxDrawdown: number
  todayProfit: number
  lastTradeTime: Date | null
  startedAt: Date
  lotSize: number
  takeProfitUSD: number
  maxLossPercentage: number
}

export interface Trade {
  id: string
  botId: string
  clientId: string
  clientName: string
  symbol: string
  type: "BUY"
  lotSize: number
  openPrice: number
  closePrice: number | null
  profit: number | null
  status: "open" | "closed" | "pending"
  openTime: Date
  closeTime: Date | null
  takeProfitPrice: number
}

export interface PerformanceDataPoint {
  timestamp: Date
  totalBalance: number
  totalProfit: number
  activeBots: number
  totalTrades: number
}

export interface DashboardStats {
  totalClients: number
  activeClients: number
  totalBots: number
  runningBots: number
  totalBalance: number
  totalProfit: number
  totalProfitPercentage: number
  todayProfit: number
  totalTrades: number
  overallWinRate: number
  avgDrawdown: number
}

export interface AlertNotification {
  id: string
  type: "warning" | "error" | "success" | "info"
  title: string
  message: string
  clientId?: string
  botId?: string
  timestamp: Date
  read: boolean
}

export type TimeFilter = "1h" | "24h" | "7d" | "30d" | "all"
export type StatusFilter = "all" | "running" | "paused" | "stopped" | "error"
