const jsforce = require('jsforce');
const fs = require('fs');
const path = require('path');

const serviceCloudService = {
  retrieveAndSaveServiceCloudItems: async (folderorg, type) => {
    const outputDir = path.join(__dirname, '..', 'org_files', type, folderorg);

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const conn = new jsforce.Connection({ loginUrl: process.env.SALESFORCE_LOGIN_URL });
    
    try {
      await conn.login(process.env.SALESFORCE_USERNAME, process.env.SALESFORCE_PASSWORD);
      console.log('Connected to Salesforce');

      let result;
      try {
        switch(type) {
          case 'CaseAssignmentRule':
            result = await conn.metadata.list([{ type: 'AssignmentRules' }], '51.0');
            break;
          case 'CaseAutoResponseRule':
            result = await conn.metadata.list([{ type: 'AutoResponseRules' }], '51.0');
            break;
          case 'EscalationRule':
            result = await conn.metadata.list([{ type: 'EscalationRules' }], '51.0');
            break;
          default:
            throw new Error('Invalid Service Cloud item type');
        }
        console.log('Result from metadata list:', JSON.stringify(result, null, 2));
      } catch (listError) {
        console.error('Error retrieving metadata list:', listError);
        throw listError;
      }

      // Ensure result is always an array
      const resultArray = Array.isArray(result) ? result : [result];

      const downloadedItems = [];
      for (const item of resultArray) {
        if (!item || typeof item !== 'object' || !item.fullName) {
          console.error('Invalid item:', item);
          continue;
        }

        let metadata, content, fileName;
        
        try {
          switch(type) {
            case 'CaseAssignmentRule':
              metadata = await conn.metadata.read('AssignmentRules', item.fullName);
              if (item.fullName.startsWith('Case')) {
                content = JSON.stringify(metadata, null, 2);
                fileName = `${item.fullName}.json`;
              } else {
                console.log(`Skipping ${item.fullName} as it's not a Case Assignment Rule`);
                continue;
              }
              break;
            case 'CaseAutoResponseRule':
              metadata = await conn.metadata.read('AutoResponseRules', item.fullName);
              if (item.fullName.startsWith('Case')) {
                content = JSON.stringify(metadata, null, 2);
                fileName = `${item.fullName}.json`;
              } else {
                console.log(`Skipping ${item.fullName} as it's not a Case Auto-Response Rule`);
                continue;
              }
              break;
            case 'EscalationRule':
              metadata = await conn.metadata.read('EscalationRules', item.fullName);
              content = JSON.stringify(metadata, null, 2);
              fileName = `${item.fullName}.json`;
              break;
          }

          if (!metadata) {
            console.error(`No metadata returned for ${item.fullName}`);
            continue;
          }

          const filePath = path.join(outputDir, fileName);
          fs.writeFileSync(filePath, content);
          downloadedItems.push(item.fullName);
          console.log(`Downloaded: ${fileName}`);
        } catch (itemError) {
          console.error(`Error processing item ${item.fullName}:`, itemError);
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

module.exports = serviceCloudService;