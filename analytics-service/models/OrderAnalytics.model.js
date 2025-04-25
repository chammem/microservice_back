const mongoose = require('mongoose');

const OrderAnalyticsSchema = new mongoose.Schema({
  orderId: { type: String, required: true, index: true },
  items: [{
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: String,
    image: String
  }],
  totalAmount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now, index: true }
}, {
  autoIndex: true,
  timestamps: false
});

module.exports = mongoose.model('OrderAnalytics', OrderAnalyticsSchema);