import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { prisma, withPrismaRetry } from "@/lib/prisma"

export const metadata = {
  title: "Lingerie - Sella Seduction",
  description: "Collection de lingerie fine et élégante pour sublimer votre féminité",
}

export default async function LingeriePage() {
  const products = await withPrismaRetry(() =>
    prisma.product.findMany({
      where: { category: "lingerie" },
      orderBy: { createdAt: "desc" }
    })
  )

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="relative overflow-hidden bg-[#120b06] py-16 md:py-24">
          <div className="editorial-grid absolute inset-0 opacity-[0.08]" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#FF9D00] to-transparent" />
          <div className="container relative mx-auto px-6">
            <h1 className="mb-4 text-center font-serif text-5xl font-bold tracking-wide text-[#fff8ed] md:text-7xl">Lingerie</h1>
            <p className="mx-auto max-w-2xl text-center text-base leading-relaxed tracking-wide text-[#f2d9ad] md:text-lg">
              Des ensembles raffinés qui célèbrent votre beauté naturelle
            </p>
          </div>
        </div>

        <div className="container mx-auto px-6 py-12 md:py-16">
          <div>
            <div className="mb-8 border-b border-border pb-4">
              <p className="text-muted-foreground">{products.length} produits disponibles</p>
            </div>

            {products.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                Aucun produit disponible dans cette catégorie
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
