const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const path = require('path');
const socketio = require('socket.io');
const analyticsRoutes = require('./routes/analytics');
const { startKafkaConsumer } = require('./services/kafkaConsumer');
const dbConfig = require('./config/db');
const cors = require('cors');
const eurekaClient = require('./config/eureka-client');

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: "http://localhost:8100",
    methods: ["GET", "POST"]
  }
});

// Configuration CORS unique et complète
const corsOptions = {
  origin: 'http://localhost:8100',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true
};

// Middleware
app.use(cors(corsOptions)); // <-- Une seule configuration CORS
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Gestion spécifique des requêtes OPTIONS
app.options('*', cors(corsOptions)); // <-- Important pour le prévol

// Routes
app.use('/api/analytics', analyticsRoutes);

eurekaClient.start(error => {
  if (error) {
    console.log('❌ Erreur lors de l’enregistrement dans Eureka:', error);
  } else {
    console.log('✅ Service enregistré dans Eureka');
  }
});

// Socket.io
io.on('connection', (socket) => {
  console.log('Nouvelle connexion Socket.io');
  socket.on('disconnect', () => {
    console.log('Utilisateur déconnecté');
  });
});

// Démarrage du serveur
async function startServer() {
  try {
    await mongoose.connect(dbConfig.url, {});
    console.log('✅ Connecté à MongoDB');

    await startKafkaConsumer();
    console.log('✅ Consumer Kafka démarré');

    const PORT = process.env.PORT || 3000; // <-- Changé à 3005 pour correspondre à votre erreur
    server.listen(PORT, () => {
      console.log(`🚀 Serveur démarré sur le port ${PORT}`);
    });
  } catch (err) {
    console.error('❌ Erreur au démarrage:', err);
    process.exit(1);
  }
}

startServer();

module.exports = app;