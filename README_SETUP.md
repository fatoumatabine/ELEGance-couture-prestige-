# 🛍️ Boutique Sella Seduction - Configuration Complète

## Vue d'ensemble

Ce projet est une boutique e-commerce moderne pour la lingerie, parfums, nuisettes et accessoires.

**Stack technologique:**
- **Frontend**: Next.js 16 + React 19 + TypeScript + TailwindCSS
- **Backend**: Next.js API Routes
- **Base de données**: PostgreSQL (Neon)
- **Images**: Cloudinary
- **Déploiement**: Vercel
- **CMS**: Admin Panel intégré

---

## 🎯 Fonctionnalités

### Boutique Client ✅
- Affichage dynamique de tous les produits
- Filtrage par catégorie (lingerie, parfums, nuisettes, accessoires)
- Panier d'achat (localStorage)
- Page détail produit
- Design responsive
- Dark/Light mode

### Admin Panel ✅
- Authentification sécurisée
- CRUD complet des produits:
  - Créer/Ajouter un produit
  - Éditer/Modifier
  - Supprimer
  - Gérer stock, prix, images, tailles, couleurs
- Tableau de bord avec tous les produits
- Upload d'images via Cloudinary

### Base de données ✅
- PostgreSQL via Neon (gratuit, production-ready)
- Schéma Prisma avec types TypeScript
- Migrations automatiques

---

## 🚀 Installation Rapide

### Prérequis
- Node.js 18+ 
- pnpm (ou npm/yarn)
- Comptes gratuits: Neon, Cloudinary, Vercel, GitHub

### 1. Clone & Install
```bash
cd hello-there
pnpm install
```

### 2. Configuration
Créez `.env.local`:
```bash
# Neon PostgreSQL
DATABASE_URL="postgresql://..."

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_key"
CLOUDINARY_API_SECRET="your_secret"

# Admin
ADMIN_PASSWORD="admin123"
```

### 3. Base de données
```bash
pnpm db:push    # Créer les tables
pnpm db:seed    # Ajouter 16 produits de démarrage
```

### 4. Développement
```bash
pnpm dev
```

Visitez:
- Boutique: http://localhost:3000/boutique
- Admin: http://localhost:3000/admin

---

## 📚 Documentation Détaillée

| Document | Contenu |
|----------|---------|
| **QUICK_START.md** | Setup 10 minutes (résumé) |
| **GUIDE_DEPLOYMENT.md** | Instructions détaillées Neon + Cloudinary + Vercel |
| **ADMIN_GUIDE.md** | Utilisation du panel d'administration |
| **SETUP.md** | Architecture technique complète |
| **URLS_AND_COMMANDS.md** | Référence URLs et commandes |

**👉 Commencez par**: `QUICK_START.md` ou `GUIDE_DEPLOYMENT.md`

---

## 📂 Structure du Projet

```
app/
├── admin/              # Panel admin (protégé par mot de passe)
│   └── page.tsx        # Interface gestion produits
├── api/
│   ├── auth/           # POST /api/auth/login
│   ├── products/       # GET/POST/PUT/DELETE /api/products
│   └── upload/         # POST /api/upload (Cloudinary)
├── boutique/           # Page boutique principale
├── produit/            # Détail d'un produit
└── ...autres pages

components/
├── product-card.tsx    # Carte produit
├── product-filters.tsx # Filtres catégories
├── product-gallery.tsx # Galerie images
├── header.tsx          # En-tête/navigation
├── footer.tsx          # Pied de page
└── ui/                 # Composants Radix UI

lib/
├── prisma.ts           # Client Prisma singleton
├── products.ts         # [À supprimer - LEGACY]
└── utils.ts

prisma/
├── schema.prisma       # Schéma base de données
├── seed.ts             # Données initiales
└── migrations/         # Historique migrations
```

---

## 🔑 Variables d'Environnement Requises

### Neon PostgreSQL
1. Créez compte https://neon.tech
2. Créez un projet/database
3. Récupérez l'URL: `postgresql://user:pass@host/db?ssl=require`

### Cloudinary
1. Créez compte https://cloudinary.com
2. Dashboard → API Keys
3. Notez: `CLOUD_NAME`, `API_KEY`, `API_SECRET`

### Admin
- Choisissez un mot de passe sécurisé

---

## 🌐 Déploiement Vercel (5 étapes)

### 1. Poussez sur GitHub
```bash
git add .
git commit -m "Initial setup"
git push origin main
```

### 2. Créez un repo Vercel
Allez sur https://vercel.com/new

### 3. Importez le repo GitHub
- Connectez GitHub
- Sélectionnez `hello-there`

### 4. Configurez variables d'env
Dans Vercel → Settings → Environment Variables:
```
DATABASE_URL=postgresql://...
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
ADMIN_PASSWORD=...
```

### 5. Initialisez la BD
```bash
vercel env pull
pnpm db:push
```

✅ **C'est déployé!** Votre site est en ligne.

---

## 👨‍💼 Utilisation Admin Panel

### Accès
```
https://votre-domain.vercel.app/admin
Mot de passe: Celui configuré dans ADMIN_PASSWORD
```

### Actions
- **Ajouter produit**: Bouton "+ Add Product"
- **Éditer**: Clique sur le crayon ✏️
- **Supprimer**: Clique sur la corbeille 🗑️

### Champs produit
- Nom, Description
- Prix (en cents: 25000 = 250€)
- Catégorie (lingerie/parfums/nuisettes/accessoires)
- Images (URLs Cloudinary)
- Tailles et Couleurs

---

## 📊 Bases de Données

### Modèles Prisma
```typescript
// Product - Article en vente
model Product {
  id: Int
  name: String
  description: String
  price: Int           // Cents
  category: String     // lingerie|parfums|nuisettes|accessoires
  images: String[]     // Cloudinary URLs
  sizes: String[]      // S,M,L,XL
  colors: String[]     // Noir,Rose,Blanc
  inStock: Boolean
  createdAt: DateTime
  updatedAt: DateTime
}

// CartItem - Article dans le panier
// Order - Commande client
```

---

## 🔒 Sécurité

### Admin Panel
- ✅ Mot de passe stocké en variable d'env (jamais en code)
- ✅ Token JWT généré au login
- ✅ Requêtes API protégées par token
- ✅ Cookie HttpOnly optionnel

### Images
- ✅ Upload via Cloudinary (sécurisé)
- ✅ API key/secret non exposés au client

### Base de données
- ✅ Connexion SSL/TLS à Neon
- ✅ Jamais de credentials en git (.env.local dans .gitignore)

### À améliorer pour production
- [ ] NextAuth.js pour authentification multi-users
- [ ] Rate limiting sur les APIs
- [ ] CORS configuration stricte
- [ ] Logs d'audit pour modifications admin

---

## 🛠️ Commandes Utiles

```bash
# Développement
pnpm dev                    # Serveur local
pnpm db:push               # Sync schéma BD
pnpm db:seed               # Ajouter produits test
pnpm prisma studio         # Explorer BD graphiquement

# Production
pnpm build                 # Build optimisé
pnpm start                 # Lancer prod
pnpm lint                  # Vérifier code

# Git & Déploiement
git push origin main       # Pousser sur GitHub
vercel deploy              # Déployer sur Vercel
vercel env pull            # Récupérer vars d'env
```

---

## 🆘 Troubleshooting

### "Cannot find module @prisma/client"
```bash
pnpm install
rm -rf node_modules/.pnpm/prisma*
pnpm install
```

### "Database connection refused"
- Vérifiez DATABASE_URL dans .env.local
- Vérifiez que Neon est accessible

### "Unauthorized" admin
- Vérifiez ADMIN_PASSWORD
- Reconnectez-vous
- Videz localStorage si problème persiste

### Images ne s'affichent pas
- Vérifiez NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
- Testez l'URL dans le navigateur directement
- Vérifiez permissions Cloudinary

### "404 Not Found"
- Attendez fin du déploiement Vercel
- Rafraîchissez (Ctrl+Shift+R)
- Vérifiez URL exacte

---

## 📈 Scalabilité

### Limites gratuites
| Service | Limite | Solution |
|---------|--------|----------|
| Neon | 1 GB stockage | Suffisant pour ~10K produits |
| Cloudinary | 25 GB, 25K crédits | ~500 images qualité |
| Vercel | 100 GB bande | ~1M pages/mois |

### Pour croître
- Passer à Neon Pro (dès besoin)
- Ajouter CDN image (Vercel Image Optimization)
- Implémenter pagination/pagination
- Ajouter cache Redis (Vercel KV)

---

## 🎓 Améliorations Futures

- [ ] Panier persistant (BD)
- [ ] Système commande client
- [ ] Paiement Stripe
- [ ] Envoi email (Resend)
- [ ] Analytics (Vercel Analytics)
- [ ] Multi-language (i18n)
- [ ] Avis clients
- [ ] Newsletter

---

## 📞 Support & Ressources

**Documentation officielle:**
- Next.js: https://nextjs.org/docs
- Prisma: https://www.prisma.io/docs
- Neon: https://neon.tech/docs
- Cloudinary: https://cloudinary.com/documentation
- Vercel: https://vercel.com/docs

**Aide en ligne:**
- Stack Overflow: `next.js prisma neon`
- GitHub Discussions
- Discord communities

---

## 📝 License

Ce projet est créé pour Sella Seduction. Utilisation personnelle/commerciale autorisée.

---

## ✨ Prêt à démarrer?

1. **Développement local**: `QUICK_START.md`
2. **Déploiement production**: `GUIDE_DEPLOYMENT.md`
3. **Gestion produits**: `ADMIN_GUIDE.md`
4. **Référence**: `URLS_AND_COMMANDS.md`

**Bon commerce!** 🎉

