"use client"

import Link from "next/link"
import { ShoppingCart, Menu, X, Phone, Mail, MessageCircle, Instagram, Facebook, ChevronDown } from "lucide-react"
import { useCartStore } from "@/lib/cart-store"
import { useEffect, useState, useCallback } from "react"
import { ThemeToggle } from "@/components/theme-toggle"

export function Header() {
  const [cartCount, setCartCount] = useState(0)
  const [isClient, setIsClient] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const count = useCartStore.getState().getTotalItems()
    setCartCount(count)
    const unsubscribe = useCartStore.subscribe((state) => {
      setCartCount(state.getTotalItems())
    })
    return unsubscribe
  }, [])

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 60)
  }, [])

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [handleScroll])

  const navLinks = [
    {
      label: "Découvrir",
      href: "/",
      items: [
        { label: "Accueil", href: "/" },
        { label: "Nouveautés", href: "/boutique?selection=nouveautes" },
        { label: "Pièces phares", href: "/boutique?selection=pieces-phares" },
        { label: "Notre atelier", href: "/a-propos" },
      ],
    },
    {
      label: "Collections",
      href: "/boutique",
      columns: [
        {
          title: "Femme",
          items: [
            { label: "Robe", href: "/robes" },
            { label: "Grand boubou", href: "/boutique?collection=femme-grand-boubou" },
            { label: "Taille basse", href: "/boutique?collection=taille-basse" },
          ],
        },
        {
          title: "Homme",
          items: [
            { label: "Grand boubou", href: "/boutique?collection=homme-grand-boubou" },
            { label: "Kaftan", href: "/boutique?collection=kaftan-homme" },
            { label: "Demi-saison", href: "/boutique?collection=demi-saison-homme" },
            { label: "Tenue Super 100", href: "/boutique?collection=super-100" },
          ],
        },
        {
          title: "Enfant",
          items: [
            { label: "Robe enfant", href: "/boutique?collection=robe-enfant" },
            { label: "Boubou enfant", href: "/boutique?collection=boubou-enfant" },
            { label: "Kaftan enfant", href: "/boutique?collection=kaftan-enfant" },
            { label: "Tenue cérémonie", href: "/boutique?collection=ceremonie-enfant" },
          ],
        },
      ],
    },
    {
      label: "Accessoires",
      href: "/accessoires",
      items: [
        { label: "Montres", href: "/boutique?accessoire=montres" },
        { label: "Parfums", href: "/parfums" },
        { label: "Chaussures", href: "/boutique?accessoire=chaussures" },
      ],
    },
    {
      label: "Sur Mesure",
      href: "/commander",
      items: [
        { label: "Prendre rendez-vous", href: "/contact" },
        { label: "Commander une création", href: "/commander" },
        { label: "Guide des tailles", href: "/conditions" },
      ],
    },
    {
      label: "Services",
      href: "/contact",
      items: [
        { label: "Livraison", href: "/livraison" },
        { label: "Retours & échanges", href: "/retours" },
        { label: "Contact WhatsApp", href: "https://wa.me/221778137032" },
      ],
    },
  ]

  return (
    <>
      {/* ===== TOP INFO BAR ===== */}
      <div className="hidden border-b border-[#ead3aa]/80 bg-[#fff3dd]/85 backdrop-blur-xl dark:border-[#3b2717] dark:bg-[#120b06] md:block">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-10">
            {/* Contact Info */}
            <div className="flex items-center gap-6">
              <a
                href="tel:+221778137032"
                className="flex items-center gap-2 text-[11px] tracking-widest uppercase text-[#7B542F] dark:text-[#d7ba8c] hover:text-[#FF9D00] transition-colors"
              >
                <Phone className="h-3 w-3" />
                +221 77 813 70 32
              </a>
              <span className="text-[#e0d5c5] dark:text-[#3b2717]">|</span>
              <a
                href="mailto:contact@elegancecouture.sn"
                className="flex items-center gap-2 text-[11px] tracking-widest uppercase text-[#7B542F] dark:text-[#d7ba8c] hover:text-[#FF9D00] transition-colors"
              >
                <Mail className="h-3 w-3" />
                contact@elegancecouture.sn
              </a>
            </div>

            {/* Right: Social + Toggle + CTA */}
            <div className="flex items-center gap-5">
              <a href="https://wa.me/221778137032" target="_blank" rel="noopener noreferrer"
                className="text-[#7B542F] dark:text-[#d7ba8c] hover:text-[#FF9D00] transition-colors" title="WhatsApp">
                <MessageCircle className="h-3.5 w-3.5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                className="text-[#7B542F] dark:text-[#d7ba8c] hover:text-[#FF9D00] transition-colors" title="Instagram">
                <Instagram className="h-3.5 w-3.5" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                className="text-[#7B542F] dark:text-[#d7ba8c] hover:text-[#FF9D00] transition-colors" title="Facebook">
                <Facebook className="h-3.5 w-3.5" />
              </a>
              <span className="text-[#e0d5c5] dark:text-[#3b2717]">|</span>
              <ThemeToggle />
              <span className="text-[#e0d5c5] dark:text-[#3b2717]">|</span>
              <Link
                href="/panier"
                className="flex items-center gap-2 text-[#7B542F] dark:text-[#d7ba8c] hover:text-[#FF9D00] transition-colors"
              >
                <ShoppingCart className="h-3.5 w-3.5" />
                {isClient && cartCount > 0 && (
                  <span className="text-[10px] text-[#FF9D00] font-semibold">({cartCount})</span>
                )}
              </Link>
              <Link
                href="/contact"
                className="ml-2 px-4 py-1.5 bg-gradient-to-r from-[#FF9D00] to-[#FFCF71] text-[#180f08] text-[10px] tracking-[0.2em] uppercase font-bold shadow-[0_10px_24px_rgba(255,157,0,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_32px_rgba(255,157,0,0.28)]"
              >
                Rendez-vous
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ===== MAIN HEADER ===== */}
      <header
        className={`sticky top-0 z-50 border-b border-[#ead3aa]/80 transition-all duration-500 dark:border-[#3b2717] ${
          scrolled
            ? "bg-[#fffaf2]/92 shadow-[0_16px_48px_rgba(123,84,47,0.12)] backdrop-blur-xl dark:bg-[#180f08]/98 dark:shadow-[0_2px_40px_rgba(0,0,0,0.6)]"
            : "bg-[#fffaf2]/86 backdrop-blur-md dark:bg-[#180f08]"
        }`}
      >
        <div className="container mx-auto px-6">
          {/* Logo Row */}
          <div className="flex items-center justify-between h-20 md:h-24">
            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-[#241609] dark:text-[#fff8ed] hover:text-[#FF9D00] transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            {/* Logo - Centered */}
            <Link href="/" className="flex items-center gap-4 mx-auto md:mx-0 md:absolute md:left-1/2 md:-translate-x-1/2">
              <div className="relative h-14 w-14 overflow-hidden rounded-full border border-[#FF9D00]/35 bg-[#fff8ed] p-0.5 shadow-[0_10px_30px_rgba(123,84,47,0.18)] dark:border-[#FF9D00]/30 dark:bg-[#211207]">
                <img
                  src="/logo.png"
                  alt="Elegance Couture"
                  className="h-full w-full rounded-full object-cover"
                />
              </div>
              <div className="text-center">
                <h1 className="font-serif text-lg font-bold tracking-wide text-[#241609] dark:text-[#fff8ed] md:text-2xl">
                  ELEGANCE <span className="brand-text-gradient">COUTURE PRESTIGE</span>
                </h1>
                <p className="mt-0.5 text-[8px] uppercase tracking-[0.35em] text-[#7B542F] dark:text-[#d7ba8c]">
                  Mode Africaine Premium
                </p>
              </div>
            </Link>

            {/* Mobile: cart */}
            <div className="flex items-center gap-3 md:opacity-0 md:pointer-events-none">
              <Link href="/panier" className="text-[#241609] dark:text-[#fff8ed] hover:text-[#FF9D00] transition-colors relative">
                <ShoppingCart className="h-5 w-5" />
                {isClient && cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#FF9D00] text-[#180f08] text-[9px] rounded-full h-4 w-4 flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* Navigation Row (desktop) */}
          <nav className="hidden h-12 items-center justify-center border-t border-[#ead3aa]/70 dark:border-[#3b2717] md:flex">
            {navLinks.map((link, idx) => (
              <div key={link.label} className="group/nav relative flex h-full items-center">
                {idx > 0 && (
                  <span className="text-[#e0d5c5] dark:text-[#3b2717] mx-1 text-xs">|</span>
                )}
                <Link
                  href={link.href}
                  className="relative flex h-full items-center gap-1.5 px-4 text-[10px] font-semibold uppercase tracking-[0.17em] text-[#7B542F] transition-colors duration-200 hover:text-[#FF9D00] dark:text-[#d7ba8c] lg:px-5 lg:text-[11px]"
                >
                  {link.label}
                  <ChevronDown className="h-3 w-3 transition-transform duration-300 group-hover/nav:rotate-180" />
                  <span className="absolute bottom-2 left-1/2 h-px w-0 -translate-x-1/2 bg-[#FF9D00] transition-all duration-300 group-hover/nav:w-8" />
                </Link>

                <div className="invisible absolute left-1/2 top-full z-50 min-w-[220px] -translate-x-1/2 border border-[#ead3aa] bg-[#fffaf2]/98 p-2 opacity-0 shadow-[0_28px_70px_rgba(123,84,47,0.18)] backdrop-blur-xl transition-all duration-300 group-hover/nav:visible group-hover/nav:opacity-100 dark:border-[#3b2717] dark:bg-[#120b06]/98">
                  {"columns" in link && link.columns ? (
                    <div className="grid w-[620px] grid-cols-3 gap-2">
                      {link.columns.map((column) => (
                        <div key={column.title} className="border-r border-[#ead3aa]/70 p-4 last:border-r-0 dark:border-[#3b2717]">
                          <p className="mb-4 font-serif text-lg font-bold text-[#241609] dark:text-[#fff8ed]">
                            {column.title}
                          </p>
                          <div className="space-y-1">
                            {column.items.map((item) => (
                              <Link
                                key={item.label}
                                href={item.href}
                                className="group/item flex items-center justify-between py-2 text-[12px] tracking-wide text-[#7B542F] transition-colors hover:text-[#B6771D] dark:text-[#d7ba8c] dark:hover:text-[#FFCF71]"
                              >
                                <span>{item.label}</span>
                                <span className="h-px w-4 bg-[#ead3aa] transition-all group-hover/item:w-7 group-hover/item:bg-[#FF9D00] dark:bg-[#3b2717]" />
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="w-60 p-2">
                      {link.items?.map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          className="group/item flex items-center justify-between border-b border-[#ead3aa]/70 px-3 py-3 text-[12px] tracking-wide text-[#7B542F] transition-colors last:border-b-0 hover:text-[#B6771D] dark:border-[#3b2717] dark:text-[#d7ba8c] dark:hover:text-[#FFCF71]"
                        >
                          <span>{item.label}</span>
                          <span className="h-px w-4 bg-[#ead3aa] transition-all group-hover/item:w-7 group-hover/item:bg-[#FF9D00] dark:bg-[#3b2717]" />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Mobile Nav Drawer */}
        {mobileOpen && (
          <div className="absolute left-0 right-0 top-full z-50 border-b border-[#ead3aa] bg-[#fffaf2]/98 shadow-[0_24px_60px_rgba(123,84,47,0.18)] backdrop-blur-xl dark:border-[#3b2717] dark:bg-[#120b06] md:hidden">
            <nav className="container mx-auto flex max-h-[calc(100vh-6rem)] flex-col gap-4 overflow-y-auto px-6 py-6">
              {navLinks.map((link) => (
                <div key={link.label} className="border-b border-[#ead3aa] pb-4 dark:border-[#3b2717]">
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="mb-3 flex items-center justify-between text-[12px] font-bold uppercase tracking-[0.22em] text-[#241609] transition-colors hover:text-[#FF9D00] dark:text-[#fff8ed]"
                  >
                    {link.label}
                    <ChevronDown className="h-3.5 w-3.5 text-[#FF9D00]" />
                  </Link>

                  {"columns" in link && link.columns ? (
                    <div className="grid gap-4">
                      {link.columns.map((column) => (
                        <div key={column.title}>
                          <p className="mb-2 font-serif text-base font-bold text-[#B6771D] dark:text-[#FFCF71]">
                            {column.title}
                          </p>
                          <div className="grid grid-cols-1 gap-1 pl-3">
                            {column.items.map((item) => (
                              <Link
                                key={item.label}
                                href={item.href}
                                onClick={() => setMobileOpen(false)}
                                className="py-1.5 text-[12px] tracking-wide text-[#7B542F] transition-colors hover:text-[#FF9D00] dark:text-[#d7ba8c]"
                              >
                                {item.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid gap-1 pl-3">
                      {link.items?.map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                          className="py-1.5 text-[12px] tracking-wide text-[#7B542F] transition-colors hover:text-[#FF9D00] dark:text-[#d7ba8c]"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="pt-4 flex flex-col gap-2">
                <a href="tel:+221778137032" className="flex items-center gap-2 text-[11px] tracking-wide text-[#7B542F] dark:text-[#d7ba8c]">
                  <Phone className="h-3 w-3 text-[#FF9D00]" /> +221 77 813 70 32
                </a>
                <a href="https://wa.me/221778137032" className="flex items-center gap-2 text-[11px] tracking-wide text-[#7B542F] dark:text-[#d7ba8c]">
                  <MessageCircle className="h-3 w-3 text-[#FF9D00]" /> WhatsApp
                </a>
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  )
}
