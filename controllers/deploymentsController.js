const express = require('express');
const router = express.Router();
const pool = require('../database');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM deployment');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { datecreated, id, orgsource, orgtarget, userid } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO deployment (datecreated, id, orgsource, orgtarget, userid) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [datecreated, id, orgsource, orgtarget, userid]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { datecreated, orgsource, orgtarget, userid } = req.body;
  try {
    const result = await pool.query(
      'UPDATE deployment SET datecreated = $1, orgsource = $2, orgtarget = $3, userid = $4 WHERE id = $5 RETURNING *',
      [datecreated, orgsource, orgtarget, userid, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM deployment WHERE id = $1', [id]);
    res.json({ message: 'Deployment deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
