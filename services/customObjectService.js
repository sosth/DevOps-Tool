// services/customObjectService.js

const jsforce = require('jsforce');
const fs = require('fs');
const path = require('path');

const customObjectService = {
  retrieveAndSaveCustomItems: async (folderorg, type) => {
    const outputDir = path.join(__dirname, '..', 'org_files', type, folderorg);

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const conn = new jsforce.Connection({ loginUrl: process.env.SALESFORCE_LOGIN_URL });
    
    try {
      await conn.login(process.env.SALESFORCE_USERNAME, process.env.SALESFORCE_PASSWORD);
      console.log('Connected to Salesforce');

      let result;
      if (type === 'CustomObject') {
        // Use Metadata API for CustomObjects
        result = await conn.metadata.list([{ type: 'CustomObject' }], '51.0');
      } else {
        // Use Tooling API for other types
        let query;
        switch(type) {
          case 'CustomField':
            query = "SELECT Id, DeveloperName, NamespacePrefix, TableEnumOrId FROM CustomField";
            break;
          case 'CustomTab':
            query = "SELECT Id, DeveloperName, NamespacePrefix FROM CustomTab";
            break;
          case 'CustomApplication':
            query = "SELECT Id, DeveloperName, NamespacePrefix FROM CustomApplication";
            break;
          case 'CustomLabel':
            query = "SELECT Id, Name, Category, Value, Language FROM ExternalString";
            break;
          default:
            throw new Error('Invalid Custom item type');
        }
        result = await conn.tooling.query(query);
        result = result.records;
      }

      const downloadedItems = [];
      for (const record of result) {
        let fileName, content;
        if (type === 'CustomObject') {
          const metadata = await conn.metadata.read('CustomObject', record.fullName);
          content = JSON.stringify(metadata, null, 2);
          fileName = `${record.fullName}.json`;
        } else {
          fileName = type === 'CustomLabel' ? `${record.Name}.json` : `${record.DeveloperName}.json`;
          content = JSON.stringify(record, null, 2);
        }

        const filePath = path.join(outputDir, fileName);
        fs.writeFileSync(filePath, content);
        downloadedItems.push(record.fullName || record.Name || record.DeveloperName);
        console.log(`Downloaded: ${fileName}`);
      }

      console.log(`All ${type} items have been downloaded successfully.`);
      return downloadedItems;
    } catch (err) {
      console.error(`Error retrieving ${type} items:`, err);
      throw err;
    } finally {
      conn.logout();
    }
  }
};

module.exports = customObjectService;