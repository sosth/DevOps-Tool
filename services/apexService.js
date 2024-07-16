// services/metadataService.js

const jsforce = require('jsforce');
const fs = require('fs');
const path = require('path');

const apexService = {
  retrieveAndSaveMetadata: async (type, folderorg) => {
    const outputDir = path.join(__dirname, '..', 'org_files', type, folderorg);

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const conn = new jsforce.Connection({ loginUrl: process.env.SALESFORCE_LOGIN_URL });
    
    try {
      await conn.login(process.env.SALESFORCE_USERNAME, process.env.SALESFORCE_PASSWORD);
      console.log('Connecté à Salesforce');

      let query, result;
      if (type === 'ApexClass') {
        query = 'SELECT Id, Name, Body FROM ApexClass';
        result = await conn.tooling.query(query);
      } else if (type === 'CustomObject') {
        result = await conn.metadata.list([{ type: 'CustomObject' }], '51.0');
      }

      const downloadedItems = [];
      for (const item of result.records || result) {
        let fileName, content;
        if (type === 'ApexClass') {
          fileName = `${item.Name}.cls`;
          content = item.Body;
        } else if (type === 'CustomObject') {
          fileName = `${item.fullName}.object`;
          const metadata = await conn.metadata.read('CustomObject', item.fullName);
          content = JSON.stringify(metadata, null, 2);
        }

        const filePath = path.join(outputDir, fileName);
        fs.writeFileSync(filePath, content);
        downloadedItems.push(item.Name || item.fullName);
        console.log(`Téléchargé: ${fileName}`);
      }

      console.log(`Tous les ${type} ont été téléchargés avec succès.`);
      return downloadedItems;
    } catch (err) {
      console.error(`Erreur lors de la récupération des ${type}:`, err);
      throw err;
    } finally {
      conn.logout();
    }
  }
};

module.exports = apexService;