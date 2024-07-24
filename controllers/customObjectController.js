// controllers/customObjectController.js

const customObjectService = require('../services/customObjectService');

const customObjectController = {
  retrieveCustomItems: async (req, res) => {
    const { folderorg, type } = req.params;

    try {
      const result = await customObjectService.retrieveAndSaveCustomItems(folderorg, type);
      res.status(200).json({ message: `${type} items retrieved successfully`, data: result });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = customObjectController;