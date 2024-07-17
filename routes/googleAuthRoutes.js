const express = require('express');
const router = express.Router();
const { OAuth2Client } = require('google-auth-library');
const { Client } = require('pg');

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

client.connect();

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function storeUserInfo(userInfo) {
    const { email, given_name, family_name, name } = userInfo;
    const query = `
        INSERT INTO users (email, emaillogin, fblogin, firstname, googlelogin, lastname, name)
        VALUES ($1, false, false, $2, true, $3, $4)
        ON CONFLICT (email) DO UPDATE SET
        googlelogin = true,
        firstname = EXCLUDED.firstname,
        lastname = EXCLUDED.lastname,
        name = EXCLUDED.name
        RETURNING id;
    `;
    try {
        const result = await client.query(query, [email, given_name, family_name, name]);
        return result.rows[0].id;
    } catch (error) {
        console.error('Error storing user info:', error);
        throw error;
    }
}

router.post('/login', async (req, res) => {
    const { token } = req.body;
    try {
        const ticket = await googleClient.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        
        // Store user info in the database
        const userId = await storeUserInfo(payload);
        
        // Set session data
        req.session.userId = userId;
        req.session.email = payload['email'];

        res.json({ success: true, userId: userId, email: payload['email'] });
    } catch (error) {
        console.error('Error verifying Google token:', error);
        res.status(400).json({ success: false, message: 'Invalid token' });
    }
});

module.exports = router;