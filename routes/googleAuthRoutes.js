const express = require('express');
const router = express.Router();
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const { Client } = require('pg');

const dbClient = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

dbClient.connect();

router.post('/login', async (req, res) => {
  const { token } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    const email = payload['email'];
    const firstName = payload['given_name'] || '';
    const lastName = payload['family_name'] || '';
    const name = `${firstName} ${lastName}`.trim();

    // Insert or update user in the database
    const query = `
      INSERT INTO users (id, email, googlelogin, firstname, lastname, name, emaillogin, fblogin)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        googlelogin = EXCLUDED.googlelogin,
        firstname = EXCLUDED.firstname,
        lastname = EXCLUDED.lastname,
        name = EXCLUDED.name
      RETURNING *;
    `;
    const values = [userid, email, true, firstName, lastName, name, false, false];

    const result = await dbClient.query(query, values);
    const user = result.rows[0];

    // Create a session for the user
    req.session.userId = userid;
    req.session.email = email;

    res.json({ success: true, user: user });
  } catch (error) {
    console.error('Error verifying Google token:', error);
    res.status(400).json({ success: false, message: 'Invalid token' });
  }
});

module.exports = router;
