# 🚀 Guide de Déploiement - Boutique Sella Seduction

## Étape 1️⃣ : Préparez Neon PostgreSQL

### 1. Créez un compte Neon
- Allez sur https://neon.tech
- Inscrivez-vous (gratuit)
- Créez un nouveau project

### 2. Récupérez l'URL de connexion
- Dans le dashboard Neon, sélectionnez votre project
- Allez dans "Connection string"
- Copiez l'URL (ressemble à `postgresql://user:password@...`)

### 3. Mettez à jour `.env.local`
```bash
# Remplacez par votre URL Neon
DATABASE_URL="postgresql://user:password@host.neon.tech/dbname?sslmode=require"
```

---

## Étape 2️⃣ : Configurez Cloudinary pour les images

### 1. Créez un compte Cloudinary
- Allez sur https://cloudinary.com
- Inscrivez-vous (gratuit)
- Confirmez votre email

### 2. Récupérez vos credentials
- Dashboard → Settings → API Keys
- Vous verrez:
  - **Cloud Name**
  - **API Key**
  - **API Secret** (ne partagez JAMAIS ce secret!)

### 3. Mettez à jour `.env.local`
```bash
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="votre_cloud_name"
CLOUDINARY_API_KEY="votre_api_key"
CLOUDINARY_API_SECRET="votre_api_secret"
```

---

## Étape 3️⃣ : Configuration Admin

### 1. Définissez un mot de passe admin sécurisé
```bash
# Dans .env.local
ADMIN_PASSWORD="votre_mot_de_passe_super_secret_123"
```

### 2. Générez un token (optionnel)
```bash
# Exécutez dans le terminal
node -e "console.log(Buffer.from('admin:' + Date.now()).toString('base64'))"

# Mettez à jour .env.local (remplacez par le token généré)
ADMIN_TOKEN="votre_token_genere"
```

---

## Étape 4️⃣ : Initialisez la base de données localement

### 1. Créez les tables
```bash
pnpm db:push
```

### 2. Remplissez avec les produits de démarrage
```bash
pnpm db:seed
```

### 3. Testez localement
```bash
pnpm dev
```
Visitez http://localhost:3000/admin et connectez-vous avec votre mot de passe

---

## Étape 5️⃣ : Poussez votre code sur GitHub

### 1. Initialisez Git (si pas déjà fait)
```bash
git init
git add .
git commit -m "Initial commit - Setup Neon + Cloudinary"
```

### 2. Créez un repo sur GitHub
- Allez sur https://github.com/new
- Créez un nouveau repository (public ou private)
- Ne cochez PAS "Initialize with README"

### 3. Poussez votre code
```bash
git remote add origin https://github.com/VOTRE_USERNAME/hello-there.git
git branch -M main
git push -u origin main
```

---

## Étape 6️⃣ : Déployez sur Vercel

### 1. Connectez Vercel à GitHub
- Allez sur https://vercel.com
- Cliquez "New Project"
- Importez depuis GitHub
- Sélectionnez votre repo `hello-there`

### 2. Configurez les variables d'environnement
Avant de déployer, allez dans **Settings → Environment Variables** et ajoutez:

```
DATABASE_URL=postgresql://user:password@...    (de Neon)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=votre_name  
CLOUDINARY_API_KEY=votre_key                   
CLOUDINARY_API_SECRET=votre_secret             
ADMIN_PASSWORD=votre_mot_de_passe             
ADMIN_TOKEN=votre_token_genere                
```

### 3. Déployez
- Cliquez "Deploy"
- Attendez que le déploiement soit terminé (~3-5 min)

---

## Étape 7️⃣ : Initialisez la BD en production

Une fois le déploiement terminé, vous devez créer les tables dans Neon:

### Option A: Via Vercel CLI (recommandé)
```bash
# Installez Vercel CLI
npm i -g vercel

# Loggez-vous
vercel login

# Allez dans votre projet
cd /chemin/vers/hello-there

# Exécutez la migration
vercel env pull  # Récupère les vars d'env
pnpm db:push     # Crée les tables
pnpm db:seed     # Ajoute les produits
```

### Option B: Via Neon Dashboard
1. Allez dans votre dashboard Neon
2. Allez dans "SQL Editor"
3. Exécutez le SQL généré par Prisma

```bash
# Pour voir le SQL à exécuter:
pnpm prisma migrate diff --from-empty --to-schema-datasource prisma/schema.prisma --script
```

---

## ✅ Vérification finale

### 1. Testez le site
- Visitez votre URL Vercel (ex: `https://hello-there-gamma.vercel.app`)
- Naviguez dans la boutique
- Vérifiez que les produits s'affichent

### 2. Testez l'admin panel
- Allez sur `/admin`
- Connectez-vous avec votre mot de passe
- Essayez d'ajouter/modifier/supprimer un produit

### 3. Testez les images
- Uploadez une image depuis l'admin
- Vérifiez qu'elle apparaît sur la page produit

---

## 🚨 Troubleshooting

### "Database Connection Error"
**Problème**: `DATABASE_URL` est vide ou incorrect
**Solution**: 
- Vérifiez que la variable est correctement définie sur Vercel
- Testez la connexion: `pnpm db:push`

### "Unauthorized" sur l'admin
**Problème**: Le mot de passe n'est pas reconnu
**Solution**:
- Vérifiez que `ADMIN_PASSWORD` est défini sur Vercel
- Déployez à nouveau après mise à jour

### "Upload Cloudinary échoue"
**Problème**: Les credentials Cloudinary sont incorrects
**Solution**:
- Vérifiez `CLOUDINARY_API_KEY` et `CLOUDINARY_API_SECRET`
- Assurez-vous que ce ne sont pas les mêmes (Key ≠ Secret)

### "404 - Page not found"
**Problème**: Une page ou une route n'existe pas
**Solution**:
- Attendez que le déploiement soit complètement terminé
- Rafraîchissez le navigateur (Ctrl+Shift+R)

---

## 📝 Notes importantes

1. **Sécurité**: 
   - Ne commitez JAMAIS `.env.local` (il est dans `.gitignore`)
   - Gardez `CLOUDINARY_API_SECRET` secret
   - Changez `ADMIN_PASSWORD` après la première connexion

2. **Limites gratuites**:
   - **Neon**: 3 projets, 1 GB de stockage
   - **Cloudinary**: 25 GB de stockage, 25 K crédits/mois
   - **Vercel**: 100 GB bande passante/mois

3. **Support**:
   - **Neon Support**: https://neon.tech/docs
   - **Cloudinary Support**: https://cloudinary.com/documentation
   - **Vercel Support**: https://vercel.com/support

---

## 🎉 Bravo!

Votre boutique est maintenant en ligne! 

**URLs à retenir:**
- 📱 Boutique: `https://votre-domain.vercel.app/boutique`
- 🔐 Admin: `https://votre-domain.vercel.app/admin`
- 🗄️ Neon: https://console.neon.tech
- ☁️ Cloudinary: https://cloudinary.com/console
- ▲ Vercel: https://vercel.com/dashboard

