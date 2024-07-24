// services/layoutService.js

const jsforce = require('jsforce');
const fs = require('fs');
const path = require('path');

const layoutService = {
  retrieveAndSaveLayoutItems: async (folderorg, type) => {
    const outputDir = path.join(__dirname, '..', 'org_files', type, folderorg);

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const conn = new jsforce.Connection({ loginUrl: process.env.SALESFORCE_LOGIN_URL });
    
    try {
      await conn.login(process.env.SALESFORCE_USERNAME, process.env.SALESFORCE_PASSWORD);
      console.log('Connected to Salesforce');

      let result;
      switch(type) {
        case 'FieldSet':
        case 'RecordType':
        case 'CompactLayout':
          // These are part of CustomObject metadata
          result = await conn.metadata.list([{ type: 'CustomObject' }], '51.0');
          break;
        case 'Layout':
          result = await conn.metadata.list([{ type: 'Layout' }], '51.0');
          break;
        default:
          throw new Error('Invalid layout item type');
      }

      const downloadedItems = [];
      for (const item of result) {
        let metadata, content, fileName;
        
        switch(type) {
          case 'FieldSet':
            metadata = await conn.metadata.read('CustomObject', item.fullName);
            if (metadata.fieldSets && metadata.fieldSets.length > 0) {
              content = JSON.stringify(metadata.fieldSets, null, 2);
              fileName = `${item.fullName}_FieldSets.json`;
            } else {
              continue; // Skip if no field sets
            }
            break;
          case 'RecordType':
            metadata = await conn.metadata.read('CustomObject', item.fullName);
            if (metadata.recordTypes && metadata.recordTypes.length > 0) {
              content = JSON.stringify(metadata.recordTypes, null, 2);
              fileName = `${item.fullName}_RecordTypes.json`;
            } else {
              continue; // Skip if no record types
            }
            break;
          case 'CompactLayout':
            metadata = await conn.metadata.read('CustomObject', item.fullName);
            if (metadata.compactLayouts && metadata.compactLayouts.length > 0) {
              content = JSON.stringify(metadata.compactLayouts, null, 2);
              fileName = `${item.fullName}_CompactLayouts.json`;
            } else {
              continue; // Skip if no compact layouts
            }
            break;
          case 'Layout':
            metadata = await conn.metadata.read('Layout', item.fullName);
            content = JSON.stringify(metadata, null, 2);
            fileName = `${item.fullName}.json`;
            break;
        }

        const filePath = path.join(outputDir, fileName);
        fs.writeFileSync(filePath, content);
        downloadedItems.push(item.fullName);
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

module.exports = layoutService;