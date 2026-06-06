import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Check, Award, Users, MapPin, Heart } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  const values = [
    {
      icon: Award,
      title: "Excellence",
      desc: "Chaque pièce est confectionnée avec le plus grand soin et les meilleurs matériaux pour un résultat impeccable."
    },
    {
      icon: Heart,
      title: "Passion",
      desc: "Nous mettons toute notre passion dans chaque création, du choix des tissus jusqu'aux finitions les plus fines."
    },
    {
      icon: Users,
      title: "Tradition",
      desc: "Nos tailleurs perpétuent un savoir-faire ancestral tout en l'adaptant aux tendances contemporaines."
    },
    {
      icon: MapPin,
      title: "Ancrage Local",
      desc: "Fiers de nos racines sénégalaises, nous travaillons avec des artisans locaux pour soutenir l'économie africaine."
    },
  ]

  const team = [
    { name: "Mamadou Diallo", role: "Fondateur & Directeur Artistique", initial: "M" },
    { name: "Aminata Ndiaye", role: "Styliste en Chef", initial: "A" },
    { name: "Ibrahim Sow", role: "Maître Tailleur", initial: "I" },
    { name: "Rokhaya Ba", role: "Responsable Clientèle", initial: "R" },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-[#180f08]">
      <Header />

      {/* Page Hero */}
      <section className="relative h-64 md:h-80 bg-[#120b06] border-b border-[#3b2717] flex items-center justify-center">
        <div className="text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-8 bg-[#FF9D00]" />
            <span className="text-[10px] tracking-[0.4em] uppercase text-[#FF9D00]">Notre Maison</span>
            <div className="h-px w-8 bg-[#FF9D00]" />
          </div>
          <h1 className="font-serif text-4xl md:text-5xl text-[#fff8ed] font-bold tracking-wide">
            À Propos de Nous
          </h1>
        </div>
      </section>

      <main className="flex-1">

        {/* Story Section */}
        <section className="py-24 bg-[#180f08]">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-px w-10 bg-[#FF9D00]" />
                  <span className="text-[10px] tracking-[0.35em] uppercase text-[#FF9D00]">Notre Histoire</span>
                </div>
                <h2 className="font-serif text-4xl text-[#fff8ed] font-bold mb-6 leading-tight">
                  Né de la Passion<br />
                  <span className="text-[#FF9D00]">de l'Élégance</span>
                </h2>
                <p className="text-[#d7ba8c] text-sm leading-relaxed mb-5 tracking-wide">
                  Fondée à Grand Dakar, Thiossane, Elegance Couture est née de la vision de créer un espace
                  où la mode africaine traditionnelle rencontre l'élégance contemporaine. Notre maison
                  de couture a été fondée avec la conviction que chaque femme et chaque homme mérite
                  de porter des créations qui reflètent leur personnalité et leur culture.
                </p>
                <p className="text-[#d7ba8c] text-sm leading-relaxed mb-8 tracking-wide">
                  Au fil des années, nous avons bâti une réputation d'excellence grâce à notre
                  engagement indéfectible envers la qualité, l'innovation et le respect des traditions
                  artisanales africaines. Chaque pièce raconte une histoire, celle d'un continent
                  riche et d'un peuple créatif.
                </p>
                <div className="space-y-3">
                  {[
                    "Plus de 5 000 clients satisfaits",
                    "Artisans qualifiés et passionnés",
                    "Tissus premium sélectionnés avec soin",
                    "Création sur mesure disponible",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-[#FF9D00] flex-shrink-0" />
                      <p className="text-[#d4cdc2] text-sm tracking-wide">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="aspect-[4/5] bg-[#1a1a1a] overflow-hidden">
                  <img
                    src="/logo.png"
                    alt="Elegance Couture Atelier"
                    className="w-full h-full object-contain p-10"
                  />
                </div>
                <div className="absolute -bottom-4 -left-4 w-24 h-24 border border-[#FF9D00]" />
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 bg-[#120b06] border-y border-[#3b2717]">
          <div className="container mx-auto px-6">
            <div className="text-center mb-14">
              <div className="flex items-center justify-center gap-4 mb-5">
                <div className="h-px w-10 bg-[#FF9D00]" />
                <span className="text-[10px] tracking-[0.35em] uppercase text-[#FF9D00]">Nos Valeurs</span>
                <div className="h-px w-10 bg-[#FF9D00]" />
              </div>
              <h2 className="font-serif text-4xl text-[#fff8ed] font-bold tracking-wide">Ce Qui Nous Définit</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((val, idx) => (
                <div key={idx} className="border border-[#3b2717] p-8 hover:border-[#FF9D00]/40 transition-colors duration-300 group text-center">
                  <div className="w-12 h-12 border border-[#3b2717] group-hover:border-[#FF9D00] flex items-center justify-center mx-auto mb-5 transition-colors">
                    <val.icon className="w-5 h-5 text-[#FF9D00]" />
                  </div>
                  <h3 className="text-[11px] tracking-[0.2em] uppercase font-semibold text-[#fff8ed] mb-3">{val.title}</h3>
                  <p className="text-[12px] text-[#d7ba8c] leading-relaxed tracking-wide">{val.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-20 bg-[#180f08]">
          <div className="container mx-auto px-6">
            <div className="text-center mb-14">
              <div className="flex items-center justify-center gap-4 mb-5">
                <div className="h-px w-10 bg-[#FF9D00]" />
                <span className="text-[10px] tracking-[0.35em] uppercase text-[#FF9D00]">Notre Équipe</span>
                <div className="h-px w-10 bg-[#FF9D00]" />
              </div>
              <h2 className="font-serif text-4xl text-[#fff8ed] font-bold tracking-wide">Les Artisans du Rêve</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {team.map((member, idx) => (
                <div key={idx} className="text-center group">
                  <div className="w-20 h-20 mx-auto bg-[#FF9D00] flex items-center justify-center text-[#180f08] font-serif text-2xl font-bold mb-4 group-hover:bg-[#FFCF71] transition-colors">
                    {member.initial}
                  </div>
                  <h4 className="text-[#fff8ed] text-sm font-semibold tracking-wide mb-1">{member.name}</h4>
                  <p className="text-[11px] tracking-[0.15em] text-[#d7ba8c] uppercase">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-14 bg-[#120b06] border-y border-[#3b2717]">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { number: "5000+", label: "Clients Heureux" },
                { number: "500+", label: "Créations" },
                { number: "25+", label: "Artisans" },
                { number: "10", label: "Pays Desservis" },
              ].map((stat, idx) => (
                <div key={idx}>
                  <div className="font-serif text-4xl font-bold text-[#FF9D00] mb-2">{stat.number}</div>
                  <p className="text-[10px] tracking-[0.25em] uppercase text-[#d7ba8c]">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-[#180f08] text-center">
          <div className="container mx-auto px-6">
            <h2 className="font-serif text-3xl text-[#fff8ed] font-bold mb-4 tracking-wide">
              Prêt à Nous Rencontrer ?
            </h2>
            <p className="text-[#d7ba8c] text-sm mb-8 max-w-sm mx-auto tracking-wide">
              Venez découvrir notre atelier et nos créations à Keur Massar, Dakar
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#FF9D00] text-[#180f08] text-[11px] tracking-[0.25em] uppercase font-semibold hover:bg-[#FFCF71] transition-all duration-300"
              >
                Nous Contacter
              </Link>
              <Link
                href="/boutique"
                className="inline-flex items-center gap-2 px-8 py-4 border border-[#FF9D00] text-[#FF9D00] text-[11px] tracking-[0.25em] uppercase font-medium hover:bg-[#FF9D00] hover:text-[#180f08] transition-all duration-300"
              >
                Voir la Boutique
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  )
}
