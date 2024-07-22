const express = require('express');
const { Client } = require('pg');
const router = express.Router();

// Database setup
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

client.connect();

router.post('/save-user', async (req, res) => {
  const { email, firstName, lastName, googleLogin } = req.body;

  try {
    const query = `
      INSERT INTO users (email, firstname, lastname, googlelogin)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (email) DO UPDATE SET
        firstname = EXCLUDED.firstname,
        lastname = EXCLUDED.lastname,
        googlelogin = EXCLUDED.googlelogin;
    `;
    const values = [email, firstName, lastName, googleLogin];

    await client.query(query, values);

    res.status(200).json({ success: true, message: 'User saved successfully' });
  } catch (error) {
    console.error('Error saving user:', error);
    res.status(500).json({ success: false, message: 'Error saving user' });
  }
});

module.exports = router;
