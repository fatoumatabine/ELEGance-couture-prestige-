"use client";

import { useState, useEffect, useRef } from "react";
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/components/language-provider"
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

const homeCopy = {
  fr: {
    brand: "Elegance Couture",
    previous: "Précédent",
    next: "Suivant",
    imageRequired: "Image admin requise",
    heroSlides: [
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
    ],
    services: [
      { label: "Couture Sur Mesure", desc: "Chaque pièce taillée à vos mensurations exactes" },
      { label: "Qualité Premium", desc: "Tissus sélectionnés parmi les meilleures manufactures" },
      { label: "Livraison Soignée", desc: "Emballage luxueux et livraison sécurisée partout" },
      { label: "Retours Faciles", desc: "Satisfaction garantie, retours sous 14 jours" },
    ],
    spotlightTitle: "À la une...",
    spotlightTabs: [
      { id: "best", label: "Best sellers" },
      { id: "promo", label: "Jusqu'à -40%" },
      { id: "week", label: "Offres de la semaine" },
    ],
    emptySpotlightTitle: "Aucun produit à afficher",
    emptySpotlightText: "Ajoutez des produits avec images depuis le dashboard admin.",
    productDetails: {
      fit: "Coupe",
      fitFallback: "Sur mesure",
      style: "Style",
      finish: "Finition",
      finishFallback: "Atelier",
      available: "Disponible",
      soldOut: "Épuisé",
      viewProduct: "Voir le Produit",
      addToCart: "Ajouter au Panier",
    },
    collections: [
      { title: "Femme", subtitle: "Élégance & Prestige", key: "collection-femme", category: "femme", fallback: "/robe-elegant.svg", href: "/boutique?category=femme" },
      { title: "Homme", subtitle: "Couture Africaine", key: "collection-homme", category: "homme", fallback: "/atelier-couture-modern.svg", href: "/boutique?category=homme" },
      { title: "Enfant", subtitle: "Style & Confort", key: "collection-enfant", category: "enfant", fallback: "https://i.pinimg.com/736x/ab/0e/7c/ab0e7c2e9adf271d7b5fc20092bf4d91.jpg", href: "/boutique?category=enfant" },
      { title: "Accessoires", subtitle: "Détails Précieux", key: "collection-accessoires", category: "accessoires", fallback: "/accessoires-mode.svg", href: "/boutique?category=accessoires" },
    ],
    collectionsEyebrow: "Nos Collections",
    collectionsTitle: "Explorer nos Créations",
    collectionsText: "Chaque pièce est une célébration de l'artisanat africain et de l'élégance contemporaine",
    collectionsEmptyTitle: "Collections en attente d'images",
    collectionsEmptyText: "Ajoutez des produits illustrés depuis l'admin pour remplir cette section.",
    discover: "Découvrir",
    featuredEyebrow: "Sélection Exclusive",
    featuredTitle: "Nos Pièces Maîtresses",
    featuredText: "Découvrez nos créations les plus prestigieuses et les plus désirées",
    noProducts: "Aucun produit disponible pour le moment",
    addProducts: "Ajouter des produits",
    viewAllProducts: "Voir Tous les Produits",
    aboutEyebrow: "Notre Histoire",
    aboutTitleStart: "L'Essence de",
    aboutTitleAccent: "l'Élégance",
    aboutTextOne: "Elegance Couture est bien plus qu'une boutique. C'est une célébration de l'artisanat africain, de la tradition et de l'innovation contemporaine. Chaque création est confectionnée avec passion par nos tailleurs et designers africains de talent.",
    aboutTextTwo: "Basée à Grand Dakar, Thiossane, notre maison de couture vous propose des créations sur mesure et prêt-à-porter qui incarnent le meilleur de la mode africaine contemporaine.",
    aboutValues: [
      "Confectionnées par des artisans africains de talent",
      "Tissus de haute qualité sélectionnés avec expertise",
      "Création sur mesure et prêt-à-porter",
      "Service client irréprochable et satisfaction garantie",
    ],
    appointment: "Prendre Rendez-vous",
    stats: [
      { number: "5000+", label: "Clients Heureux" },
      { number: "500+", label: "Créations" },
      { number: "25+", label: "Artisans" },
      { number: "10", label: "Pays Desservis" },
    ],
    testimonialsEyebrow: "Avis Clients",
    testimonialsTitle: "Ils Nous Font Confiance",
    testimonialsText: "Découvrez ce qu'en pensent ceux qui portent nos créations",
    verifiedClient: "Client Vérifié",
    testimonials: [
      { name: "Marie Diallo", text: "Une qualité exceptionnelle ! J'ai porté la robe pour un gala et reçu que des compliments. L'élégance parfaite !", rating: 5, initial: "M" },
      { name: "Amadou Sow", text: "Le boubou est magnifique, confortable et les finitions sont impeccables. Très satisfait de mon achat.", rating: 5, initial: "A" },
      { name: "Fatou Ndiaye", text: "Service impeccable, livraison rapide et produits de haute qualité. Je recommande vivement !", rating: 5, initial: "F" },
    ],
    finalEyebrow: "Commencez Maintenant",
    finalTitle: "Prêt à Découvrir l'Élégance ?",
    finalText: "Explorez notre collection et trouvez la pièce qui incarne votre style unique",
    shopCta: "Accéder à la Boutique",
    contactCta: "Nous Contacter",
  },
  en: {
    brand: "Elegance Couture",
    previous: "Previous",
    next: "Next",
    imageRequired: "Admin image required",
    heroSlides: [
      {
        title: "STYLES",
        titleItalic: "And",
        titleEnd: "TRENDS",
        subtitle: "Every creation reflects African elegance in all its splendor.",
        cta: "Discover the Collection",
        ctaHref: "/boutique",
      },
      {
        title: "THE ART",
        titleItalic: "Of",
        titleEnd: "TAILORING",
        subtitle: "Unique pieces crafted by our African master tailors.",
        cta: "Our Collections",
        ctaHref: "/boutique",
      },
      {
        title: "ELEGANCE",
        titleItalic: "And",
        titleEnd: "PRESTIGE",
        subtitle: "Gala dresses, boubous and exceptional suits for special occasions.",
        cta: "View Creations",
        ctaHref: "/robes",
      },
    ],
    services: [
      { label: "Custom Tailoring", desc: "Every piece tailored to your exact measurements" },
      { label: "Premium Quality", desc: "Fabrics selected from the finest manufacturers" },
      { label: "Careful Delivery", desc: "Luxury packaging and secure delivery everywhere" },
      { label: "Easy Returns", desc: "Satisfaction guaranteed, returns within 14 days" },
    ],
    spotlightTitle: "Featured...",
    spotlightTabs: [
      { id: "best", label: "Best sellers" },
      { id: "promo", label: "Up to -40%" },
      { id: "week", label: "Weekly offers" },
    ],
    emptySpotlightTitle: "No products to display",
    emptySpotlightText: "Add products with images from the admin dashboard.",
    productDetails: {
      fit: "Fit",
      fitFallback: "Custom-made",
      style: "Style",
      finish: "Finish",
      finishFallback: "Atelier",
      available: "Available",
      soldOut: "Sold out",
      viewProduct: "View Product",
      addToCart: "Add to Cart",
    },
    collections: [
      { title: "Women", subtitle: "Elegance & Prestige", key: "collection-femme", category: "femme", fallback: "/robe-elegant.svg", href: "/boutique?category=femme" },
      { title: "Men", subtitle: "African Tailoring", key: "collection-homme", category: "homme", fallback: "/atelier-couture-modern.svg", href: "/boutique?category=homme" },
      { title: "Kids", subtitle: "Style & Comfort", key: "collection-enfant", category: "enfant", fallback: "https://i.pinimg.com/736x/ab/0e/7c/ab0e7c2e9adf271d7b5fc20092bf4d91.jpg", href: "/boutique?category=enfant" },
      { title: "Accessories", subtitle: "Precious Details", key: "collection-accessoires", category: "accessoires", fallback: "/accessoires-mode.svg", href: "/boutique?category=accessoires" },
    ],
    collectionsEyebrow: "Our Collections",
    collectionsTitle: "Explore Our Creations",
    collectionsText: "Every piece celebrates African craftsmanship and contemporary elegance",
    collectionsEmptyTitle: "Collections waiting for images",
    collectionsEmptyText: "Add illustrated products from the admin dashboard to fill this section.",
    discover: "Discover",
    featuredEyebrow: "Exclusive Selection",
    featuredTitle: "Signature Pieces",
    featuredText: "Discover our most prestigious and most desired creations",
    noProducts: "No products available at the moment",
    addProducts: "Add products",
    viewAllProducts: "View All Products",
    aboutEyebrow: "Our Story",
    aboutTitleStart: "The Essence of",
    aboutTitleAccent: "Elegance",
    aboutTextOne: "Elegance Couture is more than a shop. It celebrates African craftsmanship, tradition and contemporary innovation. Every creation is made with passion by our talented African tailors and designers.",
    aboutTextTwo: "Based in Grand Dakar, Thiossane, our fashion house offers custom-made and ready-to-wear creations that embody the best of contemporary African fashion.",
    aboutValues: [
      "Crafted by talented African artisans",
      "High-quality fabrics selected with expertise",
      "Custom creation and ready-to-wear",
      "Outstanding customer care and guaranteed satisfaction",
    ],
    appointment: "Book Appointment",
    stats: [
      { number: "5000+", label: "Happy Clients" },
      { number: "500+", label: "Creations" },
      { number: "25+", label: "Artisans" },
      { number: "10", label: "Countries Served" },
    ],
    testimonialsEyebrow: "Client Reviews",
    testimonialsTitle: "They Trust Us",
    testimonialsText: "See what people who wear our creations think",
    verifiedClient: "Verified Client",
    testimonials: [
      { name: "Marie Diallo", text: "Exceptional quality! I wore the dress to a gala and received so many compliments. Perfect elegance.", rating: 5, initial: "M" },
      { name: "Amadou Sow", text: "The boubou is beautiful, comfortable and impeccably finished. I am very satisfied with my purchase.", rating: 5, initial: "A" },
      { name: "Fatou Ndiaye", text: "Excellent service, fast delivery and high-quality products. I highly recommend them.", rating: 5, initial: "F" },
    ],
    finalEyebrow: "Start Now",
    finalTitle: "Ready to Discover Elegance?",
    finalText: "Explore our collection and find the piece that expresses your unique style",
    shopCta: "Go to Shop",
    contactCta: "Contact Us",
  },
} as const

export default function HomePage() {
  const { language } = useLanguage();
  const copy = homeCopy[language];
  const heroSlides = copy.heroSlides;
  const [products, setProducts] = useState<Product[]>([]);
  const [siteImages, setSiteImages] = useState<SiteImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [heroIndex, setHeroIndex] = useState(0);
  const [spotlightTab, setSpotlightTab] = useState("best");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasLoadedHomeData = useRef(false);

  useEffect(() => {
    if (hasLoadedHomeData.current) return;

    hasLoadedHomeData.current = true;
    fetchProducts();
    fetchSiteImages();
  }, [heroSlides.length]);

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

  const collections = copy.collections.map((collection) => ({
    ...collection,
    image: getCollectionImage(collection.key, collection.category, collection.fallback),
  }));

  const productsWithImages = products.filter((product) => getProductImage(product));
  const featuredProducts = (
    productsWithImages.filter((product) => product.featured).length > 0
      ? productsWithImages.filter((product) => product.featured)
      : productsWithImages
  ).slice(0, 4);
  const spotlightTabs = copy.spotlightTabs;
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

  const testimonials = copy.testimonials

  const serviceIcons = [Scissors, Award, Package, RefreshCw]
  const services = copy.services.map((service, index) => ({
    ...service,
    icon: serviceIcons[index],
  }))

  const currentSlide = heroSlides[heroIndex];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">

        {/* ===== HERO SLIDER ===== */}
        <section className="relative h-[calc(var(--app-height,100svh)-4rem)] min-h-[500px] max-h-[780px] w-full overflow-hidden bg-[#120b06] sm:h-[calc(var(--app-height,100svh)-5rem)] md:h-[calc(var(--app-height,100svh)-9rem)] md:min-h-[560px] md:max-h-[820px] lg:min-h-[560px] lg:max-h-[760px] xl:h-[calc(var(--app-height,100svh)-11.5rem)] xl:min-h-[620px] xl:max-h-[860px]">
          {/* Video Background */}
          <HeroVideo
            mp4="/hero-video.mp4"
            poster="/hero-video-poster.jpg"
          />

          {/* Dark overlay */}
          <div className="absolute inset-0 z-[1] bg-gradient-to-b from-[#180f08]/45 via-[#180f08]/66 to-[#120b06]/88" />
          <div className="editorial-grid absolute inset-0 z-[2] opacity-[0.08]" />

          {/* Slide Content */}
          <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 pb-16 pt-8 text-center sm:px-6 sm:pb-0 sm:pt-0">
            <div key={heroIndex} className="animate-fadeIn w-full max-w-6xl">
              {/* Decorative line */}
              <div className="mb-5 flex items-center justify-center gap-3 sm:mb-8 sm:gap-4">
                <div className="h-px w-8 bg-gradient-to-r from-transparent to-[#FF9D00] sm:w-12" />
                <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#FFCF71] sm:text-[10px] sm:tracking-[0.4em]">
                  Elegance Couture
                </span>
                <div className="h-px w-8 bg-gradient-to-l from-transparent to-[#FF9D00] sm:w-12" />
              </div>

              {/* Large Hero Title */}
              <h1 className="mb-5 font-serif font-bold leading-[0.94] text-[#fff8ed] drop-shadow-[0_16px_48px_rgba(0,0,0,0.55)] sm:mb-6">
                <span className="block text-[clamp(2.35rem,11.5vw,3.25rem)] tracking-[0.015em] md:text-7xl md:tracking-wide lg:text-[5.5rem] xl:text-8xl">
                  {currentSlide.title}{" "}
                  <em className="brand-text-gradient italic font-normal">{currentSlide.titleItalic}</em>{" "}
                  <span className="block md:inline">{currentSlide.titleEnd}</span>
                </span>
              </h1>

              {/* Subtitle */}
              <p className="mx-auto mb-7 max-w-[20rem] text-sm leading-relaxed tracking-wide text-[#f2d9ad] sm:mb-10 sm:max-w-xl sm:text-base md:text-lg">
                {currentSlide.subtitle}
              </p>

              {/* CTA */}
              <Link
                href={currentSlide.ctaHref}
                className="brand-glow inline-flex w-full max-w-[19rem] items-center justify-center gap-3 bg-gradient-to-r from-[#FF9D00] to-[#FFCF71] px-5 py-3.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#180f08] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_58px_rgba(255,157,0,0.32)] sm:w-auto sm:px-8 sm:py-4 sm:text-[11px] sm:tracking-[0.25em]"
              >
                {currentSlide.cta}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Slider Controls */}
          <button
            onClick={prevSlide}
            className="absolute bottom-4 left-4 z-20 flex h-10 w-10 items-center justify-center border border-[#fff8ed]/25 bg-[#120b06]/25 text-[#fff8ed] backdrop-blur-md transition-all duration-300 hover:border-[#FF9D00] hover:bg-[#FF9D00] hover:text-[#180f08] sm:left-6 md:bottom-auto md:top-1/2 md:h-11 md:w-11 md:-translate-y-1/2"
            aria-label={copy.previous}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute bottom-4 right-4 z-20 flex h-10 w-10 items-center justify-center border border-[#fff8ed]/25 bg-[#120b06]/25 text-[#fff8ed] backdrop-blur-md transition-all duration-300 hover:border-[#FF9D00] hover:bg-[#FF9D00] hover:text-[#180f08] sm:right-6 md:bottom-auto md:top-1/2 md:h-11 md:w-11 md:-translate-y-1/2"
            aria-label={copy.next}
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Slide Dots */}
          <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-3 md:bottom-8">
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
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-2 lg:grid-cols-4">
              {services.map((service, idx) => (
                <div
                  key={idx}
                  className={`group flex flex-col items-center px-3 py-8 text-center sm:px-6 sm:py-10 ${
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
        <section className="bg-[#fffaf2] py-16 dark:bg-[#140b05] sm:py-20 md:py-28">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="mb-10 text-center">
              <h2 className="font-serif text-4xl italic leading-none text-[#241609] dark:text-[#fff8ed] sm:text-5xl md:text-6xl">
                {copy.spotlightTitle}
              </h2>
              <div className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 sm:mt-8 sm:gap-7">
                {spotlightTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setSpotlightTab(tab.id)}
                    className={`border-b pb-2 text-center text-[10px] font-semibold uppercase tracking-[0.08em] transition-colors sm:text-[11px] sm:tracking-[0.12em] ${
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
                <p className="font-serif text-2xl text-foreground">{copy.emptySpotlightTitle}</p>
                <p className="mt-2 text-sm text-muted-foreground">{copy.emptySpotlightText}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
                        <div className="flex min-h-12 flex-col gap-2 min-[420px]:flex-row min-[420px]:items-start min-[420px]:justify-between min-[420px]:gap-4">
                          <div className="min-w-0">
                            <h3 className="break-words text-[13px] font-semibold uppercase tracking-[0.04em] text-[#180f08] transition-colors group-hover:text-[#B6771D] dark:text-[#fff8ed] dark:group-hover:text-[#FFCF71]">
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
                            [copy.productDetails.fit, product.sizes?.[0] || copy.productDetails.fitFallback],
                            [copy.productDetails.style, product.category],
                            [copy.productDetails.finish, product.colors?.[0] || copy.productDetails.finishFallback],
                          ].map(([label, value]) => (
                            <div key={label} className="min-w-0 px-1">
                              <p className="text-[11px] font-bold text-[#180f08] dark:text-[#fff8ed]">{label}</p>
                              <p className="mt-1 truncate text-[11px] text-[#7B542F] dark:text-[#d7ba8c]">{value}</p>
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
        <section className="relative overflow-hidden bg-background py-16 sm:py-24 md:py-32">
          <div className="editorial-grid absolute inset-0 opacity-[0.22]" />
          <div className="container relative mx-auto px-4 sm:px-6">
            {/* Section Header */}
            <div className="mb-12 text-center sm:mb-16">
              <div className="flex items-center justify-center gap-4 mb-5">
                <div className="h-px w-10 bg-[#FF9D00]" />
                <span className="text-[10px] tracking-[0.35em] uppercase text-[#FF9D00] font-medium">
                  {copy.collectionsEyebrow}
                </span>
                <div className="h-px w-10 bg-[#FF9D00]" />
              </div>
              <h2 className="mb-4 font-serif text-3xl font-bold tracking-wide text-foreground sm:text-4xl md:text-5xl">
                {copy.collectionsTitle}
              </h2>
              <p className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto leading-relaxed tracking-wide">
                {copy.collectionsText}
              </p>
            </div>

            {/* Collections Grid */}
            {collections.length === 0 ? (
              <div className="border border-[#ead3aa] bg-white/70 py-14 text-center dark:border-[#3b2717] dark:bg-[#211207]">
                <p className="font-serif text-2xl text-foreground">{copy.collectionsEmptyTitle}</p>
                <p className="mt-2 text-sm text-muted-foreground">{copy.collectionsEmptyText}</p>
              </div>
            ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
              {collections.map((col, idx) => (
                <Link key={idx} href={col.href}>
                  <div className="group relative h-[360px] cursor-pointer overflow-hidden border border-[#ead3aa] shadow-[0_18px_52px_rgba(123,84,47,0.14)] transition-all duration-500 hover:-translate-y-1 hover:border-[#FF9D00]/60 dark:border-[#3b2717] sm:h-[420px] xl:h-[460px]">
                    {/* Image */}
                    <img
                      src={col.image}
                      alt={col.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#180f08]/95 via-[#180f08]/35 to-[#FFCF71]/10" />

                    {/* Content */}
                    <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8">
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
                          {copy.discover}
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
        <section className="border-y border-[#ead3aa] bg-[#fff3dd] py-16 dark:border-[#3b2717] dark:bg-[#211207] sm:py-24 md:py-32">
          <div className="container mx-auto px-4 sm:px-6">
            {/* Section Header */}
            <div className="mb-12 text-center sm:mb-16">
              <div className="flex items-center justify-center gap-4 mb-5">
                <div className="h-px w-10 bg-[#FF9D00]" />
                <span className="text-[10px] tracking-[0.35em] uppercase text-[#FF9D00] font-medium">
                  {copy.featuredEyebrow}
                </span>
                <div className="h-px w-10 bg-[#FF9D00]" />
              </div>
              <h2 className="mb-4 font-serif text-3xl font-bold tracking-wide text-foreground sm:text-4xl md:text-5xl">
                {copy.featuredTitle}
              </h2>
              <p className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto leading-relaxed">
                {copy.featuredText}
              </p>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-[#FF9D00]" />
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground text-sm mb-6 tracking-wide">{copy.noProducts}</p>
                <Link
                  href="/admin"
                  className="inline-block px-8 py-3 border border-[#FF9D00] text-[#FF9D00] text-[11px] tracking-[0.2em] uppercase hover:bg-[#FF9D00] hover:text-white transition-all duration-300"
                >
                  {copy.addProducts}
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
                          {copy.imageRequired}
                        </div>
                      )}
                      {/* Badge */}
                      <div className={`absolute top-3 left-3 px-3 py-1 text-[9px] tracking-[0.2em] uppercase font-semibold ${
                        product.inStock
                          ? "bg-gradient-to-r from-[#FF9D00] to-[#FFCF71] text-[#180f08]"
                          : "bg-muted text-muted-foreground"
                      }`}>
                        {product.inStock ? copy.productDetails.available : copy.productDetails.soldOut}
                      </div>
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center bg-[#180f08]/58 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100">
                        <Link
                          href={`/produit/${product.id}`}
                          className="bg-gradient-to-r from-[#FF9D00] to-[#FFCF71] px-5 py-3 text-center text-[10px] font-bold uppercase tracking-[0.12em] text-[#180f08] transition-transform hover:scale-[1.03] sm:px-6 sm:tracking-[0.2em]"
                        >
                          {copy.productDetails.viewProduct}
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
                        {copy.productDetails.addToCart}
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
                className="inline-flex w-full max-w-[22rem] items-center justify-center gap-3 border border-[#FF9D00] px-6 py-4 text-center text-[10px] font-bold uppercase tracking-[0.16em] text-[#B6771D] transition-all duration-300 hover:bg-[#FF9D00] hover:text-[#180f08] dark:text-[#FFCF71] sm:w-auto sm:max-w-none sm:px-10 sm:text-[11px] sm:tracking-[0.25em]"
              >
                {copy.viewAllProducts}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ===== ABOUT / SAVOIR-FAIRE ===== */}
        <section className="bg-background py-16 sm:py-24 md:py-32">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-16">
              {/* Left - Image collage */}
              <div className="relative">
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="aspect-[3/4] overflow-hidden border border-[#ead3aa] shadow-[0_20px_60px_rgba(123,84,47,0.14)] dark:border-[#3b2717]">
                    <img
                      src={storyImages[0]}
                      alt={language === "fr" ? "Création couture africaine" : "African couture creation"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="mt-8 aspect-[3/4] overflow-hidden border border-[#ead3aa] shadow-[0_20px_60px_rgba(123,84,47,0.14)] dark:border-[#3b2717]">
                    <img
                      src={storyImages[1]}
                      alt={language === "fr" ? "Élégance couture prestige" : "Elegance couture prestige"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                {/* Gold frame accent */}
                <div className="absolute -bottom-3 -right-3 -z-0 h-24 w-24 border border-[#FF9D00] sm:-bottom-4 sm:-right-4 sm:h-32 sm:w-32" />
              </div>

              {/* Right - Text */}
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-px w-10 bg-[#FF9D00]" />
                  <span className="text-[10px] tracking-[0.35em] uppercase text-[#FF9D00]">{copy.aboutEyebrow}</span>
                </div>
                <h2 className="mb-6 font-serif text-3xl font-bold leading-tight text-foreground sm:text-4xl md:text-5xl">
                  {copy.aboutTitleStart}<br />
                  <span className="brand-text-gradient">{copy.aboutTitleAccent}</span>
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6 tracking-wide">
                  {copy.aboutTextOne}
                </p>
                <p className="text-muted-foreground text-sm leading-relaxed mb-8 tracking-wide">
                  {copy.aboutTextTwo}
                </p>

                {/* Values */}
                <div className="space-y-3 mb-10">
                  {copy.aboutValues.map((val, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Check className="w-4 h-4 text-[#FF9D00] flex-shrink-0 mt-0.5" />
                      <p className="text-foreground/80 text-sm tracking-wide">{val}</p>
                    </div>
                  ))}
                </div>

                <Link
                  href="/contact"
                  className="brand-glow inline-flex w-full max-w-[22rem] items-center justify-center gap-3 bg-gradient-to-r from-[#FF9D00] to-[#FFCF71] px-6 py-4 text-center text-[10px] font-bold uppercase tracking-[0.16em] text-[#180f08] transition-all duration-300 hover:-translate-y-1 sm:w-auto sm:max-w-none sm:px-8 sm:text-[11px] sm:tracking-[0.25em]"
                >
                  {copy.appointment}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="container mx-auto mt-16 px-4 sm:mt-20 sm:px-6">
            <div className="grid grid-cols-2 gap-6 border-t border-border pt-12 text-center sm:gap-8 sm:pt-16 lg:grid-cols-4">
              {copy.stats.map((stat, idx) => (
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
        <section className="border-t border-[#ead3aa] bg-muted py-16 dark:border-[#3b2717] sm:py-24 md:py-32">
          <div className="container mx-auto px-4 sm:px-6">
            {/* Header */}
            <div className="mb-12 text-center sm:mb-16">
              <div className="flex items-center justify-center gap-4 mb-5">
                <div className="h-px w-10 bg-[#FF9D00]" />
                <span className="text-[10px] tracking-[0.35em] uppercase text-[#FF9D00] font-medium">
                  {copy.testimonialsEyebrow}
                </span>
                <div className="h-px w-10 bg-[#FF9D00]" />
              </div>
              <h2 className="mb-4 font-serif text-3xl font-bold tracking-wide text-foreground sm:text-4xl md:text-5xl">
                {copy.testimonialsTitle}
              </h2>
              <p className="text-muted-foreground text-sm max-w-md mx-auto tracking-wide">
                {copy.testimonialsText}
              </p>
            </div>

            {/* Testimonials Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((t, idx) => (
                <div key={idx} className="brand-surface p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#FF9D00]/50 sm:p-8">
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
                      <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">{copy.verifiedClient}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== CTA FINAL ===== */}
        <section className="relative overflow-hidden border-t border-[#ead3aa] bg-[#180f08] py-16 dark:border-[#3b2717] sm:py-24">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: "repeating-linear-gradient(45deg, #FF9D00 0, #FF9D00 1px, transparent 0, transparent 50%)",
              backgroundSize: "20px 20px"
            }} />
          </div>

          <div className="container relative mx-auto px-4 text-center sm:px-6">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-px w-10 bg-[#FF9D00]" />
              <span className="text-[10px] tracking-[0.35em] uppercase text-[#FF9D00]">{copy.finalEyebrow}</span>
              <div className="h-px w-10 bg-[#FF9D00]" />
            </div>
            <h2 className="mb-5 font-serif text-3xl font-bold tracking-wide text-[#fff8ed] sm:text-4xl md:text-5xl">
              {copy.finalTitle}
            </h2>
            <p className="mx-auto mb-10 max-w-md text-sm leading-relaxed tracking-wide text-[#f2d9ad]">
              {copy.finalText}
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:flex-wrap">
              <Link
                href="/boutique"
                className="brand-glow inline-flex w-full max-w-[22rem] items-center justify-center gap-3 bg-gradient-to-r from-[#FF9D00] to-[#FFCF71] px-6 py-4 text-center text-[10px] font-bold uppercase tracking-[0.16em] text-[#180f08] transition-all duration-300 hover:-translate-y-1 sm:w-auto sm:max-w-none sm:px-10 sm:text-[11px] sm:tracking-[0.25em]"
              >
                {copy.shopCta}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex w-full max-w-[22rem] items-center justify-center gap-3 border border-[#FF9D00]/70 px-6 py-4 text-center text-[10px] font-bold uppercase tracking-[0.16em] text-[#FFCF71] transition-all duration-300 hover:bg-[#FF9D00] hover:text-[#180f08] sm:w-auto sm:max-w-none sm:px-10 sm:text-[11px] sm:tracking-[0.25em]"
              >
                {copy.contactCta}
              </Link>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}
