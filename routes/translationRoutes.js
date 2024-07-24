// routes/translationRoutes.js
const express = require('express');
const router = express.Router();
const translationController = require('../controllers/translationController');

router.post('/retrieve/:type/:folderorg', translationController.retrieveMetadata);

module.exports = router;