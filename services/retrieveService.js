const fs = require('fs');
const path = require('path');
const { Connection, Org } = require('@salesforce/core');

async function retrieveApexClasses(orgName) {
    try {
        const conn = await Org.create({ aliasOrUsername: orgName }).then(org => org.getConnection());
        console.log(`Connected to Salesforce Org: ${orgName}`);

        // Query to retrieve Apex Classes
        const query = 'SELECT Name, Body FROM ApexClass';
        const apexClasses = await conn.query(query);

        // Define the directory path
        const directoryPath = path.join(__dirname, 'retrieveFolder', orgName, 'apexClasses');

        // Create the directory if it doesn't exist
        if (!fs.existsSync(directoryPath)) {
            fs.mkdirSync(directoryPath, { recursive: true });
            console.log(`Directory created: ${directoryPath}`);
        }

        // Write each Apex class to a separate file
        apexClasses.records.forEach(apexClass => {
            const filePath = path.join(directoryPath, `${apexClass.Name}.cls`);
            fs.writeFileSync(filePath, apexClass.Body);
            console.log(`File written: ${filePath}`);
        });

        console.log('Apex classes retrieved and written to files successfully.');
    } catch (err) {
        console.error('Error retrieving Apex classes:', err);
    }
}

module.exports = { retrieveApexClasses };
