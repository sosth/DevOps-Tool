// services/communityService.js

const jsforce = require('jsforce');
const fs = require('fs');
const path = require('path');

const communityService = {
  retrieveAndSaveCommunityItems: async (folderorg, type) => {
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
        case 'Community':
          result = await conn.metadata.list([{ type: 'Network' }], '51.0');
          break;
        case 'Site':
          result = await conn.metadata.list([{ type: 'CustomSite' }], '51.0');
          break;
        case 'ChatterGroup':
          result = await conn.query('SELECT Id, Name, Description FROM CollaborationGroup WHERE IsArchived = false');
          break;
        default:
          throw new Error('Invalid Community item type');
      }

      console.log(`Result for ${type}:`, JSON.stringify(result, null, 2));

      let items = [];
      if (result && result.records) {
        items = result.records;
      } else if (Array.isArray(result)) {
        items = result;
      } else if (result) {
        items = [result];
      } else {
        console.log(`No ${type} items found.`);
        return [];
      }

      const downloadedItems = [];
      for (const item of items) {
        let metadata, content, fileName;
        
        switch(type) {
          case 'Community':
            metadata = await conn.metadata.read('Network', item.fullName);
            content = JSON.stringify(metadata, null, 2);
            fileName = `${item.fullName}_Community.json`;
            break;
          case 'Site':
            metadata = await conn.metadata.read('CustomSite', item.fullName);
            content = JSON.stringify(metadata, null, 2);
            fileName = `${item.fullName}_Site.json`;
            break;
          case 'ChatterGroup':
            content = JSON.stringify(item, null, 2);
            fileName = `${item.Name}_ChatterGroup.json`;
            break;
        }

        const filePath = path.join(outputDir, fileName);
        fs.writeFileSync(filePath, content);
        downloadedItems.push(item.fullName || item.Name);
        console.log(`Downloaded: ${fileName}`);
      }

      console.log(`All ${type} items have been downloaded successfully.`);
      return downloadedItems;
    } catch (err) {
      console.error(`Error retrieving ${type} items:`, err);
      throw err;
    } finally {
      await conn.logout();
    }
  }
};

module.exports = communityService;