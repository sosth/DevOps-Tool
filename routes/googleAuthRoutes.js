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

router.post('/google', async (req, res) => {
    const { email, given_name, family_name, id } = req.body;
    const googleLogin = true;
    const fbLogin = false;
    const emailLogin = false;
  
    try {
      const newUser = await pool.query(
        `INSERT INTO users (id, email, firstname, lastname, googlelogin, fblogin, emaillogin)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (email) DO UPDATE 
         SET googlelogin = $5, firstname = $3, lastname = $4, id = $1
         RETURNING *`,
        [id, email, given_name, family_name, googleLogin, fbLogin, emailLogin]
      );
  
      res.json(newUser.rows[0]);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });
  
  module.exports = router;