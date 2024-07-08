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
    // Assuming you have a user_id, you might get this from the session or JWT
    const userId = 1; // Replace with actual user ID

    try {
        const query = `
            INSERT INTO Deploiement (org_id, user_id, dep_name)
            VALUES ($1, $2, $3)
            RETURNING *
        `;
        const values = [sourceOrg, userId, deploymentName];
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
            SELECT d.*, o.name as org_name
            FROM Deploiement d
            JOIN Organizations o ON d.org_id = o.org_id
            ORDER BY d.created_date DESC
        `;
        const result = await client.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching deployments:', error);
        res.status(500).json({ error: 'Failed to fetch deployments' });
    }
};