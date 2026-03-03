# Maigup France Application

Bienvenue dans le code source du projet Maig'Up France. Il s'agit d'une application complète visant à faciliter et moderniser les parcours administratifs des étudiants (gestions d'inscriptions, témoignages, prise de contact, interface d'administration).

## Architecture du Projet

Le projet repose sur une séparation Front / Back selon les standards suivants :
- **Frontend** : Application React initialisée avec Vite, avec utilisation rigoureuse des librairies UI et de TailwindCSS.
- **Backend / API** : Réseau de requêtes basé sur `Node.js` (Express.js) permettant une connectivité au moteur de base de données (Firebase / Firestore) pour le stockage persistant.

## Configuration & Exécution Locale

Les informations sensibles et clés privées ne sont pas directement intégrées dans le dépôt grâce à une gestion des `.env`.
Un compte FireBase est requis pour connecter Backend et Frontend. 

### 1. Variables de Sécurité (Backend)
Veuillez vous assurer de créer un fichier `.env` dans la racine de `backend/` selon ces informations (à définir vos clés de service Firebase)
```
PORT=8000
FIREBASE_PROJECT_ID=votre_valeur
FIREBASE_CLIENT_EMAIL=votre_valeur
FIREBASE_PRIVATE_KEY=votre_clé_privée_ici
```

### 2. Démarrage du système complet

**Démarrage Serveur :**
```sh
cd backend
npm install
npm run dev
```

**Démarrage Client Web :**
```sh
cd frontend
npm install
npm run dev
```
(Sur le port par défaut 5173 du terminal Vite).

## Déploiement
* Le code côté serveur est conçu pour être publié via un environnement **Render.com** (utilisez le fichier pré-configuré `render.yaml`).
* Le Frontend se déploie à partir du sous-dossier `/frontend` (par exemple sur Vercel, Netlify).
