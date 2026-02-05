import { randomBytes, createHash } from "crypto";

// Generate a secure API key
export function generateApiKey(): string {
  const key = randomBytes(32).toString("hex");
  return `mt5_${key}`;
}

// Hash API key for secure storage comparison
export function hashApiKey(key: string): string {
  return createHash("sha256").update(key).digest("hex");
}

// Validate API key format
export function isValidApiKeyFormat(key: string): boolean {
  return typeof key === "string" && key.startsWith("mt5_") && key.length === 68;
}

// Get API key from request headers
export function getApiKeyFromHeaders(headers: Headers): string | null {
  // Check Authorization header first
  const authHeader = headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }

  // Check X-API-Key header
  const apiKeyHeader = headers.get("x-api-key");
  if (apiKeyHeader) {
    return apiKeyHeader;
  }

  return null;
}

// Validate API key against stored key
export function validateApiKey(providedKey: string | null): boolean {
  if (!providedKey) {
    return false;
  }

  const storedKey = process.env.MT5_API_KEY;

  // If no key is configured, reject all requests
  if (!storedKey) {
    console.error("[API] MT5_API_KEY environment variable is not set");
    return false;
  }

  // Direct comparison (in production, use constant-time comparison)
  return providedKey === storedKey;
}

// Generate a new API key and return both the key and its hash
export function createNewApiKey(): { key: string; hash: string } {
  const key = generateApiKey();
  const hash = hashApiKey(key);
  return { key, hash };
}
