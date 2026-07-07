"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ToastAction } from "@/components/ui/toast"
import { Check, Heart, ShoppingCart, Star } from "lucide-react"
import type { Product } from "@/lib/products"
import { getProductOptionLabels } from "@/lib/products"
import { useCartStore } from "@/lib/cart-store"
import { useToast } from "@/hooks/use-toast"

interface ProductInfoProps {
  product: Product
}

export function ProductInfo({ product }: ProductInfoProps) {
  const availableSizes = product.sizes?.filter((size) => size.trim().length > 0) ?? []
  const availableColors = product.colors?.filter((color) => color.trim().length > 0) ?? []
  const rating = typeof product.rating === "number" ? product.rating : 0
  const reviewCount = typeof product.reviewCount === "number" ? product.reviewCount : 0
  const showReviews = rating > 0 && reviewCount > 0
  const optionLabels = getProductOptionLabels(product)

  const [selectedSize, setSelectedSize] = useState(availableSizes[0] || "")
  const [selectedColor, setSelectedColor] = useState(availableColors[0] || "")
  const [quantity, setQuantity] = useState(1)

  const addItem = useCartStore((state) => state.addItem)
  const { toast } = useToast()

  const handleAddToCart = () => {
    addItem({
      product,
      quantity,
      selectedSize: availableSizes.length > 0 ? selectedSize : undefined,
      selectedColor: availableColors.length > 0 ? selectedColor : undefined,
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

  return (
    <div className="max-w-[620px] space-y-6">
      <div>
        <div className="mb-3 flex items-center gap-2">
          <span className="rounded-full bg-[#fff1d4] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-[#B6771D]">
            {product.category}
          </span>
          {product.inStock ? (
            <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-semibold text-emerald-700">
              <Check className="h-3 w-3" /> En stock
            </span>
          ) : (
            <span className="rounded-full bg-rose-100 px-3 py-1 text-[11px] font-semibold text-rose-700">
              Rupture
            </span>
          )}
        </div>

        <h1 className="mb-3 font-serif text-3xl font-bold leading-tight text-[#111827] md:text-4xl">
          {product.name}
        </h1>

        <div className="flex flex-wrap items-center gap-3">
          <span className="text-2xl font-bold text-[#d97706] md:text-3xl">
            {product.price.toLocaleString()} CFA
            {optionLabels.priceSuffix && (
              <span className="ml-1 text-base font-semibold text-[#B6771D]">{optionLabels.priceSuffix}</span>
            )}
          </span>
          <span className="text-base text-slate-400 line-through">
            {Math.round(product.price * 1.2).toLocaleString()} CFA
          </span>
          <span className="rounded bg-rose-500 px-2 py-1 text-[11px] font-bold text-white">
            -20%
          </span>
        </div>
      </div>

      {showReviews && (
        <div className="flex items-center gap-2">
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-4 w-4 ${
                  star <= Math.round(rating)
                    ? "fill-[#FF9D00] text-[#FF9D00]"
                    : "text-slate-300"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-slate-500">({reviewCount} avis clients)</span>
        </div>
      )}

      <div className="border-y border-[#ead3aa] py-5">
        <p className="text-base leading-relaxed text-slate-700">
          {product.description}
        </p>
      </div>

      {availableSizes.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-bold text-[#180f08]">{optionLabels.optionLabel}</Label>
            {optionLabels.showSizeGuide && (
              <button className="text-xs text-[#d97706] underline">Guide des tailles</button>
            )}
          </div>
          <RadioGroup value={selectedSize} onValueChange={setSelectedSize}>
            <div className="flex flex-wrap gap-3">
              {availableSizes.map((size) => (
                <div key={size}>
                  <RadioGroupItem value={size} id={`size-${size}`} className="peer sr-only" />
                  <Label
                    htmlFor={`size-${size}`}
                    className="flex h-12 min-w-14 cursor-pointer items-center justify-center rounded-[6px] border-2 border-slate-200 px-4 text-sm font-semibold transition-all hover:border-[#FF9D00] peer-data-[state=checked]:border-[#FF9D00] peer-data-[state=checked]:bg-[#fff6e6]"
                  >
                    {size}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>
      )}

      {availableColors.length > 0 && (
        <div className="space-y-3">
          <Label className="text-sm font-bold text-[#180f08]">
            Couleur:
            <span className="ml-2 font-normal text-slate-600">{selectedColor}</span>
          </Label>
          <RadioGroup value={selectedColor} onValueChange={setSelectedColor}>
            <div className="flex flex-wrap gap-3">
              {availableColors.map((color) => (
                <div key={color}>
                  <RadioGroupItem value={color} id={`color-${color}`} className="peer sr-only" />
                  <Label
                    htmlFor={`color-${color}`}
                    className="flex h-11 cursor-pointer items-center justify-center rounded-[6px] border-2 border-slate-200 px-4 text-sm font-semibold transition-all hover:border-[#FF9D00] peer-data-[state=checked]:border-[#FF9D00] peer-data-[state=checked]:bg-[#fff6e6]"
                  >
                    {color}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>
      )}

      <div className="rounded-[8px] border border-[#f0d2a0] bg-white/65 p-4 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-3">
            <Label className="text-sm font-bold text-[#180f08]">{optionLabels.quantityLabel}</Label>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex h-11 items-center overflow-hidden rounded-[6px] border border-[#ead3aa] bg-white">
                <button
                  type="button"
                  className="h-full w-11 text-lg transition-colors hover:bg-[#fff6e6]"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </button>
                <span className="flex h-full w-14 items-center justify-center border-x border-[#ead3aa] font-semibold">
                  {quantity}
                </span>
                <button
                  type="button"
                  className="h-full w-11 text-lg transition-colors hover:bg-[#fff6e6]"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </button>
              </div>
              <span className={product.inStock ? "rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700" : "rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700"}>
                {product.inStock ? "Disponible" : "Indisponible"}
              </span>
            </div>
          </div>

          <div className="flex w-full gap-3 sm:w-auto">
            <Button
              className="h-12 flex-1 rounded-[6px] bg-[#FF9D00] px-6 text-sm font-bold text-[#180f08] shadow-[0_14px_30px_rgba(255,157,0,0.22)] hover:bg-[#e88e00] sm:min-w-[240px]"
              onClick={handleAddToCart}
              disabled={!product.inStock}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              {product.inStock ? "Ajouter au panier" : "Rupture de stock"}
            </Button>
            <Button variant="outline" className="h-12 w-12 rounded-[6px] border-2 border-[#f0c987] bg-white text-[#B6771D] hover:border-[#FF9D00] hover:bg-[#fff6e6] hover:text-[#180f08]">
              <Heart className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
