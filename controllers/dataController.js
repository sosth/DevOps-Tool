// controllers/dataController.js

const dataService = require('../services/dataService');

const dataController = {
  retrieveDataItems: async (req, res) => {
    const { folderorg, type } = req.params;

    try {
      const result = await dataService.retrieveAndSaveDataItems(folderorg, type);
      res.status(200).json({ message: `${type} items retrieved successfully`, data: result });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = dataController;