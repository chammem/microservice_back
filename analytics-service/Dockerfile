FROM node:18 AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
# Créez le dossier pour les logs
RUN mkdir -p /var/log/analytics
EXPOSE 3000
CMD ["node", "app.js"]