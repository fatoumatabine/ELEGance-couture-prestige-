"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useCartStore } from "@/lib/cart-store"
import { Minus, Plus, X, ShoppingBag, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function PanierPage() {
  const { items, removeItem, updateQuantity, getTotalPrice } = useCartStore()

  const total = getTotalPrice()
  const fraisLivraison = total > 0 ? 2000 : 0
  const totalFinal = total + fraisLivraison

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="text-center max-w-md">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            </div>
            <h1 className="font-serif text-3xl font-bold mb-4">Votre panier est vide</h1>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Découvrez notre collection et ajoutez des produits à votre panier
            </p>
            <Button asChild size="lg">
              <Link href="/boutique">
                Découvrir la boutique
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </main>

        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="bg-muted/30 py-12 md:py-16">
          <div className="container mx-auto px-4">
            <h1 className="font-serif text-4xl md:text-6xl font-bold text-center">Mon Panier</h1>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item, index) => (
                <Card key={`${item.product.id}-${index}`}>
                  <CardContent className="p-4 md:p-6">
                    <div className="flex gap-4">
                      <div className="relative w-24 h-24 md:w-32 md:h-32 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.product.images[0] || "/placeholder.svg"}
                          alt={item.product.name}
                          className="object-cover w-full h-full"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between gap-4 mb-2">
                          <div>
                            <Link
                              href={`/produit/${item.product.id}`}
                              className="font-semibold text-lg hover:text-accent transition-colors"
                            >
                              {item.product.name}
                            </Link>
                            <p className="text-sm text-muted-foreground capitalize">{item.product.category}</p>
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => removeItem(item.product.id)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>

                        {(item.selectedSize || item.selectedColor) && (
                          <div className="flex gap-4 text-sm mb-3">
                            {item.selectedSize && (
                              <span className="text-muted-foreground">
                                Taille: <span className="font-medium text-foreground">{item.selectedSize}</span>
                              </span>
                            )}
                            {item.selectedColor && (
                              <span className="text-muted-foreground">
                                Couleur: <span className="font-medium text-foreground">{item.selectedColor}</span>
                              </span>
                            )}
                          </div>
                        )}

                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 bg-transparent"
                              onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 bg-transparent"
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>

                          <p className="font-bold text-lg">
                            {(item.product.price * item.quantity).toLocaleString()} FCFA
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  <h2 className="font-serif text-2xl font-bold mb-6">Résumé</h2>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Sous-total</span>
                      <span className="font-medium">{total.toLocaleString()} FCFA</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Livraison</span>
                      <span className="font-medium">{fraisLivraison.toLocaleString()} FCFA</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="font-semibold text-lg">Total</span>
                      <span className="font-bold text-2xl">{totalFinal.toLocaleString()} FCFA</span>
                    </div>
                  </div>

                  <Button asChild size="lg" className="w-full mb-3">
                    <Link href="/commander">
                      Passer la commande
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>

                  <Button asChild variant="outline" size="lg" className="w-full bg-transparent">
                    <Link href="/boutique">Continuer mes achats</Link>
                  </Button>

                  <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Livraison gratuite à partir de 50,000 FCFA</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
