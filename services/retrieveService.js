const jsforce = require('jsforce');
const fs = require('fs');
const path = require('path');
require('dotenv').config(); // Load environment variables

async function retrieveApexClasses(orgName) {
    const username = process.env.SALESFORCE_USERNAME;
    const password = process.env.SALESFORCE_PASSWORD;
    const loginUrl = process.env.SALESFORCE_LOGIN_URL;
    const outputDir = path.join(__dirname, '../org_files', orgName, 'apexClasses');

    // Create directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    // Connect to Salesforce
    const conn = new jsforce.Connection({ loginUrl });

    try {
        await conn.login(username, password);
        console.log('Connected to Salesforce');

        // Query to retrieve all Apex classes
        const query = 'SELECT Id, Name, Body FROM ApexClass';
        const result = await conn.tooling.query(query);

        // Download each Apex class
        for (const apexClass of result.records) {
            const filePath = path.join(outputDir, `${apexClass.Name}.cls`);
            fs.writeFileSync(filePath, apexClass.Body);
            console.log(`Downloaded: ${apexClass.Name}`);
        }

        console.log('All Apex classes downloaded successfully.');
    } catch (err) {
        console.error('Error fetching Apex classes:', err);
        throw err;
    }
}

module.exports = {
    retrieveApexClasses
};
