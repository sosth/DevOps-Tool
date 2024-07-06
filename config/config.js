module.exports = {
  oauth2: {
    redirectUri: process.env.REDIRECT_URI,
    authorizationUri: 'https://login.salesforce.com/setup/secur/RemoteAccessAuthorizationPage.apexp',
  },
};
