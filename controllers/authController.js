const { OAuth2Client } = require('google-auth-library');
const { Client } = require('pg');

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;

const oAuth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

// Create a new PostgreSQL client
const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

client.connect();

exports.googleLogin = (req, res) => {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['profile', 'email']
    });
    res.redirect(authUrl);
};

exports.googleCallback = async (req, res) => {
    const { code } = req.query;
    try {
        const { tokens } = await oAuth2Client.getToken(code);
        oAuth2Client.setCredentials(tokens);

        const ticket = await oAuth2Client.verifyIdToken({
            idToken: tokens.id_token,
            audience: CLIENT_ID
        });

        const payload = ticket.getPayload();
        
        // Prepare user data
        const userData = {
            email: payload.email,
            name: payload.name,
            firstname: payload.given_name,
            lastname: payload.family_name,
            googlelogin: true,
            emaillogin: false,
            fblogin: false
        };

        // Insert or update user in the database
        const query = `
            INSERT INTO users (email, emaillogin, fblogin, firstname, googlelogin, lastname, name)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            ON CONFLICT (email) DO UPDATE SET
                emaillogin = $2,
                fblogin = $3,
                firstname = $4,
                googlelogin = $5,
                lastname = $6,
                name = $7
            RETURNING id
        `;
        const values = [
            userData.email,
            userData.emaillogin,
            userData.fblogin,
            userData.firstname,
            userData.googlelogin,
            userData.lastname,
            userData.name
        ];

        const result = await client.query(query, values);
        
        // Set session data
        req.session.user = {
            id: result.rows[0].id,
            ...userData
        };

        res.redirect('/');
    } catch (error) {
        console.error('Error during Google authentication:', error);
        res.status(500).send('Authentication failed');
    }
};