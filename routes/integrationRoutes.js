// routes/integrationRoutes.js
const express = require('express');
const router = express.Router();
const integrationController = require('../controllers/integrationController');

router.post('/retrieve/:type/:folderorg', integrationController.retrieveMetadata);

module.exports = router;