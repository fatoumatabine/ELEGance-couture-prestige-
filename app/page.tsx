"use client";

import { useState, useEffect, useRef } from "react";
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { ArrowRight, Star, Check, Loader2, ChevronLeft, ChevronRight, Scissors, Package, Award, RefreshCw } from "lucide-react"
import HeroVideo from "@/components/hero-video"

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  sizes: string[];
  colors: string[];
  inStock: boolean;
}

const heroSlides = [
  {
    title: "STYLES",
    titleItalic: "Et",
    titleEnd: "TENDANCES",
    subtitle: "Chaque création reflète l'élégance africaine dans toute sa splendeur.",
    cta: "Découvrir la Collection",
    ctaHref: "/boutique",
  },
  {
    title: "L'ART",
    titleItalic: "De",
    titleEnd: "LA COUTURE",
    subtitle: "Des pièces uniques confectionnées par nos maîtres tailleurs africains.",
    cta: "Nos Collections",
    ctaHref: "/boutique",
  },
  {
    title: "ÉLÉGANCE",
    titleItalic: "Et",
    titleEnd: "PRESTIGE",
    subtitle: "Robes de gala, boubous et complets d'exception pour les grandes occasions.",
    cta: "Voir les Créations",
    ctaHref: "/robes",
  },
]

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [heroIndex, setHeroIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setHeroIndex((i) => (i + 1) % heroSlides.length);
    }, 6000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const goToSlide = (idx: number) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setHeroIndex(idx);
    intervalRef.current = setInterval(() => {
      setHeroIndex((i) => (i + 1) % heroSlides.length);
    }, 6000);
  };

  const prevSlide = () => goToSlide((heroIndex - 1 + heroSlides.length) % heroSlides.length);
  const nextSlide = () => goToSlide((heroIndex + 1) % heroSlides.length);

  const collections = [
    {
      title: "Robes de Gala",
      subtitle: "Élégance & Prestige",
      image: products.find(p => p.category === "robes")?.images[0] || "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
      href: "/robes",
    },
    {
      title: "Jupes & Ensembles",
      subtitle: "Style Contemporain",
      image: products.find(p => p.category === "jupes")?.images[0] || "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80",
      href: "/jupes",
    },
    {
      title: "Pantalons",
      subtitle: "Élégance Moderne",
      image: products.find(p => p.category === "pantalons")?.images[0] || "https://images.unsplash.com/photo-1594938298603-c8148c4b4d41?w=600&q=80",
      href: "/pantalons",
    },
    {
      title: "Accessoires",
      subtitle: "Détails Précieux",
      image: products.find(p => p.category === "accessoires")?.images[0] || "https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=600&q=80",
      href: "/accessoires",
    },
  ]

  const featuredProducts = products.slice(0, 4);

  const testimonials = [
    {
      name: "Marie Diallo",
      text: "Une qualité exceptionnelle ! J'ai porté la robe pour un gala et reçu que des compliments. L'élégance parfaite !",
      rating: 5,
      initial: "M"
    },
    {
      name: "Amadou Sow",
      text: "Le boubou est magnifique, confortable et les finitions sont impeccables. Très satisfait de mon achat.",
      rating: 5,
      initial: "A"
    },
    {
      name: "Fatou Ndiaye",
      text: "Service impeccable, livraison rapide et produits de haute qualité. Je recommande vivement !",
      rating: 5,
      initial: "F"
    },
  ]

  const services = [
    { icon: Scissors, label: "Couture Sur Mesure", desc: "Chaque pièce taillée à vos mensurations exactes" },
    { icon: Award, label: "Qualité Premium", desc: "Tissus sélectionnés parmi les meilleures manufactures" },
    { icon: Package, label: "Livraison Soignée", desc: "Emballage luxueux et livraison sécurisée partout" },
    { icon: RefreshCw, label: "Retours Faciles", desc: "Satisfaction garantie, retours sous 14 jours" },
  ]

  const currentSlide = heroSlides[heroIndex];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">

        {/* ===== HERO SLIDER ===== */}
        <section className="relative w-full h-screen min-h-[600px] max-h-[900px] overflow-hidden bg-[#0d0d0d]">
          {/* Video Background */}
          <HeroVideo
            mp4="/hero-video-optimized.mp4"
            webm="/hero-video.webm"
            poster="/hero-video-poster.jpg"
          />

          {/* Dark overlay */}
          <div className="absolute inset-0 bg-[#111111]/60 z-[1]" />

          {/* Slide Content */}
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
            <div key={heroIndex} className="animate-fadeIn">
              {/* Decorative line */}
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="h-px w-12 bg-[#C9A96E]" />
                <span className="text-[10px] tracking-[0.4em] uppercase text-[#C9A96E] font-medium">
                  Elegance Couture
                </span>
                <div className="h-px w-12 bg-[#C9A96E]" />
              </div>

              {/* Large Hero Title */}
              <h1 className="font-serif font-bold text-[#f5f0e8] leading-none mb-6">
                <span className="block text-5xl md:text-7xl lg:text-8xl tracking-wide">
                  {currentSlide.title}{" "}
                  <em className="text-[#C9A96E] italic font-normal">{currentSlide.titleItalic}</em>{" "}
                  {currentSlide.titleEnd}
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-[#d4cdc2] text-base md:text-lg max-w-md mx-auto mb-10 leading-relaxed tracking-wide">
                {currentSlide.subtitle}
              </p>

              {/* CTA */}
              <Link
                href={currentSlide.ctaHref}
                className="inline-flex items-center gap-3 px-8 py-4 bg-[#C9A96E] text-[#111111] text-[11px] tracking-[0.25em] uppercase font-semibold hover:bg-[#e8d5b0] transition-all duration-300"
              >
                {currentSlide.cta}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Slider Controls */}
          <button
            onClick={prevSlide}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 border border-[#f5f0e8]/30 flex items-center justify-center text-[#f5f0e8] hover:border-[#C9A96E] hover:text-[#C9A96E] transition-all duration-300"
            aria-label="Précédent"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 border border-[#f5f0e8]/30 flex items-center justify-center text-[#f5f0e8] hover:border-[#C9A96E] hover:text-[#C9A96E] transition-all duration-300"
            aria-label="Suivant"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Slide Dots */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToSlide(idx)}
                className={`h-px transition-all duration-500 ${
                  idx === heroIndex
                    ? "w-10 bg-[#C9A96E]"
                    : "w-6 bg-[#f5f0e8]/30 hover:bg-[#f5f0e8]/60"
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        </section>

        {/* ===== SERVICES STRIP ===== */}
        <section className="bg-muted border-y border-border">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4">
              {services.map((service, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col items-center text-center py-10 px-6 ${
                    idx < services.length - 1 ? "border-r border-border" : ""
                  } group hover:bg-secondary transition-colors duration-300`}
                >
                  <service.icon className="w-6 h-6 text-[#C9A96E] mb-4 group-hover:scale-110 transition-transform" />
                  <h4 className="text-[11px] tracking-[0.2em] uppercase font-semibold text-foreground mb-2">
                    {service.label}
                  </h4>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">{service.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== COLLECTIONS ===== */}
        <section className="py-24 md:py-32 bg-background">
          <div className="container mx-auto px-6">
            {/* Section Header */}
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-4 mb-5">
                <div className="h-px w-10 bg-[#C9A96E]" />
                <span className="text-[10px] tracking-[0.35em] uppercase text-[#C9A96E] font-medium">
                  Nos Collections
                </span>
                <div className="h-px w-10 bg-[#C9A96E]" />
              </div>
              <h2 className="font-serif text-4xl md:text-5xl text-foreground font-bold tracking-wide mb-4">
                Explorer nos Créations
              </h2>
              <p className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto leading-relaxed tracking-wide">
                Chaque pièce est une célébration de l'artisanat africain et de l'élégance contemporaine
              </p>
            </div>

            {/* Collections Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {collections.map((col, idx) => (
                <Link key={idx} href={col.href}>
                  <div className="group relative overflow-hidden h-[460px] cursor-pointer">
                    {/* Image */}
                    <img
                      src={col.image?.replace("http://", "https://")}
                      alt={col.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/90 via-[#111111]/30 to-transparent" />

                    {/* Content */}
                    <div className="absolute inset-x-0 bottom-0 p-8">
                      {/* Gold line */}
                      <div className="w-6 h-px bg-[#C9A96E] mb-4 group-hover:w-12 transition-all duration-500" />
                      <p className="text-[10px] tracking-[0.3em] uppercase text-[#C9A96E] mb-2">
                        {col.subtitle}
                      </p>
                      <h3 className="font-serif text-xl md:text-2xl font-bold text-[#f5f0e8] tracking-wide">
                        {col.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="text-[10px] tracking-[0.2em] uppercase text-[#C9A96E]">
                          Découvrir
                        </span>
                        <ArrowRight className="w-3 h-3 text-[#C9A96E]" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ===== FEATURED PRODUCTS ===== */}
        <section className="py-24 md:py-32 bg-muted border-y border-border">
          <div className="container mx-auto px-6">
            {/* Section Header */}
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-4 mb-5">
                <div className="h-px w-10 bg-[#C9A96E]" />
                <span className="text-[10px] tracking-[0.35em] uppercase text-[#C9A96E] font-medium">
                  Sélection Exclusive
                </span>
                <div className="h-px w-10 bg-[#C9A96E]" />
              </div>
              <h2 className="font-serif text-4xl md:text-5xl text-foreground font-bold tracking-wide mb-4">
                Nos Pièces Maîtresses
              </h2>
              <p className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto leading-relaxed">
                Découvrez nos créations les plus prestigieuses et les plus désirées
              </p>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-[#C9A96E]" />
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground text-sm mb-6 tracking-wide">Aucun produit disponible pour le moment</p>
                <Link
                  href="/admin"
                  className="inline-block px-8 py-3 border border-[#C9A96E] text-[#C9A96E] text-[11px] tracking-[0.2em] uppercase hover:bg-[#C9A96E] hover:text-white transition-all duration-300"
                >
                  Ajouter des produits
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts.map((product) => (
                  <div key={product.id} className="group">
                    {/* Image */}
                    <div className="relative overflow-hidden aspect-[3/4] bg-secondary mb-4">
                      <img
                        src={product.images[0]?.replace("http://", "https://")}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      {/* Badge */}
                      <div className={`absolute top-3 left-3 px-3 py-1 text-[9px] tracking-[0.2em] uppercase font-semibold ${
                        product.inStock
                          ? "bg-[#C9A96E] text-white"
                          : "bg-muted text-muted-foreground"
                      }`}>
                        {product.inStock ? "Disponible" : "Épuisé"}
                      </div>
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <Link
                          href={`/produit/${product.id}`}
                          className="px-6 py-3 bg-[#C9A96E] text-white text-[10px] tracking-[0.2em] uppercase font-semibold hover:bg-[#e8d5b0] transition-colors"
                        >
                          Voir le Produit
                        </Link>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="px-1">
                      <h3 className="font-serif text-base text-foreground font-semibold mb-1 group-hover:text-[#C9A96E] transition-colors tracking-wide">
                        {product.name}
                      </h3>
                      <p className="text-[#C9A96E] text-sm font-medium tracking-wide mb-3">
                        {product.price.toLocaleString()} CFA
                      </p>

                      {/* Color dots */}
                      <div className="flex gap-1.5 mb-4">
                        {product.colors.slice(0, 4).map((color, i) => (
                          <div
                            key={i}
                            className="w-4 h-4 rounded-full border border-border cursor-pointer hover:border-[#C9A96E] transition-colors"
                            title={color}
                            style={{
                              backgroundColor:
                                color === "Noir" ? "#000" :
                                color === "Blanc" ? "#f5f0e8" :
                                color === "Bleu" ? "#3b82f6" :
                                color === "Gris" ? "#6b7280" :
                                color === "Or" ? "#C9A96E" :
                                color === "Bordeaux" ? "#881337" :
                                color === "Marron" ? "#78350f" :
                                color === "Rose" ? "#f472b6" : "#9e9585"
                            }}
                          />
                        ))}
                      </div>

                      <Link
                        href={`/produit/${product.id}`}
                        className="block w-full text-center py-3 border border-border text-foreground text-[10px] tracking-[0.2em] uppercase hover:border-[#C9A96E] hover:text-[#C9A96E] transition-all duration-300"
                      >
                        Ajouter au Panier
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* CTA */}
            <div className="text-center mt-14">
              <Link
                href="/boutique"
                className="inline-flex items-center gap-3 px-10 py-4 border border-[#C9A96E] text-[#C9A96E] text-[11px] tracking-[0.25em] uppercase font-medium hover:bg-[#C9A96E] hover:text-[#111111] transition-all duration-300"
              >
                Voir Tous les Produits
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ===== ABOUT / SAVOIR-FAIRE ===== */}
        <section className="py-24 md:py-32 bg-background">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              {/* Left - Image collage */}
              <div className="relative">
                <div className="grid grid-cols-2 gap-4">
                  <div className="aspect-[3/4] overflow-hidden">
                    <img
                      src={products[0]?.images[0]?.replace("http://", "https://") || "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80"}
                      alt="Création"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="aspect-[3/4] overflow-hidden mt-8">
                    <img
                      src={products[1]?.images[0]?.replace("http://", "https://") || "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&q=80"}
                      alt="Création"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                {/* Gold frame accent */}
                <div className="absolute -bottom-4 -right-4 w-32 h-32 border border-[#C9A96E] -z-0" />
              </div>

              {/* Right - Text */}
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-px w-10 bg-[#C9A96E]" />
                  <span className="text-[10px] tracking-[0.35em] uppercase text-[#C9A96E]">Notre Histoire</span>
                </div>
                <h2 className="font-serif text-4xl md:text-5xl text-foreground font-bold mb-6 leading-tight">
                  L'Essence de<br />
                  <span className="text-[#C9A96E]">l'Élégance</span>
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6 tracking-wide">
                  Elegance Couture est bien plus qu'une boutique. C'est une célébration de l'artisanat africain,
                  de la tradition et de l'innovation contemporaine. Chaque création est confectionnée avec passion par
                  nos tailleurs et designers africains de talent.
                </p>
                <p className="text-muted-foreground text-sm leading-relaxed mb-8 tracking-wide">
                  Basée à Grand Dakar, Thiossane, notre maison de couture vous propose des créations sur mesure
                  et prêt-à-porter qui incarnent le meilleur de la mode africaine contemporaine.
                </p>

                {/* Values */}
                <div className="space-y-3 mb-10">
                  {[
                    "Confectionnées par des artisans africains de talent",
                    "Tissus de haute qualité sélectionnés avec expertise",
                    "Création sur mesure et prêt-à-porter",
                    "Service client irréprochable et satisfaction garantie",
                  ].map((val, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Check className="w-4 h-4 text-[#C9A96E] flex-shrink-0 mt-0.5" />
                      <p className="text-foreground/80 text-sm tracking-wide">{val}</p>
                    </div>
                  ))}
                </div>

                <Link
                  href="/contact"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-[#C9A96E] text-white text-[11px] tracking-[0.25em] uppercase font-semibold hover:bg-[#e8d5b0] transition-all duration-300"
                >
                  Prendre Rendez-vous
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="container mx-auto px-6 mt-20">
            <div className="border-t border-border pt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { number: "5000+", label: "Clients Heureux" },
                { number: "500+", label: "Créations" },
                { number: "25+", label: "Artisans" },
                { number: "10", label: "Pays Desservis" },
              ].map((stat, idx) => (
                <div key={idx}>
                  <div className="font-serif text-4xl md:text-5xl font-bold text-[#C9A96E] mb-2 tracking-wide">
                    {stat.number}
                  </div>
                  <p className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== TESTIMONIALS ===== */}
        <section className="py-24 md:py-32 bg-muted border-t border-border">
          <div className="container mx-auto px-6">
            {/* Header */}
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-4 mb-5">
                <div className="h-px w-10 bg-[#C9A96E]" />
                <span className="text-[10px] tracking-[0.35em] uppercase text-[#C9A96E] font-medium">
                  Avis Clients
                </span>
                <div className="h-px w-10 bg-[#C9A96E]" />
              </div>
              <h2 className="font-serif text-4xl md:text-5xl text-foreground font-bold tracking-wide mb-4">
                Ils Nous Font Confiance
              </h2>
              <p className="text-muted-foreground text-sm max-w-md mx-auto tracking-wide">
                Découvrez ce qu'en pensent ceux qui portent nos créations
              </p>
            </div>

            {/* Testimonials Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((t, idx) => (
                <div key={idx} className="border border-border p-8 hover:border-[#C9A96E]/40 transition-colors duration-300 bg-card">
                  {/* Stars */}
                  <div className="flex gap-1 mb-6">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#C9A96E] text-[#C9A96E]" />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-muted-foreground text-sm leading-relaxed mb-8 italic tracking-wide">
                    "{t.text}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-4 border-t border-border pt-6">
                    <div className="w-10 h-10 bg-[#C9A96E] flex items-center justify-center text-white font-bold font-serif text-sm">
                      {t.initial}
                    </div>
                    <div>
                      <p className="text-foreground text-sm font-semibold tracking-wide">{t.name}</p>
                      <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">Client Vérifié</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== CTA FINAL ===== */}
        <section className="relative py-24 overflow-hidden bg-background border-t border-border">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: "repeating-linear-gradient(45deg, #C9A96E 0, #C9A96E 1px, transparent 0, transparent 50%)",
              backgroundSize: "20px 20px"
            }} />
          </div>

          <div className="relative container mx-auto px-6 text-center">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-px w-10 bg-[#C9A96E]" />
              <span className="text-[10px] tracking-[0.35em] uppercase text-[#C9A96E]">Commencez Maintenant</span>
              <div className="h-px w-10 bg-[#C9A96E]" />
            </div>
            <h2 className="font-serif text-4xl md:text-5xl text-foreground font-bold mb-5 tracking-wide">
              Prêt à Découvrir l'Élégance ?
            </h2>
            <p className="text-muted-foreground text-sm mb-10 max-w-md mx-auto leading-relaxed tracking-wide">
              Explorez notre collection et trouvez la pièce qui incarne votre style unique
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                href="/boutique"
                className="inline-flex items-center gap-3 px-10 py-4 bg-[#C9A96E] text-white text-[11px] tracking-[0.25em] uppercase font-semibold hover:bg-[#e8d5b0] transition-all duration-300"
              >
                Accéder à la Boutique
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-3 px-10 py-4 border border-[#C9A96E] text-[#C9A96E] text-[11px] tracking-[0.25em] uppercase font-medium hover:bg-[#C9A96E] hover:text-white transition-all duration-300"
              >
                Nous Contacter
              </Link>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}
