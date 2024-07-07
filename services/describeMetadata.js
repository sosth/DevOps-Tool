const jsforce = require('jsforce');

const accessToken = '6Cel800DQy000009119l888Qy0000002POvvwstBQf8iUsvouwmjk5IphKrFyR3hjsOzTuqNAVPM0NkbKNEPzLBRYs4mua2yIGnDRm9wfWm';
const instanceUrl = 'https://devsafa-dev-ed.develop.my.salesforce.com';

const conn = new jsforce.Connection({
    instanceUrl: instanceUrl,
    accessToken: accessToken
});

const describeMetadata = async () => {
    try {
        const result = await conn.metadata.describe('52.0');
        console.log(JSON.stringify(result, null, 2));
    } catch (error) {
        console.error('Error describing metadata:', error);
    }
};

describeMetadata();
