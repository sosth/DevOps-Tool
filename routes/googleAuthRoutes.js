const express = require('express');
const { OAuth2Client } = require('google-auth-library');
const axios = require('axios');
const { saveUser } = require('../services/userService');

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post('/auth', async (req, res) => {
  const { code } = req.body;
  try {
    // Exchange code for tokens
    const { tokens } = await client.getToken({
      code,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI
    });

    // Verify ID token
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    // Get user info
    const userInfo = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

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

    res.status(200).json({ success: true, userId: userId, userInfo: userInfo.data });
  } catch (error) {
    console.error('Error during Google authentication:', error);
    res.status(500).json({ success: false, error: 'Authentication failed', details: error.message });
  }
});

router.post('/login', async (req, res) => {
  const { code } = req.body;
  try {
    // Exchange code for tokens
    const { tokens } = await client.getToken({
      code,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI
    });

    // Verify ID token
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    // Get user info
    const userInfo = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

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

    res.status(200).json({ success: true, userId: userId, userInfo: userInfo.data });
  } catch (error) {
    console.error('Error during Google authentication:', error);
    res.status(500).json({ success: false, error: 'Authentication failed', details: error.message });
  }
});

router.post('/logout', (req, res) => {
  // Implement your logout logic here
  // This might involve clearing a session or removing a token from your database
  res.json({ success: true });
});

module.exports = router;