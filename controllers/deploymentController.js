const { Client } = require('pg');

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

client.connect();

exports.createDeployment = async (req, res) => {
    const { deploymentName, sourceOrg, targetOrg } = req.body;

    try {
        const query = `
            INSERT INTO deployment (orgsource, orgtarget, datecreated)
            VALUES ($1, $2, CURRENT_TIMESTAMP)
            RETURNING *
        `;
        const values = [sourceOrg, targetOrg];
        const result = await client.query(query, values);

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating deployment:', error);
        res.status(500).json({ error: 'Failed to create deployment' });
    }
};

exports.getDeployments = async (req, res) => {
    try {
        const query = `
            SELECT d.*, o1.name as source_org_name, o2.name as target_org_name
            FROM deployment d
            JOIN organizations o1 ON d.orgsource = o1.org_id
            JOIN organizations o2 ON d.orgtarget = o2.org_id
            ORDER BY d.datecreated DESC
        `;
        const result = await client.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching deployments:', error);
        res.status(500).json({ error: 'Failed to fetch deployments' });
    }
};
