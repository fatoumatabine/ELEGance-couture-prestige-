#!/bin/bash

# Script de démarrage pour Elegance Couture
# Usage: ./start-dev.sh

echo "🚀 Démarrage du serveur de développement Elegance Couture..."

# Vérifier si nvm est chargé
if ! command -v nvm &> /dev/null; then
    echo "Chargement de nvm..."
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
fi

# Utiliser Node.js 20
nvm use 20

# Vérifier si pnpm est installé
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm n'est pas installé. Installation en cours..."
    npm install -g pnpm
fi

# Installer les dépendances si node_modules n'existe pas
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances..."
    pnpm install
fi

echo "🔥 Lancement du serveur de développement..."
echo "Le site sera accessible sur: http://localhost:3000"
echo ""

# Lancer le serveur de développement
pnpm dev
