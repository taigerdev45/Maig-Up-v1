FROM node:20-alpine

WORKDIR /app

# Copie des dépendances du backend (on est déjà dans /backend selon Back4App)
COPY package*.json ./

# Installation des paquets
RUN npm install

# Copie du reste du code source
COPY . .

# Build du backend (TypeScript -> JavaScript dans /dist)
RUN npm run build

# Exposition du port
EXPOSE 8000

# Commande de démarrage
CMD ["npm", "start"]
