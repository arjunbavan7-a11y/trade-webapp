import { NextResponse } from "next/server";
import { generateApiKey } from "@/lib/api-keys";

// POST /api/generate-key - Generate a new API key
// This should only be used once to generate your key, then add it to environment variables
export async function POST(request: Request) {
  try {
    // Check for admin password to prevent unauthorized key generation
    const { adminPassword } = await request.json();

    const expectedPassword = process.env.ADMIN_PASSWORD || "admin123";

    if (adminPassword !== expectedPassword) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Generate new API key
    const apiKey = generateApiKey();

    return NextResponse.json({
      success: true,
      apiKey: apiKey,
      instructions: [
        "1. Copy this API key - it will only be shown once",
        "2. Add MT5_API_KEY to your Vercel Environment Variables",
        "3. Configure your MT5 EA with this same key",
        "4. The key format is: mt5_[64 character hex string]",
      ],
    });
  } catch (error) {
    console.error("[API] Error generating key:", error);
    return NextResponse.json(
      { error: "Failed to generate API key" },
      { status: 500 }
    );
  }
}

// GET /api/generate-key - Check if API key is configured and return it (masked)
export async function GET() {
  const apiKey = process.env.MT5_API_KEY;
  const isConfigured = !!apiKey;

  return NextResponse.json({
    configured: isConfigured,
    message: isConfigured
      ? "API key is configured. Your MT5 bots can connect."
      : "No API key configured. Generate one and add it to environment variables.",
    // Show first 8 and last 4 characters of the key for verification
    keyPreview: apiKey ? `${apiKey.substring(0, 8)}...${apiKey.substring(apiKey.length - 4)}` : null,
    // Return full key only if user provides admin password via query param
    fullKey: null, // Security: never expose full key in GET
  });
}
