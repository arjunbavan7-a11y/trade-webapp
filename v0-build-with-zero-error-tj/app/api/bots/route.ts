import { type NextRequest, NextResponse } from "next/server"
import { botStorage } from "@/lib/data-store"

// Verify API key for incoming requests from MT5
function verifyApiKey(request: NextRequest): boolean {
  const apiKey = request.headers.get("x-api-key")
  const validApiKey = process.env.MT5_API_KEY
  
  // If no API key is configured, allow requests (development mode)
  if (!validApiKey) return true
  
  return apiKey === validApiKey
}

// GET - Fetch all bots data
export async function GET(request: NextRequest) {
  try {
    const bots = botStorage.getAll()
    
    return NextResponse.json({
      success: true,
      data: bots,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error fetching bots:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch bots" },
      { status: 500 }
    )
  }
}

// POST - MT5 EA sends bot updates here
export async function POST(request: NextRequest) {
  if (!verifyApiKey(request)) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    )
  }

  try {
    const body = await request.json()
    
    // Validate required fields
    const { 
      clientId, 
      accountNumber, 
      currentBalance, 
      profit, 
      status,
      symbol,
      totalTrades,
      winningTrades,
      losingTrades
    } = body

    if (!clientId || !accountNumber) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: clientId, accountNumber" },
        { status: 400 }
      )
    }

    // Update or create bot data
    const botData = {
      id: `bot-${clientId}`,
      clientId,
      accountNumber,
      symbol: symbol || "XAUUSD",
      status: status || "running",
      currentBalance: currentBalance || 0,
      profit: profit || 0,
      profitPercentage: body.profitPercentage || 0,
      initialCapital: body.initialCapital || currentBalance - profit,
      totalTrades: totalTrades || 0,
      winningTrades: winningTrades || 0,
      losingTrades: losingTrades || 0,
      winRate: totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0,
      maxDrawdown: body.maxDrawdown || 0,
      todayProfit: body.todayProfit || 0,
      lastTradeTime: body.lastTradeTime ? new Date(body.lastTradeTime) : new Date(),
      lotSize: body.lotSize || 0.6,
      takeProfitUSD: body.takeProfitUSD || 0.6,
      maxLossPercentage: body.maxLossPercentage || 4,
      updatedAt: new Date(),
    }

    botStorage.upsert(botData.id, botData)

    return NextResponse.json({
      success: true,
      message: "Bot data updated",
      data: botData,
    })
  } catch (error) {
    console.error("Error updating bot:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update bot data" },
      { status: 500 }
    )
  }
}
