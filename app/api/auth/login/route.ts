import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { error: "Mot de passe requis" },
        { status: 400 }
      );
    }

    // Verify admin password
    const adminPassword = process.env.ADMIN_PASSWORD;
    
    if (!adminPassword) {
      console.error("Admin password not configured");
      return NextResponse.json(
        { error: "Erreur de configuration" },
        { status: 500 }
      );
    }
    
    // Use timing-safe comparison to prevent timing attacks
    const safeCompare = (a: string, b: string): boolean => {
      if (a.length !== b.length) return false;
      let result = 0;
      for (let i = 0; i < a.length; i++) {
        result |= a.charCodeAt(i) ^ b.charCodeAt(i);
      }
      return result === 0;
    };

    if (!safeCompare(password, adminPassword)) {
      // Add delay to prevent brute force (timing-safe)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return NextResponse.json(
        { error: "Identifiants invalides" },
        { status: 401 }
      );
    }

    // Generate secure token with proper entropy
    const randomBytes = crypto.randomBytes(32).toString('hex');
    const timestamp = Date.now().toString(36);
    const token = `admin_${randomBytes}_${timestamp}`;
    
    // Set token expiry (24 hours)
    const maxAge = 24 * 60 * 60;
    
    return NextResponse.json({ token }, {
      headers: {
        "Set-Cookie": `adminToken=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}`
      }
    });
  } catch (error) {
    console.error("POST /api/auth/login error:", error);
    return NextResponse.json(
      { error: "Échec de l'authentification" },
      { status: 500 }
    );
  }
}
