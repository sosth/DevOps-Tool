const express = require('express');
const router = express.Router();
const deploymentController = require('../controllers/deploymentController');

// Route to create a new deployment
router.post('/create', deploymentController.createDeployment);
// Route to get all deployments
router.get('/', deploymentController.getDeployments);
// You can add more deployment-related routes here in the future

module.exports = router;