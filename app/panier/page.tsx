"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BackButton } from "@/components/back-button"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { useCartStore } from "@/lib/cart-store"
import { getProductOptionLabels } from "@/lib/products"
import {
  Minus,
  Plus,
  ShoppingBag,
  ArrowRight,
  CheckCircle,
  Loader2,
  MapPin,
  Phone,
  ShieldCheck,
  Trash2,
  Truck,
  MessageSquare,
  RotateCcw,
  Sparkles,
  Smartphone,
  CreditCard,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
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

export default function PanierPage() {
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCartStore()
  const router = useRouter()
  const { toast } = useToast()

  const [telephone, setTelephone] = useState("")
  const [instructions, setInstructions] = useState("")
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash")
  const [paymentPhone, setPaymentPhone] = useState("")
  const [paymentReference, setPaymentReference] = useState("")
  const [paymentSettings, setPaymentSettings] = useState<SiteSetting[]>([])
  const [location, setLocation] = useState<CustomerLocation | null>(null)
  const [locationError, setLocationError] = useState("")
  const [isLocating, setIsLocating] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const freeDeliveryThreshold = 50000
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const total = getTotalPrice()
  const amountUntilFreeDelivery = Math.max(0, freeDeliveryThreshold - total)
  const deliveryProgress = total > 0 ? Math.min(100, Math.round((total / freeDeliveryThreshold) * 100)) : 0
  const hasFreeDelivery = total >= freeDeliveryThreshold
  const fraisLivraison = total > 0 && !hasFreeDelivery ? 2000 : 0
  const totalFinal = total + fraisLivraison
  const selectedPaymentMethod = normalizePaymentMethod(paymentMethod)
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

  const handleClearCart = () => {
    if (window.confirm("Voulez-vous vraiment vider le panier ?")) {
      clearCart()
    }
  }

  const handleQuickOrder = async (e: React.FormEvent) => {
    e.preventDefault()

    const cleanPhone = telephone.trim()
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
      const deliveryNote = instructions.trim()
      const gpsInstructions = `Latitude: ${location.latitude}, Longitude: ${location.longitude}${location.accuracy ? `, précision: ${Math.round(location.accuracy)} m` : ""}`
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
        instructions: [deliveryNote, gpsInstructions, ...paymentInstructions].filter(Boolean).join("\n"),
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
        (deliveryNote ? `Instructions: ${deliveryNote}\n` : "") +
        `Paiement: ${selectedPayment.label}\n` +
        (manualPayment ? `Téléphone paiement: ${cleanPaymentPhone}\nRéférence: ${cleanPaymentReference}\n` : "")
      const whatsappUrl = `https://wa.me/221778137032?text=${encodeURIComponent(message)}`
      window.open(whatsappUrl, "_blank")

      const orderPayload = {
        customer,
        items,
        total,
        fraisLivraison,
        totalFinal,
        paiement: selectedPaymentMethod,
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

      <main className="flex-1 bg-[#fffaf2] text-[#241609] dark:bg-[#140b05] dark:text-[#fff8ed]">
        <div className="container mx-auto px-4 py-8 md:px-6 md:py-10">
          <div className="mb-6 flex flex-col gap-5 border-b border-[#ead3aa] pb-6 dark:border-[#3b2717] md:flex-row md:items-end md:justify-between">
            <div>
              <BackButton className="-ml-3 mb-4" fallbackHref="/boutique" />
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.32em] text-[#B6771D] dark:text-[#FFCF71]">
                Checkout
              </p>
              <h1 className="font-serif text-4xl font-bold leading-none md:text-5xl">
                Mon panier
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#7B542F] dark:text-[#d7ba8c]">
                Vérifiez vos articles, partagez votre position et confirmez rapidement votre commande.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleClearCart}
                className="inline-flex h-10 items-center gap-2 rounded-[6px] border border-[#ead3aa] bg-white/70 px-4 text-[11px] font-bold uppercase tracking-[0.14em] text-[#7B542F] transition-colors hover:border-rose-300 hover:text-rose-600 dark:border-[#3b2717] dark:bg-[#211207] dark:text-[#d7ba8c]"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Vider
              </button>
              <Link
                href="/boutique"
                className="inline-flex h-10 items-center gap-2 rounded-[6px] border border-[#ead3aa] bg-white/70 px-4 text-[11px] font-bold uppercase tracking-[0.14em] text-[#7B542F] transition-colors hover:border-[#FF9D00] hover:text-[#B6771D] dark:border-[#3b2717] dark:bg-[#211207] dark:text-[#d7ba8c]"
              >
                Continuer
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          <div className="mb-8 grid gap-3 md:grid-cols-3">
            {[
              { label: "Articles", value: `${itemCount}`, icon: ShoppingBag },
              { label: "Livraison", value: hasFreeDelivery ? "Offerte" : `${amountUntilFreeDelivery.toLocaleString()} FCFA restant`, icon: Truck },
              { label: "Paiement", value: selectedPayment.shortLabel, icon: ShieldCheck },
            ].map((stat) => (
              <div key={stat.label} className="rounded-[8px] border border-[#ead3aa] bg-white/75 p-4 shadow-sm dark:border-[#3b2717] dark:bg-[#211207]/75">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B6771D] dark:text-[#FFCF71]">{stat.label}</p>
                  <stat.icon className="h-4 w-4 text-[#FF9D00]" />
                </div>
                <p className="font-serif text-2xl font-bold">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_400px] xl:gap-10">
            <section className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#B6771D] dark:text-[#FFCF71]">
                    Sélection
                  </p>
                  <h2 className="mt-1 font-serif text-2xl font-bold">Articles choisis</h2>
                </div>
                <span className="rounded-full border border-[#ead3aa] bg-white/75 px-3 py-1 text-xs font-semibold text-[#7B542F] dark:border-[#3b2717] dark:bg-[#211207]/75 dark:text-[#d7ba8c]">
                  {itemCount} pièce{itemCount > 1 ? "s" : ""}
                </span>
              </div>

              {items.map((item, index) => {
                const optionLabels = getProductOptionLabels(item.product)
                const optionParts = [
                  item.selectedSize ? `${optionLabels.optionLabel}: ${item.selectedSize}` : "",
                  item.selectedColor ? `Couleur: ${item.selectedColor}` : "",
                ].filter(Boolean)
                const quantityLabel = optionLabels.mode === "fabric" ? "m" : "qté"
                const lineTotal = item.product.price * item.quantity

                return (
                  <article
                    key={`${item.product.id}-${item.selectedSize || "no-size"}-${item.selectedColor || "no-color"}-${index}`}
                    className="grid gap-4 rounded-[8px] border border-[#ead3aa] bg-white p-4 shadow-[0_16px_44px_rgba(123,84,47,0.10)] dark:border-[#3b2717] dark:bg-[#211207] sm:grid-cols-[148px_minmax(0,1fr)]"
                  >
                    <Link
                      href={`/produit/${item.product.id}`}
                      className="flex aspect-[4/5] items-center justify-center overflow-hidden rounded-[6px] bg-[#f4eee3] dark:bg-[#140b05]"
                    >
                      {item.product.images[0] ? (
                        <img
                          src={item.product.images[0].replace("http://", "https://")}
                          alt={item.product.name}
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <div className="px-3 text-center text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
                          Image admin requise
                        </div>
                      )}
                    </Link>

                    <div className="flex min-w-0 flex-col justify-between gap-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.22em] text-[#B6771D] dark:text-[#FFCF71]">
                            {item.product.category}
                          </p>
                          <Link
                            href={`/produit/${item.product.id}`}
                            className="font-serif text-2xl font-bold leading-tight transition-colors hover:text-[#B6771D]"
                          >
                            {item.product.name}
                          </Link>
                          {optionParts.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {optionParts.map((option) => (
                                <span key={option} className="rounded-full bg-[#fff3dd] px-3 py-1 text-xs font-semibold text-[#7B542F] dark:bg-[#2b190d] dark:text-[#d7ba8c]">
                                  {option}
                                </span>
                              ))}
                            </div>
                          )}
                          <p className="mt-3 text-sm text-[#7B542F] dark:text-[#d7ba8c]">
                            Prix unitaire: {item.product.price.toLocaleString()} FCFA{optionLabels.priceSuffix}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.product.id, item.selectedSize, item.selectedColor)}
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[6px] border border-[#ead3aa] text-[#7B542F] transition-colors hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600 dark:border-[#3b2717] dark:text-[#d7ba8c]"
                          aria-label="Retirer du panier"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="flex flex-col gap-4 border-t border-[#ead3aa] pt-4 dark:border-[#3b2717] sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#B6771D] dark:text-[#FFCF71]">
                            {optionLabels.quantityLabel}
                          </p>
                          <div className="inline-flex h-10 w-fit items-center rounded-[6px] border border-[#ead3aa] bg-[#fffaf2] dark:border-[#3b2717] dark:bg-[#140b05]">
                            <button
                              type="button"
                              className="flex h-full w-10 items-center justify-center text-[#7B542F] transition-colors hover:bg-[#fff3dd] hover:text-[#B6771D] dark:text-[#d7ba8c]"
                              onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1), item.selectedSize, item.selectedColor)}
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="flex h-full min-w-16 items-center justify-center border-x border-[#ead3aa] px-3 text-sm font-bold dark:border-[#3b2717]">
                              {item.quantity} {quantityLabel}
                            </span>
                            <button
                              type="button"
                              className="flex h-full w-10 items-center justify-center text-[#7B542F] transition-colors hover:bg-[#fff3dd] hover:text-[#B6771D] dark:text-[#d7ba8c]"
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.selectedSize, item.selectedColor)}
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="text-left sm:text-right">
                          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#B6771D] dark:text-[#FFCF71]">Total ligne</p>
                          <p className="mt-1 text-2xl font-bold">
                            {lineTotal.toLocaleString()} FCFA
                          </p>
                        </div>
                      </div>
                    </div>
                  </article>
                )
              })}
            </section>

            <aside>
              <div className="sticky top-28 overflow-hidden rounded-[8px] border border-[#ead3aa] bg-white shadow-[0_24px_70px_rgba(123,84,47,0.14)] dark:border-[#3b2717] dark:bg-[#211207]">
                <div className="border-b border-[#ead3aa] bg-[#fff3dd] p-5 dark:border-[#3b2717] dark:bg-[#2b190d]">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#B6771D] dark:text-[#FFCF71]">
                        Résumé
                      </p>
                      <h2 className="mt-1 font-serif text-2xl font-bold">
                        Commande
                      </h2>
                    </div>
                    <span className="rounded-full bg-white/75 px-3 py-1 text-xs font-semibold text-[#7B542F] dark:bg-[#140b05] dark:text-[#d7ba8c]">
                      {itemCount} article{itemCount > 1 ? "s" : ""}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between gap-4">
                      <span className="text-[#7B542F] dark:text-[#d7ba8c]">Sous-total</span>
                      <span className="font-semibold">{total.toLocaleString()} FCFA</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-[#7B542F] dark:text-[#d7ba8c]">Livraison</span>
                      <span className={`font-semibold ${hasFreeDelivery ? "text-emerald-700" : ""}`}>
                        {hasFreeDelivery ? "Offerte" : `${fraisLivraison.toLocaleString()} FCFA`}
                      </span>
                    </div>
                    <Separator className="bg-[#ead3aa] dark:bg-[#3b2717]" />
                    <div className="flex items-end justify-between gap-4">
                      <span className="text-base font-bold">Total</span>
                      <span className="text-3xl font-bold">
                        {totalFinal.toLocaleString()} FCFA
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 rounded-[8px] border border-[#ead3aa] bg-[#fffaf2] p-4 dark:border-[#3b2717] dark:bg-[#140b05]">
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <p className="flex items-center gap-2 text-xs font-semibold text-[#7B542F] dark:text-[#d7ba8c]">
                        <Truck className="h-3.5 w-3.5 text-[#FF9D00]" />
                        Livraison offerte
                      </p>
                      <span className="text-xs font-bold text-[#B6771D] dark:text-[#FFCF71]">{deliveryProgress}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-[#ead3aa] dark:bg-[#3b2717]">
                      <div className="h-full rounded-full bg-[#FF9D00] transition-all" style={{ width: `${deliveryProgress}%` }} />
                    </div>
                    <p className="mt-2 text-xs text-[#7B542F] dark:text-[#d7ba8c]">
                      {hasFreeDelivery
                        ? "Votre livraison est offerte sur cette commande."
                        : `Encore ${amountUntilFreeDelivery.toLocaleString()} FCFA pour obtenir la livraison offerte.`}
                    </p>
                  </div>

                  <form onSubmit={handleQuickOrder} className="mt-6 space-y-4">
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
                        className="h-11 rounded-[6px] border-[#ead3aa] bg-[#fffaf2] dark:border-[#3b2717] dark:bg-[#140b05]"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleLocate}
                      disabled={isLocating}
                      className={`flex h-11 w-full items-center justify-center gap-2 rounded-[6px] border text-sm font-semibold transition-colors disabled:opacity-60 ${
                        location
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                          : "border-[#ead3aa] bg-[#fffaf2] text-[#7B542F] hover:border-[#FF9D00] hover:text-[#B6771D] dark:border-[#3b2717] dark:bg-[#140b05] dark:text-[#d7ba8c]"
                      }`}
                    >
                      {isLocating ? <Loader2 className="h-4 w-4 animate-spin" /> : location ? <CheckCircle className="h-4 w-4" /> : <MapPin className="h-4 w-4" />}
                      {location ? "Localisation ajoutée" : "Partager ma localisation"}
                    </button>

                    {location && (
                      <a
                        href={location.mapUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-700 underline-offset-4 hover:underline"
                      >
                        <MapPin className="h-3.5 w-3.5" />
                        Voir la position
                      </a>
                    )}

                    {locationError && (
                      <p className="text-xs font-medium text-rose-700">{locationError}</p>
                    )}

                    <div className="space-y-3">
                      <Label className="flex items-center gap-2 text-xs font-semibold">
                        <ShieldCheck className="h-3.5 w-3.5 text-[#FF9D00]" />
                        Mode de paiement
                      </Label>
                      <div className="grid gap-2 sm:grid-cols-3">
                        {(Object.keys(PAYMENT_METHODS) as PaymentMethod[]).map((method) => {
                          const payment = PAYMENT_METHODS[method]
                          const isSelected = selectedPaymentMethod === method

                          return (
                            <button
                              key={method}
                              type="button"
                              onClick={() => setPaymentMethod(method)}
                              aria-pressed={isSelected}
                              className={`min-h-20 rounded-[6px] border p-3 text-left transition-colors ${
                                isSelected
                                  ? "border-[#FF9D00] bg-[#fff3dd] text-[#241609] shadow-[0_10px_24px_rgba(255,157,0,0.16)]"
                                  : "border-[#ead3aa] bg-[#fffaf2] text-[#7B542F] hover:border-[#FF9D00] dark:border-[#3b2717] dark:bg-[#140b05] dark:text-[#d7ba8c]"
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
                        <div className="rounded-[8px] border border-[#f1c97f] bg-[#fff7e9] p-4 dark:border-[#4a3117] dark:bg-[#1b1007]">
                          <div className="mb-3 flex items-start justify-between gap-3">
                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#B6771D] dark:text-[#FFCF71]">
                                Paiement mobile
                              </p>
                              <p className="mt-1 text-sm font-semibold">{selectedPayment.label}</p>
                            </div>
                            <p className="text-right text-sm font-bold text-[#B6771D] dark:text-[#FFCF71]">
                              {totalFinal.toLocaleString()} FCFA
                            </p>
                          </div>

                          {merchantLines.length > 0 ? (
                            <div className="mb-3 grid gap-2">
                              {merchantLines.map((line) => (
                                <p key={line} className="rounded-[6px] border border-[#ead3aa] bg-white/70 px-3 py-2 text-xs font-semibold text-[#7B542F] dark:border-[#3b2717] dark:bg-[#211207] dark:text-[#d7ba8c]">
                                  {line}
                                </p>
                              ))}
                            </div>
                          ) : (
                            <p className="mb-3 rounded-[6px] border border-dashed border-[#ead3aa] px-3 py-2 text-xs text-[#7B542F] dark:border-[#3b2717] dark:text-[#d7ba8c]">
                              Code marchand non renseigné dans l'admin. La boutique confirmera le paiement sur WhatsApp.
                            </p>
                          )}

                          <div className="grid gap-3">
                            <div className="space-y-2">
                              <Label htmlFor="payment-phone" className="text-xs font-semibold">{selectedPayment.phoneLabel}</Label>
                              <Input
                                id="payment-phone"
                                type="tel"
                                value={paymentPhone}
                                onChange={(e) => setPaymentPhone(e.target.value)}
                                placeholder={telephone || "+221 77 123 45 67"}
                                className="h-10 rounded-[6px] border-[#ead3aa] bg-white dark:border-[#3b2717] dark:bg-[#140b05]"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="payment-reference" className="text-xs font-semibold">{selectedPayment.referenceLabel}</Label>
                              <Input
                                id="payment-reference"
                                value={paymentReference}
                                onChange={(e) => setPaymentReference(e.target.value)}
                                placeholder="Ex: transaction 123456"
                                className="h-10 rounded-[6px] border-[#ead3aa] bg-white dark:border-[#3b2717] dark:bg-[#140b05]"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex items-start gap-2 rounded-[6px] border border-[#ead3aa] bg-[#fffaf2] px-3 py-2 text-xs text-[#7B542F] dark:border-[#3b2717] dark:bg-[#140b05] dark:text-[#d7ba8c]">
                        <CreditCard className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#FF9D00]" />
                        Carte bancaire: uniquement via une passerelle sécurisée quand elle sera activée.
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="quick-instructions" className="flex items-center gap-2 text-xs font-semibold">
                        <MessageSquare className="h-3.5 w-3.5 text-[#FF9D00]" />
                        Instructions
                      </Label>
                      <Textarea
                        id="quick-instructions"
                        value={instructions}
                        onChange={(e) => setInstructions(e.target.value)}
                        placeholder="Ex: livraison après 18h, appeler en arrivant..."
                        className="min-h-20 resize-none rounded-[6px] border-[#ead3aa] bg-[#fffaf2] dark:border-[#3b2717] dark:bg-[#140b05]"
                      />
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="h-12 w-full rounded-[6px] bg-[#FF9D00] font-bold text-[#180f08] shadow-[0_14px_30px_rgba(255,157,0,0.22)] hover:bg-[#e88e00]"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Envoi en cours..." : "Confirmer maintenant"}
                      {isSubmitting ? <Loader2 className="ml-2 h-5 w-5 animate-spin" /> : <ArrowRight className="ml-2 h-5 w-5" />}
                    </Button>
                  </form>

                  <div className="mt-5 grid gap-2 border-t border-[#ead3aa] pt-4 text-xs text-[#7B542F] dark:border-[#3b2717] dark:text-[#d7ba8c]">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-3.5 w-3.5 text-[#FF9D00]" />
                      Préparation soignée avant livraison
                    </div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-3.5 w-3.5 text-[#FF9D00]" />
                      {manualPayment ? "Paiement mobile vérifié avant confirmation" : "Paiement à la livraison"}
                    </div>
                    <div className="flex items-center gap-2">
                      <RotateCcw className="h-3.5 w-3.5 text-[#FF9D00]" />
                      Vérification possible à la réception
                    </div>
                  </div>

                  <Link
                    href="/commander"
                    className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-[6px] border border-[#ead3aa] text-sm font-semibold text-[#7B542F] transition-colors hover:border-[#FF9D00] hover:text-[#B6771D] dark:border-[#3b2717] dark:text-[#d7ba8c]"
                  >
                    Finalisation détaillée
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
