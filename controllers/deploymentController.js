const { Client } = require('pg');

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

client.connect();

exports.createDeployment = async (req, res) => {
    const { orgsource, orgtarget, createdby, deploystatus } = req.body;
    try {
      const newDeployment = await Deployment.create({
        orgsource,
        orgtarget,
        createdby,
        deploystatus
      });
      res.status(201).json(newDeployment);
    } catch (error) {
      console.error("Error creating deployment:", error);
      res.status(500).json({ message: "Error creating deployment", error });
    }
  };
  


exports.getDeployments = async (req, res) => {
    try {
        const query = `
            SELECT d.*, o1.name as source_org_name, o2.name as target_org_name
            FROM deployment d
            JOIN organizations o1 ON d.source_org_id = o1.org_id
            JOIN organizations o2 ON d.target_org_id = o2.org_id
            ORDER BY d.datecreated DESC
        `;
        const result = await client.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching deployments:', error);
        res.status(500).json({ error: 'Failed to fetch deployments' });
    }
};
