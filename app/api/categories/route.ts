import { validateAdminToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });

  return NextResponse.json(categories);
}

export async function POST(request: NextRequest) {
  if (!validateAdminToken(request)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const body = await request.json();
  const slug = body.slug || body.name?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  if (!body.name || !slug) {
    return NextResponse.json({ error: "Nom requis" }, { status: 400 });
  }

  const category = await prisma.category.upsert({
    where: { slug },
    create: {
      name: body.name,
      slug,
      type: body.type || "product",
      parentSlug: body.parentSlug || null,
      description: body.description || null,
      image: body.image || null,
      sortOrder: body.sortOrder ?? 0,
      active: body.active ?? true,
    },
    update: {
      name: body.name,
      type: body.type || "product",
      parentSlug: body.parentSlug || null,
      description: body.description || null,
      image: body.image || null,
      sortOrder: body.sortOrder ?? 0,
      active: body.active ?? true,
    },
  });

  return NextResponse.json(category);
}
