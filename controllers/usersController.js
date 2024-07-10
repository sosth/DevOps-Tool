const express = require('express');
const router = express.Router();
const pool = require('../database');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { email, emaillogin, fblogin, firstname, googlelogin, id, lastname, name } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO users (email, emaillogin, fblogin, firstname, googlelogin, id, lastname, name) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [email, emaillogin, fblogin, firstname, googlelogin, id, lastname, name]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { email, emaillogin, fblogin, firstname, googlelogin, lastname, name } = req.body;
  try {
    const result = await pool.query(
      'UPDATE users SET email = $1, emaillogin = $2, fblogin = $3, firstname = $4, googlelogin = $5, lastname = $6, name = $7 WHERE id = $8 RETURNING *',
      [email, emaillogin, fblogin, firstname, googlelogin, lastname, name, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
