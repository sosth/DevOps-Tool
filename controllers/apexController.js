const { retrieveApexClasses } = require('../services/retrieveService');

exports.retrieveApexClasses = async (req, res) => {
    const orgName = req.body.orgName; // Assume orgName is sent in the request body
    if (!orgName) {
        return res.status(400).send('Organization name is required.');
    }

    try {
        await retrieveApexClasses(orgName);
        res.status(200).send(`Apex classes for org ${orgName} retrieved and written to files successfully.`);
    } catch (error) {
        res.status(500).send('Error retrieving Apex classes: ' + error.message);
    }
};
