const { Client } = require('pg');

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

client.connect();

exports.listOrgs = async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM organizations');
        res.render('listOrg', { orgs: result.rows });
    } catch (error) {
        console.error('Error listing orgs:', error);
        res.status(500).json({ error: 'Failed to list organizations' });
    }
};

exports.deleteOrg = async (req, res) => {
    const orgId = req.params.id;
    try {
        await client.query('DELETE FROM organizations WHERE id = $1', [orgId]);
        res.redirect('/listorg');
    } catch (error) {
        console.error('Error deleting org:', error);
        res.status(500).json({ error: 'Failed to delete organization' });
    }
};