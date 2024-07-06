// services/fileHandler.js
const fs = require('fs');
const path = require('path');

function getFilePath(orgId) {
    return path.resolve(__dirname, '../config', `${orgId}.json`);
}

function saveOrgInfo(orgId, orgInfo) {
    const filePath = getFilePath(orgId);
    fs.writeFileSync(filePath, JSON.stringify(orgInfo, null, 2), 'utf8');
}

function updateAccessToken(orgId, accessToken) {
    const filePath = getFilePath(orgId);
    if (fs.existsSync(filePath)) {
        const orgInfo = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        orgInfo.accessToken = accessToken;
        fs.writeFileSync(filePath, JSON.stringify(orgInfo, null, 2), 'utf8');
    }
}

function getOrgInfo(orgId) {
    const filePath = getFilePath(orgId);
    if (fs.existsSync(filePath)) {
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
    return null;
}

module.exports = {
    saveOrgInfo,
    updateAccessToken,
    getOrgInfo,
};
