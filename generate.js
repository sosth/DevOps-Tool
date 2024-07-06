require('dotenv').config();
const querystring = require('querystring');

const { CLIENT_ID, REDIRECT_URI, SALESFORCE_LOGIN_URL } = process.env;

const getAuthorizationUrl = () => {
    const params = {
        response_type: 'code',
        client_id: CLIENT_ID,
        redirect_uri: REDIRECT_URI,
        scope: 'full'
    };
    const startURL = '/setup/secur/RemoteAccessAuthorizationPage.apexp?' + querystring.stringify(params);
    return `${SALESFORCE_LOGIN_URL}?startURL=${encodeURIComponent(startURL)}`;
};

console.log(getAuthorizationUrl());
