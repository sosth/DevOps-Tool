// routes/communityRoutes.js

const express = require('express');
const router = express.Router();
const communityController = require('../controllers/communityController');

router.post('/retrieve/:type/:folderorg', communityController.retrieveCommunityItems);

module.exports = router;