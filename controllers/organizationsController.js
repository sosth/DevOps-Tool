const express = require('express');
const router = express.Router();
const pool = require('../database');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Organizations');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { id, name, instance_name, organization_type, is_sandbox, primary_contact, country, default_locale, time_zone, language, access_token } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO Organizations (id, name, instance_name, organization_type, is_sandbox, primary_contact, country, default_locale, time_zone, language, access_token) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *',
      [id, name, instance_name, organization_type, is_sandbox, primary_contact, country, default_locale, time_zone, language, access_token]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, instance_name, organization_type, is_sandbox, primary_contact, country, default_locale, time_zone, language, access_token } = req.body;
  try {
    const result = await pool.query(
      'UPDATE Organizations SET name = $1, instance_name = $2, organization_type = $3, is_sandbox = $4, primary_contact = $5, country = $6, default_locale = $7, time_zone = $8, language = $9, access_token = $10 WHERE id = $11 RETURNING *',
      [name, instance_name, organization_type, is_sandbox, primary_contact, country, default_locale, time_zone, language, access_token, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM Organizations WHERE id = $1', [id]);
    res.json({ message: 'Organization deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
