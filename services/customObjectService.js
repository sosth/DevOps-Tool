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
      switch(type) {
        case 'CustomObject':
        case 'CustomField':
        case 'CustomApplication':
          case 'CustomTab':
            result = await conn.metadata.list([{ type: type }], '51.0');
            console.log('CustomTab result:', JSON.stringify(result, null, 2));
            break;
        case 'CustomLabel':
          // Custom Labels are nested within a CustomLabels parent
          result = await conn.metadata.read('CustomLabels', 'CustomLabels');
          break;
        default:
          throw new Error('Invalid Custom item type');
      }

      const downloadedItems = [];
      if (type === 'CustomLabel') {
        // Handle Custom Labels separately
        const labels = result.labels || [];
        for (const label of labels) {
          const fileName = `${label.fullName}.json`;
          const content = JSON.stringify(label, null, 2);
          const filePath = path.join(outputDir, fileName);
          fs.writeFileSync(filePath, content);
          downloadedItems.push(label.fullName);
          console.log(`Downloaded: ${fileName}`);
        }
      } else {
        // Handle other types
        for (const item of Array.isArray(result) ? result : [result]) {
          if (!item || typeof item !== 'object') {
            console.log(`Skipping invalid item:`, item);
            continue;
          }
        
          if (!item.fullName) {
            console.log(`Item missing fullName:`, item);
            continue;
          }
        
          let metadata;
          try {
            metadata = await conn.metadata.read(type, item.fullName);
          } catch (readError) {
            console.error(`Error reading metadata for ${item.fullName}:`, readError);
            continue;
          }
        
          if (!metadata) {
            console.log(`No metadata found for ${item.fullName}`);
            continue;
          }
        
          const content = JSON.stringify(metadata, null, 2);
          const fileName = `${item.fullName}.json`;
          const filePath = path.join(outputDir, fileName);
          fs.writeFileSync(filePath, content);
          downloadedItems.push(item.fullName);
          console.log(`Downloaded: ${fileName}`);
        }
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