import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { ProductFilters } from "@/components/product-filters"
import { normalizeImageUrls } from "@/lib/image-utils"
import { prisma } from "@/lib/prisma"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Boutique - Elegance Couture Prestige",
  description: "Découvrez notre collection complète de créations couture sur mesure",
}

interface BoutiquePageProps {
  searchParams?: Promise<{
    category?: string
  }>
}

export default async function BoutiquePage({ searchParams }: BoutiquePageProps) {
  const params = await searchParams
  const selectedCategory = params?.category || "all"
  const productsFromDb = await prisma.product.findMany({
    where: selectedCategory !== "all" ? { category: selectedCategory } : undefined,
    orderBy: { createdAt: "desc" }
  })
  const products = productsFromDb.map((product) => ({
    ...product,
    images: normalizeImageUrls(product.images),
  }))

  const categories = [
    { label: "Tout", value: "all" },
    { label: "Femme", value: "femme" },
    { label: "Homme", value: "homme" },
    { label: "Enfant", value: "enfant" },
    { label: "Accessoires", value: "accessoires" },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">

        {/* ===== HERO BANNER ===== */}
        <section className="relative overflow-hidden bg-[#120b06] py-20 md:py-28">
          {/* Diagonal pattern */}
          <div className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage: "repeating-linear-gradient(45deg, #FF9D00 0, #FF9D00 1px, transparent 0, transparent 50%)",
              backgroundSize: "28px 28px",
            }}
          />
          {/* Side lines */}
          <div className="absolute left-10 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#FF9D00]/25 to-transparent hidden lg:block" />
          <div className="absolute right-10 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#FF9D00]/25 to-transparent hidden lg:block" />

          <div className="editorial-grid absolute inset-0 opacity-[0.08]" />

          <div className="relative container mx-auto px-6 text-center">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-px w-10 bg-gradient-to-r from-transparent to-[#FF9D00]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.45em] text-[#FFCF71]">
                Elegance Couture Prestige
              </span>
              <div className="h-px w-10 bg-gradient-to-l from-transparent to-[#FF9D00]" />
            </div>
            <h1 className="font-serif font-bold text-[#fff8ed] leading-none mb-5">
              <span className="block text-5xl md:text-7xl tracking-tight">Notre</span>
              <span className="brand-text-gradient block text-5xl md:text-7xl tracking-tight italic font-normal">Boutique</span>
            </h1>
            <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed tracking-wide text-[#f2d9ad] md:text-base">
              Des créations d'exception, taillées avec l'héritage d'un savoir-faire inégalé
            </p>

            {/* Count pill */}
            <div className="mt-8 inline-flex items-center gap-2 border border-[#FF9D00]/35 bg-[#FF9D00]/10 px-5 py-2 text-[#FFCF71] backdrop-blur-md">
              <span className="font-serif text-xl font-bold">{products.length}</span>
              <span className="text-[10px] tracking-[0.2em] uppercase">Créations disponibles</span>
            </div>
          </div>
        </section>

        {/* ===== CATEGORY QUICK FILTER ===== */}
        <section className="sticky top-[64px] z-30 border-b border-[#ead3aa] bg-[#fffaf2]/92 backdrop-blur-xl dark:border-[#3b2717] dark:bg-[#180f08]/92 md:top-[108px]">
          <div className="container mx-auto px-6">
            <div className="flex items-center gap-0 overflow-x-auto scrollbar-hide">
              {categories.map((cat) => (
                <Link
                  key={cat.value}
                  href={cat.value === "all" ? "/boutique" : `/boutique?category=${cat.value}`}
                  className={`flex-shrink-0 whitespace-nowrap border-b-2 px-6 py-4 text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-200 hover:border-[#FF9D00] hover:text-[#B6771D] dark:hover:text-[#FFCF71] ${
                    selectedCategory === cat.value
                      ? "border-[#FF9D00] text-[#B6771D]"
                      : "border-transparent text-muted-foreground"
                  }`}
                >
                  {cat.label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ===== CONTENT ===== */}
        <div className="container mx-auto px-4 py-10 md:px-6 md:py-14">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[210px_minmax(0,1fr)] xl:grid-cols-[220px_minmax(0,1fr)]">

            {/* Filters Sidebar */}
            <aside className="hidden lg:block">
              <div className="sticky top-40">
                <ProductFilters />
              </div>
            </aside>

            <div className="lg:hidden">
              <ProductFilters />
            </div>

            {/* Products */}
            <div className="flex-1 min-w-0">
              {/* Result bar */}
              <div className="mb-6 flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-5 w-1 bg-gradient-to-b from-[#FF9D00] to-[#FFCF71]" />
                  <p className="text-sm text-muted-foreground tracking-wide">
                    <span className="font-serif text-foreground font-semibold text-base">{products.length}</span>
                    {" "}création{products.length > 1 ? "s" : ""} disponible{products.length > 1 ? "s" : ""}
                    {selectedCategory !== "all" && (
                      <span className="ml-2 text-[#B6771D]">
                        · {categories.find((category) => category.value === selectedCategory)?.label}
                      </span>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B6771D]">
                  <span>4 images par ligne</span>
                </div>
              </div>

              {products.length === 0 ? (
                <div className="text-center py-32">
                  <div className="h-px w-12 bg-[#FF9D00] mx-auto mb-8" />
                  <p className="font-serif text-2xl text-foreground mb-3">Collection en préparation</p>
                  <p className="text-muted-foreground text-sm mb-8 tracking-wide">
                    Nos créateurs travaillent à de nouvelles pièces d'exception
                  </p>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-3 border border-[#FF9D00] px-8 py-3 text-[11px] uppercase tracking-[0.2em] text-[#B6771D] transition-all duration-300 hover:bg-[#FF9D00] hover:text-[#180f08] dark:text-[#FFCF71]"
                  >
                    Nous contacter
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
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
