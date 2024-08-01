// controllers/authController.js
const authPKCEFlow = require('../services/authPKCEFlow');
let codeVerifier;

exports.login = (req, res) => {
    codeVerifier = authPKCEFlow.generateCodeVerifier();
    const codeChallenge = authPKCEFlow.generateCodeChallenge(codeVerifier);
    const authUrl = authPKCEFlow.getAuthorizationUrl(codeChallenge);
    res.json({ url: authUrl });
};

exports.callback = async (req, res) => {
    const code = req.query.code;
    try {
        const tokenData = await authPKCEFlow.getAccessToken(code, codeVerifier);
        req.session.token = tokenData.access_token;
        req.session.instanceUrl = tokenData.instance_url;
        res.redirect('/connect.html');
    } catch (error) {
        res.status(500).send('Authentication failed');
    }
};
