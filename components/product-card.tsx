"use client"

import type React from "react"
import Link from "next/link"
import { Heart, ShoppingBag, Eye } from "lucide-react"
import { normalizeImageUrl } from "@/lib/image-utils"
import { ToastAction } from "@/components/ui/toast"
import type { Product } from "@/lib/products"
import { useCartStore } from "@/lib/cart-store"
import { useToast } from "@/hooks/use-toast"

interface ProductCardProps {
  product: Product
}

const colorMap: Record<string, string> = {
  noir: "#1a1a1a",
  blanc: "#fff8ed",
  rouge: "#dc2626",
  bleu: "#2563eb",
  vert: "#16a34a",
  jaune: "#eab308",
  rose: "#ec4899",
  violet: "#9333ea",
  marron: "#92400e",
  gris: "#6b7280",
  or: "#FF9D00",
  bordeaux: "#7f1d1d",
  nude: "#d4a98a",
  beige: "#FFCF71",
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem)
  const { toast } = useToast()
  const productImage = normalizeImageUrl(product.images?.[0])

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    addItem({
      product,
      quantity: 1,
      selectedSize: product.sizes?.[0],
      selectedColor: product.colors?.[0],
    })
    toast({
      title: "Ajouté au panier",
      description: `${product.name} a été ajouté à votre panier`,
      action: (
        <ToastAction altText="Voir le panier" className="border-[#FF9D00] bg-[#FF9D00] text-[#180f08] hover:bg-[#FFCF71]" asChild>
          <Link href="/panier">Voir panier</Link>
        </ToastAction>
      ),
    })
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    toast({
      title: "Ajouté aux favoris",
      description: `${product.name} a été ajouté à vos favoris`,
    })
  }

  return (
    <Link href={`/produit/${product.id}`} className="group block">
      <div className="relative overflow-hidden rounded-[8px] border border-[#ead3aa] bg-card shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#FF9D00]/70 hover:shadow-[0_18px_44px_rgba(123,84,47,0.14)] dark:border-[#3b2717]">
        {/* ── Image ── */}
        <div className="relative aspect-[4/5] overflow-hidden bg-muted">
          {productImage ? (
            <img
              src={productImage}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted px-6 text-center text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Image admin requise
            </div>
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#180f08]/18 via-transparent to-transparent opacity-80" />

          {/* Out of stock overlay */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-background/85 flex items-center justify-center z-10">
              <span className="text-[11px] tracking-[0.3em] uppercase font-semibold text-muted-foreground">
                Épuisé
              </span>
            </div>
          )}

          {/* Wishlist button */}
          <button
            onClick={handleWishlist}
            className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-[6px] border border-white/45 bg-[#fff8ed]/92 text-[#7B542F] shadow-sm backdrop-blur-md transition-all duration-300 hover:border-[#FF9D00] hover:text-[#FF9D00] dark:bg-[#180f08]/85 dark:text-[#fff8ed]"
            aria-label="Ajouter aux favoris"
          >
            <Heart className="w-3.5 h-3.5" />
          </button>

          {/* Available badge */}
          {product.inStock && (
            <div className="absolute left-3 top-3 z-10 rounded-[6px] bg-[#FF9D00] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.18em] text-[#180f08] shadow-sm">
              Disponible
            </div>
          )}

          {/* Slide-up action bar */}
          <div className="absolute inset-x-3 bottom-3 z-20 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <div className="flex overflow-hidden rounded-[6px] border border-white/15 bg-[#120b06]/90 backdrop-blur-md">
              <button
                onClick={(e) => { e.preventDefault() }}
                className="flex flex-1 items-center justify-center gap-2 border-r border-[#FF9D00]/20 py-2.5 text-[9px] uppercase tracking-[0.18em] text-[#fff8ed] transition-colors hover:bg-[#FF9D00]/10 hover:text-[#FFCF71]"
              >
                <Eye className="w-3.5 h-3.5" />
                Aperçu
              </button>
              <button
                onClick={handleQuickAdd}
                disabled={!product.inStock}
                className="flex flex-1 items-center justify-center gap-2 py-2.5 text-[9px] uppercase tracking-[0.18em] text-[#fff8ed] transition-colors hover:bg-[#FF9D00]/10 hover:text-[#FFCF71] disabled:opacity-40"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                Ajouter
              </button>
            </div>
          </div>
        </div>

        {/* ── Info ── */}
        <div className="bg-card p-4">
          {/* Category */}
          <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.24em] text-[#B6771D] dark:text-[#FFCF71]">
            {product.category}
          </p>

          {/* Name */}
          <h3 className="mb-3 line-clamp-2 min-h-[2.5rem] font-serif text-base font-semibold leading-tight tracking-wide text-foreground transition-colors duration-300 group-hover:text-[#B6771D] dark:group-hover:text-[#FFCF71]">
            {product.name}
          </h3>

          {/* Price + Colors row */}
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold tracking-wide text-foreground">
              {product.price.toLocaleString()}
              <span className="text-[10px] text-muted-foreground ml-1 font-normal">CFA</span>
            </p>

            {/* Color dots */}
            {product.colors && product.colors.length > 0 && (
              <div className="flex gap-1">
                {product.colors.slice(0, 4).map((color, i) => (
                  <div
                    key={i}
                    className="h-3 w-3 cursor-pointer rounded-full border border-[#ead3aa] shadow-sm transition-transform hover:scale-110 dark:border-[#3b2717]"
                    title={color}
                    style={{
                      backgroundColor: colorMap[color.toLowerCase()] ?? "#e5e7eb",
                    }}
                  />
                ))}
                {product.colors.length > 4 && (
                  <div className="flex h-3 w-3 items-center justify-center rounded-full border border-border bg-muted">
                    <span className="text-[7px] text-muted-foreground font-medium">+{product.colors.length - 4}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Gold bottom line on hover */}
          <div className="mt-3 h-px w-full bg-[#ead3aa] transition-colors duration-300 group-hover:bg-[#FF9D00]" />
        </div>
      </div>
    </Link>
  )
}
