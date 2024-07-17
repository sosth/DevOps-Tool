// routes/googleAuthRoutes.js

const express = require('express');
const router = express.Router();
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post('/login', async (req, res) => {
  const { token } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    
    // Here, you can create a session or JWT for the user
    req.session.userId = userid;
    req.session.email = payload['email'];

    // You might want to check if the user exists in your database and create them if not
    // This depends on your specific user management logic

    res.json({ success: true, userId: userid });
  } catch (error) {
    console.error('Error verifying Google token:', error);
    res.status(400).json({ success: false, message: 'Invalid token' });
  }
});
router.post('/logout', (req, res) => {
  // Clear the session or perform any necessary logout actions
  req.session.destroy((err) => {
      if (err) {
          console.error('Error destroying session:', err);
          return res.status(500).json({ success: false, message: 'Logout failed' });
      }
      res.json({ success: true, message: 'Logged out successfully' });
  });
});

module.exports = router;