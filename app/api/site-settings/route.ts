import { validateAdminToken } from "@/lib/auth";
import { publicDataCacheHeaders } from "@/lib/http-cache";
import { prisma, withPrismaRetry } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const settings = await withPrismaRetry(() =>
    prisma.siteSetting.findMany({
      orderBy: [{ group: "asc" }, { key: "asc" }],
    })
  );

  return NextResponse.json(settings, { headers: publicDataCacheHeaders });
}

export async function POST(request: NextRequest) {
  if (!validateAdminToken(request)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const body = await request.json();
  if (!body.key) {
    return NextResponse.json({ error: "Clé requise" }, { status: 400 });
  }

  const setting = await prisma.siteSetting.upsert({
    where: { key: body.key },
    create: {
      key: body.key,
      value: body.value || "",
      group: body.group || "general",
      label: body.label || null,
    },
    update: {
      value: body.value || "",
      group: body.group || "general",
      label: body.label || null,
    },
  });

  return NextResponse.json(setting);
}
