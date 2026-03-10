import { z } from "zod";

// Customer info validation
export const customerSchema = z.object({
  nom: z.string().min(1, "Le nom est requis"),
  prenom: z.string().min(1, "Le prénom est requis"),
  telephone: z.string().min(8, "Numéro de téléphone invalide"),
  email: z.string().email("Email invalide"),
  adresse: z.string().optional(),
  ville: z.string().optional(),
  quartier: z.string().optional(),
  instructions: z.string().optional(),
});

// Order item validation
export const orderItemSchema = z.object({
  product: z.object({
    id: z.number(),
    name: z.string(),
    price: z.number(),
    images: z.array(z.string()),
    category: z.string(),
  }),
  quantity: z.number().int().positive(),
  selectedSize: z.string().optional(),
  selectedColor: z.string().optional(),
});

// Order validation
export const orderSchema = z.object({
  customer: customerSchema,
  items: z.array(orderItemSchema).min(1, "Le panier est vide"),
  total: z.number(),
  fraisLivraison: z.number(),
  totalFinal: z.number(),
  paiement: z.enum(["cash", "virement"]),
});

// Contact form validation
export const contactSchema = z.object({
  nom: z.string().min(1, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  telephone: z.string().optional(),
  sujet: z.string().optional(),
  message: z.string().min(10, "Le message doit contenir au moins 10 caractères"),
});

// Product validation
export const productSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  description: z.string().min(10, "La description doit contenir au moins 10 caractères"),
  price: z.number().positive("Le prix doit être positif"),
  category: z.string().min(1, "La catégorie est requise"),
  images: z.array(z.string()).optional(),
  sizes: z.array(z.string()).optional(),
  colors: z.array(z.string()).optional(),
  inStock: z.boolean().optional(),
});

// Login validation
export const loginSchema = z.object({
  password: z.string().min(1, "Le mot de passe est requis"),
});
