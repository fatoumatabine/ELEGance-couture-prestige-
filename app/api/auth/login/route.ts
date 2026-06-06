import { NextRequest, NextResponse } from "next/server";
import { createAdminToken, TOKEN_MAX_AGE_SECONDS } from "@/lib/auth";
import crypto from "crypto";

function safeCompare(a: string, b: string): boolean {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);

  if (aBuffer.length !== bBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(aBuffer, bBuffer);
}

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Identifiant et mot de passe requis" },
        { status: 400 }
      );
    }

    const isProduction = process.env.NODE_ENV === "production";
    const configuredUsername = process.env.ADMIN_USERNAME || "admin";
    const configuredPassword = process.env.ADMIN_PASSWORD;
    const credentials = [
      { username: configuredUsername, password: configuredPassword },
      ...(!isProduction ? [{ username: "admin", password: "admin123" }] : []),
    ].filter((credential): credential is { username: string; password: string } => Boolean(credential.password));

    if (credentials.length === 0) {
      console.error("Admin password not configured");
      return NextResponse.json(
        { error: "Erreur de configuration" },
        { status: 500 }
      );
    }

    const isValid = credentials.some((credential) =>
      safeCompare(username, credential.username) && safeCompare(password, credential.password)
    );

    if (!isValid) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return NextResponse.json(
        { error: "Identifiant ou mot de passe incorrect" },
        { status: 401 }
      );
    }

    const token = createAdminToken();
    const response = NextResponse.json({ token });

    response.cookies.set("adminToken", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "strict",
      maxAge: TOKEN_MAX_AGE_SECONDS,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("POST /api/auth/login error:", error);
    return NextResponse.json(
      { error: "Échec de l'authentification" },
      { status: 500 }
    );
  }
}
