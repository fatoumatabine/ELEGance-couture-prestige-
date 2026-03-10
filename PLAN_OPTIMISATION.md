# Plan d'Optimisation - Problèmes de Performance Elegance Couture

## Problèmes Identifiés

### 1. Images Externes Non Optimisées (PROBLÈME MAJEUR)
- **Problème** : Utilisation d'images Unsplash et Pinterest via URLs externes
- **Impact** : Délais de chargement de 5-9 secondes par image
- **Localisation** : `app/page.tsx` lignes 15-50

```typescript
// Problème actuel - Images externes
image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=700&fit=crop"
image: "https://i.pinimg.com/736x/0c/f1/e8/0cf1e876c533e0a0f9a4c09427fd692c.jpg"
```

### 2. Configuration Next.js Sous-Optimale
- **Problème** : `unoptimized: true` dans next.config.mjs
- **Impact** : Désactive l'optimisation automatique des images Next.js

### 3. Absence d'Optimisation des Assets
- **Problème** : 
  - Pas de lazy loading pour les images
  - Pas de compression des assets
  - Vidéo hero non optimisée

### 4. Structure de Données Inefficace
- **Problème** : Données hardcodées dans le composant
- **Impact** : Bundle JavaScript plus lourd

## Plan de Résolution

### Phase 1 : Images Locales Optimisées
1. **Remplacer les images externes par des images locales**
   - Télécharger et optimiser les images
   - Utiliser le composant Image de Next.js
   - Implémenter le lazy loading

### Phase 2 : Configuration Next.js Optimale
1. **Optimiser next.config.mjs**
   - Activer l'optimisation des images
   - Configurer les domaines autorisés
   - Ajouter la compression

### Phase 3 : Optimisation des Assets
1. **Optimiser la vidéo hero**
   - Compresser et optimiser le fichier vidéo
   - Implémenter le lazy loading pour la vidéo

### Phase 4 : Refactoring des Données
1. **Séparer les données du composant**
   - Créer un fichier de données séparé
   - Utiliser React.memo pour les composants
   - Implémenter la pagination

## Impact Attendu
- **Réduction du temps de chargement** : 90% (de 9s à <1s)
- **Amélioration du score Lighthouse** : Performance 90+
- **Meilleure expérience utilisateur** : Chargement instantané des pages

## Commandes d'Implémentation
```bash
# Optimiser les images
npm install sharp
npm run build:images

# Redémarrer le serveur
pnpm dev
