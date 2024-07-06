const sfdxService = require('../services/sfdxService');

exports.listOrgs = async (req, res) => {
  try {
    const token = req.session.token;
    const result = await sfdxService.listOrgs(token);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deploy = async (req, res) => {
  try {
    const token = req.session.token;
    const sourcePath = req.body.sourcePath;
    const result = await sfdxService.deploySource(token, sourcePath);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.retrieve = async (req, res) => {
  try {
    const token = req.session.token;
    const sourcePath = req.body.sourcePath;
    const result = await sfdxService.retrieveSource(token, sourcePath);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
