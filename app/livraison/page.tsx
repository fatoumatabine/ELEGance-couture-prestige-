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
      <section className="flex h-56 items-center justify-center border-b border-[#3b2717] bg-[#120b06] px-4 sm:h-64">
        <div className="text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-8 bg-[#FF9D00]" />
            <span className="text-[10px] uppercase tracking-[0.24em] text-[#FF9D00] sm:tracking-[0.4em]">Informations</span>
            <div className="h-px w-8 bg-[#FF9D00]" />
          </div>
          <h1 className="font-serif text-3xl font-bold tracking-wide text-[#fff8ed] sm:text-4xl md:text-5xl">
            Livraison
          </h1>
        </div>
      </section>

      <main className="flex-1">

        {/* Features */}
        <section className="border-b border-[#3b2717] bg-[#180f08] py-12 sm:py-16">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 gap-px bg-[#3b2717] min-[420px]:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: Truck, title: "Livraison Rapide", desc: "Dès 24h à Dakar" },
                { icon: Package, title: "Emballage Luxueux", desc: "Packaging soigné" },
                { icon: Shield, title: "Sécurisée", desc: "Colis protégé" },
                { icon: Clock, title: "Suivi en Temps Réel", desc: "Numéro de suivi SMS" },
              ].map((f, i) => (
                <div key={i} className="bg-[#180f08] p-6 text-center sm:p-8">
                  <f.icon className="w-5 h-5 text-[#FF9D00] mx-auto mb-3" />
                  <h4 className="text-[11px] tracking-[0.2em] uppercase text-[#fff8ed] font-semibold mb-1">{f.title}</h4>
                  <p className="text-[11px] text-[#d7ba8c]">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Zones */}
        <section className="bg-[#120b06] py-14 sm:py-20">
          <div className="container mx-auto max-w-3xl px-4 sm:px-6">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-4 mb-5">
                <div className="h-px w-8 bg-[#FF9D00]" />
                <span className="text-[10px] tracking-[0.35em] uppercase text-[#FF9D00]">Zones & Tarifs</span>
                <div className="h-px w-8 bg-[#FF9D00]" />
              </div>
              <h2 className="font-serif text-3xl text-[#fff8ed] font-bold tracking-wide">Zones de Livraison</h2>
            </div>
            <div className="overflow-x-auto border border-[#3b2717]">
              <div className="min-w-[620px]">
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
            </div>
            <p className="text-[11px] text-[#d7ba8c] mt-4 tracking-wide">
              * La livraison gratuite est offerte pour toute commande supérieure à 25 000 CFA dans le Grand Dakar.
            </p>
          </div>
        </section>

        {/* Process */}
        <section className="bg-[#180f08] py-14 sm:py-20">
          <div className="container mx-auto max-w-4xl px-4 sm:px-6">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-4 mb-5">
                <div className="h-px w-8 bg-[#FF9D00]" />
                <span className="text-[10px] tracking-[0.35em] uppercase text-[#FF9D00]">Processus</span>
                <div className="h-px w-8 bg-[#FF9D00]" />
              </div>
              <h2 className="font-serif text-3xl text-[#fff8ed] font-bold tracking-wide">Comment Ça Marche ?</h2>
            </div>
            <div className="grid grid-cols-1 gap-6 min-[420px]:grid-cols-2 lg:grid-cols-4">
              {steps.map((s, i) => (
                <div key={i} className="text-center relative">
                  {i < steps.length - 1 && (
                    <div className="absolute left-1/2 top-6 hidden h-px w-full bg-[#3b2717] lg:block" />
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
        <section className="border-t border-[#3b2717] bg-[#120b06] px-4 py-14 text-center">
          <p className="text-[#d7ba8c] text-sm mb-6 tracking-wide">Des questions sur la livraison ?</p>
          <Link
            href="/contact"
            className="inline-flex w-full max-w-[20rem] items-center justify-center gap-2 bg-[#FF9D00] px-6 py-4 text-center text-[10px] font-semibold uppercase tracking-[0.16em] text-[#180f08] transition-all duration-300 hover:bg-[#FFCF71] sm:w-auto sm:max-w-none sm:px-8 sm:text-[11px] sm:tracking-[0.25em]"
          >
            Contactez-nous
          </Link>
        </section>
      </main>
      <Footer />
    </div>
  )
}
