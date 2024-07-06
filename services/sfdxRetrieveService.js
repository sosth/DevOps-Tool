// services/sfdxRetrieveService.js
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const retrieveApexClass = (accessToken, instanceUrl, className) => {
    return new Promise((resolve, reject) => {
        const command = `curl "${instanceUrl}/services/data/v52.0/tooling/query/?q=SELECT+Body+FROM+ApexClass+WHERE+Name='${className}'" -H "Authorization: Bearer ${accessToken}" -o ${className}.cls`;
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(stderr);
            } else {
                const targetDir = path.join(__dirname, '..', 'config', 'deploy', 'org1', 'retrieve');
                if (!fs.existsSync(targetDir)) {
                    fs.mkdirSync(targetDir, { recursive: true });
                }
                const classFilePath = path.join(targetDir, `${className}.cls`);
                fs.renameSync(`${className}.cls`, classFilePath);
                resolve(classFilePath);
            }
        });
    });
};

module.exports = {
    retrieveApexClass
};
