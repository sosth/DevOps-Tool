const sfdxService = require('../services/sfdxService');

const { Client } = require('pg');

// Create a new client instance
const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

client.connect();

// List orgs from SQL
exports.listOrgFromSQL = async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM organizations');
        res.json(result.rows);
    } catch (error) {
        console.log('Error retrieving orgs:', error);
        res.status(500).json({ error: error.message });
    }
};

// Delete an org from SQL
exports.deleteOrgFromSQL = async (req, res) => {
    const orgId = req.body.orgId;
    try {
        await client.query('DELETE FROM organizations WHERE id = $1', [orgId]);
        res.status(200).json({ message: 'Org deleted successfully' });
    } catch (error) {
        console.log('Error deleting org:', error);
        res.status(500).json({ error: error.message });
    }
};


exports.deploy = async (req, res) => {
  try {
    const token = req.session.token;
    const sourcePath = req.body.sourcePath;
    const result = await sfdxService.deploySource(token, sourcePath);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.retrieve = async (req, res) => {
  try {
    const token = req.session.token;
    const sourcePath = req.body.sourcePath;
    const result = await sfdxService.retrieveSource(token, sourcePath);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
