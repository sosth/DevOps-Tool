const express = require('express');
const router = express.Router();
const sfdxController = require('../controllers/sfdxController');

router.get('/orgs', sfdxController.listOrgs);
router.post('/deploy', sfdxController.deploy);
router.post('/retrieve', sfdxController.retrieve);
router.post('/retrieve-metadata', sfdxController.retrieveMetadata);
router.get('/listorg', sfdxController.listOrgFromSQL); // New route to list orgs from SQL
router.post('/deleteorg', sfdxController.deleteOrgFromSQL); // New route to delete an org from SQL

module.exports = router;
