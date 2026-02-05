import { type NextRequest, NextResponse } from "next/server"
import { alertStorage } from "@/lib/data-store"

function verifyApiKey(request: NextRequest): boolean {
  const apiKey = request.headers.get("x-api-key")
  const validApiKey = process.env.MT5_API_KEY
  if (!validApiKey) return true
  return apiKey === validApiKey
}

// GET - Fetch all alerts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const unreadOnly = searchParams.get("unreadOnly") === "true"

    let alerts = alertStorage.getAll()

    if (unreadOnly) {
      alerts = alerts.filter((a) => !a.read)
    }

    // Sort by timestamp descending
    alerts = alerts.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )

    return NextResponse.json({
      success: true,
      data: alerts,
      unreadCount: alerts.filter((a) => !a.read).length,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error fetching alerts:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch alerts" },
      { status: 500 }
    )
  }
}

// POST - MT5 EA sends alerts (max loss, errors, etc.)
export async function POST(request: NextRequest) {
  if (!verifyApiKey(request)) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    )
  }

  try {
    const body = await request.json()

    const { type, title, message, clientId, botId } = body

    if (!type || !title || !message) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: type, title, message" },
        { status: 400 }
      )
    }

    const alertData = {
      id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: type as "warning" | "error" | "success" | "info",
      title,
      message,
      clientId: clientId || null,
      botId: botId || null,
      timestamp: new Date(),
      read: false,
    }

    alertStorage.add(alertData)

    return NextResponse.json({
      success: true,
      message: "Alert created",
      data: alertData,
    })
  } catch (error) {
    console.error("Error creating alert:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create alert" },
      { status: 500 }
    )
  }
}

// PATCH - Mark alerts as read
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { alertIds, markAllRead } = body

    if (markAllRead) {
      alertStorage.markAllRead()
    } else if (alertIds && Array.isArray(alertIds)) {
      for (const id of alertIds) {
        alertStorage.markRead(id)
      }
    }

    return NextResponse.json({
      success: true,
      message: "Alerts updated",
    })
  } catch (error) {
    console.error("Error updating alerts:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update alerts" },
      { status: 500 }
    )
  }
}
