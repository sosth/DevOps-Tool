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

// Function to deploy (create or update) metadata
async function deployMetadata(conn, metadataType, developerName, metadataContent) {
  console.log(`Deploying ${metadataType} with developer name ${developerName}...`);

  let metadata;
  try {
    metadata = JSON.parse(metadataContent);
    
    // Remove unnecessary fields
    delete metadata.attributes;
    delete metadata.Id;
    
    // For standard applications, we don't want to change the fullName
    if (!developerName.startsWith('standard__')) {
      metadata.fullName = developerName;
    }
  } catch (error) {
    throw new Error(`Error parsing metadata content: ${error}`);
  }

  // For standard applications and standard objects, we'll always use update
  if ((metadataType === 'CustomApplication' && developerName.startsWith('standard__')) ||
      (metadataType === 'CustomObject' && developerName === 'Account')) {
    console.log(`Updating standard ${metadataType}: ${developerName}`);
    return await updateMetadata(conn, metadataType, metadata);
  }

  // For other types, we'll try to read first
  try {
    const existingMetadata = await conn.metadata.read(metadataType, developerName);
    if (existingMetadata) {
      console.log(`${metadataType} ${developerName} already exists. Updating...`);
      return await updateMetadata(conn, metadataType, metadata);
    }
  } catch (error) {
    // If the metadata doesn't exist, we'll create it
    console.log(`${metadataType} ${developerName} doesn't exist. Creating...`);
    return await createMetadata(conn, metadataType, metadata);
  }
}

// Function to create new metadata
function createMetadata(conn, metadataType, metadata) {
  return new Promise((resolve, reject) => {
    conn.metadata.create(metadataType, metadata, function(err, result) {
      if (err) {
        return reject(`Error creating ${metadataType}: ${err}`);
      }
      if (Array.isArray(result) && result[0].success) {
        console.log(`${metadataType} created successfully! ID: ${result[0].fullName}`);
        resolve(result[0]);
      } else {
        reject(`Failed to create ${metadataType}: ${JSON.stringify(result)}`);
      }
    });
  });
}

// Function to update existing metadata
function updateMetadata(conn, metadataType, metadata) {
  return new Promise((resolve, reject) => {
    conn.metadata.update(metadataType, metadata, function(err, result) {
      if (err) {
        return reject(`Error updating ${metadataType}: ${err}`);
      }
      if (Array.isArray(result) && result[0].success) {
        console.log(`${metadataType} updated successfully!`);
        resolve(result[0]);
      } else if (result && result.success) {
        console.log(`${metadataType} updated successfully!`);
        resolve(result);
      } else {
        reject(`Failed to update ${metadataType}: ${JSON.stringify(result)}`);
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
    const supportedTypes = ['CustomObject', 'CustomField', 'CustomTab', 'CustomApplication', 'CustomLabel'];
    
    for (const type of packageTypes) {
      const metadataType = type.name[0];
      if (supportedTypes.includes(metadataType)) {
        for (const member of type.members) {
          const developerName = member;
          const filePath = path.join(deployFolderPath, `${developerName}.json`);
          
          console.log(`Checking file path: ${filePath}`);
          
          if (fs.existsSync(filePath)) {
            console.log(`File found for ${metadataType}: ${developerName}`);
            const metadataContent = readMetadataFile(filePath);
            try {
              await deployMetadata(conn, metadataType, developerName, metadataContent);
            } catch (error) {
              console.error(`Error deploying ${metadataType} ${developerName}:`, error);
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