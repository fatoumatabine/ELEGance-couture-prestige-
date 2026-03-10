import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { ProductFilters } from "@/components/product-filters"
import { prisma } from "@/lib/prisma"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Boutique - Elegance Couture Prestige",
  description: "Découvrez notre collection complète de créations couture sur mesure",
}

export default async function BoutiquePage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" }
  })

  const categories = [
    { label: "Tout", value: "all" },
    { label: "Robes", value: "robes" },
    { label: "Jupes", value: "jupes" },
    { label: "Pantalons", value: "pantalons" },
    { label: "Parfums", value: "parfums" },
    { label: "Accessoires", value: "accessoires" },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">

        {/* ===== HERO BANNER ===== */}
        <section className="relative bg-[#0d0d0d] py-20 md:py-28 overflow-hidden">
          {/* Diagonal pattern */}
          <div className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: "repeating-linear-gradient(45deg, #C9A96E 0, #C9A96E 1px, transparent 0, transparent 50%)",
              backgroundSize: "28px 28px",
            }}
          />
          {/* Side lines */}
          <div className="absolute left-10 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#C9A96E]/25 to-transparent hidden lg:block" />
          <div className="absolute right-10 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#C9A96E]/25 to-transparent hidden lg:block" />

          <div className="relative container mx-auto px-6 text-center">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-px w-10 bg-[#C9A96E]" />
              <span className="text-[10px] tracking-[0.45em] uppercase text-[#C9A96E] font-medium">
                Elegance Couture Prestige
              </span>
              <div className="h-px w-10 bg-[#C9A96E]" />
            </div>
            <h1 className="font-serif font-bold text-[#f5f0e8] leading-none mb-5">
              <span className="block text-5xl md:text-7xl tracking-tight">Notre</span>
              <span className="block text-5xl md:text-7xl tracking-tight text-[#C9A96E] italic font-normal">Boutique</span>
            </h1>
            <p className="text-[#9e9585] text-sm md:text-base max-w-md mx-auto tracking-wide leading-relaxed mt-4">
              Des créations d'exception, taillées avec l'héritage d'un savoir-faire inégalé
            </p>

            {/* Count pill */}
            <div className="inline-flex items-center gap-2 mt-8 px-5 py-2 border border-[#C9A96E]/30 text-[#C9A96E]">
              <span className="font-serif text-xl font-bold">{products.length}</span>
              <span className="text-[10px] tracking-[0.2em] uppercase">Créations disponibles</span>
            </div>
          </div>
        </section>

        {/* ===== CATEGORY QUICK FILTER ===== */}
        <section className="bg-background border-b border-border sticky top-[64px] md:top-[108px] z-30">
          <div className="container mx-auto px-6">
            <div className="flex items-center gap-0 overflow-x-auto scrollbar-hide">
              {categories.map((cat) => (
                <Link
                  key={cat.value}
                  href={cat.value === "all" ? "/boutique" : `/${cat.value}`}
                  className="flex-shrink-0 px-6 py-4 text-[11px] tracking-[0.2em] uppercase font-medium text-muted-foreground hover:text-[#C9A96E] border-b-2 border-transparent hover:border-[#C9A96E] transition-all duration-200 whitespace-nowrap"
                >
                  {cat.label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ===== CONTENT ===== */}
        <div className="container mx-auto px-6 py-12 md:py-16">
          <div className="flex gap-10">

            {/* Filters Sidebar */}
            <aside className="hidden lg:block w-56 flex-shrink-0">
              <div className="sticky top-40">
                <ProductFilters />
              </div>
            </aside>

            {/* Products */}
            <div className="flex-1 min-w-0">
              {/* Result bar */}
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-4 bg-[#C9A96E]" />
                  <p className="text-sm text-muted-foreground tracking-wide">
                    <span className="font-serif text-foreground font-semibold text-base">{products.length}</span>
                    {" "}création{products.length > 1 ? "s" : ""} disponible{products.length > 1 ? "s" : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
                  <span>Vue grille</span>
                </div>
              </div>

              {products.length === 0 ? (
                <div className="text-center py-32">
                  <div className="h-px w-12 bg-[#C9A96E] mx-auto mb-8" />
                  <p className="font-serif text-2xl text-foreground mb-3">Collection en préparation</p>
                  <p className="text-muted-foreground text-sm mb-8 tracking-wide">
                    Nos créateurs travaillent à de nouvelles pièces d'exception
                  </p>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-3 px-8 py-3 border border-[#C9A96E] text-[#C9A96E] text-[11px] tracking-[0.2em] uppercase hover:bg-[#C9A96E] hover:text-white transition-all duration-300"
                  >
                    Nous contacter
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
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
