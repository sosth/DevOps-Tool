const retrieveService = require('../services/retrieveService');

exports.retrieveApexClasses = async (req, res) => {
    try {
        await retrieveApexClasses();
        res.status(200).send('Apex classes retrieved and written to files successfully.');
    } catch (error) {
        res.status(500).send('Error retrieving Apex classes: ' + error.message);
    }
};