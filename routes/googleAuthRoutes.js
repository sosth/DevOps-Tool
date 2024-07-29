// routes/googleAuthRoutes.js
const express = require('express');
const { OAuth2Client } = require('google-auth-library');
const { saveUser } = require('../services/userService'); // We'll create this service

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post('/login', async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const userData = {
      email: payload['email'],
      emaillogin: false,
      fblogin: false,
      firstname: payload['given_name'],
      googlelogin: true,
      lastname: payload['family_name'],
      name: payload['name']
    };

    const userId = await saveUser(userData);
    res.status(200).json({ success: true, userId: userId });
  } catch (error) {
    console.error('Error during Google authentication:', error);
    res.status(500).json({ success: false, error: 'Authentication failed' });
  }
});

module.exports = router;