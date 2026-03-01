FROM node:20-alpine

WORKDIR /app

# Copie des dépendances
COPY package*.json ./
COPY tsconfig.json ./

# CRUCIAL : Forcer l'installation des devDependencies (comme TypeScript) même si Back4App est en mode production
RUN npm install --include=dev

# Copie du code source
COPY src/ ./src/

# Construction du code TypeScript -> JavaScript
RUN npm run build

# Nettoyage : on ne garde que les modules de production pour alléger l'image
RUN npm prune --production

EXPOSE 8000

# Démarrage
CMD ["npm", "start"]
