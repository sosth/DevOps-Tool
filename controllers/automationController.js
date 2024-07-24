// controllers/automationController.js

const automationService = require('../services/automationService');

const automationController = {
  retrieveAutomationItems: async (req, res) => {
    const { folderorg, type } = req.params;

    try {
      const result = await automationService.retrieveAndSaveAutomationItems(folderorg, type);
      res.status(200).json({ message: `${type} items retrieved successfully`, data: result });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = automationController;