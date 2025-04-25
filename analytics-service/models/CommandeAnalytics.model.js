const mongoose = require('mongoose');

const CommandeAnalyticsSchema = new mongoose.Schema({
  commandeId: { type: String, required: true, index: true },
  client: { type: String, required: true },
  total: { type: Number, required: true },
  statut: { type: String, required: true },
  paiement: { type: String, required: true },
  adresse: String,
  email: String,
  createdAt: { type: Date, default: Date.now, index: true }
}, {
  autoIndex: true,
  timestamps: false
});

module.exports = mongoose.model('CommandeAnalytics', CommandeAnalyticsSchema);