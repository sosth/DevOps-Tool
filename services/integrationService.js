// services/integrationService.js
const jsforce = require('jsforce');
const fs = require('fs');
const path = require('path');

const integrationService = {
  retrieveAndSaveMetadata: async (type, folderorg) => {
    const outputDir = path.join(__dirname, '..', 'org_files', type, folderorg);

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const conn = new jsforce.Connection({ loginUrl: process.env.SALESFORCE_LOGIN_URL });

    try {
      await conn.login(process.env.SALESFORCE_USERNAME, process.env.SALESFORCE_PASSWORD);
      console.log('Connected to Salesforce');

      let result;
      switch (type) {
        case 'NamedCredential':
        case 'AuthProvider':
        case 'RemoteSiteSetting':
          result = await conn.metadata.list([{ type }], '51.0');
          break;
        case 'ExternalService':
          // Use the correct metadata type name for External Services
          result = await conn.metadata.list([{ type: 'ExternalServiceRegistration' }], '51.0');
          break;
        default:
          throw new Error(`Unsupported metadata type: ${type}`);
      }

      console.log('API Result:', JSON.stringify(result, null, 2));

      // Check if result is an array, if not, wrap it in an array
      const items = Array.isArray(result) ? result : [result];

      const downloadedItems = [];
      for (const item of items) {
        if (item && item.fullName) {
          const fileName = `${item.fullName}.${type.toLowerCase()}`;
          const metadata = await conn.metadata.read(type === 'ExternalService' ? 'ExternalServiceRegistration' : type, item.fullName);
          const content = JSON.stringify(metadata, null, 2);

          const filePath = path.join(outputDir, fileName);
          fs.writeFileSync(filePath, content);
          downloadedItems.push(item.fullName);
          console.log(`Downloaded: ${fileName}`);
        } else {
          console.log(`Skipping invalid item:`, item);
        }
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

module.exports = integrationService;