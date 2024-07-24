// controllers/communityController.js

const communityService = require('../services/communityService');

const communityController = {
  retrieveCommunityItems: async (req, res) => {
    const { folderorg, type } = req.params;

    try {
      const result = await communityService.retrieveAndSaveCommunityItems(folderorg, type);
      res.status(200).json({ message: `${type} items retrieved successfully`, data: result });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = communityController;