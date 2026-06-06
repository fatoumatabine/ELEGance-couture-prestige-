import { prisma } from "@/lib/prisma";
import { normalizeImageUrls } from "@/lib/image-utils";
import { NextRequest, NextResponse } from "next/server";
import { validateAdminToken } from "@/lib/auth";

// GET all products or filter by category
export async function GET(request: NextRequest) {
  try {
    const category = request.nextUrl.searchParams.get("category");

    const products = await prisma.product.findMany({
      where: category ? { category } : undefined,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(
      products.map((product) => ({
        ...product,
        images: normalizeImageUrls(product.images),
      }))
    );
  } catch (error) {
    console.error("GET /api/products error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// POST create new product (admin only)
export async function POST(request: NextRequest) {
  try {
    // Validate admin token
    if (!validateAdminToken(request)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.description || body.price === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const images = normalizeImageUrls(body.images);

    const product = await prisma.product.create({
      data: {
        name: body.name,
        description: body.description,
        price: body.price,
        category: body.category || "robes",
        gender: body.gender || null,
        collection: body.collection || null,
        subcategory: body.subcategory || null,
        featured: body.featured ?? false,
        bestSeller: body.bestSeller ?? false,
        onSale: body.onSale ?? false,
        discount: body.discount ?? null,
        sortOrder: body.sortOrder ?? 0,
        images,
        sizes: body.sizes || [],
        colors: body.colors || [],
        inStock: body.inStock ?? true,
      } as any,
    });

    return NextResponse.json(
      { ...product, images: normalizeImageUrls(product.images) },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/products error:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
