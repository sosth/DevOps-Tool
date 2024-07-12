// routes/routes.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const deploymentController = require('../controllers/deploymentController');

router.post('/retrieve/type/folderorg', deploymentController.retrieveComponents);

router.get('/metadata/:orgName/:componentType', (req, res) => {
    const { orgName, componentType } = req.params;
    const metadataDir = path.join(__dirname, '..', 'org_files', orgName, componentType);

    if (fs.existsSync(metadataDir)) {
        fs.readdir(metadataDir, (err, files) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Failed to read metadata directory.' });
            }
            const metadata = files.map(file => {
                const filePath = path.join(metadataDir, file);
                const content = fs.readFileSync(filePath, 'utf8');
                return { Name: file, Body: content };
            });
            res.status(200).json(metadata);
        });
    } else {
        res.status(404).json({ success: false, message: 'Metadata directory not found.' });
    }
});

module.exports = router;
