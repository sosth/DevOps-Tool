// routes/serviceCloudRoutes.js

const express = require('express');
const router = express.Router();
const serviceCloudController = require('../controllers/serviceCloudController');

router.post('/retrieve/:type/:folderorg', serviceCloudController.retrieveServiceCloudItems);

module.exports = router;