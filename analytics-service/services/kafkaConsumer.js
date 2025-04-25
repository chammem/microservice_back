const { Kafka } = require('kafkajs');
const config = require('../config/kafka');
const OrderAnalytics = require('../models/OrderAnalytics.model');
const CommandeAnalytics = require('../models/CommandeAnalytics.model');

const kafka = new Kafka({
  clientId: 'analytics-service',
  brokers: ['kafka:9092']
});

const consumer = kafka.consumer({
  groupId: 'analytics-group',
  heartbeatInterval: 3000,
  sessionTimeout: 30000
});

async function processOrderEvent(message) {
  try {
    const order = JSON.parse(message.value.toString());
    
    if (!order.id || !order.items) {
      throw new Error('Message de commande invalide - structure incorrecte');
    }

    await OrderAnalytics.create({
      orderId: order.id,
      items: order.items.map(item => ({
        name: item.name,
        price: item.price,
        category: item.category,
        image: item.image
      })),
      totalAmount: order.amount,
      createdAt: new Date()
    });

    const stats = await OrderAnalytics.aggregate([
      { $unwind: "$items" },
      { $group: {
        _id: "$items.name",
        count: { $sum: 1 },
        totalRevenue: { $sum: "$totalAmount" },
        image: { $first: "$items.image" }
      }},
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    console.log('📊 Statistiques produits mises à jour:', stats);
  } catch (err) {
    console.error('❌ Erreur processOrderEvent:', err);
  }
}

async function processCommandeEvent(message) {
  try {
    const commande = JSON.parse(message.value.toString());
    
    if (!commande.id || !commande.statutCommande) {
      throw new Error('Message de commande invalide - champs manquants');
    }

    await CommandeAnalytics.create({
      commandeId: commande.id,
      client: `${commande.prenomClient || ''} ${commande.nomClient || ''}`.trim(),
      total: commande.totalCommande || 0,
      statut: commande.statutCommande,
      paiement: commande.statutPaiement || 'NON_PAYE',
      adresse: commande.adresseClient,
      email: commande.email,
      createdAt: new Date()
    });

    console.log(`✅ Commande ${commande.id} enregistrée (Statut: ${commande.statutCommande})`);
  } catch (err) {
    console.error('❌ Erreur processCommandeEvent:', err);
  }
}

async function connectKafkaWithRetry(maxRetries = 5, delay = 5000) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔄 Tentative ${attempt} de connexion à Kafka...`);
      await consumer.connect();
      console.log('✅ Connecté au broker Kafka');
      return;
    } catch (err) {
      console.error(`❌ Échec tentative ${attempt}: ${err.message}`);
      if (attempt === maxRetries) {
        throw new Error('❌ Échec final de connexion à Kafka');
      }
      await new Promise(res => setTimeout(res, delay));
    }
  }
}

async function startKafkaConsumer() {
  try {
    await connectKafkaWithRetry();

    await consumer.subscribe({
      topics: ['order-events', 'command-events'],
      fromBeginning: false
    });

    console.log('👂 En écoute sur les topics: order-events, command-events');

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          console.log(`\n--- Nouveau message [${topic}][p${partition}] ---`);
          if (topic === 'order-events') {
            await processOrderEvent(message);
          } else if (topic === 'command-events') {
            await processCommandeEvent(message);
          }
        } catch (err) {
          console.error('❌ Erreur de traitement du message:', err);
        }
      }
    });

    consumer.on('consumer.crash', ({ error }) => {
      console.error('🚨 Crash du consumer Kafka:', error);
    });

  } catch (err) {
    console.error('❌ Erreur Kafka:', err);
    try {
      await consumer.disconnect();
    } catch (e) {
      console.error('Erreur lors de la déconnexion:', e);
    }
    throw err;
  }
}

module.exports = { startKafkaConsumer };