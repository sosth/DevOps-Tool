// services/getInfoOrg.js
const { exec } = require('child_process');

const getOrgInfo = (accessToken) => {
    return new Promise((resolve, reject) => {
        const command = `sfdx force:org:display --target-org ${accessToken} --json`;
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.log(`Error: ${stderr}`);
                reject(`Error: ${stderr}`);
            } else {
                console.log(`Command Output: ${stdout}`);
                try {
                    const result = JSON.parse(stdout);
                    console.log('Parsed Result:', result);
                    const orgInfo = {
                        orgId: result.result.id,
                        salesforceUrl: result.result.instanceUrl
                    };
                    resolve(orgInfo);
                } catch (parseError) {
                    console.log(`Error parsing JSON: ${parseError.message}`);
                    reject(`Error parsing JSON: ${parseError.message}`);
                }
            }
        });
    });
};

module.exports = {
    getOrgInfo
};
