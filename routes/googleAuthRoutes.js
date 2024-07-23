// routes/googleAuthRoutes.js
const express = require('express');
const { insertUser } = require('../services/insertdbuser');

const router = express.Router();

router.post('/', async (req, res) => {
  const userData = req.body;

  try {
    await insertUser(userData);
    res.status(200).json({ message: 'User data saved successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error saving user data' });
  }
});

module.exports = router;
