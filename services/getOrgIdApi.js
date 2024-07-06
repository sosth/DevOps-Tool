// services/getOrgIdApi.js
const axios = require('axios');

async function getOrgId(accessToken, instanceUrl) {
    const queryUrl = `${instanceUrl}/services/data/v52.0/query/?q=SELECT+Id,+Name,+InstanceName,+OrganizationType,+IsSandbox,+CreatedDate+FROM+Organization`;
    const response = await axios.get(queryUrl, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });
    return response.data.records[0];
}

async function getOrgDetails(accessToken, instanceUrl, orgId) {
    const orgUrl = `${instanceUrl}/services/data/v52.0/sobjects/Organization/${orgId}`;
    const response = await axios.get(orgUrl, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });
    return response.data;
}

module.exports = {
    getOrgId,
    getOrgDetails
};
