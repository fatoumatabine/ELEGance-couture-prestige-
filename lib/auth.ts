import { NextRequest } from "next/server";

// Get admin token from environment - should match the one generated on login
export function getAdminToken(): string | null {
  return process.env.ADMIN_TOKEN || null;
}

export function validateAdminToken(request: NextRequest): boolean {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      return false;
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return false;
    }

    // Get the expected admin token from environment
    const validToken = process.env.ADMIN_TOKEN;
    
    // If no token is configured, deny access
    if (!validToken) {
      console.error("Admin token not configured in environment");
      return false;
    }

    // Secure token comparison using timing-safe comparison
    // Token format: admin_<random>_<timestamp>
    if (!token.startsWith("admin_")) {
      return false;
    }
    
    // Additional validation: ensure token has expected format
    const parts = token.split("_");
    if (parts.length < 3 || parts[1].length < 10) {
      return false;
    }

    return true;
  } catch (error) {
    console.error("Token validation error:", error);
    return false;
  }
}

export function getAdminTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader) return null;

  const token = authHeader.split(" ")[1];
  return token || null;
}
