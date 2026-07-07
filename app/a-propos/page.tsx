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
    text: "Bien avant les machines modernes et les logiciels de coupe, tout commence avec El Hadj Mor Talla Fall : un père, un maître couturier, des mains d'exception, et une passion transmise comme on transmet un trésor de génération en génération.",
    accent: false,
  },
  {
    year: "Côte d'Ivoire",
    number: "02",
    title: "Le Grand Couturier",
    text: "Notre père n'était pas un couturier ordinaire. En Côte d'Ivoire, son talent l'a conduit aux plus hautes sphères, jusqu'aux couloirs du protocole, où ses créations ont accompagné des Présidents de la République et des Premiers Ministres ivoiriens.",
    accent: true,
  },
  {
    year: "Sénégal",
    number: "03",
    title: "Touba Couture Prestige",
    text: "Fort de ce bagage exceptionnel, El Hadj Mor Talla Fall a choisi de s'établir au Sénégal, où il a fondé Touba Couture Prestige — une maison devenue une référence de la haute couture africaine.",
    accent: false,
  },
  {
    year: "2019",
    number: "04",
    title: "La Relève",
    text: "Nous, ses fils, avons grandi entre les rouleaux de tissu, les mesures prises avec calme et le bruit rythmé des machines à coudre. La couture n'est pas pour nous un choix de carrière. C'est un héritage. C'est une identité. C'est notre sang.",
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
        <section className="relative flex min-h-[calc(100svh-4rem)] flex-col items-center justify-center overflow-hidden bg-[#120b06] px-4 py-24 sm:min-h-[92vh]">
          {/* Decorative diagonal grid */}
          <div className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: "repeating-linear-gradient(45deg, #FF9D00 0, #FF9D00 1px, transparent 0, transparent 50%)",
              backgroundSize: "30px 30px",
            }}
          />

          {/* Vertical gold accent lines */}
          <div className="absolute left-12 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#FF9D00]/30 to-transparent hidden lg:block" />
          <div className="absolute right-12 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#FF9D00]/30 to-transparent hidden lg:block" />

          {/* Top label */}
          <div className="absolute left-1/2 top-12 z-10 flex -translate-x-1/2 items-center gap-3 sm:top-16 sm:gap-4">
            <div className="h-px w-10 bg-[#FF9D00]/60" />
            <span className="text-center text-[9px] font-medium uppercase tracking-[0.28em] text-[#FF9D00]/80 sm:tracking-[0.5em]">
              Notre Histoire
            </span>
            <div className="h-px w-10 bg-[#FF9D00]/60" />
          </div>

          {/* Main content */}
          <div className="relative z-10 mx-auto max-w-5xl text-center">
            {/* Large editorial number */}
            <div className="pointer-events-none absolute -top-4 left-1/2 -translate-x-1/2 select-none whitespace-nowrap font-serif text-[5.5rem] font-bold leading-none text-[#FF9D00]/[0.06] sm:-top-8 sm:text-[8rem] md:text-[14rem] lg:text-[18rem]">
              2019
            </div>

            <p className="mb-8 animate-fadeIn text-[10px] uppercase tracking-[0.24em] text-[#FF9D00] sm:tracking-[0.4em]">
              Elegance Couture Prestige
            </p>

            <h1 className="font-serif font-bold leading-[0.9] mb-8 animate-fadeIn"
              style={{ animationDelay: "0.1s" }}>
              <span className="block text-[clamp(2.7rem,15vw,3.5rem)] tracking-tight text-[#fff8ed] md:text-[5.5rem] lg:text-[7rem]">
                L'Aiguille
              </span>
              <span className="block text-[clamp(2.7rem,15vw,3.5rem)] font-normal italic tracking-tight text-[#FF9D00] md:text-[5.5rem] lg:text-[7rem]">
                dans le Sang
              </span>
            </h1>

            <div className="h-px w-20 bg-[#FF9D00] mx-auto mb-8" />

            <p className="text-[#d7ba8c] text-base md:text-lg max-w-lg mx-auto leading-relaxed tracking-wide animate-fadeIn"
              style={{ animationDelay: "0.2s" }}>
              L'excellence comme héritage — l'histoire d'un père, El Hadj Mor Talla Fall, devenue la promesse d'une maison de couture familiale.
            </p>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
            <span className="text-[9px] tracking-[0.3em] uppercase text-[#FF9D00]/50">Découvrir</span>
            <div className="w-px h-10 bg-gradient-to-b from-[#FF9D00]/50 to-transparent" />
          </div>
        </section>

        {/* ===== MANIFESTE ===== */}
        <section className="overflow-hidden bg-background py-14 sm:py-20 md:py-28">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto text-center">
              <p className="mb-10 text-[10px] uppercase tracking-[0.24em] text-[#FF9D00] sm:tracking-[0.4em]">Notre Identité</p>
              <blockquote className="mb-10 font-serif text-2xl font-bold leading-[1.18] text-foreground sm:text-3xl md:text-4xl lg:text-5xl">
                "Bien plus qu'un atelier —{" "}
                <em className="text-[#FF9D00] font-normal not-italic">
                  la continuité d'un père
                </em>{" "}
                dont le nom continue de guider chaque coupe."
              </blockquote>
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
                <div className="h-px flex-1 max-w-[80px] bg-border" />
                <div className="flex items-center gap-3">
                  <MapPin className="w-3.5 h-3.5 text-[#FF9D00]" />
                  <span className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground">Grand Dakar, Thiossane</span>
                </div>
                <div className="h-px flex-1 max-w-[80px] bg-border" />
              </div>
            </div>
          </div>
        </section>

        {/* ===== PORTRAIT D'HÉRITAGE ===== */}
        <section className="relative overflow-hidden bg-[#120b06] py-14 sm:py-20 md:py-28">
          <div className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: "repeating-linear-gradient(45deg, #FF9D00 0, #FF9D00 1px, transparent 0, transparent 50%)",
              backgroundSize: "28px 28px",
            }}
          />
          <div className="absolute left-0 right-0 top-1/2 hidden h-px bg-gradient-to-r from-transparent via-[#FF9D00]/20 to-transparent lg:block" />

          <div className="container relative z-10 mx-auto px-4 sm:px-6">
            <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-[0.82fr_1fr] lg:gap-16">
              <div className="relative">
                <div className="absolute -left-4 -top-4 h-28 w-28 border border-[#FF9D00]/35" />
                <div className="absolute -bottom-4 -right-4 h-28 w-28 border border-[#FF9D00]/35" />
                <div className="relative overflow-hidden border border-[#3b2717] bg-[#180f08]">
                  <img
                    src="/elhadj%20mortalla.jpeg"
                    alt="Portrait de El Hadj Mor Talla Fall, grand couturier et père fondateur de l'héritage familial"
                    className="h-full min-h-[320px] w-full object-cover object-top sm:min-h-[460px]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#120b06]/72 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[#FF9D00]">
                      Père · Maître · Héritage
                    </p>
                    <h2 className="mt-2 font-serif text-2xl font-bold text-[#fff8ed] md:text-3xl">
                      El Hadj Mor Talla Fall
                    </h2>
                  </div>
                </div>
              </div>

              <div>
                <div className="mb-8 flex items-center gap-4">
                  <div className="h-px w-12 bg-[#FF9D00]" />
                  <span className="text-[9px] font-medium uppercase tracking-[0.45em] text-[#FF9D00]">L'Homme derrière l'héritage</span>
                </div>

                <h2 className="font-serif text-3xl font-bold leading-tight text-[#fff8ed] sm:text-4xl md:text-5xl lg:text-6xl">
                  Le sourire d'un père,<br />
                  <span className="text-[#FF9D00] italic font-normal">la main d'un maître.</span>
                </h2>

                <div className="mt-8 space-y-5 text-sm leading-relaxed tracking-wide text-[#d7ba8c] md:text-base">
                  <p>
                    El Hadj Mor Talla Fall n'a pas seulement cousu des vêtements. Il a cousu une réputation, une dignité, une manière de tenir parole devant le tissu et devant le client.
                  </p>
                  <p>
                    Ceux qui ont connu son atelier se souviennent d'une présence calme, d'un regard précis, d'un homme capable de transformer une étoffe en prestige. Dans ses gestes, il y avait la patience. Dans ses finitions, il y avait l'honneur.
                  </p>
                  <p>
                    Aujourd'hui, ses fils ne travaillent pas pour oublier son nom. Ils travaillent pour le prolonger. Chaque création d'Elegance Couture Prestige porte quelque chose de lui : l'exigence, la pudeur, la grandeur et l'amour du métier bien fait.
                  </p>
                </div>

                <div className="mt-10 grid gap-3 sm:grid-cols-3">
                  {[
                    { value: "Père", label: "la source" },
                    { value: "Maître", label: "le geste" },
                    { value: "Prestige", label: "la promesse" },
                  ].map((item) => (
                    <div key={item.value} className="border border-[#3b2717] bg-[#fff8ed]/[0.03] p-4">
                      <p className="font-serif text-2xl font-bold text-[#FF9D00]">{item.value}</p>
                      <p className="mt-1 text-[10px] uppercase tracking-[0.22em] text-[#d7ba8c]/70">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== CHAPITRES DE L'HISTOIRE ===== */}
        <section className="bg-background py-4">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-6xl mx-auto">
              {chapters.map((ch, idx) => (
                <div key={idx}
                  className={`grid grid-cols-1 lg:grid-cols-12 gap-0 mb-2 group ${ch.accent ? "" : ""}`}>

                  {/* Left column — number & year */}
                  <div className={`lg:col-span-3 flex lg:flex-col items-center lg:items-end justify-start gap-6 lg:gap-4 pb-6 lg:pb-0 lg:pr-12 ${
                    idx % 2 === 1 ? "lg:order-last lg:items-start lg:pl-12 lg:pr-0" : ""
                  }`}>
                    <div className="font-serif text-[4rem] md:text-[5rem] font-bold text-[#FF9D00]/15 leading-none select-none shrink-0">
                      {ch.number}
                    </div>
                    <div className={`flex items-center gap-3 ${idx % 2 === 1 ? "" : "lg:flex-row-reverse"}`}>
                      <Calendar className="w-3 h-3 text-[#FF9D00] shrink-0" />
                      <span className="text-[10px] tracking-[0.3em] uppercase text-[#FF9D00] font-medium">
                        {ch.year}
                      </span>
                    </div>
                  </div>

                  {/* Center — vertical line */}
                  <div className="hidden lg:flex lg:col-span-1 flex-col items-center">
                    <div className={`w-3 h-3 rounded-full border-2 border-[#FF9D00] ${ch.accent ? "bg-[#FF9D00]" : "bg-background"} mt-8 shrink-0 z-10`} />
                    <div className="w-px flex-1 bg-gradient-to-b from-[#FF9D00]/40 to-border" />
                  </div>

                  {/* Right column — content */}
                  <div className={`lg:col-span-8 ${
                    idx % 2 === 1 ? "lg:order-first" : ""
                  }`}>
                    <div className={`mb-8 p-5 transition-all duration-500 sm:p-8 md:p-10 ${
                      ch.accent
                        ? "bg-[#120b06] border border-[#3b2717] group-hover:border-[#FF9D00]/30"
                        : "bg-muted border border-border group-hover:border-[#FF9D00]/20"
                    }`}>
                      <h2 className={`font-serif text-2xl md:text-3xl font-bold mb-4 ${
                        ch.accent ? "text-[#fff8ed]" : "text-foreground"
                      }`}>
                        {ch.title}
                      </h2>
                      <p className={`text-sm md:text-base leading-relaxed tracking-wide ${
                        ch.accent ? "text-[#d7ba8c]" : "text-muted-foreground"
                      }`}>
                        {ch.text}
                      </p>
                      {/* gold bottom accent */}
                      <div className="w-8 h-0.5 bg-[#FF9D00] mt-6 group-hover:w-16 transition-all duration-500" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== INNOVATION SECTION ===== */}
        <section className="border-y border-border bg-muted py-14 sm:py-20 md:py-28">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                {/* Text */}
                <div>
                  <p className="mb-6 text-[10px] uppercase tracking-[0.24em] text-[#FF9D00] sm:tracking-[0.4em]">Tradition + Innovation</p>
                  <h2 className="mb-6 font-serif text-3xl font-bold leading-tight text-foreground sm:text-4xl md:text-5xl">
                    Le Passé comme<br />
                    <span className="text-[#FF9D00]">Fondation</span>,<br />
                    L'Avenir comme Vision
                  </h2>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-8 tracking-wide">
                    Nous n'avons pas simplement reproduit ce que nous avions appris. Nous avons pris le geste
                    d'El Hadj Mor Talla Fall, sa patience, son exigence, puis nous l'avons porté vers les outils
                    d'aujourd'hui pour aller encore plus loin dans l'excellence.
                  </p>
                  <div className="space-y-4">
                    {[
                      "Machines à commande numérique de précision",
                      "Logiciels de conception assistée par ordinateur",
                      "Nouvelles technologies de coupe et de broderie",
                      "Finitions à la main par nos maîtres tailleurs",
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <div className="w-1.5 h-1.5 bg-[#FF9D00] shrink-0" />
                        <span className="text-foreground/80 text-sm tracking-wide">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bento values grid */}
                <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
                  {values.map((v, i) => (
                    <div key={i} className={`group border border-border bg-card p-5 transition-all duration-400 hover:border-[#FF9D00]/40 sm:p-6 ${
                      v.size === "large" ? "col-span-1" : ""
                    }`}>
                      <v.icon className="w-5 h-5 text-[#FF9D00] mb-5 group-hover:scale-110 transition-transform duration-300" />
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
        <section className="bg-[#120b06]">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-2 lg:grid-cols-4">
              {stats.map((s, i) => (
                <div key={i} className={`px-3 py-10 text-center sm:px-6 sm:py-14 ${
                  i < stats.length - 1 ? "border-r border-[#3b2717]" : ""
                }`}>
                  <div className="mb-2 font-serif text-3xl font-bold tracking-wide text-[#FF9D00] sm:text-4xl md:text-5xl">
                    {s.number}
                  </div>
                  <p className="text-[10px] tracking-[0.2em] uppercase text-[#d7ba8c]">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== GRANDE CITATION ===== */}
        <section className="relative overflow-hidden bg-[#120b06] py-16 sm:py-28 md:py-40">
          {/* Large decorative text */}
          <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none">
            <span className="whitespace-nowrap font-serif text-[5rem] font-bold leading-none text-[#FF9D00]/[0.04] sm:text-[8rem] md:text-[14rem]">
              PRESTIGE
            </span>
          </div>

          {/* Horizontal gold lines */}
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 flex items-center px-12 pointer-events-none">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#FF9D00]/20" />
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#FF9D00]/20" />
          </div>

          <div className="container relative z-10 mx-auto px-4 text-center sm:px-6">
            <div className="max-w-3xl mx-auto">
              <div className="h-px w-16 bg-[#FF9D00] mx-auto mb-12" />
              <p className="mb-10 font-serif text-2xl font-light italic leading-[1.3] text-[#fff8ed] sm:text-3xl md:text-4xl lg:text-5xl">
                "Nous ne cousons pas seulement des vêtements —{" "}
                <span className="text-[#FF9D00] not-italic font-semibold">nous prolongeons un nom.</span>"
              </p>
              <div className="h-px w-16 bg-[#FF9D00] mx-auto mb-8" />
              <p className="text-[10px] uppercase tracking-[0.18em] text-[#d7ba8c] sm:tracking-[0.4em]">
                En hommage à El Hadj Mor Talla Fall · Elegance Couture Prestige · Depuis 2019
              </p>
            </div>
          </div>
        </section>

        {/* ===== LOCALISATION ===== */}
        <section className="bg-background py-14 sm:py-20 md:py-28">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                {/* Text */}
                <div>
                  <p className="mb-6 text-[10px] uppercase tracking-[0.24em] text-[#FF9D00] sm:tracking-[0.4em]">Notre Adresse</p>
                  <h2 className="mb-6 font-serif text-3xl font-bold leading-tight text-foreground sm:text-4xl md:text-5xl">
                    Grand Dakar,<br />
                    <span className="text-[#FF9D00]">Thiossane</span>
                  </h2>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6 tracking-wide">
                    Au cœur d'un quartier vivant, créatif et profondément ancré dans la culture sénégalaise, 
                    notre atelier vous accueille pour des créations sur mesure qui racontent votre histoire.
                  </p>
                  <div className="flex items-start gap-4 mb-4">
                    <MapPin className="w-4 h-4 text-[#FF9D00] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-foreground text-sm font-medium">Grand Dakar, Thiossane</p>
                      <p className="text-muted-foreground text-sm">Dakar, Sénégal</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Award className="w-4 h-4 text-[#FF9D00] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-foreground text-sm font-medium">Fondée en 2019</p>
                      <p className="text-muted-foreground text-sm">Sur un héritage de 40+ ans d'excellence</p>
                    </div>
                  </div>
                </div>

                {/* Decorative card */}
                <div className="relative">
                  <div className="border border-[#3b2717] bg-[#120b06] p-6 sm:p-10 md:p-14">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="h-px w-8 bg-[#FF9D00]" />
                      <span className="text-[9px] tracking-[0.4em] uppercase text-[#FF9D00]">Notre Promesse</span>
                    </div>
                    <h3 className="font-serif text-2xl md:text-3xl font-bold text-[#fff8ed] mb-6 leading-tight">
                      Chaque pièce taillée<br />avec l'exigence d'un<br />
                      <span className="text-[#FF9D00]">chef d'État.</span>
                    </h3>
                    <p className="text-[#d7ba8c] text-sm leading-relaxed tracking-wide">
                      Qu'il s'agisse d'un boubou, d'une robe de gala ou d'un complet sur mesure, 
                      nous apportons à chaque création le même niveau d'excellence qui a fait 
                      notre réputation auprès des plus hautes sphères.
                    </p>
                    <div className="mt-8 w-8 h-0.5 bg-[#FF9D00]" />
                  </div>
                  {/* Gold corner accent */}
                  <div className="absolute -bottom-3 -right-3 w-20 h-20 border border-[#FF9D00]/40 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== CTA FINAL ===== */}
        <section className="relative overflow-hidden border-t border-[#3b2717] bg-[#120b06] py-16 sm:py-24 md:py-32">
          <div className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: "repeating-linear-gradient(-45deg, #FF9D00 0, #FF9D00 1px, transparent 0, transparent 50%)",
              backgroundSize: "24px 24px",
            }}
          />

          <div className="container relative z-10 mx-auto px-4 text-center sm:px-6">
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="h-px w-10 bg-[#FF9D00]" />
                <span className="text-center text-[9px] uppercase tracking-[0.2em] text-[#FF9D00] sm:tracking-[0.4em]">Commencez l'Aventure</span>
                <div className="h-px w-10 bg-[#FF9D00]" />
              </div>

              <h2 className="mb-6 font-serif text-3xl font-bold leading-tight text-[#fff8ed] sm:text-4xl md:text-5xl lg:text-6xl">
                Votre Histoire<br />
                <span className="text-[#FF9D00] italic font-normal">commence ici.</span>
              </h2>

              <p className="text-[#d7ba8c] text-sm md:text-base leading-relaxed tracking-wide mb-12 max-w-lg mx-auto">
                Venez nous rendre visite à Grand Dakar, Thiossane. Ensemble, 
                nous créerons une pièce qui racontera votre propre histoire.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/boutique"
                  className="inline-flex items-center justify-center gap-3 bg-[#FF9D00] px-6 py-4 text-center text-[10px] font-semibold uppercase tracking-[0.16em] text-white transition-all duration-300 hover:bg-[#FFCF71] hover:text-[#241609] sm:px-10 sm:text-[11px] sm:tracking-[0.25em]"
                >
                  Voir nos Créations
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-3 border border-[#FF9D00]/60 px-6 py-4 text-center text-[10px] font-medium uppercase tracking-[0.16em] text-[#FF9D00] transition-all duration-300 hover:border-[#FF9D00] hover:bg-[#FF9D00]/10 sm:px-10 sm:text-[11px] sm:tracking-[0.25em]"
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
