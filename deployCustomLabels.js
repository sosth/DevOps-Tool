const jsforce = require('jsforce');
const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');

// Salesforce instance URL and access token
const instanceUrl = 'https://devsara2-dev-ed.develop.my.salesforce.com';
const accessToken = '00Dd2000000pqKC!AQEAQEaDdpozbJIFSbE0hLov3hruSntd.sGlY6X_UJDAwIOUlm4xQij2XzhZKVO4xWobQ0TmYgbfK8l0OCjje3IpzhZnq2bW';

// Path to the deploy folder and package.xml file
const deployFolderPath = path.join(__dirname, 'deploy');
const packageXmlPath = path.join(deployFolderPath, 'package.xml');

// Function to read the metadata file content
function readMetadataFile(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

// Function to deploy metadata
function deployMetadata(conn, metadataType, metadataContent) {
    return new Promise((resolve, reject) => {
        console.log(`Deploying ${metadataType}...`);

        let metadata;
        try {
            metadata = JSON.parse(metadataContent);
        } catch (error) {
            return reject(`Error parsing JSON for ${metadataType}: ${error}`);
        }

        // Deploy the metadata using the Metadata API
        conn.metadata.update(metadataType, metadata, function (err, result) {
            if (err) {
                return reject(`Error updating ${metadataType}: ${JSON.stringify(err)}`);
            }

            console.log(`Result: ${JSON.stringify(result)}`);

            if (result.success) {
                console.log(`${metadataType} deployed successfully!`);
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
    const supportedTypes = ['CustomLabels'];

    for (const type of packageTypes) {
      const metadataType = type.name[0];
      if (supportedTypes.includes(metadataType)) {
        const filePath = path.join(deployFolderPath, 'CustomLabels.labels');

        console.log(`Checking file path: ${filePath}`);

        if (fs.existsSync(filePath)) {
          console.log(`File found for ${metadataType}`);
          const metadataContent = readMetadataFile(filePath);
          try {
            await deployMetadata(conn, metadataType, metadataContent);
          } catch (error) {
            console.error(error);
          }
        } else {
          console.log(`File not found for ${metadataType}`);
        }
      }
    }
  } catch (error) {
    console.error(error);
  }
})();