# Étape 1 : Construction de l'application Angular
FROM node:18 AS build

# Définition du répertoire de travail
WORKDIR /app

# Copier les fichiers du projet Angular
COPY package.json package-lock.json ./
RUN npm install

COPY . .

# Compiler l'application Angular (génère /app/dist)
RUN npm run build --configuration=production && ls -la /app/dist

# Étape 2 : Serveur Nginx pour héberger l'application
FROM nginx:alpine

# Copier les fichiers buildés Angular dans le dossier de Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Exposer le port 80
EXPOSE 80

# Commande pour démarrer Nginx
CMD ["nginx", "-g", "daemon off;"]
