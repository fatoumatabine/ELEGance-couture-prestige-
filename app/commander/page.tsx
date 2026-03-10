"use client"

import type React from "react"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { useCartStore } from "@/lib/cart-store"
import { useRouter } from "next/navigation"
import { Package, CreditCard, MapPin } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function CommanderPage() {
  const { items, getTotalPrice, clearCart } = useCartStore()
  const router = useRouter()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    telephone: "",
    email: "",
    adresse: "",
    ville: "Dakar",
    quartier: "",
    instructions: "",
    paiement: "cash",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const total = getTotalPrice()
  const fraisLivraison = 2000
  const totalFinal = total + fraisLivraison

  if (items.length === 0) {
    router.push("/panier")
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simple WhatsApp message - only price and contact
      const itemsList = items
        .map((item) => {
          return `• ${item.product.name}: ${item.product.price.toLocaleString()} CFA`;
        })
        .join('\n');

      const message =
        `🛍️ COMMANDE - ELEGANCE COUTURE PRESTIGE\n\n` +
        `Produits:\n${itemsList}\n\n` +
        `Total: ${totalFinal.toLocaleString()} CFA\n\n` +
        `Client: ${formData.prenom} ${formData.nom}\n` +
        `Tél: ${formData.telephone}`;

      // Send email with invoice
      try {
        await fetch("/api/commande", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customer: formData,
            items: items,
            total,
            fraisLivraison,
            totalFinal,
            paiement: formData.paiement,
          }),
        })
      } catch (emailError) {
        console.error("Email error:", emailError)
      }

      const whatsappUrl = `https://wa.me/221778137032?text=${encodeURIComponent(message)}`

      clearCart()

      toast({
        title: "Commande envoyée!",
        description: "Nous vous contacterons bientôt.",
      })

      window.open(whatsappUrl, "_blank")
      router.push("/commande-confirmee")
    } catch (error) {
      console.error("Order error:", error)
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite. Veuillez réessayer.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="bg-muted/30 py-12 md:py-16">
          <div className="container mx-auto px-4">
            <h1 className="font-serif text-4xl md:text-6xl font-bold text-center">Finaliser la commande</h1>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Form Section */}
              <div className="lg:col-span-2 space-y-6">
                {/* Contact Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5 text-accent" />
                      Informations de contact
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="prenom">Prénom *</Label>
                        <Input
                          id="prenom"
                          name="prenom"
                          value={formData.prenom}
                          onChange={handleChange}
                          required
                          placeholder="Votre prénom"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="nom">Nom *</Label>
                        <Input
                          id="nom"
                          name="nom"
                          value={formData.nom}
                          onChange={handleChange}
                          required
                          placeholder="Votre nom"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="telephone">Téléphone *</Label>
                        <Input
                          id="telephone"
                          name="telephone"
                          type="tel"
                          value={formData.telephone}
                          onChange={handleChange}
                          required
                          placeholder="+221 77 123 45 67"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="email@exemple.com"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Delivery Address */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-accent" />
                      Adresse de livraison
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="adresse">Adresse complète *</Label>
                      <Input
                        id="adresse"
                        name="adresse"
                        value={formData.adresse}
                        onChange={handleChange}
                        required
                        placeholder="Numéro, rue, immeuble..."
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="ville">Ville *</Label>
                        <Input
                          id="ville"
                          name="ville"
                          value={formData.ville}
                          onChange={handleChange}
                          required
                          placeholder="Dakar"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="quartier">Quartier *</Label>
                        <Input
                          id="quartier"
                          name="quartier"
                          value={formData.quartier}
                          onChange={handleChange}
                          required
                          placeholder="Keur Massar, Almadies..."
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="instructions">Instructions de livraison (optionnel)</Label>
                      <Textarea
                        id="instructions"
                        name="instructions"
                        value={formData.instructions}
                        onChange={handleChange}
                        placeholder="Points de repère, étage, code d'accès..."
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Method */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-accent" />
                      Mode de paiement
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup
                      value={formData.paiement}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, paiement: value }))}
                      className="space-y-3"
                    >
                      <div className="flex items-center space-x-3 border rounded-lg p-4">
                        <RadioGroupItem value="cash" id="cash" />
                        <Label htmlFor="cash" className="flex-1 cursor-pointer">
                          <div>
                            <p className="font-semibold">Paiement à la livraison</p>
                            <p className="text-sm text-muted-foreground">Payez en espèces lors de la réception</p>
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 border rounded-lg p-4">
                        <RadioGroupItem value="virement" id="virement" />
                        <Label htmlFor="virement" className="flex-1 cursor-pointer">
                          <div>
                            <p className="font-semibold">Virement bancaire / Wave / Orange Money</p>
                            <p className="text-sm text-muted-foreground">
                              Nous vous enverrons les coordonnées bancaires
                            </p>
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle>Résumé de la commande</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      {items.map((item, index) => (
                        <div key={`${item.product.id}-${index}`} className="flex gap-3">
                          <div className="relative w-16 h-16 bg-muted rounded overflow-hidden flex-shrink-0">
                            <img
                              src={item.product.images[0]?.replace('http://', 'https://') || "/placeholder.svg"}
                              alt={item.product.name}
                              className="object-cover w-full h-full"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm line-clamp-1">{item.product.name}</p>
                            <p className="text-xs text-muted-foreground">
                              Qté: {item.quantity}
                              {item.selectedSize && ` • ${item.selectedSize}`}
                            </p>
                            <p className="text-sm font-semibold">
                              {(item.product.price * item.quantity).toLocaleString()} FCFA
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Sous-total</span>
                        <span className="font-medium">{total.toLocaleString()} CFA</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Livraison</span>
                        <span className="font-medium">{fraisLivraison.toLocaleString()} CFA</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="font-semibold text-lg">Total</span>
                        <span className="font-bold text-2xl">{totalFinal.toLocaleString()} CFA</span>
                      </div>
                    </div>

                    <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? "Envoi en cours..." : "Confirmer la commande"}
                    </Button>

                    <p className="text-xs text-muted-foreground text-center">
                      En confirmant, vous acceptez nos conditions de vente
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  )
}
