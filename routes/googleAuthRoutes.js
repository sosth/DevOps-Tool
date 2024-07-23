// routes/googleAuthRoutes.js
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  const { email, given_name, family_name, id } = req.body;
  const client = req.app.locals.dbClient;
  
  try {
    const result = await client.query(
      `INSERT INTO users (id, email, firstname, lastname, googlelogin, fblogin, emaillogin)
       VALUES ($1, $2, $3, $4, true, false, false)
       ON CONFLICT (email) DO UPDATE SET
         googlelogin = true,
         firstname = EXCLUDED.firstname,
         lastname = EXCLUDED.lastname
       RETURNING *`,
      [id, email, given_name, family_name]
    );
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error inserting user data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
