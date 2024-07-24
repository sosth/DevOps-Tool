// routes/layoutRoutes.js

const express = require('express');
const router = express.Router();
const layoutController = require('../controllers/layoutController');

router.post('/retrieve/:type/:folderorg', layoutController.retrieveLayoutItems);

module.exports = router;