// Mock data for the MT5 Trading Bot Dashboard

export interface Client {
  id: string
  name: string
  email: string
  accountNumber: string
  broker: string
  initialBalance: number
  currentBalance: number
  profit: number
  profitPercent: number
  totalTrades: number
  winRate: number
  status: 'active' | 'stopped' | 'paused'
  maxDrawdown: number
  lastTradeAt: string
  createdAt: string
}

export interface Trade {
  id: string
  clientId: string
  clientName: string
  symbol: string
  type: 'buy' | 'sell'
  lotSize: number
  openPrice: number
  closePrice: number | null
  takeProfit: number
  stopLoss: number | null
  profit: number
  status: 'open' | 'closed' | 'pending'
  openedAt: string
  closedAt: string | null
}

export interface DailyStats {
  date: string
  totalProfit: number
  totalTrades: number
  winRate: number
  activeClients: number
}

// Generate mock clients
export const mockClients: Client[] = [
  {
    id: 'c1',
    name: 'Alex Thompson',
    email: 'alex.t@example.com',
    accountNumber: '50412891',
    broker: 'Exness',
    initialBalance: 10000,
    currentBalance: 10847.32,
    profit: 847.32,
    profitPercent: 8.47,
    totalTrades: 1412,
    winRate: 67.2,
    status: 'active',
    maxDrawdown: 2.1,
    lastTradeAt: '2026-02-05T14:32:00Z',
    createdAt: '2025-11-15T10:00:00Z',
  },
  {
    id: 'c2',
    name: 'Sarah Chen',
    email: 'sarah.c@example.com',
    accountNumber: '50892134',
    broker: 'Exness',
    initialBalance: 25000,
    currentBalance: 27156.89,
    profit: 2156.89,
    profitPercent: 8.63,
    totalTrades: 2089,
    winRate: 71.4,
    status: 'active',
    maxDrawdown: 1.8,
    lastTradeAt: '2026-02-05T14:28:00Z',
    createdAt: '2025-10-20T08:30:00Z',
  },
  {
    id: 'c3',
    name: 'Michael Roberts',
    email: 'michael.r@example.com',
    accountNumber: '51023456',
    broker: 'Exness',
    initialBalance: 5000,
    currentBalance: 4812.45,
    profit: -187.55,
    profitPercent: -3.75,
    totalTrades: 623,
    winRate: 54.1,
    status: 'stopped',
    maxDrawdown: 4.0,
    lastTradeAt: '2026-02-04T22:15:00Z',
    createdAt: '2026-01-05T14:20:00Z',
  },
  {
    id: 'c4',
    name: 'Emma Wilson',
    email: 'emma.w@example.com',
    accountNumber: '51234567',
    broker: 'Exness',
    initialBalance: 15000,
    currentBalance: 16234.78,
    profit: 1234.78,
    profitPercent: 8.23,
    totalTrades: 1567,
    winRate: 68.9,
    status: 'active',
    maxDrawdown: 2.4,
    lastTradeAt: '2026-02-05T14:30:00Z',
    createdAt: '2025-12-01T09:45:00Z',
  },
  {
    id: 'c5',
    name: 'James Lee',
    email: 'james.l@example.com',
    accountNumber: '51345678',
    broker: 'Exness',
    initialBalance: 8000,
    currentBalance: 8542.16,
    profit: 542.16,
    profitPercent: 6.78,
    totalTrades: 892,
    winRate: 65.3,
    status: 'paused',
    maxDrawdown: 1.9,
    lastTradeAt: '2026-02-05T12:45:00Z',
    createdAt: '2025-12-15T16:00:00Z',
  },
  {
    id: 'c6',
    name: 'Olivia Martinez',
    email: 'olivia.m@example.com',
    accountNumber: '51456789',
    broker: 'Exness',
    initialBalance: 20000,
    currentBalance: 21789.34,
    profit: 1789.34,
    profitPercent: 8.95,
    totalTrades: 1823,
    winRate: 72.1,
    status: 'active',
    maxDrawdown: 1.5,
    lastTradeAt: '2026-02-05T14:31:00Z',
    createdAt: '2025-11-01T11:30:00Z',
  },
  {
    id: 'c7',
    name: 'David Kim',
    email: 'david.k@example.com',
    accountNumber: '51567890',
    broker: 'Exness',
    initialBalance: 12000,
    currentBalance: 12956.22,
    profit: 956.22,
    profitPercent: 7.97,
    totalTrades: 1234,
    winRate: 66.8,
    status: 'active',
    maxDrawdown: 2.2,
    lastTradeAt: '2026-02-05T14:29:00Z',
    createdAt: '2025-11-20T13:15:00Z',
  },
  {
    id: 'c8',
    name: 'Sophie Brown',
    email: 'sophie.b@example.com',
    accountNumber: '51678901',
    broker: 'Exness',
    initialBalance: 7500,
    currentBalance: 7123.67,
    profit: -376.33,
    profitPercent: -5.02,
    totalTrades: 456,
    winRate: 51.2,
    status: 'stopped',
    maxDrawdown: 4.0,
    lastTradeAt: '2026-02-03T18:20:00Z',
    createdAt: '2026-01-10T10:00:00Z',
  },
]

// Generate mock trades
export const mockTrades: Trade[] = [
  {
    id: 't1',
    clientId: 'c1',
    clientName: 'Alex Thompson',
    symbol: 'XAUUSD',
    type: 'buy',
    lotSize: 0.6,
    openPrice: 2845.32,
    closePrice: null,
    takeProfit: 2845.92,
    stopLoss: null,
    profit: 0.42,
    status: 'open',
    openedAt: '2026-02-05T14:32:00Z',
    closedAt: null,
  },
  {
    id: 't2',
    clientId: 'c2',
    clientName: 'Sarah Chen',
    symbol: 'XAUUSD',
    type: 'buy',
    lotSize: 0.6,
    openPrice: 2844.18,
    closePrice: 2844.78,
    takeProfit: 2844.78,
    stopLoss: null,
    profit: 0.60,
    status: 'closed',
    openedAt: '2026-02-05T14:23:00Z',
    closedAt: '2026-02-05T14:28:00Z',
  },
  {
    id: 't3',
    clientId: 'c4',
    clientName: 'Emma Wilson',
    symbol: 'XAUUSD',
    type: 'buy',
    lotSize: 0.6,
    openPrice: 2845.45,
    closePrice: null,
    takeProfit: 2846.05,
    stopLoss: null,
    profit: 0.18,
    status: 'open',
    openedAt: '2026-02-05T14:30:00Z',
    closedAt: null,
  },
  {
    id: 't4',
    clientId: 'c6',
    clientName: 'Olivia Martinez',
    symbol: 'XAUUSD',
    type: 'buy',
    lotSize: 0.6,
    openPrice: 2845.50,
    closePrice: null,
    takeProfit: 2846.10,
    stopLoss: null,
    profit: 0.12,
    status: 'open',
    openedAt: '2026-02-05T14:31:00Z',
    closedAt: null,
  },
  {
    id: 't5',
    clientId: 'c7',
    clientName: 'David Kim',
    symbol: 'XAUUSD',
    type: 'buy',
    lotSize: 0.6,
    openPrice: 2844.89,
    closePrice: 2845.49,
    takeProfit: 2845.49,
    stopLoss: null,
    profit: 0.60,
    status: 'closed',
    openedAt: '2026-02-05T14:24:00Z',
    closedAt: '2026-02-05T14:29:00Z',
  },
  {
    id: 't6',
    clientId: 'c1',
    clientName: 'Alex Thompson',
    symbol: 'XAUUSD',
    type: 'buy',
    lotSize: 0.6,
    openPrice: 2843.56,
    closePrice: 2844.16,
    takeProfit: 2844.16,
    stopLoss: null,
    profit: 0.60,
    status: 'closed',
    openedAt: '2026-02-05T14:17:00Z',
    closedAt: '2026-02-05T14:22:00Z',
  },
  {
    id: 't7',
    clientId: 'c2',
    clientName: 'Sarah Chen',
    symbol: 'XAUUSD',
    type: 'buy',
    lotSize: 0.6,
    openPrice: 2842.90,
    closePrice: 2843.50,
    takeProfit: 2843.50,
    stopLoss: null,
    profit: 0.60,
    status: 'closed',
    openedAt: '2026-02-05T14:12:00Z',
    closedAt: '2026-02-05T14:18:00Z',
  },
  {
    id: 't8',
    clientId: 'c4',
    clientName: 'Emma Wilson',
    symbol: 'XAUUSD',
    type: 'buy',
    lotSize: 0.6,
    openPrice: 2843.78,
    closePrice: 2844.38,
    takeProfit: 2844.38,
    stopLoss: null,
    profit: 0.60,
    status: 'closed',
    openedAt: '2026-02-05T14:20:00Z',
    closedAt: '2026-02-05T14:25:00Z',
  },
]

// Generate daily stats for the last 30 days
export const mockDailyStats: DailyStats[] = Array.from({ length: 30 }, (_, i) => {
  const date = new Date()
  date.setDate(date.getDate() - (29 - i))
  const baseProfit = 150 + Math.random() * 100
  const variation = Math.sin(i * 0.3) * 50
  return {
    date: date.toISOString().split('T')[0],
    totalProfit: Math.round((baseProfit + variation) * 100) / 100,
    totalTrades: Math.floor(80 + Math.random() * 40),
    winRate: Math.round((62 + Math.random() * 12) * 10) / 10,
    activeClients: Math.floor(5 + Math.random() * 3),
  }
})

// Summary metrics
export const summaryMetrics = {
  totalClients: mockClients.length,
  activeClients: mockClients.filter(c => c.status === 'active').length,
  totalBalance: mockClients.reduce((sum, c) => sum + c.currentBalance, 0),
  totalProfit: mockClients.reduce((sum, c) => sum + c.profit, 0),
  totalTrades: mockClients.reduce((sum, c) => sum + c.totalTrades, 0),
  averageWinRate: mockClients.reduce((sum, c) => sum + c.winRate, 0) / mockClients.length,
  openTrades: mockTrades.filter(t => t.status === 'open').length,
  todayProfit: mockDailyStats[mockDailyStats.length - 1].totalProfit,
  todayTrades: mockDailyStats[mockDailyStats.length - 1].totalTrades,
}
