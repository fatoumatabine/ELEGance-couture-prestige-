import Link from "next/link"
import { Phone, Mail, MapPin, Instagram, Facebook, MessageCircle } from "lucide-react"

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-[#3b2717] bg-[#120b06]">
      <div className="editorial-grid absolute inset-0 opacity-[0.06]" />
      {/* Main Footer Grid */}
      <div className="container relative mx-auto px-6 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

          {/* Brand Column */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="h-12 w-12 overflow-hidden rounded-full border border-[#FF9D00]/35 bg-[#211207] p-0.5 shadow-[0_12px_34px_rgba(255,157,0,0.16)]">
                <img src="/logo.png" alt="Elegance Couture" className="h-full w-full rounded-full object-cover" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-[#fff8ed] tracking-wider">
                  ELEGANCE <span className="brand-text-gradient">COUTURE</span>
                </h3>
                <p className="text-[8px] tracking-[0.3em] uppercase text-[#d7ba8c]">Mode Africaine Premium</p>
              </div>
            </div>
            <p className="text-[12px] text-[#d7ba8c] leading-relaxed mb-6 tracking-wide">
              Votre maison de mode africaine et couture sur mesure au Sénégal. Robes, boubous, complets et accessoires de haute qualité.
            </p>
            {/* Social */}
            <div className="flex gap-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center border border-[#3b2717] text-[#d7ba8c] transition-all duration-300 hover:border-[#FF9D00] hover:bg-[#FF9D00] hover:text-[#180f08]">
                <Instagram className="h-3.5 w-3.5" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center border border-[#3b2717] text-[#d7ba8c] transition-all duration-300 hover:border-[#FF9D00] hover:bg-[#FF9D00] hover:text-[#180f08]">
                <Facebook className="h-3.5 w-3.5" />
              </a>
              <a href="https://wa.me/221778137032" target="_blank" rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center border border-[#3b2717] text-[#d7ba8c] transition-all duration-300 hover:border-[#FF9D00] hover:bg-[#FF9D00] hover:text-[#180f08]">
                <MessageCircle className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          {/* Collections */}
          <div>
            <h4 className="text-[10px] tracking-[0.3em] uppercase font-semibold text-[#fff8ed] mb-6">Collections</h4>
            <ul className="space-y-3">
              {[
                { href: "/robes", label: "Robes de Gala" },
                { href: "/jupes", label: "Jupes & Ensembles" },
                { href: "/pantalons", label: "Pantalons" },
                { href: "/parfums", label: "Parfums" },
                { href: "/accessoires", label: "Accessoires" },
                { href: "/boutique", label: "Toute la Boutique" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[12px] tracking-wide text-[#d7ba8c] hover:text-[#FF9D00] transition-colors flex items-center gap-2 group">
                    <span className="w-4 h-px bg-[#3b2717] group-hover:bg-[#FF9D00] transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Information */}
          <div>
            <h4 className="text-[10px] tracking-[0.3em] uppercase font-semibold text-[#fff8ed] mb-6">Informations</h4>
            <ul className="space-y-3">
              {[
                { href: "/a-propos", label: "À Propos" },
                { href: "/contact", label: "Contact" },
                { href: "/livraison", label: "Livraison" },
                { href: "/retours", label: "Retours & Échanges" },
                { href: "/conditions", label: "Conditions Générales" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[12px] tracking-wide text-[#d7ba8c] hover:text-[#FF9D00] transition-colors flex items-center gap-2 group">
                    <span className="w-4 h-px bg-[#3b2717] group-hover:bg-[#FF9D00] transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[10px] tracking-[0.3em] uppercase font-semibold text-[#fff8ed] mb-6">Contact</h4>
            <ul className="space-y-4">
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
                <a href="mailto:contact@elegancecouture.sn" className="text-[12px] text-[#d7ba8c] hover:text-[#FF9D00] transition-colors tracking-wide break-all">
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
        <div className="container mx-auto flex flex-col items-center justify-between gap-3 px-6 py-5 md:flex-row">
          <p className="text-[11px] tracking-widest text-[#d7ba8c] uppercase">
            © {new Date().getFullYear()} Elegance Couture — Tous droits réservés
          </p>
          <p className="text-[11px] tracking-wide text-[#d7ba8c]">
            Fait avec ❤️ au Sénégal
          </p>
          <div className="flex items-center gap-5">
            <Link href="/livraison" className="text-[11px] tracking-wide text-[#d7ba8c] hover:text-[#FF9D00] transition-colors uppercase">
              Livraison
            </Link>
            <Link href="/retours" className="text-[11px] tracking-wide text-[#d7ba8c] hover:text-[#FF9D00] transition-colors uppercase">
              Retours
            </Link>
            <Link href="/conditions" className="text-[11px] tracking-wide text-[#d7ba8c] hover:text-[#FF9D00] transition-colors uppercase">
              CGV
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
