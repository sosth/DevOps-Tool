// routes/analyticsRoutes.js

const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

router.post('/retrieve/:type/:folderorg', analyticsController.retrieveAnalyticsItems);

module.exports = router;