// routes/securityRoutes.js

const express = require('express');
const router = express.Router();
const securityController = require('../controllers/securityController');

router.post('/retrieve/:type/:folderorg', securityController.retrieveSecurityItems);

module.exports = router;