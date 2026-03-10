# 📋 URLs & Commandes Importantes

## 🌐 URLs Services Externes

### Pendant le développement
```
Boutique Local:    http://localhost:3000/boutique
Admin Panel:       http://localhost:3000/admin
Accueil:           http://localhost:3000
```

### Après déploiement Vercel
```
Boutique:          https://votre-app.vercel.app/boutique
Admin Panel:       https://votre-app.vercel.app/admin
Accueil:           https://votre-app.vercel.app
```

### Services Externes
```
Neon Database:     https://console.neon.tech
Cloudinary:        https://cloudinary.com/console
Vercel Dashboard:  https://vercel.com/dashboard
GitHub:            https://github.com/votre-username/hello-there
```

---

## 🛠️ Commandes de Développement

### Installation & Setup Initial
```bash
# Installer les dépendances
pnpm install

# Créer les tables dans la BD
pnpm db:push

# Ajouter les produits de démarrage
pnpm db:seed
```

### Développement
```bash
# Démarrer le serveur de développement
pnpm dev

# Démarrer en mode production (build d'abord)
pnpm build
pnpm start

# Vérifier les erreurs (linting)
pnpm lint
```

### Base de Données
```bash
# Synchroniser schéma avec la BD
pnpm db:push

# Voir l'état de la BD
pnpm prisma db seed

# Ouvrir l'explorateur Prisma
pnpm prisma studio
```

### Déploiement
```bash
# Build pour production
pnpm build

# Déployer sur Vercel
vercel deploy

# Récupérer les vars d'env de Vercel
vercel env pull

# Initialiser la BD en production
vercel env pull
pnpm db:push
```

---

## 🔑 Variables d'Environnement

### `.env.local` (développement)
```bash
# PostgreSQL - Neon
DATABASE_URL="postgresql://user:password@host.neon.tech/dbname?sslmode=require"

# Cloudinary - Images
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="votre_cloud_name"
CLOUDINARY_API_KEY="votre_api_key"
CLOUDINARY_API_SECRET="votre_api_secret"

# Admin
ADMIN_PASSWORD="votre_mot_de_passe"
ADMIN_TOKEN="votre_token_optionnel"
```

### Vercel (production)
Configurez les mêmes variables dans:
- Vercel Dashboard → Settings → Environment Variables

---

## 📁 Structure des Dossiers Clés

```
projet-root/
├── app/
│   ├── admin/              ← Panel d'administration
│   │   └── page.tsx
│   ├── api/
│   │   ├── auth/           ← Authentification
│   │   │   └── login/
│   │   ├── products/       ← CRUD produits
│   │   │   ├── route.ts    (GET all, POST create)
│   │   │   └── [id]/
│   │   │       └── route.ts (GET one, PUT update, DELETE)
│   │   └── upload/         ← Upload Cloudinary
│   ├── boutique/           ← Affichage produits
│   ├── produit/            ← Détail produit
│   └── layout.tsx
├── components/             ← Composants React
│   ├── product-card.tsx
│   ├── product-filters.tsx
│   └── ui/                 ← Composants UI (Radix)
├── lib/
│   ├── prisma.ts          ← Client Prisma
│   └── products.ts        ← [LEGACY]
├── prisma/
│   ├── schema.prisma      ← Schéma BD
│   └── seed.ts            ← Données initiales
├── public/                ← Fichiers statiques
└── .env.local             ← Vars d'env (NE PAS COMMIT)
```

---

## 🚀 Étapes de Déploiement

### 1. Préparation
```bash
# Vérifier que tout fonctionne localement
pnpm dev

# Créer les tables Neon
pnpm db:push

# Remplir avec les produits
pnpm db:seed
```

### 2. GitHub
```bash
git add .
git commit -m "Setup boutique with Neon + Cloudinary"
git push origin main
```

### 3. Vercel
- New Project → Import from GitHub
- Repository: `hello-there`
- Configure environment variables
- Deploy!

### 4. Production Database
```bash
vercel env pull
pnpm db:push
```

---

## 📊 Schéma Base de Données

### Model: Product
```
id          Int        Primary Key
name        String     Nom du produit
description String     Description
price       Int        Prix en cents (25000 = 250€)
category    String     lingerie, parfums, nuisettes, accessoires
images      String[]   URLs Cloudinary
sizes       String[]   S, M, L, XL
colors      String[]   Noir, Rose, Blanc
inStock     Boolean    Disponibilité
createdAt   DateTime   Date création
updatedAt   DateTime   Date modification
```

### Model: CartItem
```
id        Int        Primary Key
sessionId String     ID session client
productId Int        Référence Product
quantity  Int        Quantité
size      String?    Taille sélectionnée
color     String?    Couleur sélectionnée
```

### Model: Order
```
id        Int        Primary Key
sessionId String     ID session client
items     Json[]     Détails articles [{productId, name, qty, price}]
total     Int        Total en cents
status    String     confirmed, shipped, delivered
createdAt DateTime   Date commande
```

---

## 🔐 Authentification Admin

### Login
- **URL**: `/api/auth/login` (POST)
- **Body**: `{ "password": "votre_password" }`
- **Response**: `{ "token": "base64_token" }`

### Utilisation du Token
Ajoutez ce header dans vos requêtes API:
```javascript
headers: {
  "Authorization": `Bearer ${token}`
}
```

### Sécurité
- Token stocké dans `localStorage`
- Cookie `adminToken` (HttpOnly) optionnel
- Session dure jusqu'à fermeture navigateur

---

## 🖼️ Gestion Images Cloudinary

### Upload via Dashboard
1. Allez sur https://cloudinary.com/console
2. Media Library → Upload
3. Copiez l'URL générée
4. Collez dans le formulaire admin

### Format URL
```
https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1234567890/folder/image.jpg
```

### Optimisation
```
# Ajouter le "?w=500" à la fin pour redimensionner
https://res.cloudinary.com/.../image.jpg?w=500

# Ajouter des transformations
v1234567890/c_fill,h_400,w_600/image.jpg
```

---

## 🐛 Debugging

### Console Erreurs (F12)
```javascript
// Voir les requêtes API
// Network tab → Voir les requêtes POST/PUT/DELETE

// Voir les logs
// Console tab → Messages d'erreur
```

### Logs Serveur
```bash
pnpm dev
# Les logs console.log() du serveur s'affichent ici
```

### Prisma Studio (Explorer BD graphiquement)
```bash
pnpm prisma studio
# Ouvre http://localhost:5555
```

---

## 📱 Mobile Support

La boutique est responsive:
- **Mobile**: Grille 1 colonne
- **Tablet**: Grille 2 colonnes
- **Desktop**: Grille 3 colonnes

Panel admin reste optimisé pour desktop (1024px+).

---

## 🆘 Aide Rapide

| Problème | Solution |
|----------|----------|
| "DB connection error" | Vérifier DATABASE_URL dans .env.local |
| "Unauthorized" admin | Vérifier ADMIN_PASSWORD |
| "Image ne s'affiche pas" | Vérifier NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME |
| "404 page not found" | Attendre déploiement Vercel terminé |
| "Token expired" | Se reconnecter au panel admin |

---

## 📞 Support Officiel

- **Neon**: https://neon.tech/docs
- **Cloudinary**: https://cloudinary.com/documentation
- **Vercel**: https://vercel.com/support
- **Next.js**: https://nextjs.org/docs
- **Prisma**: https://www.prisma.io/docs

