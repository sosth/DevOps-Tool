// services/customPermissionService.js
const jsforce = require('jsforce');
const fs = require('fs');
const path = require('path');

const customPermissionService = {
  retrieveAndSaveCustomPermissions: async (folderorg) => {
    const type = 'CustomPermission';
    const outputDir = path.join(__dirname, '..', 'org_files', type, folderorg);

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const conn = new jsforce.Connection({ loginUrl: process.env.SALESFORCE_LOGIN_URL });

    try {
      await conn.login(process.env.SALESFORCE_USERNAME, process.env.SALESFORCE_PASSWORD);
      console.log('Connected to Salesforce');

      // Use Composite API to query for CustomPermission
      const compositeRequest = {
        allOrNone: true,
        compositeRequest: [
          {
            method: 'GET',
            url: '/services/data/v51.0/tooling/query/?q=SELECT+Id,DeveloperName,MasterLabel,Description,NamespacePrefix+FROM+CustomPermission',
            referenceId: 'customPermissionsQuery'
          }
        ]
      };

      const compositeResponse = await conn.request({
        method: 'POST',
        url: '/services/data/v51.0/composite',
        body: JSON.stringify(compositeRequest),
        headers: { 'Content-Type': 'application/json' }
      });

      console.log('Composite Response:', JSON.stringify(compositeResponse, null, 2));

      const queryResult = compositeResponse.compositeResponse[0].body;
      console.log('Query Result:', JSON.stringify(queryResult, null, 2));

      const downloadedItems = [];
      if (queryResult && queryResult.records && Array.isArray(queryResult.records)) {
        for (const record of queryResult.records) {
          const fileName = `${record.DeveloperName}.custompermission`;
          const metadata = {
            fullName: record.DeveloperName,
            label: record.MasterLabel,
            description: record.Description,
            namespacePrefix: record.NamespacePrefix
          };
          const content = JSON.stringify(metadata, null, 2);

          const filePath = path.join(outputDir, fileName);
          fs.writeFileSync(filePath, content);
          downloadedItems.push(record.DeveloperName);
          console.log(`Downloaded: ${fileName}`);
        }
        console.log(`All Custom Permissions have been downloaded successfully.`);
      } else {
        console.log('No Custom Permissions found or unexpected response structure.');
      }

      return downloadedItems;
    } catch (err) {
      console.error(`Error retrieving Custom Permissions:`, err);
      console.error('Error details:', err.response ? err.response.body : err);
      throw err;
    } finally {
      conn.logout();
    }
  }
};

module.exports = customPermissionService;