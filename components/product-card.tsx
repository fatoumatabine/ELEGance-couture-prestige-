"use client"

import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { Heart, ShoppingBag, Eye } from "lucide-react"
import type { Product } from "@/lib/products"
import { useCartStore } from "@/lib/cart-store"
import { useToast } from "@/hooks/use-toast"

interface ProductCardProps {
  product: Product
}

const colorMap: Record<string, string> = {
  noir: "#1a1a1a",
  blanc: "#f5f0e8",
  rouge: "#dc2626",
  bleu: "#2563eb",
  vert: "#16a34a",
  jaune: "#eab308",
  rose: "#ec4899",
  violet: "#9333ea",
  marron: "#92400e",
  gris: "#6b7280",
  or: "#C9A96E",
  bordeaux: "#7f1d1d",
  nude: "#d4a98a",
  beige: "#e8d5b0",
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem)
  const { toast } = useToast()

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
      <div className="relative bg-background border border-border hover:border-[#C9A96E]/50 transition-all duration-400 overflow-hidden">

        {/* ── Image ── */}
        <div className="relative aspect-[3/4] overflow-hidden bg-muted">
          <Image
            src={product.images[0]?.replace("http://", "https://") || "/placeholder.svg"}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />

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
            className="absolute top-3 right-3 z-20 w-8 h-8 flex items-center justify-center bg-background/90 border border-border opacity-0 group-hover:opacity-100 transition-all duration-300 hover:border-[#C9A96E] hover:text-[#C9A96E]"
            aria-label="Ajouter aux favoris"
          >
            <Heart className="w-3.5 h-3.5" />
          </button>

          {/* Available badge */}
          {product.inStock && (
            <div className="absolute top-3 left-3 z-10 px-2 py-1 bg-[#C9A96E] text-white text-[9px] tracking-[0.2em] uppercase font-semibold">
              Disponible
            </div>
          )}

          {/* Slide-up action bar */}
          <div className="absolute inset-x-0 bottom-0 z-20 translate-y-full group-hover:translate-y-0 transition-transform duration-350">
            <div className="bg-[#0d0d0d]/90 backdrop-blur-sm border-t border-[#C9A96E]/20 flex">
              <button
                onClick={(e) => { e.preventDefault() }}
                className="flex-1 flex items-center justify-center gap-2 py-3 text-[10px] tracking-[0.2em] uppercase text-[#f5f0e8] hover:text-[#C9A96E] hover:bg-white/5 transition-colors border-r border-[#C9A96E]/20"
              >
                <Eye className="w-3.5 h-3.5" />
                Aperçu
              </button>
              <button
                onClick={handleQuickAdd}
                disabled={!product.inStock}
                className="flex-1 flex items-center justify-center gap-2 py-3 text-[10px] tracking-[0.2em] uppercase text-[#f5f0e8] hover:text-[#C9A96E] hover:bg-white/5 transition-colors disabled:opacity-40"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                Ajouter
              </button>
            </div>
          </div>
        </div>

        {/* ── Info ── */}
        <div className="p-5">
          {/* Category */}
          <p className="text-[9px] tracking-[0.35em] uppercase text-[#C9A96E] font-medium mb-2">
            {product.category}
          </p>

          {/* Name */}
          <h3 className="font-serif text-base font-semibold text-foreground group-hover:text-[#C9A96E] transition-colors duration-300 line-clamp-1 mb-3 tracking-wide">
            {product.name}
          </h3>

          {/* Price + Colors row */}
          <div className="flex items-center justify-between">
            <p className="text-foreground font-semibold text-sm tracking-wide">
              {product.price.toLocaleString()}
              <span className="text-[10px] text-muted-foreground ml-1 font-normal">CFA</span>
            </p>

            {/* Color dots */}
            {product.colors && product.colors.length > 0 && (
              <div className="flex gap-1">
                {product.colors.slice(0, 4).map((color, i) => (
                  <div
                    key={i}
                    className="w-3.5 h-3.5 rounded-full border border-border hover:scale-110 transition-transform cursor-pointer"
                    title={color}
                    style={{
                      backgroundColor: colorMap[color.toLowerCase()] ?? "#e5e7eb",
                    }}
                  />
                ))}
                {product.colors.length > 4 && (
                  <div className="w-3.5 h-3.5 rounded-full bg-muted border border-border flex items-center justify-center">
                    <span className="text-[7px] text-muted-foreground font-medium">+{product.colors.length - 4}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Gold bottom line on hover */}
          <div className="mt-4 h-px w-0 group-hover:w-full bg-[#C9A96E] transition-all duration-500" />
        </div>
      </div>
    </Link>
  )
}
