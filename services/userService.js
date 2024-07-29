const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const saveUser = async (userData) => {
  const client = await pool.connect();
  try {
    console.log('Attempting to save user:', userData);
    const query = `
      INSERT INTO users (email, emaillogin, fblogin, firstname, googlelogin, lastname, name)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (email) DO UPDATE
      SET emaillogin = $2, fblogin = $3, firstname = $4, googlelogin = $5, lastname = $6, name = $7
      RETURNING id;
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
    console.log('User saved successfully:', result.rows[0]);
    return result.rows[0].id;
  } catch (error) {
    console.error('Error saving user to database:', error);
    throw error;
  } finally {
    client.release();
  }
};

module.exports = { saveUser };
