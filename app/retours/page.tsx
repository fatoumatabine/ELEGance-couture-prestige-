import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { RefreshCw, CheckCircle, XCircle, Clock, Mail, Phone } from "lucide-react"
import Link from "next/link"

export default function RetoursPage() {
  const accepted = [
    "Articles dans leur état d'origine, non portés et non lavés",
    "Articles avec toutes leurs étiquettes d'origine attachées",
    "Articles retournés dans leur emballage d'origine",
    "Retour effectué dans un délai de 14 jours après réception",
  ]

  const refused = [
    "Articles portés, lavés ou endommagés",
    "Articles sans étiquettes ou emballage d'origine",
    "Articles personnalisés ou réalisés sur mesure",
    "Sous-vêtements, parfums et produits d'hygiène ouverts",
    "Retour après 14 jours de la réception",
  ]

  return (
    <div className="min-h-screen flex flex-col bg-[#111111]">
      <Header />

      {/* Hero */}
      <section className="h-64 bg-[#0d0d0d] border-b border-[#2a2520] flex items-center justify-center">
        <div className="text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-8 bg-[#C9A96E]" />
            <span className="text-[10px] tracking-[0.4em] uppercase text-[#C9A96E]">Politique</span>
            <div className="h-px w-8 bg-[#C9A96E]" />
          </div>
          <h1 className="font-serif text-4xl md:text-5xl text-[#f5f0e8] font-bold tracking-wide">
            Retours & Échanges
          </h1>
        </div>
      </section>

      <main className="flex-1 py-20">
        <div className="container mx-auto px-6 max-w-3xl">

          {/* Intro */}
          <div className="text-center mb-16">
            <div className="w-14 h-14 border border-[#C9A96E] flex items-center justify-center mx-auto mb-6">
              <RefreshCw className="w-6 h-6 text-[#C9A96E]" />
            </div>
            <h2 className="font-serif text-3xl text-[#f5f0e8] font-bold mb-4 tracking-wide">
              Notre Politique de Retour
            </h2>
            <p className="text-[#9e9585] text-sm leading-relaxed tracking-wide max-w-lg mx-auto">
              Votre satisfaction est notre priorité absolue. Si pour une raison quelconque vous n'êtes
              pas entièrement satisfait(e) de votre commande, nous acceptons les retours sous 14 jours
              à compter de la date de réception.
            </p>
          </div>

          {/* Délai highlight */}
          <div className="border border-[#C9A96E]/30 bg-[#1a1a1a] p-8 mb-12 text-center">
            <Clock className="w-5 h-5 text-[#C9A96E] mx-auto mb-3" />
            <div className="font-serif text-4xl text-[#C9A96E] font-bold mb-2">14 Jours</div>
            <p className="text-[11px] tracking-[0.2em] uppercase text-[#9e9585]">Délai de retour garanti</p>
          </div>

          {/* Accepted / Refused */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            <div className="border border-[#2a2520] p-6">
              <div className="flex items-center gap-3 mb-5">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <h3 className="text-[11px] tracking-[0.2em] uppercase text-[#f5f0e8] font-semibold">Articles Acceptés</h3>
              </div>
              <ul className="space-y-3">
                {accepted.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-1 h-1 bg-[#C9A96E] rounded-full mt-2 flex-shrink-0" />
                    <p className="text-[12px] text-[#9e9585] leading-relaxed tracking-wide">{item}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="border border-[#2a2520] p-6">
              <div className="flex items-center gap-3 mb-5">
                <XCircle className="w-4 h-4 text-red-500" />
                <h3 className="text-[11px] tracking-[0.2em] uppercase text-[#f5f0e8] font-semibold">Articles Non Acceptés</h3>
              </div>
              <ul className="space-y-3">
                {refused.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-1 h-1 bg-red-500/60 rounded-full mt-2 flex-shrink-0" />
                    <p className="text-[12px] text-[#9e9585] leading-relaxed tracking-wide">{item}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Process */}
          <div className="mb-16">
            <h3 className="font-serif text-2xl text-[#f5f0e8] font-bold mb-8 tracking-wide">Comment Effectuer un Retour ?</h3>
            <div className="space-y-4">
              {[
                { step: "01", text: "Contactez notre service client par email ou WhatsApp dans les 14 jours suivant la réception." },
                { step: "02", text: "Indiquez votre numéro de commande, le ou les articles concernés et la raison du retour." },
                { step: "03", text: "Nous vous communiquerons les instructions de retour et l'adresse d'envoi." },
                { step: "04", text: "Une fois le colis reçu et vérifié, nous procéderons au remboursement ou à l'échange sous 5 jours ouvrables." },
              ].map((s, i) => (
                <div key={i} className="flex gap-5 items-start border-b border-[#2a2520] pb-5">
                  <span className="font-serif text-lg text-[#C9A96E] font-bold flex-shrink-0 w-8">{s.step}</span>
                  <p className="text-[12px] text-[#9e9585] leading-relaxed tracking-wide pt-1">{s.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="border border-[#2a2520] p-8 text-center bg-[#0d0d0d]">
            <h3 className="font-serif text-xl text-[#f5f0e8] font-bold mb-4 tracking-wide">Besoin d'Aide ?</h3>
            <p className="text-[#9e9585] text-sm mb-6 tracking-wide">Notre équipe est disponible pour vous accompagner</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:contact@elegancecouture.sn"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-[#C9A96E] text-[#C9A96E] text-[10px] tracking-[0.2em] uppercase hover:bg-[#C9A96E] hover:text-[#111111] transition-all duration-300"
              >
                <Mail className="w-3.5 h-3.5" />
                Envoyer un Email
              </a>
              <a
                href="https://wa.me/221778137032"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#C9A96E] text-[#111111] text-[10px] tracking-[0.2em] uppercase font-semibold hover:bg-[#e8d5b0] transition-all duration-300"
              >
                <Phone className="w-3.5 h-3.5" />
                WhatsApp
              </a>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  )
}
