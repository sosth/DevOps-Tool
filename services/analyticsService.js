// services/analyticsService.js

const jsforce = require('jsforce');
const fs = require('fs');
const path = require('path');

const analyticsService = {
  retrieveAndSaveAnalyticsItems: async (folderorg, type) => {
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
          case 'ReportType':
            result = await conn.metadata.list([{ type: 'ReportType' }], '51.0');
            break;
          case 'Report':
            result = await conn.metadata.list([{ type: 'Report' }], '51.0');
            break;
          case 'Dashboard':
            result = await conn.metadata.list([{ type: 'Dashboard' }], '51.0');
            break;
          case 'DashboardComponent':
            result = await conn.metadata.list([{ type: 'Dashboard' }], '51.0');
            break;
          default:
            throw new Error('Invalid analytics item type');
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
            case 'ReportType':
              metadata = await conn.metadata.read('ReportType', item.fullName);
              break;
            case 'Report':
              metadata = await conn.metadata.read('Report', item.fullName);
              break;
            case 'Dashboard':
              metadata = await conn.metadata.read('Dashboard', item.fullName);
              break;
            case 'DashboardComponent':
              metadata = await conn.metadata.read('Dashboard', item.fullName);
              if (metadata.dashboardComponents && metadata.dashboardComponents.length > 0) {
                content = JSON.stringify(metadata.dashboardComponents, null, 2);
                fileName = `${item.fullName}_Components.json`;
              } else {
                console.log(`No components found for dashboard: ${item.fullName}`);
                continue;
              }
              break;
          }
  
          if (!metadata) {
            console.error(`No metadata returned for ${item.fullName}`);
            continue;
          }
  
          if (!content) {
            content = JSON.stringify(metadata, null, 2);
          }
          
          if (!fileName) {
            fileName = `${item.fullName}.json`;
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

module.exports = analyticsService;