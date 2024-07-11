const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const pool = require('./db'); // Assuming you have a db.js for database connection

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
},
async (accessToken, refreshToken, profile, done) => {
    const { id, name, emails } = profile;
    const email = emails[0].value;
    const firstname = name.givenName;
    const lastname = name.familyName;

    try {
        // Check if user exists
        let user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (user.rows.length === 0) {
            // If user doesn't exist, insert new user
            user = await pool.query(
                'INSERT INTO users (email, googlelogin, firstname, lastname, name) VALUES ($1, $2, $3, $4, $5) RETURNING *',
                [email, true, firstname, lastname, `${firstname} ${lastname}`]
            );
        }
        done(null, user.rows[0]);
    } catch (err) {
        done(err, null);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        done(null, user.rows[0]);
    } catch (err) {
        done(err, null);
    }
});
