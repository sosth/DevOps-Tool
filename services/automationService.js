// services/automationService.js

const jsforce = require('jsforce');
const fs = require('fs');
const path = require('path');

const automationService = {
  retrieveAndSaveAutomationItems: async (folderorg, type) => {
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
          case 'WorkflowRule':
          case 'WorkflowAction':
            result = await conn.metadata.list([{ type: 'Workflow' }], '51.0');
            break;
          case 'ProcessBuilder':
          case 'Flow':
            result = await conn.metadata.list([{ type: 'Flow' }], '51.0');
            break;
          case 'ApprovalProcess':
            result = await conn.metadata.list([{ type: 'ApprovalProcess' }], '51.0');
            break;
          default:
            throw new Error('Invalid automation item type');
        }
        console.log('Result from metadata list:', JSON.stringify(result, null, 2));
      } catch (error) {
        console.error('Error retrieving metadata list:', error);
        throw error;
      }
      // Ensure result is an array
      result = Array.isArray(result) ? result : [result];
      console.log(`Number of items retrieved: ${result.length}`);
      const downloadedItems = [];
      for (const item of result) {
        if (!item || typeof item !== 'object') {
          console.error('Invalid item in result:', item);
          continue;
        }
  
        console.log(`Processing item:`, JSON.stringify(item, null, 2));
        let metadata, content, fileName;
        
        try {
          switch(type) {
            case 'WorkflowRule':
            case 'WorkflowAction':
              metadata = await conn.metadata.read('Workflow', item.fullName);
              if (type === 'WorkflowRule') {
                content = JSON.stringify(metadata.rules, null, 2);
                fileName = `${item.fullName}_WorkflowRules.json`;
              } else {
                content = JSON.stringify({
                  tasks: metadata.tasks,
                  alerts: metadata.alerts,
                  fieldUpdates: metadata.fieldUpdates,
                  outboundMessages: metadata.outboundMessages
                }, null, 2);
                fileName = `${item.fullName}_WorkflowActions.json`;
              }
              break;
              case 'ProcessBuilder':
                case 'Flow':
                  if (!item.fullName) {
                    console.error('Item is missing fullName:', item);
                    continue;
                  }
                  try {
                    metadata = await conn.metadata.read('Flow', item.fullName);
                    console.log(`Metadata retrieved for ${item.fullName}:`, JSON.stringify(metadata, null, 2));
                  } catch (readError) {
                    console.error(`Error reading metadata for ${item.fullName}:`, readError);
                    continue;
                  }
      
                  if (!metadata) {
                    console.error(`No metadata returned for ${item.fullName}`);
                    continue;
                  }
      
                  if ((type === 'ProcessBuilder' && metadata.processType === 'Workflow') ||
                      (type === 'Flow' && metadata.processType !== 'Workflow')) {
                    content = JSON.stringify(metadata, null, 2);
                    fileName = `${item.fullName}.json`;
                  } else {
                    console.log(`Skipping ${item.fullName} as it doesn't match the requested type`);
                    continue;
                  }
                  break;
            case 'ApprovalProcess':
              metadata = await conn.metadata.read('ApprovalProcess', item.fullName);
              content = JSON.stringify(metadata, null, 2);
              fileName = `${item.fullName}.json`;
              break;
          }
          
          if (!content) {
            console.error(`Content is undefined for ${item.fullName}. Skipping.`);
            continue;
          }
  
          const filePath = path.join(outputDir, fileName);
          fs.writeFileSync(filePath, content);
          downloadedItems.push(item.fullName);
          console.log(`Downloaded: ${fileName}`);
        } catch (itemError) {
          console.error(`Error processing item:`, itemError);
          console.error(`Item details:`, JSON.stringify(item, null, 2));
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

module.exports = automationService;