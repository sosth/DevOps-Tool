const express = require('express');
const router = express.Router();
const pool = require('../database');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM deployeditems');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { dateofdeploy, dateofretrieve, deploymentid, developername, errortext, id, metadataitemid, name, orgofretrieve, status, type } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO deployeditems (dateofdeploy, dateofretrieve, deploymentid, developername, errortext, id, metadataitemid, name, orgofretrieve, status, type) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *',
      [dateofdeploy, dateofretrieve, deploymentid, developername, errortext, id, metadataitemid, name, orgofretrieve, status, type]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { dateofdeploy, dateofretrieve, deploymentid, developername, errortext, metadataitemid, name, orgofretrieve, status, type } = req.body;
  try {
    const result = await pool.query(
      'UPDATE deployeditems SET dateofdeploy = $1, dateofretrieve = $2, deploymentid = $3, developername = $4, errortext = $5, metadataitemid = $6, name = $7, orgofretrieve = $8, status = $9, type = $10 WHERE id = $11 RETURNING *',
      [dateofdeploy, dateofretrieve, deploymentid, developername, errortext, metadataitemid, name, orgofretrieve, status, type, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM deployeditems WHERE id = $1', [id]);
    res.json({ message: 'Deployed item deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
