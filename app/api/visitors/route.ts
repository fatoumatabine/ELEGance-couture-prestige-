import crypto from "crypto";
import { validateAdminToken } from "@/lib/auth";
import { prisma, withPrismaRetry } from "@/lib/prisma";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const MAX_VISITOR_ID_LENGTH = 100;

type CountRow = { count: number };
type TopPageRow = { path: string; views: number };

type VisitorRow = {
  id: number;
  visitorId: string;
  firstSeen: Date;
  lastSeen: Date;
  visits: number;
  lastPath: string;
  lastTitle: string | null;
  referrer: string | null;
  userAgent: string | null;
  deviceType: string | null;
  browser: string | null;
  os: string | null;
  language: string | null;
  country: string | null;
  city: string | null;
  screen: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type VisitorPageViewRow = {
  id: number;
  visitorId: string;
  path: string;
  title: string | null;
  referrer: string | null;
  createdAt: Date;
};

function cleanString(value: unknown, maxLength = 240) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

function cleanHeader(value: string | null, maxLength = 120) {
  if (!value) return "";

  try {
    return decodeURIComponent(value).trim().slice(0, maxLength);
  } catch {
    return value.trim().slice(0, maxLength);
  }
}

function hashIp(ip: string) {
  const secret =
    process.env.VISITOR_HASH_SECRET ||
    process.env.JWT_SECRET ||
    process.env.ADMIN_TOKEN ||
    "visitor-analytics";

  return crypto.createHmac("sha256", secret).update(ip).digest("hex");
}

function getGeo(request: NextRequest) {
  return {
    country: cleanHeader(
      request.headers.get("x-vercel-ip-country") ||
        request.headers.get("cf-ipcountry") ||
        request.headers.get("x-country"),
      80
    ),
    city: cleanHeader(
      request.headers.get("x-vercel-ip-city") ||
        request.headers.get("cf-ipcity") ||
        request.headers.get("x-city"),
      100
    ),
  };
}

function parseUserAgent(userAgent: string) {
  const lower = userAgent.toLowerCase();
  const deviceType = /bot|crawler|spider|crawling/.test(lower)
    ? "robot"
    : /ipad|tablet|android(?!.*mobile)/.test(lower)
      ? "tablette"
      : /mobile|iphone|ipod|android/.test(lower)
        ? "mobile"
        : "ordinateur";

  const browser = /edg\//i.test(userAgent)
    ? "Edge"
    : /chrome|crios/i.test(userAgent)
      ? "Chrome"
      : /firefox|fxios/i.test(userAgent)
        ? "Firefox"
        : /safari/i.test(userAgent)
          ? "Safari"
          : "Navigateur";

  const os = /iphone|ipad|ipod/i.test(userAgent)
    ? "iOS"
    : /android/i.test(userAgent)
      ? "Android"
      : /windows/i.test(userAgent)
        ? "Windows"
        : /mac os|macintosh/i.test(userAgent)
          ? "macOS"
          : /linux/i.test(userAgent)
            ? "Linux"
            : "";

  return { deviceType, browser, os };
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rateLimitResult = rateLimit(`visitor:${ip}`, 120, 60000);

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Trop de visites enregistrées. Veuillez réessayer plus tard." },
        { status: 429 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const visitorId = cleanString(body.visitorId, MAX_VISITOR_ID_LENGTH);

    if (!/^[a-zA-Z0-9._-]{8,100}$/.test(visitorId)) {
      return NextResponse.json({ error: "Identifiant visiteur invalide" }, { status: 400 });
    }

    const path = cleanString(body.path, 500) || "/";
    if (path.startsWith("/admin")) {
      return NextResponse.json({ success: true, skipped: true });
    }

    const userAgent = cleanString(request.headers.get("user-agent"), 500);
    const userAgentInfo = parseUserAgent(userAgent);
    const geo = getGeo(request);
    const now = new Date();
    const title = cleanString(body.title, 180);
    const referrer = cleanString(body.referrer, 500);
    const ipHash = hashIp(ip);
    const language = cleanString(body.language, 40) || null;
    const screen = cleanString(body.screen, 40) || null;

    await withPrismaRetry(() =>
      prisma.$transaction([
        prisma.$executeRaw`
          INSERT INTO "Visitor" (
            "visitorId",
            "ipHash",
            "firstSeen",
            "lastSeen",
            "visits",
            "lastPath",
            "lastTitle",
            "referrer",
            "userAgent",
            "deviceType",
            "browser",
            "os",
            "language",
            "country",
            "city",
            "screen",
            "createdAt",
            "updatedAt"
          )
          VALUES (
            ${visitorId},
            ${ipHash},
            ${now},
            ${now},
            1,
            ${path},
            ${title || null},
            ${referrer || null},
            ${userAgent},
            ${userAgentInfo.deviceType},
            ${userAgentInfo.browser},
            ${userAgentInfo.os || null},
            ${language},
            ${geo.country || null},
            ${geo.city || null},
            ${screen},
            ${now},
            ${now}
          )
          ON CONFLICT ("visitorId") DO UPDATE SET
            "ipHash" = EXCLUDED."ipHash",
            "lastSeen" = EXCLUDED."lastSeen",
            "visits" = "Visitor"."visits" + 1,
            "lastPath" = EXCLUDED."lastPath",
            "lastTitle" = EXCLUDED."lastTitle",
            "referrer" = EXCLUDED."referrer",
            "userAgent" = EXCLUDED."userAgent",
            "deviceType" = EXCLUDED."deviceType",
            "browser" = EXCLUDED."browser",
            "os" = EXCLUDED."os",
            "language" = EXCLUDED."language",
            "country" = EXCLUDED."country",
            "city" = EXCLUDED."city",
            "screen" = EXCLUDED."screen",
            "updatedAt" = EXCLUDED."updatedAt"
        `,
        prisma.$executeRaw`
          INSERT INTO "VisitorPageView" (
            "visitorId",
            "path",
            "title",
            "referrer",
            "createdAt"
          )
          VALUES (
            ${visitorId},
            ${path},
            ${title || null},
            ${referrer || null},
            ${now}
          )
        `,
      ])
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST /api/visitors error:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'enregistrement de la visite" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    if (!validateAdminToken(request)) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const requestedLimit = Number(request.nextUrl.searchParams.get("limit") || 80);
    const limit = Math.min(Math.max(Number.isFinite(requestedLimit) ? requestedLimit : 80, 20), 200);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const activeSince = new Date(Date.now() - 15 * 60 * 1000);

    const [visitors, totalRows, todayRows, activeRows, pageViewRows, topPages] =
      await withPrismaRetry(() =>
        Promise.all([
          prisma.$queryRaw<VisitorRow[]>`
            SELECT
              "id",
              "visitorId",
              "firstSeen",
              "lastSeen",
              "visits",
              "lastPath",
              "lastTitle",
              "referrer",
              "userAgent",
              "deviceType",
              "browser",
              "os",
              "language",
              "country",
              "city",
              "screen",
              "createdAt",
              "updatedAt"
            FROM "Visitor"
            ORDER BY "lastSeen" DESC
            LIMIT ${limit}
          `,
          prisma.$queryRaw<CountRow[]>`SELECT COUNT(*)::int AS "count" FROM "Visitor"`,
          prisma.$queryRaw<CountRow[]>`SELECT COUNT(*)::int AS "count" FROM "Visitor" WHERE "lastSeen" >= ${today}`,
          prisma.$queryRaw<CountRow[]>`SELECT COUNT(*)::int AS "count" FROM "Visitor" WHERE "lastSeen" >= ${activeSince}`,
          prisma.$queryRaw<CountRow[]>`SELECT COUNT(*)::int AS "count" FROM "VisitorPageView"`,
          prisma.$queryRaw<TopPageRow[]>`
            SELECT "path", COUNT(*)::int AS "views"
            FROM "VisitorPageView"
            GROUP BY "path"
            ORDER BY "views" DESC
            LIMIT 8
          `,
        ])
      );

    const visitorIds = visitors.map((visitor) => visitor.visitorId);
    const pageViews = visitorIds.length
      ? await withPrismaRetry(() =>
          prisma.$queryRaw<VisitorPageViewRow[]>(
            Prisma.sql`
              SELECT
                "id",
                "visitorId",
                "path",
                "title",
                "referrer",
                "createdAt"
              FROM "VisitorPageView"
              WHERE "visitorId" IN (${Prisma.join(visitorIds)})
              ORDER BY "createdAt" DESC
            `
          )
        )
      : [];

    const pageViewsByVisitor = new Map<string, VisitorPageViewRow[]>();
    for (const pageView of pageViews) {
      const existing = pageViewsByVisitor.get(pageView.visitorId) || [];
      if (existing.length < 5) {
        existing.push(pageView);
        pageViewsByVisitor.set(pageView.visitorId, existing);
      }
    }

    return NextResponse.json({
      visitors: visitors.map((visitor) => ({
        ...visitor,
        pageViews: pageViewsByVisitor.get(visitor.visitorId) || [],
      })),
      stats: {
        totalVisitors: totalRows[0]?.count || 0,
        todayVisitors: todayRows[0]?.count || 0,
        activeVisitors: activeRows[0]?.count || 0,
        totalPageViews: pageViewRows[0]?.count || 0,
      },
      topPages,
    });
  } catch (error) {
    console.error("GET /api/visitors error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des visiteurs" },
      { status: 500 }
    );
  }
}
