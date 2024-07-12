const retrieveService = require('../services/retrieveService');

exports.retrieveApexClasses = async (req, res) => {
    const { username, password, loginUrl, orgName } = req.body;

    try {
        await retrieveService.retrieveApexClasses(username, password, loginUrl, orgName);
        res.status(200).json({ message: 'All Apex classes retrieved and saved successfully.' });
    } catch (error) {
        console.error('Error retrieving Apex classes:', error);
        res.status(500).json({ error: 'Failed to retrieve Apex classes' });
    }
};
