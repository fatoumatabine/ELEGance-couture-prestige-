import { validateAdminToken } from "@/lib/auth";
import { publicDataCacheHeaders } from "@/lib/http-cache";
import { normalizeImageUrl } from "@/lib/image-utils";
import { prisma, withPrismaRetry } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const images = await withPrismaRetry(() =>
      prisma.siteImage.findMany({
        orderBy: [{ section: "asc" }, { sortOrder: "asc" }, { title: "asc" }],
      })
    );

    return NextResponse.json(
      images.map((image) => ({
        ...image,
        url: normalizeImageUrl(image.url) || image.url,
      })),
      { headers: publicDataCacheHeaders }
    );
  } catch (error) {
    console.error("GET /api/site-images error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des images du site" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  if (!validateAdminToken(request)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const body = await request.json();
  const url = normalizeImageUrl(body.url);

  if (!body.title || !body.key || !url) {
    return NextResponse.json({ error: "Titre, clé et URL requis" }, { status: 400 });
  }

  const image = await prisma.siteImage.upsert({
    where: { key: body.key },
    create: {
      title: body.title,
      key: body.key,
      url,
      alt: body.alt || null,
      section: body.section || "general",
      sortOrder: body.sortOrder ?? 0,
      active: body.active ?? true,
    },
    update: {
      title: body.title,
      url,
      alt: body.alt || null,
      section: body.section || "general",
      sortOrder: body.sortOrder ?? 0,
      active: body.active ?? true,
    },
  });

  return NextResponse.json(image);
}
