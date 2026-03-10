import { prisma } from "@/lib/prisma";

async function main() {
  // Clear existing data
  await prisma.product.deleteMany();

  // Create products
  const products = [
    // Robes
    {
      name: "Robe Wax Africaine",
      description: "Robe traditionnelle wax avec motifs authentiques, parfaite pour les occasions spéciales",
      price: 45000,
      category: "robes",
      images: ["/traditional-african-wax-dress.jpg"],
      sizes: ["S", "M", "L", "XL"],
      colors: ["Multicolore", "Bleu", "Rouge"],
      inStock: true,
    },
    {
      name: "Robe de Soirée Éclat",
      description: "Robe de soirée élégante en tissu brillant, idéale pour les événements",
      price: 85000,
      category: "robes",
      images: ["/elegant-evening-dress.jpg"],
      sizes: ["S", "M", "L", "XL"],
      colors: ["Noir", "Rouge", "Doré"],
      inStock: true,
    },
    {
      name: "Robe Bambara Traditionnelle",
      description: "Robe traditionnelle bambara avec broderies artisanales du Mali",
      price: 65000,
      category: "robes",
      images: ["/bambara-traditional-dress.jpg"],
      sizes: ["S", "M", "L", "XL"],
      colors: ["Bleu", "Blanc", "Indigo"],
      inStock: true,
    },
    {
      name: "Robe Moderne Wax",
      description: "Robe moderne coupée dans un beau wax africain, style contemporain",
      price: 55000,
      category: "robes",
      images: ["/modern-wax-dress.jpg"],
      sizes: ["S", "M", "L", "XL"],
      colors: ["Multicolore", "Vert", "Jaune"],
      inStock: true,
    },

    // Boubous
    {
      name: "Boubou Homme Classique",
      description: "Boubou traditionnel pour homme, confectionné avec soin par nos artisans",
      price: 75000,
      category: "boubous",
      images: ["/traditional-mens-boubou.jpg"],
      sizes: ["S", "M", "L", "XL", "XXL"],
      colors: ["Blanc", "Bleu", "Gris"],
      inStock: true,
    },
    {
      name: "Boubou Femme Élégant",
      description: "Boubou féminin avec finitions raffinées et motifs délicats",
      price: 85000,
      category: "boubous",
      images: ["/elegant-womens-boubou.jpg"],
      sizes: ["S", "M", "L", "XL"],
      colors: ["Rose", "Violet", "Beige"],
      inStock: true,
    },
    {
      name: "Boubou de Cérémonie",
      description: "Boubou de cérémonie avec broderies dorées, parfait pour les mariages",
      price: 120000,
      category: "boubous",
      images: ["/ceremony-boubou.jpg"],
      sizes: ["M", "L", "XL", "XXL"],
      colors: ["Blanc", "Doré", "Rouge"],
      inStock: true,
    },
    {
      name: "Ensemble Boubou Complet",
      description: "Ensemble complet boubou + pantalon, prêt à porter",
      price: 95000,
      category: "boubous",
      images: ["/complete-boubou-set.jpg"],
      sizes: ["S", "M", "L", "XL"],
      colors: ["Bleu", "Marron", "Vert"],
      inStock: true,
    },

    // Complets
    {
      name: "Complet Homme Classique",
      description: "Costume complet pour homme, coupe moderne et élégante",
      price: 150000,
      category: "complets",
      images: ["/mens-suit-classic.jpg"],
      sizes: ["S", "M", "L", "XL", "XXL"],
      colors: ["Noir", "Gris", "Bleu marine"],
      inStock: true,
    },
    {
      name: "Tailleur Femme Chic",
      description: "Tailleur féminin avec jupe et veste assortie, parfait pour le bureau",
      price: 135000,
      category: "complets",
      images: ["/womens-tailored-suit.jpg"],
      sizes: ["S", "M", "L", "XL"],
      colors: ["Noir", "Gris", "Beige"],
      inStock: true,
    },
    {
      name: "Complet Mariage",
      description: "Complet de mariage avec chemise et cravate, tissu de qualité supérieure",
      price: 200000,
      category: "complets",
      images: ["/wedding-suit.jpg"],
      sizes: ["M", "L", "XL", "XXL"],
      colors: ["Noir", "Blanc", "Gris perle"],
      inStock: true,
    },
    {
      name: "Ensemble Casual",
      description: "Ensemble casual moderne, confortable et stylé pour tous les jours",
      price: 95000,
      category: "complets",
      images: ["/casual-ensemble.jpg"],
      sizes: ["S", "M", "L", "XL"],
      colors: ["Bleu", "Marron", "Vert"],
      inStock: true,
    },

    // Accessoires
    {
      name: "Ceinture en Cuir",
      description: "Ceinture artisanale en cuir véritable, finition élégante",
      price: 25000,
      category: "accessoires",
      images: ["/leather-belt.jpg"],
      sizes: ["S", "M", "L"],
      colors: ["Noir", "Marron", "Beige"],
      inStock: true,
    },
    {
      name: "Chapeau Fedora",
      description: "Chapeau fedora en feutre, accessoire indispensable du gentleman",
      price: 35000,
      category: "accessoires",
      images: ["/fedora-hat.jpg"],
      sizes: ["M", "L"],
      colors: ["Noir", "Gris", "Beige"],
      inStock: true,
    },
    {
      name: "Écharpe en Soie",
      description: "Écharpe légère en soie naturelle, parfaite pour toutes saisons",
      price: 45000,
      category: "accessoires",
      images: ["/silk-scarf.jpg"],
      sizes: [],
      colors: ["Multicolore", "Rouge", "Bleu"],
      inStock: true,
    },
    {
      name: "Sac à Main Élégant",
      description: "Sac à main en cuir synthétique, design moderne et fonctionnel",
      price: 55000,
      category: "accessoires",
      images: ["/elegant-handbag.jpg"],
      sizes: [],
      colors: ["Noir", "Marron", "Rouge"],
      inStock: true,
    },
    {
      name: "Tunique Homme Super Cent",
      description: "Tunique homme élégante avec finitions raffinées, inspirée de la mode africaine contemporaine",
      price: 65000,
      category: "boubous",
      images: ["https://i.pinimg.com/736x/39/60/52/39605277c57ce95d7c852b30d1bcb2dd.jpg"],
      sizes: ["S", "M", "L", "XL", "XXL"],
      colors: ["Blanc", "Bleu", "Gris", "Vert"],
      inStock: true,
    },
  ];

  for (const product of products) {
    await prisma.product.create({
      data: product,
    });
  }

  console.log("Seed completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
