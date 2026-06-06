"use client"

import type React from "react"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useCartStore } from "@/lib/cart-store"
import { Minus, Plus, X, ShoppingBag, ArrowRight, CheckCircle, Loader2, MapPin, Phone } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface CustomerLocation {
  latitude: number
  longitude: number
  accuracy?: number
  mapUrl: string
}

export default function PanierPage() {
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCartStore()
  const router = useRouter()
  const { toast } = useToast()

  const [telephone, setTelephone] = useState("")
  const [location, setLocation] = useState<CustomerLocation | null>(null)
  const [locationError, setLocationError] = useState("")
  const [isLocating, setIsLocating] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const total = getTotalPrice()
  const fraisLivraison = total > 0 ? 2000 : 0
  const totalFinal = total + fraisLivraison

  const handleLocate = () => {
    if (!navigator.geolocation) {
      setLocationError("La localisation n'est pas disponible sur ce navigateur.")
      return
    }

    setIsLocating(true)
    setLocationError("")

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = Number(position.coords.latitude.toFixed(6))
        const longitude = Number(position.coords.longitude.toFixed(6))

        setLocation({
          latitude,
          longitude,
          accuracy: position.coords.accuracy,
          mapUrl: `https://www.google.com/maps?q=${latitude},${longitude}`,
        })
        setIsLocating(false)
      },
      (error) => {
        const message = error.code === error.PERMISSION_DENIED
          ? "Autorisez la localisation pour envoyer votre position de livraison."
          : "Impossible de récupérer votre localisation. Réessayez dans un instant."

        setLocationError(message)
        setIsLocating(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 60000,
      }
    )
  }

  const handleQuickOrder = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!telephone.trim()) {
      toast({
        title: "Numéro requis",
        description: "Ajoutez votre numéro de téléphone pour confirmer la commande.",
        variant: "destructive",
      })
      return
    }

    if (!location) {
      toast({
        title: "Localisation requise",
        description: "Cliquez sur “Partager ma localisation” avant de confirmer.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const customer = {
        telephone: telephone.trim(),
        nom: "",
        prenom: "Client",
        email: "",
        adresse: location.mapUrl,
        ville: "Localisation GPS",
        quartier: "",
        instructions: `Latitude: ${location.latitude}, Longitude: ${location.longitude}${location.accuracy ? `, précision: ${Math.round(location.accuracy)} m` : ""}`,
        location,
      }

      const itemsList = items
        .map((item) => {
          const options = [item.selectedSize, item.selectedColor].filter(Boolean).join(" / ")
          const optionText = options ? ` (${options})` : ""
          return `• ${item.product.name}${optionText} x${item.quantity}: ${(item.product.price * item.quantity).toLocaleString()} CFA`
        })
        .join("\n")

      const message =
        `🛍️ COMMANDE - ELEGANCE COUTURE PRESTIGE\n\n` +
        `Produits:\n${itemsList}\n\n` +
        `Total: ${totalFinal.toLocaleString()} CFA\n\n` +
        `Téléphone client: ${customer.telephone}\n` +
        `Localisation livraison: ${location.mapUrl}\n` +
        `Paiement: à la livraison`
      const whatsappUrl = `https://wa.me/221778137032?text=${encodeURIComponent(message)}`
      window.open(whatsappUrl, "_blank")

      const orderPayload = {
        customer,
        items,
        total,
        fraisLivraison,
        totalFinal,
        paiement: "cash",
      }

      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      }).catch((error) => console.error("Order save error:", error))

      await fetch("/api/commande", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      }).catch((error) => console.error("Order notification error:", error))

      clearCart()
      toast({
        title: "Commande envoyée!",
        description: "Nous vous contacterons bientôt.",
      })

      router.push("/commande-confirmee")
    } catch (error) {
      console.error("Quick order error:", error)
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite. Veuillez réessayer.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

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
                        {item.product.images[0] ? (
                          <img
                            src={item.product.images[0].replace("http://", "https://")}
                            alt={item.product.name}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center px-2 text-center text-[9px] uppercase tracking-wide text-muted-foreground">Image admin requise</div>
                        )}
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

                  <form onSubmit={handleQuickOrder} className="space-y-4">
                    <div className="rounded-[8px] border border-[#f0d2a0] bg-[#fffaf2] p-4">
                      <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-[#B6771D]">
                        Commande rapide
                      </p>
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <Label htmlFor="quick-phone" className="flex items-center gap-2 text-xs font-semibold">
                            <Phone className="h-3.5 w-3.5 text-[#FF9D00]" />
                            Téléphone
                          </Label>
                          <Input
                            id="quick-phone"
                            type="tel"
                            value={telephone}
                            onChange={(e) => setTelephone(e.target.value)}
                            required
                            placeholder="+221 77 123 45 67"
                            className="h-10 bg-white"
                          />
                        </div>

                        <Button
                          type="button"
                          onClick={handleLocate}
                          disabled={isLocating}
                          variant="outline"
                          className="h-10 w-full border-[#f0c987] bg-white text-[#7B542F] hover:border-[#FF9D00] hover:bg-[#fff6e6]"
                        >
                          {isLocating ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
                          {location ? "Modifier ma localisation" : "Partager ma localisation"}
                        </Button>

                        {location && (
                          <a
                            href={location.mapUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-700 underline-offset-4 hover:underline"
                          >
                            <CheckCircle className="h-3.5 w-3.5" />
                            Localisation ajoutée
                          </a>
                        )}

                        {locationError && (
                          <p className="text-xs font-medium text-rose-700">{locationError}</p>
                        )}
                      </div>
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-[#FF9D00] font-bold text-[#180f08] hover:bg-[#e88e00]"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Envoi en cours..." : "Confirmer maintenant"}
                      {isSubmitting ? <Loader2 className="ml-2 h-5 w-5 animate-spin" /> : <ArrowRight className="ml-2 h-5 w-5" />}
                    </Button>
                  </form>

                  <div className="my-4 flex items-center gap-3">
                    <Separator className="flex-1" />
                    <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">ou</span>
                    <Separator className="flex-1" />
                  </div>

                  <Button asChild variant="outline" size="lg" className="w-full bg-transparent mb-3">
                    <Link href="/commander">Finalisation détaillée</Link>
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
