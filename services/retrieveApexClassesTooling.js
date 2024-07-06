const jsforce = require('jsforce');
const fs = require('fs');
const path = require('path');

// Your access token and instance URL
const accessToken = '00DQy000009119l!AQEAQBVfr9Ii7TccpvMH54s8S_72oKPezY1XNEKs3ZeuTYmJ6.J2a6t.EwdkABeAG2Ll6BlG7vNgVF_kGguzl_IqgwJ8a6Eg';
const instanceUrl = 'https://devsafa-dev-ed.develop.my.salesforce.com';

// Create a new connection
const conn = new jsforce.Connection({
    instanceUrl: instanceUrl,
    accessToken: accessToken
});

const retrieveAllApexClasses = async () => {
    try {
        // Query all Apex classes using Tooling API
        const result = await conn.tooling.query('SELECT Id, Name, Body FROM ApexClass');

        if (!result.records || result.records.length === 0) {
            console.log('No Apex classes found.');
            return;
        }

        // Ensure the directory exists
        const dir = path.join(__dirname, 'retrieved_metadata');
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        // Loop through all classes and save their metadata
        for (const apexClass of result.records) {
            const fileName = `${apexClass.Name}.cls`;
            const filePath = path.join(dir, fileName);
            fs.writeFileSync(filePath, apexClass.Body);

            console.log(`Retrieved and saved: ${fileName}`);
        }
        console.log('All Apex classes retrieved successfully.');
    } catch (error) {
        console.error('Error retrieving Apex classes:', error);
    }
};

// Execute the function
retrieveAllApexClasses();
