const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const { Client } = require('pg');
const fs = require('fs');

const authController = require('./controllers/authController');
const getOrgIdApi = require('./services/getOrgIdApi');
const orgController = require('./controllers/orgController');
const deploymentController = require('./controllers/deploymentController'); // Include deployment controller
const deploymentRoutes = require('./routes/deploymentRoutres');
const retrieveService = require('./services/retrieveService');
const apexRoutes = require('./routes/apexRoutes'); // Import apex routes
const deployScript = require('./deployitem');
const googleAuthRoutes = require('./routes/googleAuthRoutes');
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
app.use(express.static(path.join(__dirname, 'frontend', 'build')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'build', 'HomePage.js'));
  });
app.use('/api/google', googleAuthRoutes);
app.post('/deploy', async (req, res) => {
    try {
        await deployScript(); // Call the deployment script function
        res.status(200).send('Deployment successful!');
    } catch (error) {
        res.status(500).send(`Deployment failed: ${error.message}`);
    }
});

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
app.use('/api/deployments', deploymentRoutes);
app.use('/api/apex', apexRoutes);
app.get('/create-deployment', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'create-deployment.html'));
});
app.get('/retrieve-apex', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'retrieve-apex.html'));
});
app.post('/retrieve-all-components', async (req, res) => {
    const { accessToken, instanceUrl, componentType } = req.body;
    try {
        await retrieveService.retrieveAndSaveComponents(accessToken, instanceUrl, componentType);
        res.status(200).json({ message: `All ${componentType} components retrieved and saved successfully.` });
    } catch (error) {
        console.error(`Error retrieving ${componentType} components:`, error);
        res.status(500).json({ error: `Failed to retrieve ${componentType} components` });
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

app.post('/get-components', async (req, res) => {
    const { accessToken, instanceUrl, componentType } = req.body;
    const conn = new jsforce.Connection({
        instanceUrl: instanceUrl,
        accessToken: accessToken
    });
    try {
        const components = await conn.metadata.list([{ type: componentType }], '39.0');
        res.json(components);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/downloadselectedmetadata', async (req, res) => {
    const { accessToken, instanceUrl, metadataType, fullName } = req.body;
    try {
        const metadata = await retrieveService.retrieveAndSaveComponents(accessToken, instanceUrl, metadataType, fullName);
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
    const { accessToken, instanceUrl, componentType } = req.body;
    try {
        await retrieveService.retrieveAndSaveComponents(accessToken, instanceUrl, componentType);
        res.status(200).json({ message: `All ${componentType} metadata retrieved and saved successfully.` });
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

app.get('/metadata/:orgName/:componentType', (req, res) => {
    const { orgName, componentType } = req.params;
    const metadataDir = path.join(__dirname, 'org_files', orgName, componentType);

    if (fs.existsSync(metadataDir)) {
        fs.readdir(metadataDir, (err, files) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Failed to read metadata directory.' });
            }
            const metadata = files.map(file => {
                const filePath = path.join(metadataDir, file);
                const content = fs.readFileSync(filePath, 'utf8');
                return { Name: file, Body: content };
            });
            res.status(200).json(metadata);
        });
    } else {
        res.status(404).json({ success: false, message: 'Metadata directory not found.' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`App running at http://localhost:${port}`);
});
