import { validateAdminToken } from "@/lib/auth";
import { publicDataCacheHeaders } from "@/lib/http-cache";
import { prisma, withPrismaRetry } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const sections = await withPrismaRetry(() =>
    prisma.homeSection.findMany({
      orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
    })
  );

  return NextResponse.json(sections, { headers: publicDataCacheHeaders });
}

export async function POST(request: NextRequest) {
  if (!validateAdminToken(request)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const body = await request.json();
  if (!body.title || !body.key) {
    return NextResponse.json({ error: "Titre et clé requis" }, { status: 400 });
  }

  const section = await prisma.homeSection.upsert({
    where: { key: body.key },
    create: {
      title: body.title,
      key: body.key,
      subtitle: body.subtitle || null,
      ctaLabel: body.ctaLabel || null,
      ctaHref: body.ctaHref || null,
      image: body.image || null,
      active: body.active ?? true,
      sortOrder: body.sortOrder ?? 0,
    },
    update: {
      title: body.title,
      subtitle: body.subtitle || null,
      ctaLabel: body.ctaLabel || null,
      ctaHref: body.ctaHref || null,
      image: body.image || null,
      active: body.active ?? true,
      sortOrder: body.sortOrder ?? 0,
    },
  });

  return NextResponse.json(section);
}
