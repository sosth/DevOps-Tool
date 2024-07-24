// routes/dataRoutes.js

const express = require('express');
const router = express.Router();
const dataController = require('../controllers/dataController');

router.post('/retrieve/:type/:folderorg', dataController.retrieveDataItems);

module.exports = router;