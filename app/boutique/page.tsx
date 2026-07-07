import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { normalizeImageUrls } from "@/lib/image-utils"
import { prisma, withPrismaRetry } from "@/lib/prisma"
import type { Prisma } from "@prisma/client"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Boutique - Elegance Couture Prestige",
  description: "Découvrez notre collection complète de créations couture sur mesure",
}

type BoutiqueSearchParams = {
  category?: string
  collection?: string
  accessoire?: string
  selection?: string
}

interface BoutiquePageProps {
  searchParams?: Promise<BoutiqueSearchParams>
}

const formatFilterLabel = (value: string) =>
  value
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")

function getProductsWhere(params?: BoutiqueSearchParams) {
  const filters: Prisma.ProductWhereInput[] = []
  const category = params?.category?.trim()
  const collection = params?.collection?.trim()
  const accessoire = params?.accessoire?.trim()
  const selection = params?.selection?.trim()

  if (category && category !== "all") {
    if (["femme", "homme", "enfant"].includes(category)) {
      filters.push({
        OR: [
          { category },
          { gender: category },
        ],
      })
    } else if (category === "accessoires") {
      filters.push({
        OR: [
          { category: "accessoires" },
          { gender: "accessoire" },
        ],
      })
    } else {
      filters.push({ category })
    }
  }

  if (collection) {
    filters.push({
      OR: [
        { collection },
        { subcategory: collection },
      ],
    })
  }

  if (accessoire) {
    filters.push({
      OR: [
        { category: accessoire },
        { collection: accessoire },
        { subcategory: accessoire },
      ],
    })
  }

  if (selection === "pieces-phares") {
    filters.push({ featured: true })
  }

  if (selection === "best-sellers") {
    filters.push({ bestSeller: true })
  }

  if (selection === "promotions") {
    filters.push({
      OR: [
        { onSale: true },
        { discount: { gt: 0 } },
      ],
    })
  }

  return filters.length > 0 ? { AND: filters } : undefined
}

export default async function BoutiquePage({ searchParams }: BoutiquePageProps) {
  const params = await searchParams
  const selectedCategory = params?.category || "all"
  const selectedCollection = params?.collection?.trim() || ""
  const selectedAccessory = params?.accessoire?.trim() || ""
  const selectedSelection = params?.selection?.trim() || ""
  const where = getProductsWhere(params)
  const productsFromDb = await withPrismaRetry(() =>
    prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" }
    })
  )
  const products = productsFromDb.map((product) => ({
    ...product,
    images: normalizeImageUrls(product.images),
  }))
  const heroImages = products
    .map((product) => ({ src: product.images.find(Boolean), alt: product.name }))
    .filter((image): image is { src: string; alt: string } => Boolean(image.src))
    .slice(0, 3)

  const categories = [
    { label: "Tout", value: "all" },
    { label: "Femme", value: "femme" },
    { label: "Homme", value: "homme" },
    { label: "Enfant", value: "enfant" },
    { label: "Accessoires", value: "accessoires" },
  ]
  const activeCategoryLabel = categories.find((category) => category.value === selectedCategory)?.label
  const selectionLabels: Record<string, string> = {
    nouveautes: "Nouveautés",
    "pieces-phares": "Pièces phares",
    "best-sellers": "Best sellers",
    promotions: "Promotions",
  }
  const activeFilterLabels = [
    selectedCategory !== "all" ? activeCategoryLabel : "",
    selectedCollection ? formatFilterLabel(selectedCollection) : "",
    selectedAccessory ? formatFilterLabel(selectedAccessory) : "",
    selectedSelection ? selectionLabels[selectedSelection] || formatFilterLabel(selectedSelection) : "",
  ].filter((label): label is string => Boolean(label))

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">

        {/* ===== BOUTIQUE INTRO ===== */}
        <section className="border-b border-[#ead3aa] bg-[#fffaf2] dark:border-[#3b2717] dark:bg-[#140b05]">
          <div className="container mx-auto grid gap-8 px-4 py-8 sm:px-6 md:grid-cols-[minmax(0,1fr)_minmax(300px,440px)] md:items-center lg:py-10">
            <div className="max-w-2xl">
              <div className="mb-4 flex items-center gap-3">
                <div className="h-px w-8 bg-[#FF9D00]" />
                <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#B6771D] dark:text-[#FFCF71]">
                  Elegance Couture Prestige
                </span>
              </div>
              <h1 className="font-serif text-4xl font-bold leading-none text-[#241609] dark:text-[#fff8ed] sm:text-5xl md:text-6xl">
                Boutique
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-relaxed tracking-wide text-[#7B542F] dark:text-[#d7ba8c] md:text-base">
                Des créations d'exception, taillées avec l'héritage d'un savoir-faire inégalé.
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center border border-[#ead3aa] bg-white/70 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#7B542F] dark:border-[#3b2717] dark:bg-[#211207] dark:text-[#d7ba8c] sm:px-4 sm:text-[11px] sm:tracking-[0.18em]">
                  {products.length} création{products.length > 1 ? "s" : ""}
                </span>
                {selectedCategory !== "all" && activeCategoryLabel && (
                  <span className="inline-flex items-center border border-[#FF9D00]/35 bg-[#FF9D00]/10 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#B6771D] dark:text-[#FFCF71] sm:px-4 sm:text-[11px] sm:tracking-[0.18em]">
                    {activeCategoryLabel}
                  </span>
                )}
                {activeFilterLabels.slice(selectedCategory !== "all" ? 1 : 0).map((label) => (
                  <span key={label} className="inline-flex items-center border border-[#FF9D00]/35 bg-[#FF9D00]/10 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#B6771D] dark:text-[#FFCF71] sm:px-4 sm:text-[11px] sm:tracking-[0.18em]">
                    {label}
                  </span>
                ))}
              </div>
            </div>

            {heroImages.length > 0 && (
              <div className="grid h-[190px] grid-cols-3 grid-rows-2 gap-2 md:h-[230px]">
                {heroImages.map((image, index) => (
                  <div
                    key={`${image.src}-${index}`}
                    className={`overflow-hidden border border-[#ead3aa] bg-white dark:border-[#3b2717] dark:bg-[#211207] ${
                      index === 0 ? "col-span-2 row-span-2" : ""
                    }`}
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="h-full w-full object-cover object-top"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ===== CATEGORY QUICK FILTER ===== */}
        <section className="sticky top-16 z-30 border-b border-[#ead3aa] bg-[#fffaf2]/94 backdrop-blur-xl dark:border-[#3b2717] dark:bg-[#180f08]/94 sm:top-20 md:top-24 xl:top-36">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="flex items-center gap-2 overflow-x-auto py-3 scrollbar-hide">
              {categories.map((cat) => (
                <Link
                  key={cat.value}
                  href={cat.value === "all" ? "/boutique" : `/boutique?category=${cat.value}`}
                  className={`flex-shrink-0 whitespace-nowrap border px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.12em] transition-all duration-200 hover:border-[#FF9D00] hover:text-[#B6771D] dark:hover:text-[#FFCF71] sm:px-5 sm:text-[11px] sm:tracking-[0.18em] ${
                    selectedCategory === cat.value
                      ? "border-[#FF9D00] bg-[#FF9D00] text-[#180f08]"
                      : "border-[#ead3aa] bg-white/55 text-[#7B542F] dark:border-[#3b2717] dark:bg-[#211207]/60 dark:text-[#d7ba8c]"
                  }`}
                >
                  {cat.label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ===== CONTENT ===== */}
        <div className="container mx-auto px-4 py-8 md:px-6 md:py-10">
          <div>
            {/* Result bar */}
            <div className="mb-6 flex items-center border-b border-[#ead3aa] pb-4 dark:border-[#3b2717]">
              <div className="flex min-w-0 flex-wrap items-center gap-3">
                <div className="h-px w-8 bg-[#FF9D00]" />
                <p className="min-w-0 text-sm tracking-wide text-muted-foreground">
                  <span className="font-serif text-foreground font-semibold text-base">{products.length}</span>
                  {" "}création{products.length > 1 ? "s" : ""} disponible{products.length > 1 ? "s" : ""}
                  {selectedCategory !== "all" && (
                    <span className="ml-2 text-[#B6771D]">
                      · {activeCategoryLabel}
                    </span>
                  )}
                  {activeFilterLabels.slice(selectedCategory !== "all" ? 1 : 0).map((label) => (
                    <span key={label} className="ml-2 text-[#B6771D]">
                      · {label}
                    </span>
                  ))}
                </p>
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
                  className="inline-flex w-full max-w-[20rem] items-center justify-center gap-3 border border-[#FF9D00] px-6 py-3 text-center text-[10px] uppercase tracking-[0.14em] text-[#B6771D] transition-all duration-300 hover:bg-[#FF9D00] hover:text-[#180f08] dark:text-[#FFCF71] sm:w-auto sm:max-w-none sm:px-8 sm:text-[11px] sm:tracking-[0.2em]"
                >
                  Nous contacter
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
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
