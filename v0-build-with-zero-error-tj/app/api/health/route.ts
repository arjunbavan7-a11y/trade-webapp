import { NextResponse } from "next/server"
import { botStorage, tradeStorage, alertStorage } from "@/lib/data-store"

// Health check endpoint to verify API is working
export async function GET() {
  const apiKeyConfigured = !!process.env.MT5_API_KEY
  
  return NextResponse.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    apiKeyConfigured,
    stats: {
      connectedBots: botStorage.size(),
      totalTrades: tradeStorage.size(),
      activeAlerts: alertStorage.getAll().filter(a => !a.read).length,
    },
    endpoints: {
      bots: "/api/bots",
      trades: "/api/trades",
      alerts: "/api/alerts",
      health: "/api/health",
    },
  })
}
