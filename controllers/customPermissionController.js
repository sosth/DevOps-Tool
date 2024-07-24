// controllers/customPermissionController.js
const customPermissionService = require('../services/customPermissionService');

const customPermissionController = {
  retrieveCustomPermissions: async (req, res) => {
    const { folderorg } = req.params;
    try {
      const result = await customPermissionService.retrieveAndSaveCustomPermissions(folderorg);
      res.status(200).json({ message: `Custom Permissions retrieved successfully`, data: result });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = customPermissionController;