// controllers/integrationController.js
const integrationService = require('../services/integrationService');

const integrationController = {
  retrieveMetadata: async (req, res) => {
    const { type, folderorg } = req.params;
    try {
      const result = await integrationService.retrieveAndSaveMetadata(type, folderorg);
      res.status(200).json({ message: `${type} retrieved successfully`, data: result });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = integrationController;