const { Client } = require('pg');

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

client.connect();

exports.createDeployment = async (req, res) => {
    const { orgId, userId, depName } = req.body;

    try {
        const result = await client.query(
            'INSERT INTO Deploiement (org_id, user_id, dep_name) VALUES ($1, $2, $3) RETURNING dep_id',
            [orgId, userId, depName]
        );
        res.json({ depId: result.rows[0].dep_id });
    } catch (error) {
        console.error('Error creating deployment:', error);
        res.status(500).json({ error: 'Failed to create deployment' });
    }
};