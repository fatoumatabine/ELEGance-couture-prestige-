# 👨‍💼 Guide Admin Panel

## Accès au Panel

**URL**: `/admin` (ex: `http://localhost:3000/admin`)

### Connexion
1. Vous verrez un formulaire de login
2. Entrez le mot de passe défini dans `ADMIN_PASSWORD` (`.env.local`)
3. Cliquez "Login"

---

## Gérer les Produits

### Voir tous les produits
- Le tableau affiche tous les produits avec:
  - **Nom**: Nom du produit
  - **Catégorie**: lingerie, parfums, nuisettes, accessoires
  - **Prix**: Affiché en euros
  - **Stock**: "In Stock" (vert) ou "Out" (rouge)
  - **Actions**: Boutons Éditer et Supprimer

### Ajouter un produit

1. Cliquez le bouton **"+ Add Product"**
2. Remplissez le formulaire:

| Champ | Description | Exemple |
|-------|-------------|---------|
| **Name** | Nom du produit | "Ensemble Dentelle Rose" |
| **Description** | Description courte | "Ensemble soutien-gorge et culotte..." |
| **Price** | Prix en cents (100 = 1€) | 25000 (= 250€) |
| **Category** | Catégorie | lingerie, parfums, nuisettes, accessoires |
| **Image URLs** | URLs Cloudinary séparées par virgule | https://res.cloudinary.com/... |
| **Sizes** | Tailles disponibles (virgules) | S, M, L, XL |
| **Colors** | Couleurs (virgules) | Noir, Rose, Blanc |

3. Cliquez **"Create Product"**

**Exemple d'ajout complet:**
```
Name: Ensemble Satin Noir Luxe
Description: Ensemble élégant en satin noir avec dentelles fines
Price: 35000
Category: lingerie
Image URLs: https://res.cloudinary.com/dh7a8n/image/upload/v1234567890/satin-noir.jpg
Sizes: S, M, L, XL
Colors: Noir, Bordeaux, Blanc
```

### Modifier un produit

1. Cliquez le bouton ✏️ **Edit** à côté du produit
2. Modifiez les champs
3. Cliquez **"Update Product"**

### Supprimer un produit

1. Cliquez le bouton 🗑️ **Delete** à côté du produit
2. Confirmez la suppression
3. Le produit est immédiatement retiré

---

## Upload d'images via Cloudinary

### Méthode 1: Upload dans Cloudinary directement

1. Allez sur https://cloudinary.com/console
2. Onglet "Media Library"
3. Cliquez "Upload" et sélectionnez votre image
4. Une fois uploadée, cliquez dessus et copiez l'URL
5. Collez l'URL dans le champ "Image URLs" du formulaire produit

**L'URL ressemblera à:**
```
https://res.cloudinary.com/your-cloud-name/image/upload/v1234567890/dossier/nom-image.jpg
```

### Méthode 2: Upload directement depuis l'admin (à venir)

*Cette fonctionnalité sera bientôt disponible pour un upload plus facile*

---

## Gestion des Catégories

Les catégories disponibles sont:

1. **lingerie**: Ensembles, bodys, ceintures...
2. **parfums**: Parfums, eaux de toilette...
3. **nuisettes**: Nuisettes, déshabillés, kimonos...
4. **accessoires**: Bas, masques, bougies...

**Note**: Pour ajouter une nouvelle catégorie, modifiez `prisma/schema.prisma`

---

## Gestion des Tailles

Exemples selon les catégories:

| Catégorie | Tailles |
|-----------|---------|
| **lingerie** | S, M, L, XL |
| **parfums** | *(pas de tailles)* |
| **nuisettes** | XS, S, M, L, XL, XXL |
| **accessoires** | S/M, L/XL |

---

## Gestion des Couleurs

Format: Écrivez les couleurs en Français, séparées par virgules

**Exemples:**
- Noir, Blanc, Rose, Rouge, Beige
- Champagne, Ivoire, Bordeaux, Nude

---

## Gestion du Stock

- **In Stock** (vert): Le produit est disponible
- **Out** (rouge): Le produit n'est plus disponible

Pour changer le statut:
1. Éditez le produit
2. La case "In Stock" détermine la disponibilité
3. Cochez/décochez selon les besoins

---

## Affichage en Boutique

Les produits modifiés apparaissent **immédiatement** sur:
- `/boutique` (page générale)
- `/produit/[id]` (détail du produit)

**Note**: Une fois éditée, la page boutique se recharge automatiquement pour les nouveaux visiteurs.

---

## Conseils & Bonnes Pratiques

### ✅ À faire

- ✓ Utilisez des descriptions courtes mais complètes (50-150 caractères)
- ✓ Téléchargez des images de qualité (min 500x500px)
- ✓ Testez chaque ajout en visitant la page produit
- ✓ Mettez à jour le stock régulièrement
- ✓ Organisez vos images dans des dossiers Cloudinary (ex: `/lingerie`, `/parfums`)

### ❌ À éviter

- ✗ Prix en euros directement (utiliser les cents: 25000 = 250€)
- ✗ URLs cassées ou incomplètes
- ✗ Laisser trop de "out of stock"
- ✗ Descriptions vides ou trop longues
- ✗ Oublier de tester après modifications

---

## FAQ

### Q: Comment déconnecter un admin?
R: Visitez simplement une autre page ou rechargez. La session dure jusqu'à la fermeture du navigateur.

### Q: Les modifications sont-elles sauvegardées?
R: Oui, immédiatement dans la base Neon. Si vous voyez "Product created/updated", c'est fait!

### Q: Puis-je annuler une suppression?
R: Non, une suppression est définitive. Faites attention!

### Q: Combien de produits puis-je avoir?
R: Avec Neon gratuit: jusqu'à 1GB (~50 000 produits avec des images). C'est largement suffisant!

### Q: Les images disparaissent-elles si je supprime un produit?
R: Non, les images restent chez Cloudinary. Seul le lien est supprimé.

### Q: Comment ajouter d'autres admins?
R: Pour l'instant, il y a qu'un seul mot de passe. Partagez `ADMIN_PASSWORD` ou adaptez le code pour plusieurs utilisateurs.

---

## Problèmes Courants

### "Unauthorized" lors de l'ajout
**Cause**: Token expiré
**Solution**: Reconnectez-vous

### "Failed to save product"
**Cause**: Erreur de validation ou base de données inaccessible
**Solution**: 
- Vérifiez que `DATABASE_URL` est correct
- Vérifiez la connexion Neon
- Essayez à nouveau

### Produit ajouté mais n'apparaît pas en boutique
**Cause**: Cache navigateur
**Solution**:
- Rafraîchissez le navigateur (Ctrl+Shift+R)
- Attendez quelques secondes

### Image Cloudinary ne s'affiche pas
**Cause**: URL invalide ou domaine Cloudinary non configuré
**Solution**:
- Vérifiez l'URL copiée exactement
- Assurez-vous que `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` est correct
- Testez l'URL directement dans le navigateur

---

## Besoin d'aide?

- 📧 Erreur techniques → Vérifiez la console (F12) pour les logs
- 💾 Problème base de données → Consultez https://neon.tech/docs
- ☁️ Problème Cloudinary → Consultez https://cloudinary.com/documentation

