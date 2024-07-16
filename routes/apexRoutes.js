// routes/metadataRoutes.js

const express = require('express');
const router = express.Router();
const apexController = require('../controllers/apexController');

router.post('/retrieve/:type/:folderorg', apexController.retrieveMetadata);

module.exports = router;