const express = require('express');
const router = express.Router();
const pool = require('../database');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Retrieve');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { dep_id, ret_name, is_deployed, deploy_succeed } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO Retrieve (dep_id, ret_name, is_deployed, deploy_succeed) VALUES ($1, $2, $3, $4) RETURNING *',
      [dep_id, ret_name, is_deployed, deploy_succeed]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:ret_id', async (req, res) => {
  const { ret_id } = req.params;
  const { dep_id, ret_name, is_deployed, deploy_succeed } = req.body;
  try {
    const result = await pool.query(
      'UPDATE Retrieve SET dep_id = $1, ret_name = $2, is_deployed = $3, deploy_succeed = $4 WHERE ret_id = $5 RETURNING *',
      [dep_id, ret_name, is_deployed, deploy_succeed, ret_id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:ret_id', async (req, res) => {
  const { ret_id } = req.params;
  try {
    await pool.query('DELETE FROM Retrieve WHERE ret_id = $1', [ret_id]);
    res.json({ message: 'Retrieve entry deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
