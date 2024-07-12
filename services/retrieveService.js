const jsforce = require('jsforce');
const fs = require('fs');
const path = require('path');

async function retrieveAndSaveComponents(accessToken, instanceUrl, componentType) {
    const conn = new jsforce.Connection({
        instanceUrl,
        accessToken
    });

    const components = await conn.metadata.list([{ type: componentType }], '39.0');

    const outputDir = path.join(__dirname, '..', 'org_files', 'your_org_name', componentType);
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    for (const component of components) {
        const componentMetadata = await conn.metadata.read(componentType, component.fullName);
        const filePath = path.join(outputDir, `${component.fullName}.xml`);
        fs.writeFileSync(filePath, componentMetadata);
    }
}

module.exports = {
    retrieveAndSaveComponents
};
