import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BackButton } from "@/components/back-button"
import { ProductGallery } from "@/components/product-gallery"
import { ProductInfo } from "@/components/product-info"
import { ProductRecommendations } from "@/components/product-recommendations"
import { normalizeImageUrls } from "@/lib/image-utils"
import { prisma, withPrismaRetry } from "@/lib/prisma"
import type { Product } from "@/lib/products"
import { notFound } from "next/navigation"

interface ProductPageProps {
  params: Promise<{
    id: string
  }>
}

async function getProduct(id: string): Promise<Product | null> {
  const productId = Number(id)

  if (!Number.isInteger(productId)) {
    return null
  }

  const product = await withPrismaRetry(() =>
    prisma.product.findUnique({
      where: { id: productId },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        category: true,
        gender: true,
        collection: true,
        subcategory: true,
        images: true,
        sizes: true,
        colors: true,
        inStock: true,
      },
    })
  )

  if (!product) {
    return null
  }

  return {
    ...product,
    images: normalizeImageUrls(product.images),
    sizes: product.sizes.filter((size) => size.trim().length > 0),
    colors: product.colors.filter((color) => color.trim().length > 0),
  }
}

export async function generateMetadata({ params }: ProductPageProps) {
  try {
    const { id } = await params
    const product = await getProduct(id)

    if (!product) {
      return {
        title: "Produit non trouvé",
      }
    }

    return {
      title: `${product.name} - Elegance Couture`,
      description: product.description,
    }
  } catch (error) {
    return {
      title: "Produit non trouvé",
    }
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  try {
    const { id } = await params
    const product = await getProduct(id)

    if (!product) {
      notFound()
    }

    return (
      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 bg-[#fffaf2]">
          <div className="container mx-auto px-4 py-6 sm:py-8 md:py-12">
            <div className="mb-12 grid grid-cols-1 gap-8 lg:mb-16 lg:grid-cols-[minmax(320px,0.85fr)_1fr] lg:gap-12">
              <div className="relative w-full max-w-[520px] justify-self-center lg:justify-self-start">
                <BackButton
                  className="absolute left-3 top-3 z-20 bg-white/95 shadow-sm backdrop-blur-sm dark:bg-[#211207]/95"
                  fallbackHref="/boutique"
                  showLabel={false}
                />
                <ProductGallery images={product.images} productName={product.name} />
              </div>
              <ProductInfo product={product} />
            </div>

            <ProductRecommendations currentProductId={product.id} category={product.category} />
          </div>
        </main>

        <Footer />
      </div>
    )
  } catch (error) {
    console.error("Error loading product:", error)
    notFound()
  }
}
