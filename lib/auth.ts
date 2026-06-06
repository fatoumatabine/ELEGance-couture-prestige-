import { NextRequest } from "next/server";
import crypto from "crypto";

const TOKEN_MAX_AGE_SECONDS = 24 * 60 * 60;

function getSecret(): string | null {
  return process.env.JWT_SECRET || process.env.ADMIN_TOKEN || process.env.ADMIN_PASSWORD || (process.env.NODE_ENV !== "production" ? "admin123" : null);
}

function base64UrlEncode(value: string | Buffer): string {
  return Buffer.from(value)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function base64UrlDecode(value: string): string {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(normalized.length + ((4 - normalized.length % 4) % 4), "=");
  return Buffer.from(padded, "base64").toString("utf8");
}

function signJwt(header: string, payload: string, secret: string): string {
  return base64UrlEncode(crypto.createHmac("sha256", secret).update(`${header}.${payload}`).digest());
}

function timingSafeStringEqual(a: string, b: string): boolean {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);

  if (aBuffer.length !== bBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(aBuffer, bBuffer);
}

export function createAdminToken(): string {
  const secret = getSecret();

  if (!secret) {
    throw new Error("Admin secret not configured");
  }

  const now = Math.floor(Date.now() / 1000);
  const header = base64UrlEncode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = base64UrlEncode(JSON.stringify({
    sub: "admin",
    role: "admin",
    iat: now,
    exp: now + TOKEN_MAX_AGE_SECONDS,
    jti: crypto.randomBytes(16).toString("hex"),
  }));
  const signature = signJwt(header, payload, secret);

  return `${header}.${payload}.${signature}`;
}

export function validateAdminToken(request: NextRequest): boolean {
  try {
    const token = getAdminTokenFromRequest(request);
    const secret = getSecret();

    if (!token || !secret) {
      if (!secret) console.error("Admin secret not configured in environment");
      return false;
    }

    const parts = token.split(".");

    if (parts.length === 3) {
      const [header, payload, signature] = parts;
      const expected = signJwt(header, payload, secret);

      if (!timingSafeStringEqual(signature, expected)) {
        return false;
      }

      const decoded = JSON.parse(base64UrlDecode(payload));
      const now = Math.floor(Date.now() / 1000);

      return decoded?.sub === "admin"
        && decoded?.role === "admin"
        && Number.isFinite(decoded.exp)
        && decoded.exp >= now;
    }

    if (parts.length !== 4 || parts[0] !== "admin") {
      return false;
    }

    const [, issuedAtRaw, nonce, signature] = parts;
    const issuedAt = Number(issuedAtRaw);

    if (!Number.isFinite(issuedAt) || !nonce || !signature) {
      return false;
    }

    const now = Math.floor(Date.now() / 1000);
    if (issuedAt > now || now - issuedAt > TOKEN_MAX_AGE_SECONDS) {
      return false;
    }

    const expected = crypto.createHmac("sha256", secret).update(`${issuedAtRaw}.${nonce}`).digest("hex");
    return timingSafeStringEqual(signature, expected);
  } catch (error) {
    console.error("Token validation error:", error);
    return false;
  }
}

export function getAdminTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get("Authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.split(" ")[1] || null;
  }

  return request.cookies.get("adminToken")?.value || null;
}

export { TOKEN_MAX_AGE_SECONDS };
