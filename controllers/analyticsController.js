// controllers/analyticsController.js

const analyticsService = require('../services/analyticsService');

const analyticsController = {
  retrieveAnalyticsItems: async (req, res) => {
    const { folderorg, type } = req.params;

    try {
      const result = await analyticsService.retrieveAndSaveAnalyticsItems(folderorg, type);
      res.status(200).json({ message: `${type} items retrieved successfully`, data: result });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = analyticsController;