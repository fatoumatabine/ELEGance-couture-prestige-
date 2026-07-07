"use client"

import Link from "next/link"
import { Phone, Mail, MapPin, Instagram, Facebook, MessageCircle } from "lucide-react"
import { useLanguage } from "@/components/language-provider"

const footerCopy = {
  fr: {
    tagline: "Mode Africaine Premium",
    description: "Votre maison de mode africaine et couture sur mesure au Sénégal. Robes, boubous, complets et accessoires de haute qualité.",
    collectionsTitle: "Collections",
    infoTitle: "Informations",
    contactTitle: "Contact",
    rights: "Tous droits réservés",
    made: "Fait au Sénégal",
    collections: [
      { href: "/robes", label: "Robes de Gala" },
      { href: "/jupes", label: "Jupes & Ensembles" },
      { href: "/pantalons", label: "Pantalons" },
      { href: "/parfums", label: "Parfums" },
      { href: "/accessoires", label: "Accessoires" },
      { href: "/boutique", label: "Toute la Boutique" },
    ],
    info: [
      { href: "/a-propos", label: "À Propos" },
      { href: "/contact", label: "Contact" },
      { href: "/livraison", label: "Livraison" },
      { href: "/retours", label: "Retours & Échanges" },
      { href: "/conditions", label: "Conditions Générales" },
    ],
    bottom: [
      { href: "/livraison", label: "Livraison" },
      { href: "/retours", label: "Retours" },
      { href: "/conditions", label: "CGV" },
    ],
  },
  en: {
    tagline: "Premium African Fashion",
    description: "Your African fashion house for custom tailoring in Senegal. Dresses, boubous, suits and premium accessories.",
    collectionsTitle: "Collections",
    infoTitle: "Information",
    contactTitle: "Contact",
    rights: "All rights reserved",
    made: "Made in Senegal",
    collections: [
      { href: "/robes", label: "Gala Dresses" },
      { href: "/jupes", label: "Skirts & Sets" },
      { href: "/pantalons", label: "Trousers" },
      { href: "/parfums", label: "Perfumes" },
      { href: "/accessoires", label: "Accessories" },
      { href: "/boutique", label: "Full Shop" },
    ],
    info: [
      { href: "/a-propos", label: "About" },
      { href: "/contact", label: "Contact" },
      { href: "/livraison", label: "Delivery" },
      { href: "/retours", label: "Returns & Exchanges" },
      { href: "/conditions", label: "Terms & Conditions" },
    ],
    bottom: [
      { href: "/livraison", label: "Delivery" },
      { href: "/retours", label: "Returns" },
      { href: "/conditions", label: "Terms" },
    ],
  },
} as const

export function Footer() {
  const { language } = useLanguage()
  const copy = footerCopy[language]

  return (
    <footer className="relative overflow-hidden border-t border-[#3b2717] bg-[#120b06]">
      <div className="editorial-grid absolute inset-0 opacity-[0.06]" />
      {/* Main Footer Grid */}
      <div className="container relative mx-auto px-4 py-12 min-[400px]:px-5 sm:px-6 sm:py-14 md:py-16 lg:py-20">
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 min-[360px]:grid-cols-2 lg:grid-cols-4 lg:gap-12">

          {/* Brand Column */}
          <div className="min-w-0 min-[360px]:col-span-2 lg:col-span-1">
            <div className="mb-4 flex min-w-0 items-center gap-3 sm:mb-5">
              <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full border border-[#FF9D00]/35 bg-[#211207] p-0.5 shadow-[0_12px_34px_rgba(255,157,0,0.16)] sm:h-12 sm:w-12">
                <img src="/logo.png" alt="Elegance Couture" className="h-full w-full rounded-full object-cover" />
              </div>
              <div className="min-w-0">
                <h3 className="font-serif text-base font-bold tracking-wide text-[#fff8ed] min-[400px]:text-lg min-[400px]:tracking-wider">
                  ELEGANCE <span className="brand-text-gradient">COUTURE</span>
                </h3>
                <p className="mt-0.5 text-[7px] uppercase tracking-[0.22em] text-[#d7ba8c] min-[400px]:text-[8px] min-[400px]:tracking-[0.3em]">{copy.tagline}</p>
              </div>
            </div>
            <p className="mb-5 max-w-md text-[12px] leading-relaxed tracking-wide text-[#d7ba8c] sm:mb-6">
              {copy.description}
            </p>
            {/* Social */}
            <div className="flex gap-3 sm:gap-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center border border-[#3b2717] text-[#d7ba8c] transition-all duration-300 hover:border-[#FF9D00] hover:bg-[#FF9D00] hover:text-[#180f08]">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center border border-[#3b2717] text-[#d7ba8c] transition-all duration-300 hover:border-[#FF9D00] hover:bg-[#FF9D00] hover:text-[#180f08]">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="https://wa.me/221778137032" target="_blank" rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="flex h-10 w-10 items-center justify-center border border-[#3b2717] text-[#d7ba8c] transition-all duration-300 hover:border-[#FF9D00] hover:bg-[#FF9D00] hover:text-[#180f08]">
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Collections */}
          <div className="min-w-0">
            <h4 className="mb-4 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#fff8ed] sm:mb-6 sm:tracking-[0.3em]">{copy.collectionsTitle}</h4>
            <ul className="space-y-1 sm:space-y-1.5">
              {copy.collections.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="group flex min-h-8 items-center gap-2 text-[11px] leading-snug tracking-wide text-[#d7ba8c] transition-colors hover:text-[#FF9D00] sm:text-[12px]">
                    <span className="h-px w-3 shrink-0 bg-[#3b2717] transition-colors group-hover:bg-[#FF9D00] sm:w-4" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Information */}
          <div className="min-w-0">
            <h4 className="mb-4 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#fff8ed] sm:mb-6 sm:tracking-[0.3em]">{copy.infoTitle}</h4>
            <ul className="space-y-1 sm:space-y-1.5">
              {copy.info.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="group flex min-h-8 items-center gap-2 text-[11px] leading-snug tracking-wide text-[#d7ba8c] transition-colors hover:text-[#FF9D00] sm:text-[12px]">
                    <span className="h-px w-3 shrink-0 bg-[#3b2717] transition-colors group-hover:bg-[#FF9D00] sm:w-4" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="min-w-0 min-[360px]:col-span-2 lg:col-span-1">
            <h4 className="mb-4 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#fff8ed] sm:mb-6 sm:tracking-[0.3em]">{copy.contactTitle}</h4>
            <ul className="grid gap-4 min-[460px]:grid-cols-2 lg:grid-cols-1">
              <li className="flex items-start gap-3">
                <MapPin className="h-3.5 w-3.5 mt-0.5 flex-shrink-0 text-[#FF9D00]" />
                <span className="text-[12px] text-[#d7ba8c] leading-relaxed tracking-wide">Grand Dakar, Thiossane<br />Dakar, Sénégal</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="h-3.5 w-3.5 mt-0.5 flex-shrink-0 text-[#FF9D00]" />
                <div className="flex flex-col gap-1">
                  <a href="tel:+221778137032" className="text-[12px] text-[#d7ba8c] hover:text-[#FF9D00] transition-colors tracking-wide">
                    +221 77 813 70 32
                  </a>
                  <a href="tel:+221779472942" className="text-[12px] text-[#d7ba8c] hover:text-[#FF9D00] transition-colors tracking-wide">
                    +221 77 947 29 42
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-3.5 w-3.5 flex-shrink-0 text-[#FF9D00]" />
                <a href="mailto:contact@elegancecouture.sn" className="min-w-0 break-all text-[11px] tracking-wide text-[#d7ba8c] transition-colors hover:text-[#FF9D00] min-[360px]:text-[12px]">
                  contact@elegancecouture.sn
                </a>
              </li>
              <li className="flex items-center gap-3">
                <MessageCircle className="h-3.5 w-3.5 flex-shrink-0 text-[#FF9D00]" />
                <a href="https://wa.me/221778137032" target="_blank" rel="noopener noreferrer" className="text-[12px] text-[#d7ba8c] hover:text-[#FF9D00] transition-colors">
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative border-t border-[#3b2717]">
        <div className="container mx-auto flex flex-col items-center justify-between gap-3 px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-5 text-center min-[400px]:px-5 sm:px-6 lg:flex-row lg:text-left">
          <p className="max-w-full text-[10px] uppercase leading-relaxed tracking-[0.12em] text-[#d7ba8c] sm:text-[11px] sm:tracking-widest">
            © {new Date().getFullYear()} Elegance Couture - {copy.rights}
          </p>
          <p className="text-[11px] tracking-wide text-[#d7ba8c]">
            {copy.made}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:gap-x-5">
            {copy.bottom.map((link) => (
              <Link key={link.href} href={link.href} className="text-[11px] tracking-wide text-[#d7ba8c] hover:text-[#FF9D00] transition-colors uppercase">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
