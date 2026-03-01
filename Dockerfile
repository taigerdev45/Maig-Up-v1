FROM node:20-alpine

WORKDIR /app

# On copie d'abord les fichiers de configuration du backend
COPY backend/package*.json ./
COPY backend/tsconfig.json ./

# Installation des paquets (y compris devDependencies pour tsc)
RUN npm install

# On copie le code source du backend
COPY backend/src ./src

# Build du backend (TypeScript -> JavaScript dans /dist)
RUN npm run build

# Exposition du port
EXPOSE 8000

# Commande de démarrage
CMD ["npm", "start"]
