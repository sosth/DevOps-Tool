const jsforce = require('jsforce');

const accessToken = '00DQy000009119l!AQEAQBVfr9Ii7TccpvMH54s8S_72oKPezY1XNEKs3ZeuTYmJ6.J2a6t.EwdkABeAG2Ll6BlG7vNgVF_kGguzl_IqgwJ8a6Eg';
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
