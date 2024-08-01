const express = require('express');
const { OAuth2Client } = require('google-auth-library');
const { saveUser } = require('../services/userService');

const router = express.Router();
const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

router.post('/login', async (req, res) => {
  const { code } = req.body;
  console.log('Received code:', code);
  
  if (!code) {
    return res.status(400).json({ success: false, error: 'No code provided' });
  }

  try {
    console.log('Google Client ID:', process.env.GOOGLE_CLIENT_ID);
    console.log('Google Client Secret:', process.env.GOOGLE_CLIENT_SECRET ? '[REDACTED]' : 'Not set');
    console.log('Google Redirect URI:', process.env.GOOGLE_REDIRECT_URI);

    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const ticket = await oauth2Client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    console.log('Google payload:', payload);
    const userData = {
      email: payload['email'],
      emaillogin: false,
      fblogin: false,
      firstname: payload['given_name'],
      googlelogin: true,
      lastname: payload['family_name'],
      name: payload['name']
    };

    console.log('Prepared user data:', userData);
    const userId = await saveUser(userData);
    console.log('User saved with ID:', userId);
    res.status(200).json({ success: true, userId: userId });
  } catch (error) {
    console.error('Error during Google authentication:', error);
    res.status(500).json({ success: false, error: 'Authentication failed', details: error.message });
  }
});

module.exports = router;