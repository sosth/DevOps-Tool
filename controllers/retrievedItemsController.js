const express = require('express');
const router = express.Router();
const pool = require('../database');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM retrieveditems');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { dateofretrieve, deploymentid, developername, id, metadataitemid, name, orgofretrieve, type } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO retrieveditems (dateofretrieve, deploymentid, developername, id, metadataitemid, name, orgofretrieve, type) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [dateofretrieve, deploymentid, developername, id, metadataitemid, name, orgofretrieve, type]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { dateofretrieve, deploymentid, developername, metadataitemid, name, orgofretrieve, type } = req.body;
  try {
    const result = await pool.query(
      'UPDATE retrieveditems SET dateofretrieve = $1, deploymentid = $2, developername = $3, metadataitemid = $4, name = $5, orgofretrieve = $6, type = $7 WHERE id = $8 RETURNING *',
      [dateofretrieve, deploymentid, developername, metadataitemid, name, orgofretrieve, type, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM retrieveditems WHERE id = $1', [id]);
    res.json({ message: 'Retrieved item deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
