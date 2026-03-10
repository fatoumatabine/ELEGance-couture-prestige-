#!/bin/bash

echo "🔧 Nettoyage et redémarrage du projet Elegance Couture"

# Arrêter tous les processus Node.js et Next.js
echo "📛 Arrêt des processus existants..."
pkill -9 node 2>/dev/null || true
pkill -9 next 2>/dev/null || true

# Attendre que les processus se terminent
sleep 2

# Supprimer le dossier .next pour un démarrage propre
echo "🧹 Suppression du cache Next.js..."
rm -rf .next 2>/dev/null || true

# Vérifier que les ports sont libres
echo "🔍 Vérification des ports..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:3001 | xargs kill -9 2>/dev/null || true

# S'assurer que nous utilisons la bonne version de Node.js
echo "⚙️ Configuration Node.js..."
nvm use 20.9.0 || nvm use default

# Vérifier pnpm
echo "📦 Vérification de pnpm..."
if ! command -v pnpm &> /dev/null; then
    echo "Installation de pnpm..."
    npm install -g pnpm
fi

echo "🚀 Démarrage du serveur de développement..."
pnpm dev
