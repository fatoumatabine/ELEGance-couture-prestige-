"use client"

import Link from "next/link"
import { ShoppingCart, Menu, X, Phone, Mail, MessageCircle, Instagram, Facebook } from "lucide-react"
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
    { href: "/", label: "Accueil" },
    { href: "/a-propos", label: "À propos" },
    { href: "/boutique", label: "Boutique" },
    { href: "/robes", label: "Robes" },
    { href: "/jupes", label: "Jupes" },
    { href: "/pantalons", label: "Pantalons" },
    { href: "/parfums", label: "Parfums" },
    { href: "/accessoires", label: "Accessoires" },
    { href: "/contact", label: "Contact" },
  ]

  return (
    <>
      {/* ===== TOP INFO BAR ===== */}
      <div className="bg-[#f3ede4] dark:bg-[#0d0d0d] border-b border-[#e0d5c5] dark:border-[#2a2520] hidden md:block">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-10">
            {/* Contact Info */}
            <div className="flex items-center gap-6">
              <a
                href="tel:+221778137032"
                className="flex items-center gap-2 text-[11px] tracking-widest uppercase text-[#6b5c47] dark:text-[#9e9585] hover:text-[#C9A96E] transition-colors"
              >
                <Phone className="h-3 w-3" />
                +221 77 813 70 32
              </a>
              <span className="text-[#e0d5c5] dark:text-[#2a2520]">|</span>
              <a
                href="mailto:contact@elegancecouture.sn"
                className="flex items-center gap-2 text-[11px] tracking-widest uppercase text-[#6b5c47] dark:text-[#9e9585] hover:text-[#C9A96E] transition-colors"
              >
                <Mail className="h-3 w-3" />
                contact@elegancecouture.sn
              </a>
            </div>

            {/* Right: Social + Toggle + CTA */}
            <div className="flex items-center gap-5">
              <a href="https://wa.me/221778137032" target="_blank" rel="noopener noreferrer"
                className="text-[#6b5c47] dark:text-[#9e9585] hover:text-[#C9A96E] transition-colors" title="WhatsApp">
                <MessageCircle className="h-3.5 w-3.5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                className="text-[#6b5c47] dark:text-[#9e9585] hover:text-[#C9A96E] transition-colors" title="Instagram">
                <Instagram className="h-3.5 w-3.5" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                className="text-[#6b5c47] dark:text-[#9e9585] hover:text-[#C9A96E] transition-colors" title="Facebook">
                <Facebook className="h-3.5 w-3.5" />
              </a>
              <span className="text-[#e0d5c5] dark:text-[#2a2520]">|</span>
              <ThemeToggle />
              <span className="text-[#e0d5c5] dark:text-[#2a2520]">|</span>
              <Link
                href="/panier"
                className="flex items-center gap-2 text-[#6b5c47] dark:text-[#9e9585] hover:text-[#C9A96E] transition-colors"
              >
                <ShoppingCart className="h-3.5 w-3.5" />
                {isClient && cartCount > 0 && (
                  <span className="text-[10px] text-[#C9A96E] font-semibold">({cartCount})</span>
                )}
              </Link>
              <Link
                href="/contact"
                className="ml-2 px-4 py-1 border border-[#C9A96E] text-[#C9A96E] text-[10px] tracking-[0.2em] uppercase font-medium hover:bg-[#C9A96E] hover:text-[#111111] transition-all duration-300"
              >
                Rendez-vous
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ===== MAIN HEADER ===== */}
      <header
        className={`sticky top-0 z-50 transition-all duration-500 border-b border-[#e0d5c5] dark:border-[#2a2520] ${
          scrolled
            ? "bg-white/95 dark:bg-[#111111]/98 backdrop-blur-md shadow-sm dark:shadow-[0_2px_40px_rgba(0,0,0,0.6)]"
            : "bg-[#faf9f7] dark:bg-[#111111]"
        }`}
      >
        <div className="container mx-auto px-6">
          {/* Logo Row */}
          <div className="flex items-center justify-between h-20 md:h-24">
            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-[#1a1410] dark:text-[#f5f0e8] hover:text-[#C9A96E] transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            {/* Logo - Centered */}
            <Link href="/" className="flex items-center gap-4 mx-auto md:mx-0 md:absolute md:left-1/2 md:-translate-x-1/2">
              <div className="relative w-14 h-14 rounded-full overflow-hidden border border-[#e0d5c5] dark:border-[#2a2520]">
                <img
                  src="/logo.png"
                  alt="Elegance Couture"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center">
                <h1 className="font-serif text-xl md:text-2xl font-bold tracking-wider text-[#1a1410] dark:text-[#f5f0e8]">
                  ELEGANCE <span className="text-[#C9A96E]">COUTURE PRESTIGE</span>
                </h1>
                <p className="text-[8px] tracking-[0.35em] uppercase text-[#6b5c47] dark:text-[#9e9585] mt-0.5">
                  ✦ Mode Africaine ✦
                </p>
              </div>
            </Link>

            {/* Mobile: cart */}
            <div className="flex items-center gap-3 md:opacity-0 md:pointer-events-none">
              <Link href="/panier" className="text-[#1a1410] dark:text-[#f5f0e8] hover:text-[#C9A96E] transition-colors relative">
                <ShoppingCart className="h-5 w-5" />
                {isClient && cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#C9A96E] text-[#111111] text-[9px] rounded-full h-4 w-4 flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* Navigation Row (desktop) */}
          <nav className="hidden md:flex items-center justify-center border-t border-[#e0d5c5] dark:border-[#2a2520] h-12">
            {navLinks.map((link, idx) => (
              <div key={link.href} className="flex items-center">
                {idx > 0 && (
                  <span className="text-[#e0d5c5] dark:text-[#2a2520] mx-1 text-xs">|</span>
                )}
                <Link
                  href={link.href}
                  className="px-5 text-[11px] tracking-[0.18em] uppercase font-medium text-[#6b5c47] dark:text-[#9e9585] hover:text-[#C9A96E] transition-colors duration-200 relative group py-3"
                >
                  {link.label}
                  <span className="absolute bottom-2 left-1/2 -translate-x-1/2 w-0 h-px bg-[#C9A96E] group-hover:w-4 transition-all duration-300" />
                </Link>
              </div>
            ))}
          </nav>
        </div>

        {/* Mobile Nav Drawer */}
        {mobileOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-[#0d0d0d] border-b border-[#e0d5c5] dark:border-[#2a2520] z-50">
            <nav className="container mx-auto px-6 py-6 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-[12px] tracking-[0.2em] uppercase font-medium text-[#6b5c47] dark:text-[#9e9585] hover:text-[#C9A96E] transition-colors py-3 border-b border-[#f0ebe3] dark:border-[#1a1a1a]"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 flex flex-col gap-2">
                <a href="tel:+221778137032" className="flex items-center gap-2 text-[11px] tracking-wide text-[#6b5c47] dark:text-[#9e9585]">
                  <Phone className="h-3 w-3 text-[#C9A96E]" /> +221 77 813 70 32
                </a>
                <a href="https://wa.me/221778137032" className="flex items-center gap-2 text-[11px] tracking-wide text-[#6b5c47] dark:text-[#9e9585]">
                  <MessageCircle className="h-3 w-3 text-[#C9A96E]" /> WhatsApp
                </a>
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  )
}
