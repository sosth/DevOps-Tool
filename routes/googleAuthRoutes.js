const express = require('express');
const { pool } = require('../db'); // Assume you have a centralized db.js file
const router = express.Router();

router.post('/google', async (req, res) => {
    console.log('Received Google login request:', req.body);
    const { email, given_name, family_name, id } = req.body;
    const googleLogin = true;
    const fbLogin = false;
    const emailLogin = false;

    try {
        const client = await pool.connect();
        try {
            const result = await client.query(
                `INSERT INTO users (id, email, firstname, lastname, googlelogin, fblogin, emaillogin)
                 VALUES ($1, $2, $3, $4, $5, $6, $7)
                 ON CONFLICT (email) DO UPDATE 
                 SET googlelogin = $5, firstname = $3, lastname = $4, id = $1
                 RETURNING *`,
                [id, email, given_name, family_name, googleLogin, fbLogin, emailLogin]
            );

            console.log('User inserted/updated:', result.rows[0]);
            res.json(result.rows[0]);
        } finally {
            client.release();
        }
    } catch (err) {
        console.error('Error in /google route:', err);
        res.status(500).json({ error: 'Server error', details: err.message });
    }
});

module.exports = router;