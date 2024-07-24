// routes/customPermissionRoutes.js
const express = require('express');
const router = express.Router();
const customPermissionController = require('../controllers/customPermissionController');

router.post('/retrieve/:folderorg', customPermissionController.retrieveCustomPermissions);

module.exports = router;