// controllers/securityController.js

const securityService = require('../services/securityService');

const securityController = {
  retrieveSecurityItems: async (req, res) => {
    const { folderorg, type } = req.params;

    try {
      const result = await securityService.retrieveAndSaveSecurityItems(folderorg, type);
      res.status(200).json({ message: `${type} items retrieved successfully`, data: result });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = securityController;