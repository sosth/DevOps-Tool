require('dotenv').config();
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const { Client } = require('pg');
const jsforce = require('jsforce');
const fs = require('fs');

const authController = require('./controllers/authController');
const getOrgIdApi = require('./services/getOrgIdApi');
const { retrieveMetadata } = require('./services/metadataService');
const orgController = require('./controllers/orgController');
const deploymentRoutes = require('./routes/deploymentRoutes');

const retrieveAllApexClasses = require('./services/retrieveAllApexClasses');

const app = express();
const port = process.env.PORT || 3000;

// Middleware setup
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
}));
app.use(bodyParser.json());
app.use(express.static('public'));

// Database setup
const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

client.connect();

// Routes
app.use('/api', deploymentRoutes);
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'connect.html'));
});

app.get('/auth-url', authController.login);
app.get('/callback', authController.callback);

app.get('/listorg', orgController.listOrgs);
app.post('/deleteorg/:id', orgController.deleteOrg);
app.get('/deleteorg', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'deleteOrg.html'));
});

app.post('/create-deployment', deploymentController.createDeployment);
app.post('/retrieve-metadata', metadataController.retrieveMetadata);
app.post('/retrieve-all-apex-classes', async (req, res) => {
    const { accessToken, instanceUrl } = req.body;
    try {
        await retrieveAllApexClasses(accessToken, instanceUrl);
        res.status(200).json({ message: 'All Apex classes retrieved and saved successfully.' });
    } catch (error) {
        console.error('Error retrieving all Apex classes:', error);
        res.status(500).json({ error: 'Failed to retrieve Apex classes' });
    }
});

app.post('/store-token', (req, res) => {
    const { accessToken, instanceUrl } = req.body;
    if (accessToken && instanceUrl) {
        req.session.token = accessToken;
        req.session.instanceUrl = instanceUrl;
        res.sendStatus(200);
    } else {
        res.sendStatus(400);
    }
});

app.get('/org-info-data', (req, res) => {
    if (req.session.token && req.session.instanceUrl) {
        res.json({
            accessToken: req.session.token,
            instanceUrl: req.session.instanceUrl
        });
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
});

app.get('/get-org-info', async (req, res) => {
    if (req.session.token) {
        try {
            const orgIdData = await getOrgIdApi.getOrgId(req.session.token, req.session.instanceUrl);
            const orgInfo = await getOrgIdApi.getOrgDetails(req.session.token, req.session.instanceUrl, orgIdData.Id);

            const query = `
                INSERT INTO organizations (
                    id, name, instance_name, organization_type, is_sandbox, created_date,
                    primary_contact, country, default_locale, time_zone, language, access_token
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
                ON CONFLICT (id) DO UPDATE SET
                    name = EXCLUDED.name,
                    instance_name = EXCLUDED.instance_name,
                    organization_type = EXCLUDED.organization_type,
                    is_sandbox = EXCLUDED.is_sandbox,
                    created_date = EXCLUDED.created_date,
                    primary_contact = EXCLUDED.primary_contact,
                    country = EXCLUDED.country,
                    default_locale = EXCLUDED.default_locale,
                    time_zone = EXCLUDED.time_zone,
                    language = EXCLUDED.language,
                    access_token = EXCLUDED.access_token;
            `;
            const values = [
                orgInfo.Id,
                orgInfo.Name,
                orgInfo.InstanceName,
                orgInfo.OrganizationType,
                orgInfo.IsSandbox,
                orgInfo.CreatedDate,
                orgInfo.PrimaryContact,
                orgInfo.Country,
                orgInfo.DefaultLocaleSidKey,
                orgInfo.TimeZoneSidKey,
                orgInfo.LanguageLocaleKey,
                req.session.token
            ];

            await client.query(query, values);

            res.json(orgInfo);
        } catch (error) {
            console.log('Error retrieving org info:', error);
            res.status(500).json({ error: error.message });
        }
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
});

app.get('/connected-orgs', async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM organizations');
        res.json(result.rows);
    } catch (error) {
        console.log('Error retrieving connected orgs:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/orgs', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/connectorgs.html'));
});

app.post('/get-apex-classes', async (req, res) => {
    const { accessToken, instanceUrl } = req.body;
    const conn = new jsforce.Connection({
        instanceUrl: instanceUrl,
        accessToken: accessToken
    });
    try {
        const apexClasses = await conn.metadata.list([{ type: 'ApexClass' }], '39.0');
        res.json(apexClasses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/downloadselectedmetadata', async (req, res) => {
    const { accessToken, instanceUrl, metadataType, fullName } = req.body;
    try {
        const metadata = await retrieveMetadata(accessToken, instanceUrl, metadataType, fullName);
        const fileName = `${fullName}.xml`;
        const filePath = path.join(__dirname, 'public', 'retrieved_metadata', fileName);
        fs.writeFileSync(filePath, metadata);
        res.json({ fileName });
    } catch (error) {
        console.log('Error retrieving metadata:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/downloadallmetadata', async (req, res) => {
    const { accessToken, instanceUrl } = req.body;
    try {
        const conn = new jsforce.Connection({
            instanceUrl: instanceUrl,
            accessToken: accessToken
        });
        const apexClasses = await conn.metadata.list([{ type: 'ApexClass' }], '39.0');
        let fileNames = [];
        for (const apexClass of apexClasses) {
            const metadata = await retrieveMetadata(accessToken, instanceUrl, 'ApexClass', apexClass.fullName);
            const fileName = `${apexClass.fullName}.xml`;
            const filePath = path.join(__dirname, 'public', 'retrieved_metadata', fileName);
            fs.writeFileSync(filePath, metadata);
            fileNames.push(fileName);
        }
        res.json({ fileNames });
    } catch (error) {
        console.log('Error retrieving all metadata:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/describemetadata', async (req, res) => {
    const { accessToken, instanceUrl } = req.body;
    try {
        const conn = new jsforce.Connection({
            instanceUrl: instanceUrl,
            accessToken: accessToken
        });
        conn.metadata.describe('52.0', (err, result) => {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.json(result);
            }
        });
    } catch (error) {
        console.log('Error describing metadata:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/connectedretrieve', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'connectedretrieve.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`App running at http://localhost:${port}`);
});