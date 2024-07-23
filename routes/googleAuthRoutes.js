const express = require('express');
const { pool } = require('../db'); // Assume you have a centralized db.js file
const router = express.Router();

router.post('/', async (req, res) => {
    console.log('Received Google login request:', req.body);
    const { email, given_name, family_name, id } = req.body;
    const googleLogin = true;
    const fbLogin = false;
    const emailLogin = false;

    try {
        console.log('Executing database query...');
        const result = await req.app.locals.dbClient.query(
            `INSERT INTO users (id, email, firstname, lastname, googlelogin, fblogin, emaillogin)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             ON CONFLICT (email) DO UPDATE 
             SET googlelogin = $5, firstname = $3, lastname = $4, id = $1
             RETURNING *`,
            [id, email, given_name, family_name, googleLogin, fbLogin, emailLogin]
        );
        console.log('Query executed successfully. Result:', result.rows[0]);
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Database error', details: error.message });
    }
});
module.exports = router;