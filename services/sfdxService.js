// services/sfdxService.js
const axios = require('axios');
const path = require('path');
const fs = require('fs');

const retrieveApexClass = async (accessToken, instanceUrl, className) => {
    const url = `${instanceUrl}/services/data/v52.0/tooling/query/?q=SELECT+Body+FROM+ApexClass+WHERE+Name='${className}'`;
    const headers = {
        'Authorization': `Bearer ${accessToken}`
    };

    try {
        const response = await axios.get(url, { headers });
        const classBody = response.data.records[0].Body;
        const targetDir = path.join(__dirname, '..', 'config', 'deploy', 'org1', 'retrieve');

        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
        }

        const classFilePath = path.join(targetDir, `${className}.cls`);
        fs.writeFileSync(classFilePath, classBody);

        return classFilePath;
    } catch (error) {
        console.error('Error retrieving Apex class:', error.response ? error.response.data : error.message);
        throw new Error('Failed to retrieve Apex class');
    }
};

module.exports = {
    retrieveApexClass
};
