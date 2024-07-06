// services/authPKCEFlow.js
require('dotenv').config();
const axios = require('axios');
const crypto = require('crypto');
const querystring = require('querystring');

const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, SALESFORCE_LOGIN_URL, STATE } = process.env;

const generateCodeVerifier = () => {
    return crypto.randomBytes(32).toString('base64url');
};

const generateCodeChallenge = (codeVerifier) => {
    return crypto.createHash('sha256').update(codeVerifier).digest('base64url');
};

const getAuthorizationUrl = (codeChallenge) => {
    const params = {
        response_type: 'code',
        client_id: CLIENT_ID,
        redirect_uri: REDIRECT_URI,
        state: STATE,
        code_challenge: codeChallenge,
        code_challenge_method: 'S256',
        prompt: 'login'
    };
    return `${SALESFORCE_LOGIN_URL}/services/oauth2/authorize?${querystring.stringify(params)}`;
};

const getAccessToken = async (code, codeVerifier) => {
    const params = {
        grant_type: 'authorization_code',
        code,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        code_verifier: codeVerifier
    };

    try {
        const response = await axios.post(`${SALESFORCE_LOGIN_URL}/services/oauth2/token`, querystring.stringify(params), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error getting access token:', error.response ? error.response.data : error.message);
        throw new Error('Failed to get access token');
    }
};

module.exports = {
    generateCodeVerifier,
    generateCodeChallenge,
    getAuthorizationUrl,
    getAccessToken
};
