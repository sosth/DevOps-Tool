// services/apexService.js

const jsforce = require('jsforce');
const fs = require('fs');
const path = require('path');

const apexService = {
  retrieveAndSaveApexItems: async (folderorg, type) => {
    const outputDir = path.join(__dirname, '..', 'org_files', type, folderorg);

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const conn = new jsforce.Connection({ loginUrl: process.env.SALESFORCE_LOGIN_URL });
    
    try {
      await conn.login(process.env.SALESFORCE_USERNAME, process.env.SALESFORCE_PASSWORD);
      console.log('Connected to Salesforce');

      let query, result;
      switch(type) {
        case 'ApexClass':
          query = 'SELECT Id, Name, Body FROM ApexClass';
          result = await conn.tooling.query(query);
          break;
        case 'ApexTrigger':
          query = 'SELECT Id, Name, Body FROM ApexTrigger';
          result = await conn.tooling.query(query);
          break;
        case 'ApexPage':
          query = 'SELECT Id, Name, Markup FROM ApexPage';
          result = await conn.tooling.query(query);
          break;
        case 'ApexComponent':
          query = 'SELECT Id, Name, Markup FROM ApexComponent';
          result = await conn.tooling.query(query);
          break;
        default:
          throw new Error('Invalid Apex item type');
      }

      const downloadedItems = [];
      for (const item of result.records) {
        let fileName, content;
        switch(type) {
          case 'ApexClass':
            fileName = `${item.Name}.cls`;
            content = item.Body;
            break;
          case 'ApexTrigger':
            fileName = `${item.Name}.trigger`;
            content = item.Body;
            break;
          case 'ApexPage':
            fileName = `${item.Name}.page`;
            content = item.Markup;
            break;
          case 'ApexComponent':
            fileName = `${item.Name}.component`;
            content = item.Markup;
            break;
        }

        const filePath = path.join(outputDir, fileName);
        fs.writeFileSync(filePath, content);
        downloadedItems.push(item.Name);
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

module.exports = apexService;