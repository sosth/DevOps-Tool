const jsforce = require('jsforce');
const fs = require('fs');
const path = require('path');

// Your access token and instance URL
const accessToken = '6Cel800DQy000009119l888Qy0000002POvx4Lf0DDXcL2IrwZbgPxk8QisAc2SGndU0OTSuJQEqwSjkrlhaNB4C3tBa7rYLjNtH0Vd1wAZ';
const instanceUrl = 'https://devsafa-dev-ed.develop.my.salesforce.com';

// Create a new connection
const conn = new jsforce.Connection({
    instanceUrl: instanceUrl,
    accessToken: accessToken
});

const retrieveAllApexClasses = async () => {
    try {
        // List all Apex classes
        const apexClasses = await conn.metadata.list([{ type: 'ApexClass' }], '52.0');
        
        if (!apexClasses || apexClasses.length === 0) {
            console.log('No Apex classes found.');
            return;
        }

        // Ensure the directory exists
        const dir = path.join(__dirname, 'retrieved_metadata');
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        // Loop through all classes and retrieve their metadata
        for (const apexClass of apexClasses) {
            const metadata = await conn.metadata.read('ApexClass', apexClass.fullName);
            const fileName = `${apexClass.fullName}.xml`;
            const filePath = path.join(dir, fileName);
            fs.writeFileSync(filePath, metadata);
            console.log(`Retrieved and saved: ${fileName}`);
        }
        console.log('All Apex classes retrieved successfully.');
    } catch (error) {
        console.error('Error retrieving Apex classes:', error);
    }
};

// Execute the function
retrieveAllApexClasses();
