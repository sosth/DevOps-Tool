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
async function deployMetadata(conn, metadataType, metadata) {
  console.log(`Deploying ${metadataType}...`);

  try {
    const result = await conn.metadata.upsert(metadataType, metadata);
    console.log('Result:', JSON.stringify(result, null, 2));

    if (result.success) {
      console.log(`${metadataType} deployed successfully! ID: ${result.id}`);
      return result;
    } else {
      const errorString = JSON.stringify(result.errors, null, 2);
      throw new Error(`Failed to deploy ${metadataType}. Errors: ${errorString}`);
    }
  } catch (err) {
    console.error('Error:', err);
    throw new Error(`Error deploying ${metadataType}: ${err.message}`);
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

        if (!result.Package || !result.Package.types) {
          return reject('Invalid package.xml structure: missing Package or types');
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
    console.log('Package types:', packageTypes);

    const supportedTypes = ['WorkflowActions', 'WorkflowRule', 'Flow', 'ApprovalProcess'];
    
    for (const type of packageTypes) {
      const metadataType = type.name[0];
      console.log(`Processing metadata type: ${metadataType}`);

      if (supportedTypes.includes(metadataType)) {
        for (const member of type.members) {
          const developerName = member;
          let filePath = path.join(deployFolderPath, `${developerName}.json`);
          
          console.log(`Checking file path: ${filePath}`);
          
          if (fs.existsSync(filePath)) {
            console.log(`File found for ${metadataType}: ${developerName}`);
            const metadataContent = readMetadataFile(filePath);
            const workflowActions = JSON.parse(metadataContent);

           
if (metadataType === 'WorkflowActions') {
  if (workflowActions.fieldUpdates) {
    // Ensure fieldUpdates is always an array
    const fieldUpdates = Array.isArray(workflowActions.fieldUpdates) 
      ? workflowActions.fieldUpdates 
      : [workflowActions.fieldUpdates];

    for (const fieldUpdate of fieldUpdates) {
      // Ensure the fullName is in the correct format
      if (!fieldUpdate.fullName.includes('.')) {
        fieldUpdate.fullName = `${developerName.split('_')[0]}.${fieldUpdate.fullName}`;
      }
      await deployMetadata(conn, 'WorkflowFieldUpdate', fieldUpdate);
    }
  }
  // Similar changes for tasks, alerts, and outboundMessages
  if (workflowActions.tasks) {
    const tasks = Array.isArray(workflowActions.tasks) ? workflowActions.tasks : [workflowActions.tasks];
    for (const task of tasks) {
      await deployMetadata(conn, 'WorkflowTask', task);
    }
  }
  if (workflowActions.alerts) {
    const alerts = Array.isArray(workflowActions.alerts) ? workflowActions.alerts : [workflowActions.alerts];
    for (const alert of alerts) {
      await deployMetadata(conn, 'WorkflowAlert', alert);
    }
  }
  if (workflowActions.outboundMessages) {
    const messages = Array.isArray(workflowActions.outboundMessages) ? workflowActions.outboundMessages : [workflowActions.outboundMessages];
    for (const message of messages) {
      await deployMetadata(conn, 'WorkflowOutboundMessage', message);
    }
  }
} else {
  await deployMetadata(conn, metadataType, workflowActions);
}
          } else {
            console.log(`File not found for ${metadataType}: ${developerName}`);
          }
        }
      } else {
        console.log(`Unsupported metadata type: ${metadataType}`);
      }
    }
  } catch (error) {
    console.error('Error in deployment process:', error);
  }
})();