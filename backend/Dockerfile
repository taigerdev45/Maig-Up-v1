FROM node:20-alpine

WORKDIR /app

# Copie uniquement des fichiers de dépendances
COPY package*.json ./

# Installation des paquets (UNIQUEMENT les paquets de production, ce qui demande très peu de RAM)
RUN npm ci --omit=dev || npm install --omit=dev

# Copie du code DÉJÀ compilé
COPY dist/ ./dist/

# Exposition du port
EXPOSE 8000

# Démarrage
CMD ["npm", "start"]
