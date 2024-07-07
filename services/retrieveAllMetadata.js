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

const metadataTypes = [
    { type: 'ApexClass', ext: 'cls' },
    { type: 'ApexTrigger', ext: 'trigger' },
    { type: 'ApexPage', ext: 'page' },
    { type: 'ApexComponent', ext: 'component' }
    // Add more metadata types here if needed
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
            const result = await conn.metadata.list([{ type: metadataType.type }], '52.0');

            if (!result || result.length === 0) {
                console.log(`No ${metadataType.type} found.`);
                continue;
            }

            const typeDir = path.join(dir, metadataType.type);
            if (!fs.existsSync(typeDir)) {
                fs.mkdirSync(typeDir, { recursive: true });
            }

            for (const item of result) {
                const metadata = await conn.metadata.read(metadataType.type, item.fullName);
                const fileName = `${item.fullName}.${metadataType.ext}`;
                const filePath = path.join(typeDir, fileName);

                let content;
                switch (metadataType.type) {
                    case 'ApexClass':
                    case 'ApexTrigger':
                        content = metadata.content;
                        break;
                    case 'ApexPage':
                    case 'ApexComponent':
                        content = metadata.markup;
                        break;
                    default:
                        content = metadata.content || metadata.markup;
                }

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
