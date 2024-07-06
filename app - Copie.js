require('dotenv').config();
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const authController = require('./controllers/authController');
const getOrgIdApi = require('./services/getOrgIdApi');
const { Client } = require('pg');

const app = express();
const port = process.env.PORT || 3000;

app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
}));

app.use(bodyParser.json());
app.use(express.static('public'));

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

client.connect();

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/connect.html');
});

app.get('/auth-url', authController.login);

app.get('/callback', authController.callback);

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

app.listen(port, () => {
    console.log(`App running at http://localhost:${port}`);
});
