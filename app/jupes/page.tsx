import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { ProductFilters } from "@/components/product-filters"
import { prisma } from "@/lib/prisma"

export const metadata = {
  title: "Jupes - Elegance Couture",
  description: "Collection de jupes tendance et sur mesure",
}

export default async function JupesPage() {
  const products = await prisma.product.findMany({
    where: { category: "jupes" },
    orderBy: { createdAt: "desc" }
  })

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="bg-muted/30 py-12 md:py-16">
          <div className="container mx-auto px-4">
            <h1 className="font-serif text-4xl md:text-6xl font-bold text-center mb-4">Jupes</h1>
            <p className="text-center text-muted-foreground text-lg max-w-2xl mx-auto">
              Découvrez notre collection de jupes chic et élégantes 👚
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="flex gap-8">
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-24">
                <ProductFilters />
              </div>
            </aside>

            <div className="flex-1">
              <div className="mb-6">
                <p className="text-muted-foreground">{products.length} création(s) disponible(s)</p>
              </div>

              {products.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  Aucune création disponible dans cette catégorie
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
