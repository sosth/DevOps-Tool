// controllers/layoutController.js

const layoutService = require('../services/layoutService');

const layoutController = {
  retrieveLayoutItems: async (req, res) => {
    const { folderorg, type } = req.params;

    try {
      const result = await layoutService.retrieveAndSaveLayoutItems(folderorg, type);
      res.status(200).json({ message: `${type} items retrieved successfully`, data: result });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = layoutController;