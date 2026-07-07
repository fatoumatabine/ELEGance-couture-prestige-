"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BackButton } from "@/components/back-button"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useCartStore } from "@/lib/cart-store"
import { useRouter } from "next/navigation"
import { CheckCircle, CreditCard, Loader2, MapPin, Phone, ShieldCheck, Smartphone } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  getPaymentMerchantLines,
  isManualMobilePayment,
  normalizePaymentMethod,
  PAYMENT_METHODS,
  type PaymentMethod,
} from "@/lib/payments"

interface CustomerLocation {
  latitude: number
  longitude: number
  accuracy?: number
  mapUrl: string
}

interface SiteSetting {
  key: string
  value: string
}

export default function CommanderPage() {
  const { items, getTotalPrice, clearCart } = useCartStore()
  const router = useRouter()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    telephone: "",
    paiement: "cash" as PaymentMethod,
  })

  const [paymentPhone, setPaymentPhone] = useState("")
  const [paymentReference, setPaymentReference] = useState("")
  const [paymentSettings, setPaymentSettings] = useState<SiteSetting[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLocating, setIsLocating] = useState(false)
  const [location, setLocation] = useState<CustomerLocation | null>(null)
  const [locationError, setLocationError] = useState("")
  const [cartReady, setCartReady] = useState(false)

  const total = getTotalPrice()
  const freeDeliveryThreshold = 50000
  const fraisLivraison = total > 0 && total < freeDeliveryThreshold ? 2000 : 0
  const totalFinal = total + fraisLivraison
  const selectedPaymentMethod = normalizePaymentMethod(formData.paiement)
  const selectedPayment = PAYMENT_METHODS[selectedPaymentMethod]
  const manualPayment = isManualMobilePayment(selectedPaymentMethod)
  const paymentSettingsMap = paymentSettings.reduce<Record<string, string>>((acc, setting) => {
    acc[setting.key] = setting.value
    return acc
  }, {})
  const merchantLines = getPaymentMerchantLines(selectedPaymentMethod, paymentSettingsMap)

  useEffect(() => {
    fetch("/api/site-settings")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setPaymentSettings(Array.isArray(data) ? data : []))
      .catch(() => setPaymentSettings([]))
  }, [])

  useEffect(() => {
    setCartReady(useCartStore.persist.hasHydrated())
    return useCartStore.persist.onFinishHydration(() => setCartReady(true))
  }, [])

  useEffect(() => {
    if (cartReady && items.length === 0) {
      router.replace("/panier")
    }
  }, [cartReady, items.length, router])

  if (!cartReady || items.length === 0) {
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const cleanPhone = formData.telephone.trim()
    const phoneDigits = cleanPhone.replace(/\D/g, "")

    if (!cleanPhone) {
      toast({
        title: "Numéro requis",
        description: "Ajoutez votre numéro de téléphone pour confirmer la commande.",
        variant: "destructive",
      })
      return
    }

    if (phoneDigits.length < 9) {
      toast({
        title: "Numéro incomplet",
        description: "Vérifiez votre numéro avant de confirmer la commande.",
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

    const cleanPaymentPhone = paymentPhone.trim() || cleanPhone
    const paymentPhoneDigits = cleanPaymentPhone.replace(/\D/g, "")
    const cleanPaymentReference = paymentReference.trim()

    if (manualPayment && paymentPhoneDigits.length < 9) {
      toast({
        title: "Téléphone paiement requis",
        description: "Ajoutez le numéro utilisé pour le paiement Wave ou Orange Money.",
        variant: "destructive",
      })
      return
    }

    if (manualPayment && !cleanPaymentReference) {
      toast({
        title: "Référence paiement requise",
        description: "Après le paiement, ajoutez la référence de transaction pour vérification.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const paymentInstructions = [
        `Paiement: ${selectedPayment.label}`,
        manualPayment ? `${selectedPayment.phoneLabel}: ${cleanPaymentPhone}` : "",
        manualPayment ? `${selectedPayment.referenceLabel}: ${cleanPaymentReference}` : "",
        manualPayment ? "Statut paiement: à vérifier dans l'application marchand" : "",
      ].filter(Boolean)
      const customer = {
        telephone: cleanPhone,
        nom: "",
        prenom: "Client",
        email: "",
        adresse: location.mapUrl,
        ville: "Localisation GPS",
        quartier: "",
        instructions: [
          `Latitude: ${location.latitude}, Longitude: ${location.longitude}${location.accuracy ? `, précision: ${Math.round(location.accuracy)} m` : ""}`,
          ...paymentInstructions,
        ].join("\n"),
        location,
      }

      const itemsList = items
        .map((item) => {
          const options = [item.selectedSize, item.selectedColor].filter(Boolean).join(" / ")
          const optionText = options ? ` (${options})` : ""
          return `• ${item.product.name}${optionText} x${item.quantity}: ${(item.product.price * item.quantity).toLocaleString()} CFA`;
        })
        .join('\n');

      const message =
        `🛍️ COMMANDE - ELEGANCE COUTURE PRESTIGE\n\n` +
        `Produits:\n${itemsList}\n\n` +
        `Total: ${totalFinal.toLocaleString()} CFA\n\n` +
        `Téléphone client: ${customer.telephone}\n` +
        `Localisation livraison: ${location.mapUrl}\n` +
        `Paiement: ${selectedPayment.label}\n` +
        (manualPayment ? `Téléphone paiement: ${cleanPaymentPhone}\nRéférence: ${cleanPaymentReference}\n` : "");

      try {
        const orderPayload = {
          customer,
          items: items,
          total,
          fraisLivraison,
          totalFinal,
          paiement: selectedPaymentMethod,
        }

        await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderPayload),
        })

        await fetch("/api/commande", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderPayload),
        })
      } catch (emailError) {
        console.error("Order save/email error:", emailError)
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="bg-muted/30 py-12 md:py-16">
          <div className="container mx-auto px-4">
            <BackButton className="mb-6" fallbackHref="/panier" />
            <h1 className="font-serif text-4xl md:text-6xl font-bold text-center">Finaliser la commande</h1>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Form Section */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Phone className="h-5 w-5 text-accent" />
                      Votre téléphone
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="telephone">Numéro de téléphone *</Label>
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
                    <p className="text-sm text-muted-foreground">
                      Nous vous appellerons ou écrirons sur WhatsApp pour confirmer les détails de la livraison.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-accent" />
                      Localisation de livraison
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="rounded-[8px] border border-[#f0d2a0] bg-[#fffaf2] p-4">
                      <p className="text-sm text-muted-foreground">
                        Cliquez sur le bouton pour envoyer automatiquement votre position. Elle sera utilisée uniquement pour la livraison.
                      </p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                      <Button
                        type="button"
                        onClick={handleLocate}
                        disabled={isLocating}
                        className="h-12 rounded-[6px] bg-[#FF9D00] px-6 font-bold text-[#180f08] hover:bg-[#e88e00]"
                      >
                        {isLocating ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
                        {location ? "Modifier ma localisation" : "Partager ma localisation"}
                      </Button>

                      {location && (
                        <a
                          href={location.mapUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 underline-offset-4 hover:underline"
                        >
                          <CheckCircle className="h-4 w-4" />
                          Localisation ajoutée
                        </a>
                      )}
                    </div>

                    {location && (
                      <p className="text-xs text-muted-foreground">
                        Précision approximative : {location.accuracy ? `${Math.round(location.accuracy)} m` : "non indiquée"}
                      </p>
                    )}

                    {locationError && (
                      <p className="text-sm font-medium text-rose-700">
                        {locationError}
                      </p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5 text-accent" />
                      Paiement
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="grid gap-3 sm:grid-cols-3">
                      {(Object.keys(PAYMENT_METHODS) as PaymentMethod[]).map((method) => {
                        const payment = PAYMENT_METHODS[method]
                        const isSelected = selectedPaymentMethod === method

                        return (
                          <button
                            key={method}
                            type="button"
                            onClick={() => setFormData((prev) => ({ ...prev, paiement: method }))}
                            aria-pressed={isSelected}
                            className={`min-h-24 rounded-[6px] border p-4 text-left transition-colors ${
                              isSelected
                                ? "border-[#FF9D00] bg-[#fff3dd] text-[#241609] shadow-[0_10px_24px_rgba(255,157,0,0.16)]"
                                : "border-[#f0d2a0] bg-[#fffaf2] text-[#7B542F] hover:border-[#FF9D00]"
                            }`}
                          >
                            <span className="mb-2 flex items-center justify-between gap-2">
                              {method === "cash" ? <ShieldCheck className="h-4 w-4 text-[#FF9D00]" /> : <Smartphone className="h-4 w-4 text-[#FF9D00]" />}
                              {isSelected && <CheckCircle className="h-4 w-4 text-emerald-700" />}
                            </span>
                            <span className="block text-xs font-bold uppercase tracking-[0.14em]">{payment.shortLabel}</span>
                            <span className="mt-1 block text-xs leading-snug opacity-80">{payment.label}</span>
                          </button>
                        )
                      })}
                    </div>

                    {manualPayment && (
                      <div className="rounded-[8px] border border-[#f1c97f] bg-[#fff7e9] p-4">
                        <div className="mb-3 flex items-start justify-between gap-3">
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#B6771D]">
                              Paiement mobile
                            </p>
                            <p className="mt-1 text-sm font-semibold">{selectedPayment.label}</p>
                          </div>
                          <p className="text-right text-sm font-bold text-[#B6771D]">
                            {totalFinal.toLocaleString()} FCFA
                          </p>
                        </div>

                        {merchantLines.length > 0 ? (
                          <div className="mb-3 grid gap-2">
                            {merchantLines.map((line) => (
                              <p key={line} className="rounded-[6px] border border-[#ead3aa] bg-white/70 px-3 py-2 text-xs font-semibold text-[#7B542F]">
                                {line}
                              </p>
                            ))}
                          </div>
                        ) : (
                          <p className="mb-3 rounded-[6px] border border-dashed border-[#ead3aa] px-3 py-2 text-xs text-[#7B542F]">
                            Code marchand non renseigné dans l'admin. La boutique confirmera le paiement sur WhatsApp.
                          </p>
                        )}

                        <div className="grid gap-3 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="detail-payment-phone">{selectedPayment.phoneLabel}</Label>
                            <Input
                              id="detail-payment-phone"
                              type="tel"
                              value={paymentPhone}
                              onChange={(e) => setPaymentPhone(e.target.value)}
                              placeholder={formData.telephone || "+221 77 123 45 67"}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="detail-payment-reference">{selectedPayment.referenceLabel}</Label>
                            <Input
                              id="detail-payment-reference"
                              value={paymentReference}
                              onChange={(e) => setPaymentReference(e.target.value)}
                              placeholder="Ex: transaction 123456"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-start gap-2 rounded-[6px] border border-[#f0d2a0] bg-[#fffaf2] px-3 py-2 text-xs text-muted-foreground">
                      <CreditCard className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#FF9D00]" />
                      Carte bancaire: uniquement via une passerelle sécurisée quand elle sera activée.
                    </div>
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
                            {item.product.images[0] ? (
                              <img
                                src={item.product.images[0].replace('http://', 'https://')}
                                alt={item.product.name}
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-[8px] uppercase tracking-wide text-muted-foreground">Image admin</div>
                            )}
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
                        <span className={`font-medium ${fraisLivraison === 0 ? "text-emerald-700" : ""}`}>
                          {fraisLivraison === 0 ? "Offerte" : `${fraisLivraison.toLocaleString()} CFA`}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Paiement</span>
                        <span className="font-medium">{selectedPayment.shortLabel}</span>
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
