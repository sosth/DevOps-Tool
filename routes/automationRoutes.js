// routes/automationRoutes.js

const express = require('express');
const router = express.Router();
const automationController = require('../controllers/automationController');

router.post('/retrieve/:type/:folderorg', automationController.retrieveAutomationItems);

module.exports = router;