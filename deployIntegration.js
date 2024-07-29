const jsforce = require('jsforce');
const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');

// Salesforce instance URL and access token
const instanceUrl = 'https://devsara2-dev-ed.develop.my.salesforce.com';
const accessToken = '00Dd2000000pqKC!AQEAQOgrUoxSPnnyMnwVWBAAXFchB2fshJrXkn6tsPt59oj86p3b6baGjM_eiqk35LUiWcWac5PULHj7nJX39QyCdqGAn14e';

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
        return reject(`Error parsing metadata content for ${metadataType} ${developerName}: ${error}`);
      }
  
      // Adjust metadata type for ExternalService
      const apiMetadataType = metadataType === 'ExternalService' ? 'ExternalServiceRegistration' : metadataType;
  
      // Create an object with the fullName property
      const metadataPayload = {
        fullName: developerName,
        ...metadata
      };
  
      // Deploy the metadata using the Metadata API
      conn.metadata.upsert(apiMetadataType, metadataPayload, function(err, result) {
        if (err) {
          return reject(`Error creating ${metadataType}: ${err}`);
        }
  
        if (result.success) {
          console.log(`${metadataType} deployed successfully!`);
          resolve(result);
        } else {
          reject(`Failed to deploy ${metadataType}: ${result.errors}`);
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
    const supportedTypes = ['NamedCredential', 'AuthProvider', 'RemoteSiteSetting', 'ExternalService'];
    
    for (const type of packageTypes) {
      const metadataType = type.name[0];
      if (supportedTypes.includes(metadataType)) {
        for (const member of type.members) {
          const developerName = member;
          const filePath = path.join(deployFolderPath, metadataType, `${developerName}.json`);
          
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
    }
  } catch (error) {
    console.error(error);
  }
})();