import { ProductCard } from "@/components/product-card"
import { prisma } from "@/lib/prisma"

interface ProductRecommendationsProps {
  currentProductId: number
  category: string
}

export async function ProductRecommendations({ currentProductId, category }: ProductRecommendationsProps) {
  const recommendations = await prisma.product.findMany({
    where: {
      category: category,
      id: { not: currentProductId }
    },
    take: 4,
    orderBy: { createdAt: "desc" }
  })

  if (recommendations.length === 0) {
    return null
  }

  return (
    <section>
      <div className="mb-8">
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-center">Vous aimerez aussi</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {recommendations.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
