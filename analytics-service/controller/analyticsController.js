const OrderAnalytics = require('../models/OrderAnalytics.model');
const CommandeAnalytics = require('../models/CommandeAnalytics.model'); 

exports.getDashboardStats = async (req, res) => {
    try {
        if (!OrderAnalytics || !CommandeAnalytics) {
            throw new Error('Database models not initialized');
        }

      const [dailyOrders, popularItems, revenue, commandesStats] = await Promise.all([
        // Commandes par jour (OrderAnalytics)
        OrderAnalytics.aggregate([
          { 
            $group: { 
              _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
              count: { $sum: 1 },
              revenue: { $sum: "$totalAmount" }
            }
          },
          { $sort: { "_id": 1 } }
        ]),
  
        // Top produits (OrderAnalytics)
        OrderAnalytics.aggregate([
          { $unwind: "$items" },
          { $group: { 
              _id: "$items.name", 
              count: { $sum: 1 },
              image: { $first: "$items.image" } 
          }},
          { $sort: { count: -1 } },
          { $limit: 5 }
        ]),
  
        // Revenue total (OrderAnalytics)
        OrderAnalytics.aggregate([
          { $group: { _id: null, total: { $sum: "$totalAmount" } } }
        ]),
  
        // Stats des commandes (CommandeAnalytics)
        CommandeAnalytics.aggregate([
          { 
            $group: { 
              _id: "$statut", 
              count: { $sum: 1 },
              totalRevenue: { $sum: "$total" }
            }
          },
          { $sort: { count: -1 } }
        ])
      ]);
  
      res.json({
        dailyOrders,
        popularItems,
        totalRevenue: revenue[0]?.total || 0,
        commandesStats // Ajouté
      });
    } catch (err) {
      console.error('Erreur getDashboardStats:', err);
      res.status(500).json({ error: err.message });
    }
  };