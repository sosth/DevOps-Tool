// services/insertdbuser.js

const insertUser = async (client, user) => {
  const query = `
    INSERT INTO users (id, email, firstname, lastname, googlelogin, fblogin, emaillogin)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    ON CONFLICT (id) DO UPDATE SET
      email = EXCLUDED.email,
      firstname = EXCLUDED.firstname,
      lastname = EXCLUDED.lastname,
      googlelogin = EXCLUDED.googlelogin
  `;
  const values = [
    user.id,
    user.email,
    user.given_name,
    user.family_name,
    true,
    false,
    false
  ];

  try {
    await client.query(query, values);
    return { success: true, message: 'User data saved successfully.' };
  } catch (err) {
    console.error('Error inserting user data:', err);
    throw err;
  }
};

module.exports = insertUser;
