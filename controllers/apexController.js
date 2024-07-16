// controllers/metadataController.js

const apexService = require('../services/apexService');

const apexController = {
  retrieveMetadata: async (req, res) => {
    const { type, folderorg } = req.params;

    try {
      const result = await apexService.retrieveAndSaveMetadata(type, folderorg);
      res.status(200).json({ message: `${type} récupérés avec succès`, data: result });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = apexController;