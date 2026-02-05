import { type NextRequest, NextResponse } from "next/server"
import { tradeStorage } from "@/lib/data-store"

function verifyApiKey(request: NextRequest): boolean {
  const apiKey = request.headers.get("x-api-key")
  const validApiKey = process.env.MT5_API_KEY
  if (!validApiKey) return true
  return apiKey === validApiKey
}

// GET - Fetch all trades
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const clientId = searchParams.get("clientId")
    const botId = searchParams.get("botId")
    const status = searchParams.get("status")
    const limit = Number.parseInt(searchParams.get("limit") || "100")

    let trades = tradeStorage.getAll()

    // Apply filters
    if (clientId) {
      trades = trades.filter((t) => t.clientId === clientId)
    }
    if (botId) {
      trades = trades.filter((t) => t.botId === botId)
    }
    if (status) {
      trades = trades.filter((t) => t.status === status)
    }

    // Sort by open time descending and limit
    trades = trades
      .sort((a, b) => new Date(b.openTime).getTime() - new Date(a.openTime).getTime())
      .slice(0, limit)

    return NextResponse.json({
      success: true,
      data: trades,
      count: trades.length,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error fetching trades:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch trades" },
      { status: 500 }
    )
  }
}

// POST - MT5 EA sends new trades here
export async function POST(request: NextRequest) {
  if (!verifyApiKey(request)) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    )
  }

  try {
    const body = await request.json()

    const {
      ticket,
      clientId,
      botId,
      symbol,
      type,
      lotSize,
      openPrice,
      closePrice,
      profit,
      status,
      openTime,
      closeTime,
      takeProfitPrice,
    } = body

    if (!ticket || !clientId) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: ticket, clientId" },
        { status: 400 }
      )
    }

    const tradeData = {
      id: `trade-${ticket}`,
      ticket,
      botId: botId || `bot-${clientId}`,
      clientId,
      clientName: body.clientName || "",
      symbol: symbol || "XAUUSD",
      type: type || "BUY",
      lotSize: lotSize || 0.6,
      openPrice: openPrice || 0,
      closePrice: closePrice || null,
      profit: profit || null,
      status: status || "open",
      openTime: openTime ? new Date(openTime) : new Date(),
      closeTime: closeTime ? new Date(closeTime) : null,
      takeProfitPrice: takeProfitPrice || 0,
      updatedAt: new Date(),
    }

    tradeStorage.upsert(tradeData.id, tradeData)

    return NextResponse.json({
      success: true,
      message: "Trade recorded",
      data: tradeData,
    })
  } catch (error) {
    console.error("Error recording trade:", error)
    return NextResponse.json(
      { success: false, error: "Failed to record trade" },
      { status: 500 }
    )
  }
}
