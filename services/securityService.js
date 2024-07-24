// services/securityService.js

const jsforce = require('jsforce');
const fs = require('fs');
const path = require('path');

const securityService = {
  retrieveAndSaveSecurityItems: async (folderorg, type) => {
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
        case 'PermissionSet':
        case 'Profile':
        case 'Role':
          result = await conn.metadata.list([{ type: type }], '51.0');
          break;
        case 'SharingRule':
          // Sharing Rules are part of CustomObject metadata
          result = await conn.metadata.list([{ type: 'CustomObject' }], '51.0');
          break;
        case 'FieldLevelSecurity':
          // Field Level Security is part of Profile metadata
          result = await conn.metadata.list([{ type: 'Profile' }], '51.0');
          break;
        default:
          throw new Error('Invalid security item type');
      }

      const downloadedItems = [];
      for (const item of result) {
        let metadata, content, fileName;
        
        switch(type) {
          case 'PermissionSet':
          case 'Profile':
          case 'Role':
            metadata = await conn.metadata.read(type, item.fullName);
            content = JSON.stringify(metadata, null, 2);
            fileName = `${item.fullName}.json`;
            break;
          case 'SharingRule':
            metadata = await conn.metadata.read('CustomObject', item.fullName);
            if (metadata.sharingModel) {
              content = JSON.stringify(metadata.sharingRules, null, 2);
              fileName = `${item.fullName}_SharingRules.json`;
            } else {
              continue; // Skip if no sharing rules
            }
            break;
          case 'FieldLevelSecurity':
            metadata = await conn.metadata.read('Profile', item.fullName);
            content = JSON.stringify(metadata.fieldPermissions, null, 2);
            fileName = `${item.fullName}_FieldLevelSecurity.json`;
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

module.exports = securityService;