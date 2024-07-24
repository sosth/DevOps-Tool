// routes/customObjectRoutes.js

const express = require('express');
const router = express.Router();
const customObjectController = require('../controllers/customObjectController');

router.post('/retrieve/:type/:folderorg', customObjectController.retrieveCustomItems);

module.exports = router;