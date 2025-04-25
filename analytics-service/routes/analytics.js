const express = require('express');
const router = express.Router();
const analyticsController = require('../controller/analyticsController'); 

router.get('/dashboard', analyticsController.getDashboardStats);
//router.get('/stats', analyticsController.getStats); 
module.exports = router;