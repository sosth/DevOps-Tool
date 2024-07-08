// routes/deploymentRoutes.js
const express = require('express');
const router = express.Router();
const deploymentController = require('../controllers/deploymentController');

router.post('/deployments', deploymentController.createDeployment);

module.exports = router;
