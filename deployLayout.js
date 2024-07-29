const jsforce = require('jsforce');
const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');

// Salesforce instance URL and access token
const instanceUrl = 'https://devsara2-dev-ed.develop.my.salesforce.com';
const accessToken = '00Dd2000000pqKC!AQEAQC6qcqwPanFR8oxOvvh1SqiXhXFL9X50TVREi8MjpdCUZFcxQthCmDANx2VRYaprmoHLHXoQ8A5ef3XQN4SXImPPVa0w';


// Path to the deploy folder and package.xml file
const deployFolderPath = path.join(__dirname, 'deploy');
const packageXmlPath = path.join(deployFolderPath, 'package.xml');

// Function to read the metadata file content
function readMetadataFile(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

// Function to deploy metadata
function deployMetadata(conn, metadataType, fullName, metadataContent) {
  return new Promise((resolve, reject) => {
    console.log(`Deploying ${metadataType} with full name ${fullName}...`);

    let metadata;
    if (metadataType === 'CustomObject') {
      // For CustomObject, we need to merge the existing metadata with our updates
      conn.metadata.read(metadataType, fullName, (err, existingMetadata) => {
        if (err) {
          return reject(`Error reading existing ${metadataType}: ${err}`);
        }

        const updates = JSON.parse(metadataContent);
        
        // Determine which part of CustomObject we're updating
        if (updates[0] && updates[0].fullName) {
          if (updates[0].fullName.endsWith('__c')) {
            existingMetadata.fieldSets = updates;
          } else if (updates[0].picklistValues) {
            existingMetadata.recordTypes = updates;
          } else {
            existingMetadata.compactLayouts = updates;
          }
        }

        metadata = existingMetadata;
        performUpdate();
      });
    } else {
      // For Layout, we can use the content as-is
      metadata = JSON.parse(metadataContent);
      performUpdate();
    }

    function performUpdate() {
      conn.metadata.update(metadataType, metadata, function(err, result) {
        if (err) {
          return reject(`Error updating ${metadataType}: ${err}`);
        }

        if (result.success) {
          console.log(`${metadataType} deployed successfully! ID: ${result.id}`);
          resolve(result);
        } else {
          reject(`Failed to deploy ${metadataType}: ${result.errors}`);
        }
      });
    }
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
    const supportedTypes = ['CustomObject', 'Layout'];
    
    for (const type of packageTypes) {
      const metadataType = type.name[0];
      if (supportedTypes.includes(metadataType)) {
        for (const member of type.members) {
          const fullName = member;
          let filePath;

          if (metadataType === 'CustomObject') {
            // For CustomObject, we need to check for FieldSet, RecordType, and CompactLayout
            const subTypes = ['FieldSets', 'RecordTypes', 'CompactLayouts'];
            for (const subType of subTypes) {
              filePath = path.join(deployFolderPath, `${fullName}_${subType}.json`);
              if (fs.existsSync(filePath)) {
                console.log(`File found for ${metadataType} (${subType}): ${fullName}`);
                const metadataContent = readMetadataFile(filePath);
                try {
                  await deployMetadata(conn, metadataType, fullName, metadataContent);
                } catch (error) {
                  console.error(error);
                }
              }
            }
          } else if (metadataType === 'Layout') {
            filePath = path.join(deployFolderPath, `${fullName}.json`);
            if (fs.existsSync(filePath)) {
              console.log(`File found for ${metadataType}: ${fullName}`);
              const metadataContent = readMetadataFile(filePath);
              try {
                await deployMetadata(conn, metadataType, fullName, metadataContent);
              } catch (error) {
                console.error(error);
              }
            }
          }

          if (!fs.existsSync(filePath)) {
            console.log(`File not found for ${metadataType}: ${fullName}`);
          }
        }
      }
    }
  } catch (error) {
    console.error(error);
  }
})();