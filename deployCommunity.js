const jsforce = require('jsforce');
const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');

// Salesforce instance URL and access token
const instanceUrl = 'https://devsara2-dev-ed.develop.my.salesforce.com';
const accessToken = '00Dd2000000pqKC!AQEAQGAv7CxtQnTTiFt_3M1EnpCol9hT6KjwglcquPYHP9wCqtqX6fZEUiU3iRrL16TET.LHIR0eKILkWxKVQ7s_X3uGTFhd';

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

            console.log(`Result: ${JSON.stringify(result)}`);

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

// Function to create or update Chatter Group
async function upsertChatterGroup(conn, groupData) {
    const { Name, Description } = groupData;
    
    try {
        // Check if the group already exists
        const existingGroup = await conn.query(`SELECT Id FROM CollaborationGroup WHERE Name = '${Name}'`);
        
        if (existingGroup.records.length > 0) {
            // Update existing group
            const result = await conn.sobject('CollaborationGroup').update({ 
                Id: existingGroup.records[0].Id,
                Name,
                Description
            });
            console.log(`Updated Chatter Group: ${Name}`);
            return result;
        } else {
            // Create new group
            const result = await conn.sobject('CollaborationGroup').create({ 
                Name,
                Description,
                CollaborationType: 'Public' // You might want to make this configurable
            });
            console.log(`Created Chatter Group: ${Name}`);
            return result;
        }
    } catch (error) {
        console.error(`Error upserting Chatter Group ${Name}:`, error);
        throw error;
    }
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
    const supportedTypes = ['Network', 'CustomSite', 'CollaborationGroup'];

    for (const type of packageTypes) {
      const metadataType = type.name[0];
      if (supportedTypes.includes(metadataType)) {
        for (const member of type.members) {
          const developerName = member;
          let filePath;

          switch (metadataType) {
            case 'Network':
              filePath = path.join(deployFolderPath, `${developerName}_Community.json`);
              break;
            case 'CustomSite':
              filePath = path.join(deployFolderPath, `${developerName}_Site.json`);
              break;
            case 'CollaborationGroup':
              filePath = path.join(deployFolderPath, `${developerName}_ChatterGroup.json`);
              break;
          }

          console.log(`Checking file path: ${filePath}`);

          if (fs.existsSync(filePath)) {
            console.log(`File found for ${metadataType}: ${developerName}`);
            const metadataContent = readMetadataFile(filePath);
            try {
              if (metadataType === 'CollaborationGroup') {
                const groupData = JSON.parse(metadataContent);
                await upsertChatterGroup(conn, groupData);
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