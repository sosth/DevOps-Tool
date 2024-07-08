// services/deploymentService.js
const db = require('../database'); // Adjust the path to your database module

const createDeployment = async (deploymentData) => {
    const { org_id, user_id, dep_name, dep_description } = deploymentData;
    const created_date = new Date();

    try {
        const result = await db.query(
            'INSERT INTO Deploiement (org_id, user_id, dep_name, created_date) VALUES ($1, $2, $3, $4) RETURNING *',
            [org_id, user_id, dep_name, created_date]
        );
        return result.rows[0];
    } catch (error) {
        throw error;
    }
};

module.exports = {
    createDeployment,
};
