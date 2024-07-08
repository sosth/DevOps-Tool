const express = require('express');
const router = express.Router();
const sfdxController = require('../controllers/sfdxController');

router.get('/orgs', sfdxController.listOrgs);
router.post('/deploy', sfdxController.deploy);
router.post('/retrieve', sfdxController.retrieve);

module.exports = router;

