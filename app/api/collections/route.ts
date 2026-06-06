import { validateAdminToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const collections = await prisma.collection.findMany({
    orderBy: [{ gender: "asc" }, { sortOrder: "asc" }, { name: "asc" }],
  });

  return NextResponse.json(collections);
}

export async function POST(request: NextRequest) {
  if (!validateAdminToken(request)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const body = await request.json();
  const slug = body.slug || body.name?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  if (!body.name || !slug || !body.gender) {
    return NextResponse.json({ error: "Nom et genre requis" }, { status: 400 });
  }

  const collection = await prisma.collection.upsert({
    where: { slug },
    create: {
      name: body.name,
      slug,
      gender: body.gender,
      description: body.description || null,
      image: body.image || null,
      sortOrder: body.sortOrder ?? 0,
      active: body.active ?? true,
    },
    update: {
      name: body.name,
      gender: body.gender,
      description: body.description || null,
      image: body.image || null,
      sortOrder: body.sortOrder ?? 0,
      active: body.active ?? true,
    },
  });

  return NextResponse.json(collection);
}
