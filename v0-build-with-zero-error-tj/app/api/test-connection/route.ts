import { type NextRequest, NextResponse } from "next/server";

// POST - Test API key connection
export async function POST(request: NextRequest) {
  const apiKey = request.headers.get("x-api-key");
  const validApiKey = process.env.MT5_API_KEY;

  // Check if API key is configured in environment
  if (!validApiKey) {
    return NextResponse.json(
      {
        success: false,
        error: "No API key configured on server",
        message:
          "Please add MT5_API_KEY to your Vercel environment variables first.",
      },
      { status: 503 }
    );
  }

  // Check if user provided an API key
  if (!apiKey) {
    return NextResponse.json(
      {
        success: false,
        error: "No API key provided",
        message: "Please enter an API key to test.",
      },
      { status: 400 }
    );
  }

  // Validate the API key
  if (apiKey !== validApiKey) {
    return NextResponse.json(
      {
        success: false,
        error: "Invalid API key",
        message:
          "The API key you entered does not match the configured MT5_API_KEY.",
      },
      { status: 401 }
    );
  }

  // Success - API key is valid
  return NextResponse.json({
    success: true,
    message:
      "Connection successful! Your API key is valid and ready to receive MT5 data.",
    timestamp: new Date().toISOString(),
  });
}
