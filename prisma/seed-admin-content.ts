import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const categories = [
  { name: "Femme", slug: "femme", type: "product", sortOrder: 1 },
  { name: "Homme", slug: "homme", type: "product", sortOrder: 2 },
  { name: "Enfant", slug: "enfant", type: "product", sortOrder: 3 },
  { name: "Accessoires", slug: "accessoires", type: "accessory", sortOrder: 4 },
  { name: "Montres", slug: "montres", type: "accessory", parentSlug: "accessoires", sortOrder: 5 },
  { name: "Parfums", slug: "parfums", type: "accessory", parentSlug: "accessoires", sortOrder: 6 },
  { name: "Chaussures", slug: "chaussures", type: "accessory", parentSlug: "accessoires", sortOrder: 7 },
];

const collections = [
  { name: "Robe", slug: "robe", gender: "femme", sortOrder: 1 },
  { name: "Grand boubou", slug: "femme-grand-boubou", gender: "femme", sortOrder: 2 },
  { name: "Taille basse", slug: "taille-basse", gender: "femme", sortOrder: 3 },
  { name: "Grand boubou", slug: "homme-grand-boubou", gender: "homme", sortOrder: 1 },
  { name: "Kaftan", slug: "kaftan-homme", gender: "homme", sortOrder: 2 },
  { name: "Demi-saison", slug: "demi-saison-homme", gender: "homme", sortOrder: 3 },
  { name: "Tenue Super 100", slug: "super-100", gender: "homme", sortOrder: 4 },
  { name: "Robe enfant", slug: "robe-enfant", gender: "enfant", sortOrder: 1 },
  { name: "Boubou enfant", slug: "boubou-enfant", gender: "enfant", sortOrder: 2 },
  { name: "Kaftan enfant", slug: "kaftan-enfant", gender: "enfant", sortOrder: 3 },
  { name: "Tenue cérémonie", slug: "ceremonie-enfant", gender: "enfant", sortOrder: 4 },
];

const settings = [
  { key: "phone", value: "+221 77 813 70 32", group: "contact", label: "Téléphone principal" },
  { key: "whatsapp", value: "https://wa.me/221778137032", group: "contact", label: "WhatsApp" },
  { key: "email", value: "contact@elegancecouture.sn", group: "contact", label: "Email" },
  { key: "address", value: "Grand Dakar, Thiossane, Dakar, Sénégal", group: "contact", label: "Adresse" },
];

async function main() {
  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    });
  }

  for (const collection of collections) {
    await prisma.collection.upsert({
      where: { slug: collection.slug },
      update: collection,
      create: collection,
    });
  }

  for (const setting of settings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: setting,
      create: setting,
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
