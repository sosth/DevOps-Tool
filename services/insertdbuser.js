// services/insertdbuser.js
const { Client } = require('pg');

const insertUser = async (userData) => {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  await client.connect();

  const query = `
    INSERT INTO users (id, email, firstname, lastname, googlelogin, fblogin, emaillogin)
    VALUES ($1, $2, $3, $4, true, false, false)
    ON CONFLICT (id) DO UPDATE SET
      email = EXCLUDED.email,
      firstname = EXCLUDED.firstname,
      lastname = EXCLUDED.lastname,
      googlelogin = EXCLUDED.googlelogin;
  `;

  const values = [userData.id, userData.email, userData.given_name, userData.family_name];

  try {
    await client.query(query, values);
  } catch (error) {
    console.error('Error inserting user data:', error);
    throw error;
  } finally {
    await client.end();
  }
};

module.exports = { insertUser };
