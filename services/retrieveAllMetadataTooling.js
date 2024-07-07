const jsforce = require('jsforce');
const fs = require('fs');
const path = require('path');

// Your access token and instance URL
const accessToken = '6Cel800DQy000009119l888Qy0000002POvvwstBQf8iUsvouwmjk5IphKrFyR3hjsOzTuqNAVPM0NkbKNEPzLBRYs4mua2yIGnDRm9wfWm';
const instanceUrl = 'https://devsafa-dev-ed.develop.my.salesforce.com';

// Create a new connection
const conn = new jsforce.Connection({
    instanceUrl: instanceUrl,
    accessToken: accessToken
});

const metadataTypes = [
    { type: 'ApexClass', query: 'SELECT Id, Name, Body FROM ApexClass', ext: 'cls', contentField: 'Body' },
    { type: 'ApexTrigger', query: 'SELECT Id, Name, Body FROM ApexTrigger', ext: 'trigger', contentField: 'Body' },
    { type: 'ApexPage', query: 'SELECT Id, Name, Markup FROM ApexPage', ext: 'page', contentField: 'Markup' },
    { type: 'ApexComponent', query: 'SELECT Id, Name, Markup FROM ApexComponent', ext: 'component', contentField: 'Markup' }
    // Add more metadata types and their queries here
];

const retrieveAllMetadata = async () => {
    try {
        // Ensure the directory exists
        const dir = path.join(__dirname, '..', 'public', 'retrieved_metadata');
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        for (const metadataType of metadataTypes) {
            console.log(`Retrieving ${metadataType.type}...`);
            const result = await conn.tooling.query(metadataType.query);

            if (!result.records || result.records.length === 0) {
                console.log(`No ${metadataType.type} found.`);
                continue;
            }

            const typeDir = path.join(dir, metadataType.type);
            if (!fs.existsSync(typeDir)) {
                fs.mkdirSync(typeDir, { recursive: true });
            }

            for (const record of result.records) {
                const fileName = `${record.Name}.${metadataType.ext}`;
                const filePath = path.join(typeDir, fileName);
                const content = record[metadataType.contentField];
                fs.writeFileSync(filePath, content);
                console.log(`Retrieved and saved: ${fileName}`);
            }
        }
        console.log('All metadata retrieved successfully.');
    } catch (error) {
        console.error('Error retrieving metadata:', error);
    }
};

// Execute the function
retrieveAllMetadata();
