const jsforce = require('jsforce');
const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');

// Salesforce instance URL and access token
const instanceUrl = 'https://devsara2-dev-ed.develop.my.salesforce.com';
const accessToken = '00Dd2000000pqKC!AQEAQP2hi0TRRJ7DQKJlaRGpP7LPqy.T2Gf2jRX5TYXfOsjhcOKfetqImUGkVPusT_MNjgkOdnU7WJoQgZJixsTBrXRcBhkq';

// Path to the deploy folder and package.xml file
const deployFolderPath = path.join(__dirname, 'deploy');
const packageXmlPath = path.join(deployFolderPath, 'package.xml');

// Function to read the metadata file content
function readMetadataFile(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

// Function to deploy metadata
function deployMetadata(conn, metadataType, developerName, metadataContent) {
    return new Promise((resolve, reject) => {
        console.log(`Deploying ${metadataType} with developer name ${developerName}...`);

        let metadata;
        try {
            metadata = JSON.parse(metadataContent);
        } catch (error) {
            return reject(`Error parsing JSON for ${metadataType} ${developerName}: ${error}`);
        }

        // Deploy the metadata using the Metadata API
        conn.metadata.update(metadataType, metadata, function (err, result) {
            if (err) {
                return reject(`Error updating ${metadataType}: ${JSON.stringify(err)}`);
            }

            console.log(`Result: ${JSON.stringify(result)}`);  // Log the entire result object for debugging

            if (result.success) {
                const idMessage = result.id ? ` ID: ${result.id}` : '';
                console.log(`${metadataType} deployed successfully!${idMessage}`);
                resolve(result);
            } else {
                const errorDetails = Array.isArray(result.errors)
                    ? result.errors.map(e => JSON.stringify(e)).join(', ')
                    : JSON.stringify(result.errors);
                reject(`Failed to deploy ${metadataType}: ${errorDetails}`);
            }
        });
    });
}

// Function to read and parse the package.xml file
function readPackageXml(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return reject(`Error reading package.xml: ${err}`);
      }

      xml2js.parseString(data, (err, result) => {
        if (err) {
          return reject(`Error parsing package.xml: ${err}`);
        }

        resolve(result.Package.types);
      });
    });
  });
}

// Connect to Salesforce using the access token
const conn = new jsforce.Connection({
  instanceUrl: instanceUrl,
  accessToken: accessToken
});

console.log('Successfully connected to Salesforce');

// Read and deploy metadata files specified in package.xml
(async () => {
  try {
    console.log(`Reading package.xml from path: ${packageXmlPath}`);
    const packageTypes = await readPackageXml(packageXmlPath);
    const supportedTypes = ['PermissionSet', 'Profile', 'Role', 'SharingRules', 'CustomObject'];

    for (const type of packageTypes) {
      const metadataType = type.name[0];
      if (supportedTypes.includes(metadataType)) {
        for (const member of type.members) {
          const developerName = member;
          let filePath;

          if (metadataType === 'SharingRules') {
            filePath = path.join(deployFolderPath, `${developerName}_SharingRules.json`);
          } else if (metadataType === 'CustomObject' && developerName.endsWith('__c')) {
            filePath = path.join(deployFolderPath, `${developerName}_FieldLevelSecurity.json`);
          } else {
            filePath = path.join(deployFolderPath, `${developerName}.json`);
          }

          console.log(`Checking file path: ${filePath}`);

          if (fs.existsSync(filePath)) {
            console.log(`File found for ${metadataType}: ${developerName}`);
            const metadataContent = readMetadataFile(filePath);
            try {
              if (metadataType === 'SharingRules') {
                // For SharingRules, we need to update the CustomObject
                const customObjectMetadata = await conn.metadata.read('CustomObject', developerName);
                customObjectMetadata.sharingRules = JSON.parse(metadataContent);
                await deployMetadata(conn, 'CustomObject', developerName, JSON.stringify(customObjectMetadata));
              } else if (metadataType === 'CustomObject' && developerName.endsWith('__c')) {
                // For Field Level Security, we need to update the Profile
                const profileMetadata = await conn.metadata.read('Profile', 'Admin'); // Assuming we're updating the Admin profile
                profileMetadata.fieldPermissions = JSON.parse(metadataContent);
                await deployMetadata(conn, 'Profile', 'Admin', JSON.stringify(profileMetadata));
              } else {
                await deployMetadata(conn, metadataType, developerName, metadataContent);
              }
            } catch (error) {
              console.error(error);
            }
          } else {
            console.log(`File not found for ${metadataType}: ${developerName}`);
          }
        }
      }
    }
  } catch (error) {
    console.error(error);
  }
})();