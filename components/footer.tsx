import Link from "next/link"
import { Phone, Mail, MapPin, Instagram, Facebook, MessageCircle } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-[#0d0d0d] border-t border-[#2a2520]">
      {/* Main Footer Grid */}
      <div className="container mx-auto px-6 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

          {/* Brand Column */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-full overflow-hidden border border-[#2a2520]">
                <img src="/logo.png" alt="Elegance Couture" className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-[#f5f0e8] tracking-wider">
                  ELEGANCE <span className="text-[#C9A96E]">COUTURE</span>
                </h3>
                <p className="text-[8px] tracking-[0.3em] uppercase text-[#9e9585]">✦ Mode Africaine ✦</p>
              </div>
            </div>
            <p className="text-[12px] text-[#9e9585] leading-relaxed mb-6 tracking-wide">
              Votre maison de mode africaine et couture sur mesure au Sénégal. Robes, boubous, complets et accessoires de haute qualité.
            </p>
            {/* Social */}
            <div className="flex gap-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 border border-[#2a2520] flex items-center justify-center text-[#9e9585] hover:border-[#C9A96E] hover:text-[#C9A96E] transition-all duration-300">
                <Instagram className="h-3.5 w-3.5" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 border border-[#2a2520] flex items-center justify-center text-[#9e9585] hover:border-[#C9A96E] hover:text-[#C9A96E] transition-all duration-300">
                <Facebook className="h-3.5 w-3.5" />
              </a>
              <a href="https://wa.me/221778137032" target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 border border-[#2a2520] flex items-center justify-center text-[#9e9585] hover:border-[#C9A96E] hover:text-[#C9A96E] transition-all duration-300">
                <MessageCircle className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          {/* Collections */}
          <div>
            <h4 className="text-[10px] tracking-[0.3em] uppercase font-semibold text-[#f5f0e8] mb-6">Collections</h4>
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
                  <Link href={link.href} className="text-[12px] tracking-wide text-[#9e9585] hover:text-[#C9A96E] transition-colors flex items-center gap-2 group">
                    <span className="w-4 h-px bg-[#2a2520] group-hover:bg-[#C9A96E] transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Information */}
          <div>
            <h4 className="text-[10px] tracking-[0.3em] uppercase font-semibold text-[#f5f0e8] mb-6">Informations</h4>
            <ul className="space-y-3">
              {[
                { href: "/about", label: "À Propos" },
                { href: "/contact", label: "Contact" },
                { href: "/livraison", label: "Livraison" },
                { href: "/retours", label: "Retours & Échanges" },
                { href: "/conditions", label: "Conditions Générales" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[12px] tracking-wide text-[#9e9585] hover:text-[#C9A96E] transition-colors flex items-center gap-2 group">
                    <span className="w-4 h-px bg-[#2a2520] group-hover:bg-[#C9A96E] transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[10px] tracking-[0.3em] uppercase font-semibold text-[#f5f0e8] mb-6">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-3.5 w-3.5 mt-0.5 flex-shrink-0 text-[#C9A96E]" />
                <span className="text-[12px] text-[#9e9585] leading-relaxed tracking-wide">Grand Dakar, Thiossane<br />Dakar, Sénégal</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="h-3.5 w-3.5 mt-0.5 flex-shrink-0 text-[#C9A96E]" />
                <div className="flex flex-col gap-1">
                  <a href="tel:+221778137032" className="text-[12px] text-[#9e9585] hover:text-[#C9A96E] transition-colors tracking-wide">
                    +221 77 813 70 32
                  </a>
                  <a href="tel:+221774468922" className="text-[12px] text-[#9e9585] hover:text-[#C9A96E] transition-colors tracking-wide">
                    +221 77 446 89 22
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-3.5 w-3.5 flex-shrink-0 text-[#C9A96E]" />
                <a href="mailto:contact@elegancecouture.sn" className="text-[12px] text-[#9e9585] hover:text-[#C9A96E] transition-colors tracking-wide break-all">
                  contact@elegancecouture.sn
                </a>
              </li>
              <li className="flex items-center gap-3">
                <MessageCircle className="h-3.5 w-3.5 flex-shrink-0 text-[#C9A96E]" />
                <a href="https://wa.me/221778137032" target="_blank" rel="noopener noreferrer" className="text-[12px] text-[#9e9585] hover:text-[#C9A96E] transition-colors">
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#2a2520]">
        <div className="container mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-[11px] tracking-widest text-[#9e9585] uppercase">
            © {new Date().getFullYear()} Elegance Couture — Tous droits réservés
          </p>
          <p className="text-[11px] tracking-wide text-[#9e9585]">
            Fait avec ❤️ au Sénégal
          </p>
          <div className="flex items-center gap-5">
            <Link href="/livraison" className="text-[11px] tracking-wide text-[#9e9585] hover:text-[#C9A96E] transition-colors uppercase">
              Livraison
            </Link>
            <Link href="/retours" className="text-[11px] tracking-wide text-[#9e9585] hover:text-[#C9A96E] transition-colors uppercase">
              Retours
            </Link>
            <Link href="/conditions" className="text-[11px] tracking-wide text-[#9e9585] hover:text-[#C9A96E] transition-colors uppercase">
              CGV
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
