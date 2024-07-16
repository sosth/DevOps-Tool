const jsforce = require('jsforce');
const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');

// Salesforce instance URL and access token
const instanceUrl = 'https://devsara2-dev-ed.develop.my.salesforce.com';
const accessToken = '00Dd2000000pqKC!AQEAQP5RToTF8w4oNL7HME9r1eL7SI55xMoHyoo0uWzsiWFSd0aRiOvs9FFDC8ZjXH5vRmxtYX4wrFAPa.9rYRIY4Vj1.jYD'

// Path to the deploy folder and package.xml file
const deployFolderPath = path.join(__dirname, 'deploy');
const packageXmlPath = path.join(deployFolderPath, 'package.xml');
// Function to read the metadata file content (assuming it's JSON)
function readMetadataFile(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

// Function to deploy metadata (create or update)
async function deployMetadata(conn, metadataType, developerName, metadataContent) {
  try {
    console.log(`Deploying ${metadataType} with developer name ${developerName}...`);

    if (metadataType === 'CustomObject') {
      const result = await conn.metadata.read('CustomObject', developerName);
      if (result.fullName) {
        // CustomObject exists, update it
        console.log(`Updating existing ${metadataType}: ${developerName}`);
        await conn.metadata.update('CustomObject', {
          fullName: developerName,
          ...metadataContent
        });
        console.log(`${metadataType} updated successfully!`);
      } else {
        // CustomObject does not exist, create it
        console.log(`Creating new ${metadataType}: ${developerName}`);
        const createResult = await conn.metadata.create('CustomObject', metadataContent);
        console.log(`${metadataType} created successfully! ID: ${createResult.id}`);
      }
    } else {
      // Other metadata types handled via Tooling API
      const existingMetadata = await conn.tooling.sobject(metadataType).findOne({ Name: developerName });
      const metadataObject = {
        Name: developerName,
        Body: JSON.stringify(metadataContent) // Convert JSON to string for Tooling API
      };

      if (existingMetadata) {
        // Update existing metadata
        console.log(`Updating existing ${metadataType} with ID: ${existingMetadata.Id}`);
        await conn.tooling.sobject(metadataType).update({
          Id: existingMetadata.Id,
          Body: JSON.stringify(metadataContent)
        });
        console.log(`${metadataType} updated successfully! ID: ${existingMetadata.Id}`);
      } else {
        // Create new metadata
        const result = await conn.tooling.sobject(metadataType).create(metadataObject);
        if (result.success) {
          console.log(`${metadataType} deployed successfully! ID: ${result.id}`);
        } else {
          console.log(`Failed to deploy ${metadataType}: ${result.errors}`);
        }
      }
    }
  } catch (err) {
    console.error(`Error deploying ${metadataType}: ${err.message}`);
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

// Read and deploy all metadata files specified in package.xml
(async () => {
  try {
    console.log(`Reading package.xml from path: ${packageXmlPath}`);
    const packageTypes = await readPackageXml(packageXmlPath);
    for (const type of packageTypes) {
      const metadataType = type.name[0];
      for (const member of type.members) {
        const developerName = member;
        const extensionMap = {
          'ApexClass': 'cls',
          'CustomObject': 'object'
        };
        const extension = extensionMap[metadataType] || metadataType.toLowerCase(); // Default to metadataType in lowercase if not mapped
        const filePath = path.join(deployFolderPath, `${developerName}.${extension}`);

        console.log(`Checking file path: ${filePath}`);

        if (fs.existsSync(filePath)) {
          console.log(`File found for ${metadataType}: ${developerName}`);
          const metadataContent = readMetadataFile(filePath);
          try {
            await deployMetadata(conn, metadataType, developerName, metadataContent);
          } catch (error) {
            console.error(error);
          }
        } else {
          console.log(`File not found for ${metadataType}: ${developerName}`);
        }
      }
    }
  } catch (error) {
    console.error(error);
  }
})();
module.exports = async function deploy() {
  try {
      // Your existing deployment logic
      console.log('Successfully connected to Salesforce');
      // Read and deploy all metadata files specified in package.xml
      const packageTypes = await readPackageXml(packageXmlPath);
      for (const type of packageTypes) {
          const metadataType = type.name[0];
          for (const member of type.members) {
              const developerName = member;
              const extensionMap = {
                  'ApexClass': 'cls',
                  'CustomObject': 'object'
              };
              const extension = extensionMap[metadataType] || metadataType.toLowerCase(); // Default to metadataType in lowercase if not mapped
              const filePath = path.join(deployFolderPath, `${developerName}.${extension}`);

              console.log(`Checking file path: ${filePath}`);

              if (fs.existsSync(filePath)) {
                  console.log(`File found for ${metadataType}: ${developerName}`);
                  const metadataContent = readMetadataFile(filePath);
                  try {
                      await deployMetadata(conn, metadataType, developerName, metadataContent);
                  } catch (error) {
                      console.error(error);
                  }
              } else {
                  console.log(`File not found for ${metadataType}: ${developerName}`);
              }
          }
      }
  } catch (error) {
      console.error(error);
  }
};