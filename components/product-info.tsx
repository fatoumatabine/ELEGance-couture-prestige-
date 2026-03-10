"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Heart, ShoppingCart, Truck, Shield, RotateCcw, Star, Check } from "lucide-react"
import type { Product } from "@/lib/products"
import { useCartStore } from "@/lib/cart-store"
import { useToast } from "@/hooks/use-toast"

interface ProductInfoProps {
  product: Product
}

export function ProductInfo({ product }: ProductInfoProps) {
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || "")
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || "")
  const [quantity, setQuantity] = useState(1)

  const addItem = useCartStore((state) => state.addItem)
  const { toast } = useToast()

  const handleAddToCart = () => {
    addItem({
      product,
      quantity,
      selectedSize: product.sizes ? selectedSize : undefined,
      selectedColor: product.colors ? selectedColor : undefined,
    })

    toast({
      title: "✓ Ajouté au panier",
      description: `${product.name} a été ajouté à votre panier`,
    })
  }

  return (
    <div className="space-y-8">
      {/* Category & Title */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-semibold uppercase tracking-wider rounded-full">
            {product.category}
          </span>
          {product.inStock ? (
            <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
              <Check className="h-3 w-3" /> En stock
            </span>
          ) : (
            <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
              Rupture
            </span>
          )}
        </div>
        
        <h1 className="font-serif text-3xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
          {product.name}
        </h1>
        
        <div className="flex items-baseline gap-4">
          <span className="text-4xl font-bold text-amber-600">
            {product.price.toLocaleString()} CFA
          </span>
          <span className="text-gray-400 line-through text-lg">
            {(product.price * 1.2).toLocaleString()} CFA
          </span>
          <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded">
            -20%
          </span>
        </div>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-2">
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} className="h-5 w-5 fill-amber-400 text-amber-400" />
          ))}
        </div>
        <span className="text-sm text-gray-500">(12 avis clients)</span>
      </div>

      {/* Description */}
      <div className="border-t border-b py-6">
        <p className="text-gray-600 leading-relaxed text-lg">
          {product.description}
        </p>
      </div>

      {/* Size Selection */}
      {product.sizes && product.sizes.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-base font-bold">Taille</Label>
            <button className="text-sm text-amber-600 underline">Guide des tailles</button>
          </div>
          <RadioGroup value={selectedSize} onValueChange={setSelectedSize}>
            <div className="flex gap-3 flex-wrap">
              {product.sizes.map((size) => (
                <div key={size}>
                  <RadioGroupItem value={size} id={`size-${size}`} className="peer sr-only" />
                  <Label
                    htmlFor={`size-${size}`}
                    className="flex items-center justify-center w-14 h-14 border-2 border-gray-200 rounded-lg cursor-pointer transition-all hover:border-amber-400 peer-data-[state=checked]:border-amber-500 peer-data-[state=checked]:bg-amber-50 font-semibold"
                  >
                    {size}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>
      )}

      {/* Color Selection */}
      {product.colors && product.colors.length > 0 && (
        <div className="space-y-4">
          <Label className="text-base font-bold">Couleur: <span className="font-normal text-gray-600">{selectedColor}</span></Label>
          <RadioGroup value={selectedColor} onValueChange={setSelectedColor}>
            <div className="flex gap-3 flex-wrap">
              {product.colors.map((color) => (
                <div key={color}>
                  <RadioGroupItem value={color} id={`color-${color}`} className="peer sr-only" />
                  <Label
                    htmlFor={`color-${color}`}
                    className="flex items-center justify-center px-5 h-12 border-2 border-gray-200 rounded-lg cursor-pointer transition-all hover:border-amber-400 peer-data-[state=checked]:border-amber-500 peer-data-[state=checked]:bg-amber-50"
                  >
                    {color}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>
      )}

      {/* Quantity */}
      <div className="space-y-4">
        <Label className="text-base font-bold">Quantité</Label>
        <div className="flex items-center gap-4">
          <div className="flex items-center border-2 border-gray-200 rounded-lg">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-12 w-12 border-r border-gray-200 rounded-l-lg"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >
              -
            </Button>
            <span className="w-16 text-center font-bold text-lg">{quantity}</span>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-12 w-12 border-l border-gray-200 rounded-r-lg"
              onClick={() => setQuantity(quantity + 1)}
            >
              +
            </Button>
          </div>
          <span className="text-gray-500 text-sm">Disponible</span>
        </div>
      </div>

      {/* Action Buttons - Premium Style */}
      <div className="space-y-4">
        <div className="flex gap-3">
          <Button 
            size="lg" 
            className="flex-1 h-16 text-lg font-bold bg-gray-900 hover:bg-gray-800 rounded-xl"
            onClick={handleAddToCart}
            disabled={!product.inStock}
          >
            <ShoppingCart className="mr-3 h-6 w-6" />
            {product.inStock ? "Ajouter au panier" : "Rupture de stock"}
          </Button>
          <Button size="lg" variant="outline" className="h-16 w-16 rounded-xl border-2 hover:border-amber-500 hover:bg-amber-50">
            <Heart className="h-6 w-6" />
          </Button>
        </div>
        
        <Button 
          variant="link" 
          className="w-full text-gray-600 underline"
        >
          Acheter maintenant et payer plus tard
        </Button>
      </div>

      {/* Features - Premium Cards */}
      <div className="grid grid-cols-1 gap-3">
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
            <Truck className="h-6 w-6 text-amber-600" />
          </div>
          <div>
            <p className="font-bold text-gray-900">Livraison gratuite</p>
            <p className="text-sm text-gray-500">Livraison sous 48-72h à Dakar</p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
            <Shield className="h-6 w-6 text-amber-600" />
          </div>
          <div>
            <p className="font-bold text-gray-900">Paiement sécurisé</p>
            <p className="text-sm text-gray-500">100% sécurisé SSL</p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
            <RotateCcw className="h-6 w-6 text-amber-600" />
          </div>
          <div>
            <p className="font-bold text-gray-900">Retour gratuit</p>
            <p className="text-sm text-gray-500">Sous 7 jours</p>
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="border-t pt-6">
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-xl">
          <p className="text-sm text-gray-600 mb-3 text-center">
            Des questions ? Notre équipe est disponible
          </p>
          <div className="flex gap-2">
            <Button variant="outline" asChild className="flex-1 bg-white">
              <a href="tel:+221781128137">📞 Appeler</a>
            </Button>
            <Button variant="outline" asChild className="flex-1 bg-white">
              <a href="https://wa.me/221781128137">💬 WhatsApp</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
