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
        console.log('Attempting to connect to database...');
        const client = await pool.connect();
        console.log('Connected to database successfully');
        try {
            console.log('Executing database query...');
            const result = await client.query(
                `INSERT INTO users (id, email, firstname, lastname, googlelogin, fblogin, emaillogin)
                 VALUES ($1, $2, $3, $4, $5, $6, $7)
                 ON CONFLICT (email) DO UPDATE 
                 SET googlelogin = $5, firstname = $3, lastname = $4, id = $1
                 RETURNING *`,
                [id, email, given_name, family_name, googleLogin, fbLogin, emailLogin]
            );
            console.log('Query executed successfully. Result:', result.rows[0]);
            res.json(result.rows[0]);
        } catch (queryError) {
            console.error('Error executing query:', queryError);
            res.status(500).json({ error: 'Database query error', details: queryError.message });
        } finally {
            client.release();
            console.log('Database connection released');
        }
    } catch (connectionError) {
        console.error('Error connecting to database:', connectionError);
        res.status(500).json({ error: 'Database connection error', details: connectionError.message });
    }
});
module.exports = router;