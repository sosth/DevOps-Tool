const jsforce = require('jsforce');
const fs = require('fs');
const path = require('path');

const retrieveAllApexClasses = async (accessToken, instanceUrl) => {
    const conn = new jsforce.Connection({
        instanceUrl: instanceUrl,
        accessToken: accessToken
    });

    try {
        // List all Apex classes
        const apexClasses = await conn.metadata.list([{ type: 'ApexClass' }], '52.0');

        // Ensure the directory exists
        const dir = path.join(__dirname, '..', 'public', 'retrieved_metadata');
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

module.exports = retrieveAllApexClasses;
