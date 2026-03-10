import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Package, Clock, MapPin, Shield, Truck, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function LivraisonPage() {
  const zones = [
    { zone: "Dakar Centre", delai: "24 — 48h", tarif: "Gratuit dès 25 000 CFA" },
    { zone: "Banlieue de Dakar", delai: "48 — 72h", tarif: "1 500 CFA" },
    { zone: "Autres régions du Sénégal", delai: "3 — 5 jours", tarif: "3 500 CFA" },
    { zone: "International (Afrique)", delai: "7 — 14 jours", tarif: "Sur devis" },
  ]

  const steps = [
    { step: "01", title: "Commande Passée", desc: "Vous recevez un email de confirmation avec le récapitulatif de votre commande." },
    { step: "02", title: "Préparation", desc: "Votre colis est préparé avec soin et emballé dans notre packaging luxueux signature." },
    { step: "03", title: "Expédition", desc: "Votre colis est confié à notre partenaire logistique et un numéro de suivi vous est envoyé." },
    { step: "04", title: "Livraison", desc: "Votre commande est livrée à l'adresse indiquée selon les délais estimés." },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-[#111111]">
      <Header />

      {/* Hero */}
      <section className="h-64 bg-[#0d0d0d] border-b border-[#2a2520] flex items-center justify-center">
        <div className="text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-8 bg-[#C9A96E]" />
            <span className="text-[10px] tracking-[0.4em] uppercase text-[#C9A96E]">Informations</span>
            <div className="h-px w-8 bg-[#C9A96E]" />
          </div>
          <h1 className="font-serif text-4xl md:text-5xl text-[#f5f0e8] font-bold tracking-wide">
            Livraison
          </h1>
        </div>
      </section>

      <main className="flex-1">

        {/* Features */}
        <section className="py-16 bg-[#111111] border-b border-[#2a2520]">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#2a2520]">
              {[
                { icon: Truck, title: "Livraison Rapide", desc: "Dès 24h à Dakar" },
                { icon: Package, title: "Emballage Luxueux", desc: "Packaging soigné" },
                { icon: Shield, title: "Sécurisée", desc: "Colis protégé" },
                { icon: Clock, title: "Suivi en Temps Réel", desc: "Numéro de suivi SMS" },
              ].map((f, i) => (
                <div key={i} className="bg-[#111111] p-8 text-center">
                  <f.icon className="w-5 h-5 text-[#C9A96E] mx-auto mb-3" />
                  <h4 className="text-[11px] tracking-[0.2em] uppercase text-[#f5f0e8] font-semibold mb-1">{f.title}</h4>
                  <p className="text-[11px] text-[#9e9585]">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Zones */}
        <section className="py-20 bg-[#0d0d0d]">
          <div className="container mx-auto px-6 max-w-3xl">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-4 mb-5">
                <div className="h-px w-8 bg-[#C9A96E]" />
                <span className="text-[10px] tracking-[0.35em] uppercase text-[#C9A96E]">Zones & Tarifs</span>
                <div className="h-px w-8 bg-[#C9A96E]" />
              </div>
              <h2 className="font-serif text-3xl text-[#f5f0e8] font-bold tracking-wide">Zones de Livraison</h2>
            </div>
            <div className="border border-[#2a2520]">
              <div className="grid grid-cols-3 border-b border-[#2a2520] bg-[#1a1a1a]">
                <div className="px-6 py-4 text-[10px] tracking-[0.2em] uppercase text-[#C9A96E] font-semibold">Zone</div>
                <div className="px-6 py-4 text-[10px] tracking-[0.2em] uppercase text-[#C9A96E] font-semibold">Délai</div>
                <div className="px-6 py-4 text-[10px] tracking-[0.2em] uppercase text-[#C9A96E] font-semibold">Tarif</div>
              </div>
              {zones.map((z, i) => (
                <div key={i} className={`grid grid-cols-3 ${i < zones.length - 1 ? "border-b border-[#2a2520]" : ""}`}>
                  <div className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3 h-3 text-[#C9A96E]" />
                      <span className="text-[12px] text-[#f5f0e8] tracking-wide">{z.zone}</span>
                    </div>
                  </div>
                  <div className="px-6 py-5 text-[12px] text-[#9e9585] tracking-wide">{z.delai}</div>
                  <div className="px-6 py-5 text-[12px] text-[#C9A96E] tracking-wide font-medium">{z.tarif}</div>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-[#9e9585] mt-4 tracking-wide">
              * La livraison gratuite est offerte pour toute commande supérieure à 25 000 CFA dans le Grand Dakar.
            </p>
          </div>
        </section>

        {/* Process */}
        <section className="py-20 bg-[#111111]">
          <div className="container mx-auto px-6 max-w-4xl">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-4 mb-5">
                <div className="h-px w-8 bg-[#C9A96E]" />
                <span className="text-[10px] tracking-[0.35em] uppercase text-[#C9A96E]">Processus</span>
                <div className="h-px w-8 bg-[#C9A96E]" />
              </div>
              <h2 className="font-serif text-3xl text-[#f5f0e8] font-bold tracking-wide">Comment Ça Marche ?</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {steps.map((s, i) => (
                <div key={i} className="text-center relative">
                  {i < steps.length - 1 && (
                    <div className="hidden md:block absolute top-6 left-1/2 w-full h-px bg-[#2a2520]" />
                  )}
                  <div className="relative w-12 h-12 border border-[#C9A96E] flex items-center justify-center mx-auto mb-4 bg-[#111111]">
                    <span className="font-serif text-sm text-[#C9A96E] font-bold">{s.step}</span>
                  </div>
                  <h4 className="text-[11px] tracking-[0.2em] uppercase text-[#f5f0e8] font-semibold mb-2">{s.title}</h4>
                  <p className="text-[11px] text-[#9e9585] leading-relaxed tracking-wide">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-14 bg-[#0d0d0d] border-t border-[#2a2520] text-center">
          <p className="text-[#9e9585] text-sm mb-6 tracking-wide">Des questions sur la livraison ?</p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#C9A96E] text-[#111111] text-[11px] tracking-[0.25em] uppercase font-semibold hover:bg-[#e8d5b0] transition-all duration-300"
          >
            Contactez-nous
          </Link>
        </section>
      </main>
      <Footer />
    </div>
  )
}
