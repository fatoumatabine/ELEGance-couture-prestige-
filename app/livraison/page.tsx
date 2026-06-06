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
    <div className="min-h-screen flex flex-col bg-[#180f08]">
      <Header />

      {/* Hero */}
      <section className="h-64 bg-[#120b06] border-b border-[#3b2717] flex items-center justify-center">
        <div className="text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-8 bg-[#FF9D00]" />
            <span className="text-[10px] tracking-[0.4em] uppercase text-[#FF9D00]">Informations</span>
            <div className="h-px w-8 bg-[#FF9D00]" />
          </div>
          <h1 className="font-serif text-4xl md:text-5xl text-[#fff8ed] font-bold tracking-wide">
            Livraison
          </h1>
        </div>
      </section>

      <main className="flex-1">

        {/* Features */}
        <section className="py-16 bg-[#180f08] border-b border-[#3b2717]">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#3b2717]">
              {[
                { icon: Truck, title: "Livraison Rapide", desc: "Dès 24h à Dakar" },
                { icon: Package, title: "Emballage Luxueux", desc: "Packaging soigné" },
                { icon: Shield, title: "Sécurisée", desc: "Colis protégé" },
                { icon: Clock, title: "Suivi en Temps Réel", desc: "Numéro de suivi SMS" },
              ].map((f, i) => (
                <div key={i} className="bg-[#180f08] p-8 text-center">
                  <f.icon className="w-5 h-5 text-[#FF9D00] mx-auto mb-3" />
                  <h4 className="text-[11px] tracking-[0.2em] uppercase text-[#fff8ed] font-semibold mb-1">{f.title}</h4>
                  <p className="text-[11px] text-[#d7ba8c]">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Zones */}
        <section className="py-20 bg-[#120b06]">
          <div className="container mx-auto px-6 max-w-3xl">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-4 mb-5">
                <div className="h-px w-8 bg-[#FF9D00]" />
                <span className="text-[10px] tracking-[0.35em] uppercase text-[#FF9D00]">Zones & Tarifs</span>
                <div className="h-px w-8 bg-[#FF9D00]" />
              </div>
              <h2 className="font-serif text-3xl text-[#fff8ed] font-bold tracking-wide">Zones de Livraison</h2>
            </div>
            <div className="border border-[#3b2717]">
              <div className="grid grid-cols-3 border-b border-[#3b2717] bg-[#1a1a1a]">
                <div className="px-6 py-4 text-[10px] tracking-[0.2em] uppercase text-[#FF9D00] font-semibold">Zone</div>
                <div className="px-6 py-4 text-[10px] tracking-[0.2em] uppercase text-[#FF9D00] font-semibold">Délai</div>
                <div className="px-6 py-4 text-[10px] tracking-[0.2em] uppercase text-[#FF9D00] font-semibold">Tarif</div>
              </div>
              {zones.map((z, i) => (
                <div key={i} className={`grid grid-cols-3 ${i < zones.length - 1 ? "border-b border-[#3b2717]" : ""}`}>
                  <div className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3 h-3 text-[#FF9D00]" />
                      <span className="text-[12px] text-[#fff8ed] tracking-wide">{z.zone}</span>
                    </div>
                  </div>
                  <div className="px-6 py-5 text-[12px] text-[#d7ba8c] tracking-wide">{z.delai}</div>
                  <div className="px-6 py-5 text-[12px] text-[#FF9D00] tracking-wide font-medium">{z.tarif}</div>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-[#d7ba8c] mt-4 tracking-wide">
              * La livraison gratuite est offerte pour toute commande supérieure à 25 000 CFA dans le Grand Dakar.
            </p>
          </div>
        </section>

        {/* Process */}
        <section className="py-20 bg-[#180f08]">
          <div className="container mx-auto px-6 max-w-4xl">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-4 mb-5">
                <div className="h-px w-8 bg-[#FF9D00]" />
                <span className="text-[10px] tracking-[0.35em] uppercase text-[#FF9D00]">Processus</span>
                <div className="h-px w-8 bg-[#FF9D00]" />
              </div>
              <h2 className="font-serif text-3xl text-[#fff8ed] font-bold tracking-wide">Comment Ça Marche ?</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {steps.map((s, i) => (
                <div key={i} className="text-center relative">
                  {i < steps.length - 1 && (
                    <div className="hidden md:block absolute top-6 left-1/2 w-full h-px bg-[#3b2717]" />
                  )}
                  <div className="relative w-12 h-12 border border-[#FF9D00] flex items-center justify-center mx-auto mb-4 bg-[#180f08]">
                    <span className="font-serif text-sm text-[#FF9D00] font-bold">{s.step}</span>
                  </div>
                  <h4 className="text-[11px] tracking-[0.2em] uppercase text-[#fff8ed] font-semibold mb-2">{s.title}</h4>
                  <p className="text-[11px] text-[#d7ba8c] leading-relaxed tracking-wide">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-14 bg-[#120b06] border-t border-[#3b2717] text-center">
          <p className="text-[#d7ba8c] text-sm mb-6 tracking-wide">Des questions sur la livraison ?</p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#FF9D00] text-[#180f08] text-[11px] tracking-[0.25em] uppercase font-semibold hover:bg-[#FFCF71] transition-all duration-300"
          >
            Contactez-nous
          </Link>
        </section>
      </main>
      <Footer />
    </div>
  )
}
