const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

client.connect();

exports.createDeployment = async (req, res) => {
  const { deploymentName, sourceOrg, targetOrg, userId, orgSource, orgTarget } = req.body;

  try {
    const query = `
      INSERT INTO deployment (dep_name, source_org_id, target_org_id, userid, orgsource, orgtarget)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const values = [deploymentName, sourceOrg, targetOrg, userId, orgSource, orgTarget];
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
      SELECT d.*, o1.name as source_org_name, o2.name as target_org_name, u.username as user_name
      FROM deployment d
      JOIN organizations o1 ON d.source_org_id = o1.org_id
      JOIN organizations o2 ON d.target_org_id = o2.org_id
      JOIN users u ON d.userid = u.id
      ORDER BY d.datecreated DESC
    `;
    const result = await client.query(query);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching deployments:', error);
    res.status(500).json({ error: 'Failed to fetch deployments' });
  }
};
