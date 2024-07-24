// services/translationService.js
const jsforce = require('jsforce');
const fs = require('fs');
const path = require('path');

const translationService = {
  retrieveAndSaveMetadata: async (type, folderorg) => {
    const outputDir = path.join(__dirname, '..', 'org_files', type, folderorg);

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const conn = new jsforce.Connection({ loginUrl: process.env.SALESFORCE_LOGIN_URL });

    try {
      await conn.login(process.env.SALESFORCE_USERNAME, process.env.SALESFORCE_PASSWORD);
      console.log('Connected to Salesforce');

      let downloadedItems = [];

      if (type === 'CustomLabels') {
        const customLabels = await conn.metadata.read('CustomLabels', 'CustomLabels');
        const fileName = 'CustomLabels.labels';
        const content = JSON.stringify(customLabels, null, 2);

        const filePath = path.join(outputDir, fileName);
        fs.writeFileSync(filePath, content);
        downloadedItems.push('CustomLabels');
        console.log(`Downloaded: ${fileName}`);
      } else {
        throw new Error(`Unsupported metadata type: ${type}`);
      }

      console.log(`All ${type} have been downloaded successfully.`);
      return downloadedItems;
    } catch (err) {
      console.error(`Error retrieving ${type}:`, err);
      throw err;
    } finally {
      conn.logout();
    }
  }
};

module.exports = translationService;