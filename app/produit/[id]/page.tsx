import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductGallery } from "@/components/product-gallery"
import { ProductInfo } from "@/components/product-info"
import { ProductRecommendations } from "@/components/product-recommendations"
import { notFound } from "next/navigation"

interface ProductPageProps {
  params: Promise<{
    id: string
  }>
}

interface Product {
   id: number
   name: string
   description: string
   price: number
   category: "robes" | "jupes" | "pantalons" | "accessoires" | "autres"
   images: string[]
   sizes?: string[]
   colors?: string[]
   inStock: boolean
 }

export async function generateMetadata({ params }: ProductPageProps) {
  try {
    const { id } = await params
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/products/${id}`, {
      cache: 'no-store',
    })

    if (!response.ok) {
      return {
        title: "Produit non trouvé",
      }
    }

    const product: Product = await response.json()

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

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/products/${id}`, {
      cache: 'no-store',
    })

    if (!response.ok) {
      notFound()
    }

    const product: Product = await response.json()

    return (
      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1">
          <div className="container mx-auto px-4 py-8 md:py-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
              <ProductGallery images={product.images} productName={product.name} />
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
