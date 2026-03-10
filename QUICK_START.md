# ⚡ Quick Start - 10 minutes

## Pour les impatients

### 1. Variables d'environnement (5 min)

Créez/Modifiez `.env.local`:
```bash
# Neon (Get from https://neon.tech)
DATABASE_URL="postgresql://..."

# Cloudinary (Get from https://cloudinary.com)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="votre_cloud_name"
CLOUDINARY_API_KEY="votre_api_key"
CLOUDINARY_API_SECRET="votre_api_secret"

# Admin
ADMIN_PASSWORD="admin123"
```

### 2. Base de données (2 min)

```bash
pnpm db:push
pnpm db:seed
```

### 3. Démarrez local (1 min)

```bash
pnpm dev
```

### 4. Testez (2 min)

- Boutique: http://localhost:3000/boutique
- Admin: http://localhost:3000/admin (password: `admin123`)

---

## Pour le déploiement

### 1. Neon + Cloudinary setup ✓ (déjà fait)

### 2. GitHub
```bash
git add .
git commit -m "Initial setup"
git push origin main
```

### 3. Vercel
- New Project → Import from GitHub
- Add env vars (DATABASE_URL, CLOUDINARY_*, ADMIN_PASSWORD)
- Deploy!

### 4. Production DB setup
```bash
vercel env pull
pnpm db:push
pnpm db:seed
```

---

## Structure clé

```
/app
  /admin        ← Gestion produits
  /api
    /products   ← CRUD produits
    /auth       ← Login
    /upload     ← Upload images
  /boutique     ← Affichage produits

/prisma
  schema.prisma ← Modèle BD
  seed.ts       ← Données initiales
```

---

## Commandes utiles

```bash
pnpm dev              # Dev local
pnpm db:push          # Sync BD
pnpm db:seed          # Ajouter produits
pnpm build            # Build prod
pnpm start            # Run prod
```

---

## Docs complètes

- 📖 **Configuration détaillée**: `GUIDE_DEPLOYMENT.md`
- 👨‍💼 **Admin Panel**: `ADMIN_GUIDE.md`
- ⚙️ **Architecture**: `SETUP.md`

---

**C'est tout!** 🎉 Votre boutique est prête.

