const express = require('express');
const router = express.Router();
const apexController = require('../controllers/apexController');

router.post('/retrieve-apex-classes', apexController.retrieveApexClasses);

module.exports = router;
