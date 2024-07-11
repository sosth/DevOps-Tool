const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { Client } = require('pg');

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

client.connect();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "https://devto-f2687ab8b235.herokuapp.com/auth/google/callback"
},
async (accessToken, refreshToken, profile, done) => {
    const { id, name, emails } = profile;
    const email = emails[0].value;
    const firstname = name.givenName;
    const lastname = name.familyName;

    try {
        const user = await client.query('SELECT * FROM users WHERE email = $1', [email]);
        if (user.rows.length === 0) {
            const newUser = await client.query(
                'INSERT INTO users (email, googlelogin, firstname, lastname, name) VALUES ($1, $2, $3, $4, $5) RETURNING *',
                [email, true, firstname, lastname, `${firstname} ${lastname}`]
            );
            return done(null, newUser.rows[0]);
        }
        return done(null, user.rows[0]);
    } catch (err) {
        return done(err, null);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await client.query('SELECT * FROM users WHERE id = $1', [id]);
        done(null, user.rows[0]);
    } catch (err) {
        done(err, null);
    }
});
