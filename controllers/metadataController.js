const { Client } = require('pg');
const jsforce = require('jsforce');

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

client.connect();

exports.retrieveMetadata = async (req, res) => {
    const { accessToken, instanceUrl, componentType, depId, retName } = req.body;

    try {
        const conn = new jsforce.Connection({
            instanceUrl: instanceUrl,
            accessToken: accessToken
        });

        // Create a new Retrieve record
        const retrieveResult = await client.query(
            'INSERT INTO Retrieve (dep_id, ret_name, is_deployed, deployed_succeed) VALUES ($1, $2, false, false) RETURNING ret_id',
            [depId, retName]
        );
        const retId = retrieveResult.rows[0].ret_id;

        // Query the Tooling API
        const result = await conn.tooling.query(`SELECT Id, Name FROM ${componentType}`);

        // Store each component in the MetadataItem table
        for (let record of result.records) {
            await client.query(
                'INSERT INTO MetadataItem (ret_id, component_type, component_name) VALUES ($1, $2, $3)',
                [retId, componentType, record.Name]
            );
        }

        res.json({ message: `Retrieved and stored ${result.records.length} ${componentType} components.` });
    } catch (error) {
        console.error('Error retrieving metadata:', error);
        res.status(500).json({ error: 'Failed to retrieve metadata' });
    }
};