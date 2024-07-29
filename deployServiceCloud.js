const jsforce = require('jsforce');
const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');

// Salesforce instance URL and access token
const instanceUrl = 'https://devsara2-dev-ed.develop.my.salesforce.com';
const accessToken = '00Dd2000000pqKC!AQEAQMfJbK7J_q3Tsraa9ciRFcKOas.atcZNS7A0ATggeOkxcVKfz6CXQCPMMQ7jg_Y9YSEz3lQ9kGmEpDsruDjMj0yQWMN8';

const deployFolderPath = path.join(__dirname, 'deploy');
const packageXmlPath = path.join(deployFolderPath, 'package.xml');

function readMetadataFile(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function deployMetadata(conn, metadataType, developerName, metadataContent) {
  return new Promise((resolve, reject) => {
    console.log(`Deploying ${metadataType} with developer name ${developerName}...`);

    const metadata = JSON.parse(metadataContent);

    // Adjust the metadata structure based on the type
    let deployableMetadata;
    switch(metadataType) {
      case 'AssignmentRules':
        deployableMetadata = {
          fullName: developerName,
          assignmentRule: metadata.assignmentRule
        };
        break;
      case 'AutoResponseRules':
        deployableMetadata = {
          fullName: developerName,
          autoResponseRule: metadata.autoResponseRule
        };
        break;
      case 'EscalationRules':
        deployableMetadata = {
          fullName: developerName,
          escalationRule: metadata.escalationRule
        };
        break;
      default:
        return reject(`Unsupported metadata type: ${metadataType}`);
    }

    conn.metadata.update(metadataType, deployableMetadata, function(err, result) {
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
  });
}

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

const conn = new jsforce.Connection({
  instanceUrl: instanceUrl,
  accessToken: accessToken
});

console.log('Successfully connected to Salesforce');

(async () => {
  try {
    console.log(`Reading package.xml from path: ${packageXmlPath}`);
    const packageTypes = await readPackageXml(packageXmlPath);
    console.log('Package types:', JSON.stringify(packageTypes, null, 2));

    const supportedTypes = ['AssignmentRules', 'AutoResponseRules', 'EscalationRules'];
    
    for (const type of packageTypes) {
      const metadataType = type.name[0];
      if (supportedTypes.includes(metadataType)) {
        for (const member of type.members) {
          const fullName = member;
          let filePath = path.join(deployFolderPath, `${fullName}.json`);

          if (fs.existsSync(filePath)) {
            console.log(`File found for ${metadataType}: ${fullName}`);
            const metadataContent = readMetadataFile(filePath);
            try {
              await deployMetadata(conn, metadataType, fullName, metadataContent);
            } catch (error) {
              console.error('Deployment error:', error);
            }
          } else {
            console.log(`File not found for ${metadataType}: ${fullName}`);
          }
        }
      }
    }
  } catch (error) {
    console.error('Script error:', error);
  }
})();