import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Scissors, Award, Cpu, Heart, MapPin, Calendar, Crown } from "lucide-react"

export const metadata: Metadata = {
  title: "Notre Histoire - Elegance Couture Prestige",
  description: "L'aiguille dans le sang, l'excellence comme héritage. Découvrez l'histoire d'Elegance Couture Prestige.",
}

const chapters = [
  {
    year: "Avant 2019",
    number: "01",
    title: "L'Aiguille dans le Sang",
    text: "Bien avant les machines modernes et les logiciels de coupe, tout commence avec un père, ses mains d'exception, et une passion transmise comme on transmet un trésor de génération en génération.",
    accent: false,
  },
  {
    year: "Côte d'Ivoire",
    number: "02",
    title: "L'Héritage Ivoirien",
    text: "Notre père n'était pas un couturier ordinaire. Il a exercé son art pendant de longues années en Côte d'Ivoire, où son talent l'a conduit aux plus hautes sphères — habillant des Présidents de la République et des Premiers Ministres ivoiriens. Son nom circulait dans les couloirs du protocole.",
    accent: true,
  },
  {
    year: "Sénégal",
    number: "03",
    title: "Touba Couture Prestige",
    text: "Fort de ce bagage exceptionnel, il a choisi de s'établir au Sénégal, où il a fondé Touba Couture Prestige — une maison qui s'est imposée rapidement comme une référence incontournable de la haute couture africaine.",
    accent: false,
  },
  {
    year: "2019",
    number: "04",
    title: "La Relève",
    text: "Nous, ses fils, avons grandi entre les rouleaux de tissu et le bruit rythmé des machines à coudre. La couture n'est pas pour nous un choix de carrière. C'est un héritage. C'est une identité. C'est notre sang.",
    accent: true,
  },
]

const values = [
  {
    icon: Crown,
    title: "Excellence",
    desc: "Chaque point de couture est un acte de précision. Rien n'est laissé au hasard.",
    size: "large",
  },
  {
    icon: Scissors,
    title: "Artisanat",
    desc: "Un savoir-faire transmis de père en fils depuis des décennies.",
    size: "small",
  },
  {
    icon: Cpu,
    title: "Innovation",
    desc: "Machines à commande numérique et logiciels de CAO au service de la tradition.",
    size: "small",
  },
  {
    icon: Heart,
    title: "Passion",
    desc: "L'amour du tissu, de la coupe et du client — notre moteur depuis 2019.",
    size: "large",
  },
]

const stats = [
  { number: "40+", label: "Ans d'expérience familiale" },
  { number: "500+", label: "Créations sur mesure" },
  { number: "5000+", label: "Clients satisfaits" },
  { number: "10", label: "Pays desservis" },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">

        {/* ===== HERO CINÉMATIQUE ===== */}
        <section className="relative min-h-[92vh] flex flex-col items-center justify-center overflow-hidden bg-[#0d0d0d]">
          {/* Decorative diagonal grid */}
          <div className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: "repeating-linear-gradient(45deg, #C9A96E 0, #C9A96E 1px, transparent 0, transparent 50%)",
              backgroundSize: "30px 30px",
            }}
          />

          {/* Vertical gold accent lines */}
          <div className="absolute left-12 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#C9A96E]/30 to-transparent hidden lg:block" />
          <div className="absolute right-12 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#C9A96E]/30 to-transparent hidden lg:block" />

          {/* Top label */}
          <div className="absolute top-16 left-1/2 -translate-x-1/2 flex items-center gap-4 z-10">
            <div className="h-px w-10 bg-[#C9A96E]/60" />
            <span className="text-[9px] tracking-[0.5em] uppercase text-[#C9A96E]/80 font-medium">
              Notre Histoire
            </span>
            <div className="h-px w-10 bg-[#C9A96E]/60" />
          </div>

          {/* Main content */}
          <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
            {/* Large editorial number */}
            <div className="font-serif text-[8rem] md:text-[14rem] lg:text-[18rem] font-bold text-[#C9A96E]/[0.06] leading-none select-none absolute -top-8 left-1/2 -translate-x-1/2 pointer-events-none whitespace-nowrap">
              2019
            </div>

            <p className="text-[10px] tracking-[0.4em] uppercase text-[#C9A96E] mb-8 animate-fadeIn">
              Elegance Couture Prestige
            </p>

            <h1 className="font-serif font-bold leading-[0.9] mb-8 animate-fadeIn"
              style={{ animationDelay: "0.1s" }}>
              <span className="block text-[3.5rem] md:text-[5.5rem] lg:text-[7rem] text-[#f5f0e8] tracking-tight">
                L'Aiguille
              </span>
              <span className="block text-[3.5rem] md:text-[5.5rem] lg:text-[7rem] text-[#C9A96E] italic font-normal tracking-tight">
                dans le Sang
              </span>
            </h1>

            <div className="h-px w-20 bg-[#C9A96E] mx-auto mb-8" />

            <p className="text-[#9e9585] text-base md:text-lg max-w-lg mx-auto leading-relaxed tracking-wide animate-fadeIn"
              style={{ animationDelay: "0.2s" }}>
              L'excellence comme héritage — une maison de couture familiale qui a habillé des chefs d'État.
            </p>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
            <span className="text-[9px] tracking-[0.3em] uppercase text-[#C9A96E]/50">Découvrir</span>
            <div className="w-px h-10 bg-gradient-to-b from-[#C9A96E]/50 to-transparent" />
          </div>
        </section>

        {/* ===== MANIFESTE ===== */}
        <section className="py-20 md:py-28 bg-background overflow-hidden">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-[10px] tracking-[0.4em] uppercase text-[#C9A96E] mb-10">Notre Identité</p>
              <blockquote className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-[1.15] mb-10">
                "Bien plus qu'un atelier —{" "}
                <em className="text-[#C9A96E] font-normal not-italic">
                  la continuité d'un héritage
                </em>{" "}
                qui a habillé des chefs d'État."
              </blockquote>
              <div className="flex items-center justify-center gap-6">
                <div className="h-px flex-1 max-w-[80px] bg-border" />
                <div className="flex items-center gap-3">
                  <MapPin className="w-3.5 h-3.5 text-[#C9A96E]" />
                  <span className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground">Grand Dakar, Thiossane</span>
                </div>
                <div className="h-px flex-1 max-w-[80px] bg-border" />
              </div>
            </div>
          </div>
        </section>

        {/* ===== CHAPITRES DE L'HISTOIRE ===== */}
        <section className="py-4 bg-background">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              {chapters.map((ch, idx) => (
                <div key={idx}
                  className={`grid grid-cols-1 lg:grid-cols-12 gap-0 mb-2 group ${ch.accent ? "" : ""}`}>

                  {/* Left column — number & year */}
                  <div className={`lg:col-span-3 flex lg:flex-col items-center lg:items-end justify-start gap-6 lg:gap-4 pb-6 lg:pb-0 lg:pr-12 ${
                    idx % 2 === 1 ? "lg:order-last lg:items-start lg:pl-12 lg:pr-0" : ""
                  }`}>
                    <div className="font-serif text-[4rem] md:text-[5rem] font-bold text-[#C9A96E]/15 leading-none select-none shrink-0">
                      {ch.number}
                    </div>
                    <div className={`flex items-center gap-3 ${idx % 2 === 1 ? "" : "lg:flex-row-reverse"}`}>
                      <Calendar className="w-3 h-3 text-[#C9A96E] shrink-0" />
                      <span className="text-[10px] tracking-[0.3em] uppercase text-[#C9A96E] font-medium">
                        {ch.year}
                      </span>
                    </div>
                  </div>

                  {/* Center — vertical line */}
                  <div className="hidden lg:flex lg:col-span-1 flex-col items-center">
                    <div className={`w-3 h-3 rounded-full border-2 border-[#C9A96E] ${ch.accent ? "bg-[#C9A96E]" : "bg-background"} mt-8 shrink-0 z-10`} />
                    <div className="w-px flex-1 bg-gradient-to-b from-[#C9A96E]/40 to-border" />
                  </div>

                  {/* Right column — content */}
                  <div className={`lg:col-span-8 ${
                    idx % 2 === 1 ? "lg:order-first" : ""
                  }`}>
                    <div className={`p-8 md:p-10 mb-8 transition-all duration-500 ${
                      ch.accent
                        ? "bg-[#0d0d0d] border border-[#2a2520] group-hover:border-[#C9A96E]/30"
                        : "bg-muted border border-border group-hover:border-[#C9A96E]/20"
                    }`}>
                      <h2 className={`font-serif text-2xl md:text-3xl font-bold mb-4 ${
                        ch.accent ? "text-[#f5f0e8]" : "text-foreground"
                      }`}>
                        {ch.title}
                      </h2>
                      <p className={`text-sm md:text-base leading-relaxed tracking-wide ${
                        ch.accent ? "text-[#9e9585]" : "text-muted-foreground"
                      }`}>
                        {ch.text}
                      </p>
                      {/* gold bottom accent */}
                      <div className="w-8 h-0.5 bg-[#C9A96E] mt-6 group-hover:w-16 transition-all duration-500" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== INNOVATION SECTION ===== */}
        <section className="py-20 md:py-28 bg-muted border-y border-border">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                {/* Text */}
                <div>
                  <p className="text-[10px] tracking-[0.4em] uppercase text-[#C9A96E] mb-6">Tradition + Innovation</p>
                  <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground leading-tight mb-6">
                    Le Passé comme<br />
                    <span className="text-[#C9A96E]">Fondation</span>,<br />
                    L'Avenir comme Vision
                  </h2>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-8 tracking-wide">
                    Nous n'avons pas simplement reproduit ce que nous avions appris. Nous avons fusionné 
                    le savoir-faire artisanal de notre père avec les outils d'aujourd'hui pour aller encore 
                    plus loin dans l'excellence.
                  </p>
                  <div className="space-y-4">
                    {[
                      "Machines à commande numérique de précision",
                      "Logiciels de conception assistée par ordinateur",
                      "Nouvelles technologies de coupe et de broderie",
                      "Finitions à la main par nos maîtres tailleurs",
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <div className="w-1.5 h-1.5 bg-[#C9A96E] shrink-0" />
                        <span className="text-foreground/80 text-sm tracking-wide">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bento values grid */}
                <div className="grid grid-cols-2 gap-3">
                  {values.map((v, i) => (
                    <div key={i} className={`group bg-card border border-border p-6 hover:border-[#C9A96E]/40 transition-all duration-400 ${
                      v.size === "large" ? "col-span-1" : ""
                    }`}>
                      <v.icon className="w-5 h-5 text-[#C9A96E] mb-5 group-hover:scale-110 transition-transform duration-300" />
                      <h3 className="font-serif text-lg font-bold text-foreground mb-2">{v.title}</h3>
                      <p className="text-muted-foreground text-xs leading-relaxed">{v.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== STATS ===== */}
        <section className="bg-[#0d0d0d]">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4">
              {stats.map((s, i) => (
                <div key={i} className={`text-center py-14 px-6 ${
                  i < stats.length - 1 ? "border-r border-[#2a2520]" : ""
                }`}>
                  <div className="font-serif text-4xl md:text-5xl font-bold text-[#C9A96E] mb-2 tracking-wide">
                    {s.number}
                  </div>
                  <p className="text-[10px] tracking-[0.2em] uppercase text-[#9e9585]">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== GRANDE CITATION ===== */}
        <section className="relative py-28 md:py-40 bg-[#0d0d0d] overflow-hidden">
          {/* Large decorative text */}
          <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none">
            <span className="font-serif text-[8rem] md:text-[14rem] font-bold text-[#C9A96E]/[0.04] whitespace-nowrap leading-none">
              PRESTIGE
            </span>
          </div>

          {/* Horizontal gold lines */}
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 flex items-center px-12 pointer-events-none">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#C9A96E]/20" />
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#C9A96E]/20" />
          </div>

          <div className="relative z-10 container mx-auto px-6 text-center">
            <div className="max-w-3xl mx-auto">
              <div className="h-px w-16 bg-[#C9A96E] mx-auto mb-12" />
              <p className="font-serif text-3xl md:text-4xl lg:text-5xl italic font-light text-[#f5f0e8] leading-[1.3] mb-10">
                "L'élégance n'est pas un service —{" "}
                <span className="text-[#C9A96E] not-italic font-semibold">c'est une promesse.</span>"
              </p>
              <div className="h-px w-16 bg-[#C9A96E] mx-auto mb-8" />
              <p className="text-[10px] tracking-[0.4em] uppercase text-[#9e9585]">
                Elegance Couture Prestige · Grand Dakar, Thiossane · Depuis 2019
              </p>
            </div>
          </div>
        </section>

        {/* ===== LOCALISATION ===== */}
        <section className="py-20 md:py-28 bg-background">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                {/* Text */}
                <div>
                  <p className="text-[10px] tracking-[0.4em] uppercase text-[#C9A96E] mb-6">Notre Adresse</p>
                  <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground leading-tight mb-6">
                    Grand Dakar,<br />
                    <span className="text-[#C9A96E]">Thiossane</span>
                  </h2>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6 tracking-wide">
                    Au cœur d'un quartier vivant, créatif et profondément ancré dans la culture sénégalaise, 
                    notre atelier vous accueille pour des créations sur mesure qui racontent votre histoire.
                  </p>
                  <div className="flex items-start gap-4 mb-4">
                    <MapPin className="w-4 h-4 text-[#C9A96E] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-foreground text-sm font-medium">Grand Dakar, Thiossane</p>
                      <p className="text-muted-foreground text-sm">Dakar, Sénégal</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Award className="w-4 h-4 text-[#C9A96E] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-foreground text-sm font-medium">Fondée en 2019</p>
                      <p className="text-muted-foreground text-sm">Sur un héritage de 40+ ans d'excellence</p>
                    </div>
                  </div>
                </div>

                {/* Decorative card */}
                <div className="relative">
                  <div className="bg-[#0d0d0d] border border-[#2a2520] p-10 md:p-14">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="h-px w-8 bg-[#C9A96E]" />
                      <span className="text-[9px] tracking-[0.4em] uppercase text-[#C9A96E]">Notre Promesse</span>
                    </div>
                    <h3 className="font-serif text-2xl md:text-3xl font-bold text-[#f5f0e8] mb-6 leading-tight">
                      Chaque pièce taillée<br />avec l'exigence d'un<br />
                      <span className="text-[#C9A96E]">chef d'État.</span>
                    </h3>
                    <p className="text-[#9e9585] text-sm leading-relaxed tracking-wide">
                      Qu'il s'agisse d'un boubou, d'une robe de gala ou d'un complet sur mesure, 
                      nous apportons à chaque création le même niveau d'excellence qui a fait 
                      notre réputation auprès des plus hautes sphères.
                    </p>
                    <div className="mt-8 w-8 h-0.5 bg-[#C9A96E]" />
                  </div>
                  {/* Gold corner accent */}
                  <div className="absolute -bottom-3 -right-3 w-20 h-20 border border-[#C9A96E]/40 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== CTA FINAL ===== */}
        <section className="relative py-24 md:py-32 bg-[#0d0d0d] overflow-hidden border-t border-[#2a2520]">
          <div className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: "repeating-linear-gradient(-45deg, #C9A96E 0, #C9A96E 1px, transparent 0, transparent 50%)",
              backgroundSize: "24px 24px",
            }}
          />

          <div className="relative z-10 container mx-auto px-6 text-center">
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="h-px w-10 bg-[#C9A96E]" />
                <span className="text-[9px] tracking-[0.4em] uppercase text-[#C9A96E]">Commencez l'Aventure</span>
                <div className="h-px w-10 bg-[#C9A96E]" />
              </div>

              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-[#f5f0e8] mb-6 leading-tight">
                Votre Histoire<br />
                <span className="text-[#C9A96E] italic font-normal">commence ici.</span>
              </h2>

              <p className="text-[#9e9585] text-sm md:text-base leading-relaxed tracking-wide mb-12 max-w-lg mx-auto">
                Venez nous rendre visite à Grand Dakar, Thiossane. Ensemble, 
                nous créerons une pièce qui racontera votre propre histoire.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/boutique"
                  className="inline-flex items-center justify-center gap-3 px-10 py-4 bg-[#C9A96E] text-white text-[11px] tracking-[0.25em] uppercase font-semibold hover:bg-[#e8d5b0] hover:text-[#1a1410] transition-all duration-300"
                >
                  Voir nos Créations
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-3 px-10 py-4 border border-[#C9A96E]/60 text-[#C9A96E] text-[11px] tracking-[0.25em] uppercase font-medium hover:border-[#C9A96E] hover:bg-[#C9A96E]/10 transition-all duration-300"
                >
                  Prendre Rendez-vous
                </Link>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}
