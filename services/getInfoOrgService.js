// services/getInfoOrgService.js
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const getOrgInfo = async (accessToken, instanceUrl) => {
    const orgQueryUrl = `${instanceUrl}/services/data/v52.0/query/?q=SELECT+Id,+Name,+InstanceName,+OrganizationType,+IsSandbox,+CreatedDate+FROM+Organization`;
    const orgDetailsUrl = (orgId) => `${instanceUrl}/services/data/v52.0/sobjects/Organization/${orgId}`;

    try {
        // Query organization basic info
        const queryResponse = await axios.get(orgQueryUrl, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        const orgInfo = queryResponse.data.records[0];
        const orgId = orgInfo.Id;

        // Fetch detailed organization info
        const detailsResponse = await axios.get(orgDetailsUrl(orgId), {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        const orgDetails = detailsResponse.data;

        // Create directory for the org
        const orgDir = path.join(__dirname, '..', 'orgs', orgId);
        if (!fs.existsSync(orgDir)) {
            fs.mkdirSync(orgDir, { recursive: true });
        }

        // Save org info to a file
        const orgInfoFilePath = path.join(orgDir, 'orgInfo.json');
        fs.writeFileSync(orgInfoFilePath, JSON.stringify(orgDetails, null, 2));

        return {
            orgId: orgDetails.Id,
            orgName: orgDetails.Name,
            instanceName: orgDetails.InstanceName,
            organizationType: orgDetails.OrganizationType,
            isSandbox: orgDetails.IsSandbox,
            createdDate: orgDetails.CreatedDate,
            salesforceUrl: instanceUrl,
            primaryContact: orgDetails.PrimaryContact,
            country: orgDetails.Country,
            defaultLocale: orgDetails.DefaultLocaleSidKey,
            timeZone: orgDetails.TimeZoneSidKey,
            languageLocale: orgDetails.LanguageLocaleKey,
            address: orgDetails.Address,
            phone: orgDetails.Phone,
            fax: orgDetails.Fax
        };
    } catch (error) {
        console.error('Error fetching organization info:', error.response ? error.response.data : error.message);
        throw new Error('Failed to fetch organization info');
    }
};

module.exports = {
    getOrgInfo
};
