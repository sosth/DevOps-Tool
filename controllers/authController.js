import * as authPKCEFlow from '../services/authPKCEFlow.js';

let codeVerifier;

export const login = (req, res) => {
    codeVerifier = authPKCEFlow.generateCodeVerifier();
    const codeChallenge = authPKCEFlow.generateCodeChallenge(codeVerifier);
    const authUrl = authPKCEFlow.getAuthorizationUrl(codeChallenge);
    res.json({ url: authUrl });
};

export const callback = async (req, res) => {
    const code = req.query.code;
    try {
        const tokenData = await authPKCEFlow.getAccessToken(code, codeVerifier);
        req.session.token = tokenData.access_token;
        req.session.instanceUrl = tokenData.instance_url;
        // Instead of redirecting, send a success response
        res.json({ success: true, message: 'Authentication successful' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Authentication failed' });
    }
};