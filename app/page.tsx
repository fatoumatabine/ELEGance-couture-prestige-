"use client";

import { useState, useEffect, useRef } from "react";
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { ArrowRight, Star, Check, Loader2, ChevronLeft, ChevronRight, Scissors, Package, Award, RefreshCw, Heart } from "lucide-react"
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
  featured?: boolean;
  bestSeller?: boolean;
  onSale?: boolean;
  discount?: number | null;
  createdAt?: string;
}

interface SiteImage {
  id: number;
  title: string;
  key: string;
  url: string;
  section: string;
  active: boolean;
}

const getProductImage = (product?: Product) => product?.images?.find(Boolean)?.replace("http://", "https://");

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
  const [siteImages, setSiteImages] = useState<SiteImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [heroIndex, setHeroIndex] = useState(0);
  const [spotlightTab, setSpotlightTab] = useState("best");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchProducts();
    fetchSiteImages();
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

  const fetchSiteImages = async () => {
    try {
      const res = await fetch("/api/site-images");
      if (res.ok) {
        const data = await res.json();
        setSiteImages(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Error fetching site images:", error);
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

  const getCollectionImage = (key: string, category: string, fallback: string) => {
    const adminImage = siteImages.find((image) => image.active && image.key === key)?.url;
    const productImage = getProductImage(products.find((product) => product.category === category));
    return adminImage || productImage || fallback;
  };

  const collections = [
    {
      title: "Femme",
      subtitle: "Élégance & Prestige",
      image: getCollectionImage("collection-femme", "femme", "/robe-elegant.svg"),
      href: "/boutique?category=femme",
    },
    {
      title: "Homme",
      subtitle: "Couture Africaine",
      image: getCollectionImage("collection-homme", "homme", "/atelier-couture-modern.svg"),
      href: "/boutique?category=homme",
    },
    {
      title: "Enfant",
      subtitle: "Style & Confort",
      image: getCollectionImage("collection-enfant", "enfant", "https://i.pinimg.com/736x/ab/0e/7c/ab0e7c2e9adf271d7b5fc20092bf4d91.jpg"),
      href: "/boutique?category=enfant",
    },
    {
      title: "Accessoires",
      subtitle: "Détails Précieux",
      image: getCollectionImage("collection-accessoires", "accessoires", "/accessoires-mode.svg"),
      href: "/boutique?category=accessoires",
    },
  ];

  const productsWithImages = products.filter((product) => getProductImage(product));
  const featuredProducts = (
    productsWithImages.filter((product) => product.featured).length > 0
      ? productsWithImages.filter((product) => product.featured)
      : productsWithImages
  ).slice(0, 4);
  const spotlightTabs = [
    { id: "best", label: "Best sellers" },
    { id: "promo", label: "Jusqu'à -40%" },
    { id: "week", label: "Offres de la semaine" },
  ];
  const spotlightProducts = (() => {
    const productsByTab: Record<string, Product[]> = {
      best: productsWithImages.filter((product) => product.bestSeller),
      promo: productsWithImages.filter((product) => product.onSale || (product.discount ?? 0) > 0),
      week: productsWithImages.filter((product) => product.featured || product.onSale).slice(0, 8),
    };

    const selectedProducts = productsByTab[spotlightTab] || [];

    if (selectedProducts.length > 0) {
      return [...selectedProducts]
        .sort((a, b) => (b.discount ?? 0) - (a.discount ?? 0))
        .slice(0, 4);
    }

    if (spotlightTab === "best") {
      return [...productsWithImages]
        .sort((a, b) => b.price - a.price)
        .slice(0, 4);
    }

    if (spotlightTab === "promo") {
      return [...productsWithImages]
        .filter((product) => product.inStock)
        .sort((a, b) => a.price - b.price)
        .slice(0, 4);
    }

    if (spotlightTab === "week") {
      return productsWithImages.slice(0, 4);
    }

    return productsWithImages.slice(0, 4);
  })();

  const storyImages = [
    "https://i.pinimg.com/1200x/d4/58/37/d45837c7a4206121f33fd4676db3c8a3.jpg",
    "https://i.pinimg.com/1200x/f5/6c/53/f56c53d579219a85dc898fb3a1e1395a.jpg",
  ];

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
        <section className="relative h-screen min-h-[600px] max-h-[900px] w-full overflow-hidden bg-[#120b06]">
          {/* Video Background */}
          <HeroVideo
            mp4="/hero-video.mp4"
            poster="/hero-video-poster.jpg"
          />

          {/* Dark overlay */}
          <div className="absolute inset-0 z-[1] bg-gradient-to-b from-[#180f08]/45 via-[#180f08]/66 to-[#120b06]/88" />
          <div className="editorial-grid absolute inset-0 z-[2] opacity-[0.08]" />

          {/* Slide Content */}
          <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
            <div key={heroIndex} className="animate-fadeIn max-w-6xl">
              {/* Decorative line */}
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#FF9D00]" />
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#FFCF71]">
                  Elegance Couture
                </span>
                <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#FF9D00]" />
              </div>

              {/* Large Hero Title */}
              <h1 className="mb-6 font-serif font-bold leading-none text-[#fff8ed] drop-shadow-[0_16px_48px_rgba(0,0,0,0.55)]">
                <span className="block text-5xl tracking-wide md:text-7xl lg:text-8xl">
                  {currentSlide.title}{" "}
                  <em className="brand-text-gradient italic font-normal">{currentSlide.titleItalic}</em>{" "}
                  {currentSlide.titleEnd}
                </span>
              </h1>

              {/* Subtitle */}
              <p className="mx-auto mb-10 max-w-xl text-base leading-relaxed tracking-wide text-[#f2d9ad] md:text-lg">
                {currentSlide.subtitle}
              </p>

              {/* CTA */}
              <Link
                href={currentSlide.ctaHref}
                className="brand-glow inline-flex items-center gap-3 bg-gradient-to-r from-[#FF9D00] to-[#FFCF71] px-8 py-4 text-[11px] font-bold uppercase tracking-[0.25em] text-[#180f08] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_58px_rgba(255,157,0,0.32)]"
              >
                {currentSlide.cta}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Slider Controls */}
          <button
            onClick={prevSlide}
            className="absolute left-6 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center border border-[#fff8ed]/25 bg-[#120b06]/25 text-[#fff8ed] backdrop-blur-md transition-all duration-300 hover:border-[#FF9D00] hover:bg-[#FF9D00] hover:text-[#180f08]"
            aria-label="Précédent"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-6 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center border border-[#fff8ed]/25 bg-[#120b06]/25 text-[#fff8ed] backdrop-blur-md transition-all duration-300 hover:border-[#FF9D00] hover:bg-[#FF9D00] hover:text-[#180f08]"
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
                    ? "w-10 bg-[#FF9D00]"
                    : "w-6 bg-[#fff8ed]/30 hover:bg-[#fff8ed]/60"
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        </section>

        {/* ===== SERVICES STRIP ===== */}
        <section className="border-y border-[#ead3aa] bg-[#fff3dd]/80 dark:border-[#3b2717] dark:bg-[#211207]">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4">
              {services.map((service, idx) => (
                <div
                  key={idx}
                  className={`group flex flex-col items-center px-6 py-10 text-center ${
                    idx < services.length - 1 ? "border-r border-border" : ""
                  } transition-colors duration-300 hover:bg-[#fff8ed] dark:hover:bg-[#2b190d]`}
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center border border-[#FF9D00]/25 bg-[#FF9D00]/10 text-[#B6771D] transition-all duration-300 group-hover:border-[#FF9D00] group-hover:bg-[#FF9D00] group-hover:text-[#180f08]">
                    <service.icon className="h-5 w-5 transition-transform group-hover:scale-110" />
                  </div>
                  <h4 className="text-[11px] tracking-[0.2em] uppercase font-semibold text-foreground mb-2">
                    {service.label}
                  </h4>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">{service.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== À LA UNE ===== */}
        <section className="bg-[#fffaf2] py-20 dark:bg-[#140b05] md:py-28">
          <div className="container mx-auto px-6">
            <div className="mb-10 text-center">
              <h2 className="font-serif text-5xl italic leading-none text-[#241609] dark:text-[#fff8ed] md:text-6xl">
                À la une...
              </h2>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-7">
                {spotlightTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setSpotlightTab(tab.id)}
                    className={`border-b pb-2 text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors ${
                      spotlightTab === tab.id
                        ? "border-[#180f08] text-[#180f08] dark:border-[#FFCF71] dark:text-[#FFCF71]"
                        : "border-transparent text-[#7B542F] hover:border-[#FF9D00] hover:text-[#B6771D] dark:text-[#d7ba8c]"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-[#FF9D00]" />
              </div>
            ) : spotlightProducts.length === 0 ? (
              <div className="border border-[#ead3aa] bg-white/70 py-16 text-center dark:border-[#3b2717] dark:bg-[#211207]">
                <p className="font-serif text-2xl text-foreground">Aucun produit à afficher</p>
                <p className="mt-2 text-sm text-muted-foreground">Ajoutez des produits avec images depuis le dashboard admin.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
                {spotlightProducts.map((product, idx) => (
                  <Link
                    key={`${product.id}-${idx}`}
                    href={`/produit/${product.id}`}
                    className="group block"
                  >
                    <article className="relative overflow-hidden bg-[#fffaf2] transition-all duration-500 hover:-translate-y-1 dark:bg-[#140b05]">
                      <span className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#180f08] shadow-[0_8px_24px_rgba(24,15,8,0.16)] transition-colors group-hover:text-[#FF9D00]">
                        <Heart className="h-4 w-4" />
                      </span>

                      <div className="flex aspect-[4/5] items-center justify-center overflow-hidden bg-[#f4f1ed] dark:bg-[#211207]">
                        <img
                          src={getProductImage(product)!}
                          alt={product.name}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>

                      <div className="pt-4">
                        <p className="mb-3 text-center text-[12px] text-[#7B542F] dark:text-[#d7ba8c]">
                          {product.category}
                        </p>
                        <div className="flex min-h-12 items-start justify-between gap-4">
                          <div>
                            <h3 className="text-[13px] font-semibold uppercase tracking-[0.06em] text-[#180f08] transition-colors group-hover:text-[#B6771D] dark:text-[#fff8ed] dark:group-hover:text-[#FFCF71]">
                              {product.name}
                            </h3>
                            <p className="mt-2 text-[12px] text-[#7B542F] dark:text-[#d7ba8c]">
                              Elegance Couture
                            </p>
                          </div>
                          <p className="shrink-0 text-[13px] font-bold tracking-wide text-[#180f08] dark:text-[#fff8ed]">
                            {product.price.toLocaleString()} CFA
                          </p>
                        </div>

                        <div className="mt-5 grid grid-cols-3 border-t border-[#ead3aa] pt-4 text-center dark:border-[#3b2717]">
                          {[
                            ["Coupe", product.sizes?.[0] || "Sur mesure"],
                            ["Style", product.category],
                            ["Finition", product.colors?.[0] || "Atelier"],
                          ].map(([label, value]) => (
                            <div key={label}>
                              <p className="text-[11px] font-bold text-[#180f08] dark:text-[#fff8ed]">{label}</p>
                              <p className="mt-1 text-[11px] text-[#7B542F] dark:text-[#d7ba8c]">{value}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ===== COLLECTIONS ===== */}
        <section className="relative overflow-hidden bg-background py-24 md:py-32">
          <div className="editorial-grid absolute inset-0 opacity-[0.22]" />
          <div className="container relative mx-auto px-6">
            {/* Section Header */}
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-4 mb-5">
                <div className="h-px w-10 bg-[#FF9D00]" />
                <span className="text-[10px] tracking-[0.35em] uppercase text-[#FF9D00] font-medium">
                  Nos Collections
                </span>
                <div className="h-px w-10 bg-[#FF9D00]" />
              </div>
              <h2 className="mb-4 font-serif text-4xl font-bold tracking-wide text-foreground md:text-5xl">
                Explorer nos Créations
              </h2>
              <p className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto leading-relaxed tracking-wide">
                Chaque pièce est une célébration de l'artisanat africain et de l'élégance contemporaine
              </p>
            </div>

            {/* Collections Grid */}
            {collections.length === 0 ? (
              <div className="border border-[#ead3aa] bg-white/70 py-14 text-center dark:border-[#3b2717] dark:bg-[#211207]">
                <p className="font-serif text-2xl text-foreground">Collections en attente d'images</p>
                <p className="mt-2 text-sm text-muted-foreground">Ajoutez des produits illustrés depuis l'admin pour remplir cette section.</p>
              </div>
            ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
              {collections.map((col, idx) => (
                <Link key={idx} href={col.href}>
                  <div className="group relative h-[460px] cursor-pointer overflow-hidden border border-[#ead3aa] shadow-[0_18px_52px_rgba(123,84,47,0.14)] transition-all duration-500 hover:-translate-y-1 hover:border-[#FF9D00]/60 dark:border-[#3b2717]">
                    {/* Image */}
                    <img
                      src={col.image}
                      alt={col.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#180f08]/95 via-[#180f08]/35 to-[#FFCF71]/10" />

                    {/* Content */}
                    <div className="absolute inset-x-0 bottom-0 p-8">
                      {/* Gold line */}
                      <div className="w-6 h-px bg-[#FF9D00] mb-4 group-hover:w-12 transition-all duration-500" />
                      <p className="text-[10px] tracking-[0.3em] uppercase text-[#FF9D00] mb-2">
                        {col.subtitle}
                      </p>
                      <h3 className="font-serif text-xl md:text-2xl font-bold text-[#fff8ed] tracking-wide">
                        {col.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="text-[10px] tracking-[0.2em] uppercase text-[#FF9D00]">
                          Découvrir
                        </span>
                        <ArrowRight className="w-3 h-3 text-[#FF9D00]" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            )}
          </div>
        </section>

        {/* ===== FEATURED PRODUCTS ===== */}
        <section className="border-y border-[#ead3aa] bg-[#fff3dd] py-24 dark:border-[#3b2717] dark:bg-[#211207] md:py-32">
          <div className="container mx-auto px-6">
            {/* Section Header */}
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-4 mb-5">
                <div className="h-px w-10 bg-[#FF9D00]" />
                <span className="text-[10px] tracking-[0.35em] uppercase text-[#FF9D00] font-medium">
                  Sélection Exclusive
                </span>
                <div className="h-px w-10 bg-[#FF9D00]" />
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
                <Loader2 className="h-8 w-8 animate-spin text-[#FF9D00]" />
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground text-sm mb-6 tracking-wide">Aucun produit disponible pour le moment</p>
                <Link
                  href="/admin"
                  className="inline-block px-8 py-3 border border-[#FF9D00] text-[#FF9D00] text-[11px] tracking-[0.2em] uppercase hover:bg-[#FF9D00] hover:text-white transition-all duration-300"
                >
                  Ajouter des produits
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts.map((product) => (
                  <div key={product.id} className="group">
                    {/* Image */}
                    <div className="relative mb-4 aspect-[3/4] overflow-hidden border border-[#ead3aa] bg-secondary shadow-[0_14px_42px_rgba(123,84,47,0.1)] transition-all duration-500 group-hover:-translate-y-1 group-hover:border-[#FF9D00]/60 dark:border-[#3b2717]">
                      {getProductImage(product) ? (
                        <img
                          src={getProductImage(product)}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-muted text-xs uppercase tracking-[0.2em] text-muted-foreground">
                          Image admin requise
                        </div>
                      )}
                      {/* Badge */}
                      <div className={`absolute top-3 left-3 px-3 py-1 text-[9px] tracking-[0.2em] uppercase font-semibold ${
                        product.inStock
                          ? "bg-gradient-to-r from-[#FF9D00] to-[#FFCF71] text-[#180f08]"
                          : "bg-muted text-muted-foreground"
                      }`}>
                        {product.inStock ? "Disponible" : "Épuisé"}
                      </div>
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center bg-[#180f08]/58 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100">
                        <Link
                          href={`/produit/${product.id}`}
                          className="bg-gradient-to-r from-[#FF9D00] to-[#FFCF71] px-6 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#180f08] transition-transform hover:scale-[1.03]"
                        >
                          Voir le Produit
                        </Link>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="px-1">
                      <h3 className="font-serif text-base text-foreground font-semibold mb-1 group-hover:text-[#FF9D00] transition-colors tracking-wide">
                        {product.name}
                      </h3>
                      <p className="mb-3 text-sm font-bold tracking-wide text-[#B6771D] dark:text-[#FFCF71]">
                        {product.price.toLocaleString()} CFA
                      </p>

                      {/* Color dots */}
                      <div className="flex gap-1.5 mb-4">
                        {product.colors.slice(0, 4).map((color, i) => (
                          <div
                            key={i}
                            className="w-4 h-4 rounded-full border border-border cursor-pointer hover:border-[#FF9D00] transition-colors"
                            title={color}
                            style={{
                              backgroundColor:
                                color === "Noir" ? "#000" :
                                color === "Blanc" ? "#fff8ed" :
                                color === "Bleu" ? "#3b82f6" :
                                color === "Gris" ? "#6b7280" :
                                color === "Or" ? "#FF9D00" :
                                color === "Bordeaux" ? "#881337" :
                                color === "Marron" ? "#78350f" :
                                color === "Rose" ? "#f472b6" : "#d7ba8c"
                            }}
                          />
                        ))}
                      </div>

                      <Link
                        href={`/produit/${product.id}`}
                        className="block w-full text-center py-3 border border-border text-foreground text-[10px] tracking-[0.2em] uppercase hover:border-[#FF9D00] hover:text-[#FF9D00] transition-all duration-300"
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
                className="inline-flex items-center gap-3 border border-[#FF9D00] px-10 py-4 text-[11px] font-bold uppercase tracking-[0.25em] text-[#B6771D] transition-all duration-300 hover:bg-[#FF9D00] hover:text-[#180f08] dark:text-[#FFCF71]"
              >
                Voir Tous les Produits
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ===== ABOUT / SAVOIR-FAIRE ===== */}
        <section className="bg-background py-24 md:py-32">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              {/* Left - Image collage */}
              <div className="relative">
                <div className="grid grid-cols-2 gap-4">
                  <div className="aspect-[3/4] overflow-hidden border border-[#ead3aa] shadow-[0_20px_60px_rgba(123,84,47,0.14)] dark:border-[#3b2717]">
                    <img
                      src={storyImages[0]}
                      alt="Création couture africaine"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="mt-8 aspect-[3/4] overflow-hidden border border-[#ead3aa] shadow-[0_20px_60px_rgba(123,84,47,0.14)] dark:border-[#3b2717]">
                    <img
                      src={storyImages[1]}
                      alt="Élégance couture prestige"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                {/* Gold frame accent */}
                <div className="absolute -bottom-4 -right-4 -z-0 h-32 w-32 border border-[#FF9D00]" />
              </div>

              {/* Right - Text */}
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-px w-10 bg-[#FF9D00]" />
                  <span className="text-[10px] tracking-[0.35em] uppercase text-[#FF9D00]">Notre Histoire</span>
                </div>
                <h2 className="font-serif text-4xl md:text-5xl text-foreground font-bold mb-6 leading-tight">
                  L'Essence de<br />
                  <span className="brand-text-gradient">l'Élégance</span>
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
                      <Check className="w-4 h-4 text-[#FF9D00] flex-shrink-0 mt-0.5" />
                      <p className="text-foreground/80 text-sm tracking-wide">{val}</p>
                    </div>
                  ))}
                </div>

                <Link
                  href="/contact"
                  className="brand-glow inline-flex items-center gap-3 bg-gradient-to-r from-[#FF9D00] to-[#FFCF71] px-8 py-4 text-[11px] font-bold uppercase tracking-[0.25em] text-[#180f08] transition-all duration-300 hover:-translate-y-1"
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
                  <div className="brand-text-gradient mb-2 font-serif text-4xl font-bold tracking-wide md:text-5xl">
                    {stat.number}
                  </div>
                  <p className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== TESTIMONIALS ===== */}
        <section className="border-t border-[#ead3aa] bg-muted py-24 dark:border-[#3b2717] md:py-32">
          <div className="container mx-auto px-6">
            {/* Header */}
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-4 mb-5">
                <div className="h-px w-10 bg-[#FF9D00]" />
                <span className="text-[10px] tracking-[0.35em] uppercase text-[#FF9D00] font-medium">
                  Avis Clients
                </span>
                <div className="h-px w-10 bg-[#FF9D00]" />
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
                <div key={idx} className="brand-surface p-8 transition-all duration-300 hover:-translate-y-1 hover:border-[#FF9D00]/50">
                  {/* Stars */}
                  <div className="flex gap-1 mb-6">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#FF9D00] text-[#FF9D00]" />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-muted-foreground text-sm leading-relaxed mb-8 italic tracking-wide">
                    "{t.text}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-4 border-t border-border pt-6">
                    <div className="flex h-10 w-10 items-center justify-center bg-gradient-to-r from-[#FF9D00] to-[#FFCF71] font-serif text-sm font-bold text-[#180f08]">
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
        <section className="relative overflow-hidden border-t border-[#ead3aa] bg-[#180f08] py-24 dark:border-[#3b2717]">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: "repeating-linear-gradient(45deg, #FF9D00 0, #FF9D00 1px, transparent 0, transparent 50%)",
              backgroundSize: "20px 20px"
            }} />
          </div>

          <div className="relative container mx-auto px-6 text-center">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-px w-10 bg-[#FF9D00]" />
              <span className="text-[10px] tracking-[0.35em] uppercase text-[#FF9D00]">Commencez Maintenant</span>
              <div className="h-px w-10 bg-[#FF9D00]" />
            </div>
            <h2 className="mb-5 font-serif text-4xl font-bold tracking-wide text-[#fff8ed] md:text-5xl">
              Prêt à Découvrir l'Élégance ?
            </h2>
            <p className="mx-auto mb-10 max-w-md text-sm leading-relaxed tracking-wide text-[#f2d9ad]">
              Explorez notre collection et trouvez la pièce qui incarne votre style unique
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                href="/boutique"
                className="brand-glow inline-flex items-center gap-3 bg-gradient-to-r from-[#FF9D00] to-[#FFCF71] px-10 py-4 text-[11px] font-bold uppercase tracking-[0.25em] text-[#180f08] transition-all duration-300 hover:-translate-y-1"
              >
                Accéder à la Boutique
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-3 border border-[#FF9D00]/70 px-10 py-4 text-[11px] font-bold uppercase tracking-[0.25em] text-[#FFCF71] transition-all duration-300 hover:bg-[#FF9D00] hover:text-[#180f08]"
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
