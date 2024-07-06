// services/authService.js
require('dotenv').config();
const axios = require('axios');
const querystring = require('querystring');

const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, SALESFORCE_LOGIN_URL, STATE } = process.env;

const getAuthorizationUrl = () => {
    const params = {
        response_type: 'token',
        client_id: CLIENT_ID,
        redirect_uri: REDIRECT_URI,
        state: STATE,
    };
    return `${SALESFORCE_LOGIN_URL}/services/oauth2/authorize?${querystring.stringify(params)}`;
};

const getAccessToken = async (code) => {
    const params = {
        grant_type: 'authorization_code',
        code,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI
    };

    try {
        console.log('Requesting access token with params:', params);
        const response = await axios.post(`${SALESFORCE_LOGIN_URL}/services/oauth2/token`, querystring.stringify(params), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        console.log('Access token response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error response from Salesforce:', error.response ? error.response.data : error.message);
        throw new Error('Failed to get access token');
    }
};

const getApexClasses = async (accessToken, instanceUrl) => {
    try {
        const response = await axios.get(`${instanceUrl}/services/data/v52.0/tooling/query/?q=SELECT+Id,Name+FROM+ApexClass`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        return response.data.records.map(record => record.Name);
    } catch (error) {
        console.error('Error fetching Apex classes:', error.response ? error.response.data : error.message);
        throw new Error('Failed to fetch Apex classes');
    }
};

module.exports = {
    getAuthorizationUrl,
    getAccessToken,
    getApexClasses
};
