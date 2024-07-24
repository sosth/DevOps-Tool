// routes/apexRoutes.js

const express = require('express');
const router = express.Router();
const apexController = require('../controllers/apexController');

router.post('/retrieve/:type/:folderorg', apexController.retrieveApexItems);

module.exports = router;