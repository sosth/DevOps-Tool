// routes/googleAuthRoutes.js

const express = require('express');
const router = express.Router();
const insertUser = require('../services/insertdbuser');

router.post('/', async (req, res) => {
  const { email, given_name, family_name, id } = req.body;
  const user = { email, given_name, family_name, id };

  try {
    const dbClient = req.app.locals.dbClient;
    const result = await insertUser(dbClient, user);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error saving user data.', error: error.message });
  }
});

module.exports = router;
