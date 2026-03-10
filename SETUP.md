# Configuration - Boutique Sella Seduction

## 1. Setup Neon PostgreSQL

1. Créez un compte sur [neon.tech](https://neon.tech)
2. Créez un nouveau projet/database
3. Copiez l'URL de connexion PostgreSQL
4. Mettez à jour `.env.local`:
```
DATABASE_URL="postgresql://user:password@host.neon.tech/dbname?sslmode=require"
```

## 2. Setup Cloudinary

1. Créez un compte sur [cloudinary.com](https://cloudinary.com)
2. Allez dans Settings → API Keys
3. Mettez à jour `.env.local`:
```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
```

## 3. Admin Token Setup

1. Générez un token sécurisé:
```bash
node -e "console.log(Buffer.from('admin:' + Date.now()).toString('base64'))"
```

2. Mettez à jour `.env.local`:
```
ADMIN_TOKEN="your_generated_token"
ADMIN_PASSWORD="your_password_here"
```

## 4. Base de Données

### Initialiser le schéma:
```bash
pnpm db:push
```

### Remplir avec les produits de démarrage:
```bash
pnpm db:seed
```

## 5. Développement

```bash
pnpm dev
```

L'app sera disponible sur http://localhost:3000

## 6. Admin Panel

- **URL**: http://localhost:3000/admin
- **Password**: Celui défini dans `ADMIN_PASSWORD`

### Fonctionnalités Admin:
- ✅ Ajouter/Modifier/Supprimer des produits
- ✅ Gérer stock, prix, images, couleurs, tailles
- ✅ Upload d'images via Cloudinary

## 7. Déploiement Vercel

### Étape 1: Push sur GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/hello-there.git
git push -u origin main
```

### Étape 2: Déployer sur Vercel
1. Allez sur [vercel.com](https://vercel.com)
2. Connectez votre repo GitHub
3. Mettez à jour les variables d'environnement:
```
DATABASE_URL
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
ADMIN_TOKEN
ADMIN_PASSWORD
```
4. Déployez!

### Étape 3: Initialiser la BD en production
Une fois déployé, connectez-vous à votre Vercel dashboard et exécutez:
```bash
pnpm db:push
pnpm db:seed
```

## Structure

```
├── app/
│   ├── admin/          # Panel admin pour gérer produits
│   ├── api/
│   │   ├── products/   # CRUD produits
│   │   ├── auth/       # Login admin
│   │   └── upload/     # Upload Cloudinary
│   ├── boutique/       # Boutique (fetch depuis BD)
│   ├── produit/        # Détail produit
│   └── ...
├── prisma/
│   ├── schema.prisma   # Schéma base de données
│   └── seed.ts         # Données de démarrage
└── lib/
    ├── prisma.ts       # Client Prisma
    └── products.ts     # [LEGACY - peut être supprimé]
```

## Notes

- Les produits sont maintenant stockés dans PostgreSQL (Neon)
- Les images doivent être uploadées via Cloudinary
- L'authentification admin est simple (mot de passe en variable d'env)
- Pour la production, envisagez NextAuth.js avec une vraie auth

## Troubleshooting

### "Cannot find module @prisma/client"
```bash
pnpm install
```

### "DATABASE_URL is not defined"
Vérifiez que `.env.local` existe et contient `DATABASE_URL`

### "Unauthorized" sur l'admin panel
Vérifiez que `ADMIN_TOKEN` est défini et envoyé correctement
