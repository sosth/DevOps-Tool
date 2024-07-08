// controllers/deploymentController.js
const deploymentService = require('../services/deployment');

const createDeployment = async (req, res) => {
    const deploymentData = req.body;

    try {
        const newDeployment = await deploymentService.createDeployment(deploymentData);
        res.status(201).json(newDeployment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createDeployment,
};
