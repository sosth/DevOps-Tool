const { Client } = require('pg');
const { retrieveAndSaveComponents } = require('../services/retrieveService');
const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

client.connect();


exports.retrieveComponents = async (req, res) => {
    const { orgId, orgName, componentType } = req.body;

    try {
        const result = await retrieveAndSaveComponents(orgId, orgName, componentType);
        res.status(200).json(result);
    } catch (error) {
        console.error(`Error in retrieveComponents:`, error);
        res.status(500).json({ success: false, message: `Failed to retrieve ${componentType} components.` });
    }
};
exports.createDeployment = async (req, res) => {
    const { deploymentName, sourceOrg, targetOrg } = req.body;

    try {
        // Fetch source and target organization names
        const sourceOrgQuery = `
            SELECT name FROM Organizations WHERE org_id = $1
        `;
        const targetOrgQuery = `
            SELECT name FROM Organizations WHERE org_id = $1
        `;
        const sourceOrgResult = await client.query(sourceOrgQuery, [sourceOrg]);
        const targetOrgResult = await client.query(targetOrgQuery, [targetOrg]);

        const sourceOrgName = sourceOrgResult.rows[0].name;
        const targetOrgName = targetOrgResult.rows[0].name;

        // Insert into Deployment table with orgsource and orgtarget
        const query = `
            INSERT INTO Deployment (source_org_id, target_org_id, dep_name, orgsource, orgtarget)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `;
        const values = [sourceOrg, targetOrg, deploymentName, sourceOrgName, targetOrgName];
        const result = await client.query(query, values);

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating deployment:', error);
        res.status(500).json({ error: 'Failed to create deployment' });
    }
    res.redirect('/connectedretrieve');
};


exports.getDeployments = async (req, res) => {
    try {
        const query = `
            SELECT d.*, o1.name as source_org_name, o2.name as target_org_name
            FROM Deployment d
            JOIN Organizations o1 ON d.source_org_id = o1.org_id
            JOIN Organizations o2 ON d.target_org_id = o2.org_id
            ORDER BY d.datecreated DESC
        `;
        const result = await client.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching deployments:', error);
        res.status(500).json({ error: 'Failed to fetch deployments' });
    }
};
