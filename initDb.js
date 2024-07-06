// initDb.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS organizations (
        id TEXT PRIMARY KEY,
        name TEXT,
        instance_name TEXT,
        organization_type TEXT,
        is_sandbox INTEGER,
        created_date TEXT,
        primary_contact TEXT,
        country TEXT,
        default_locale TEXT,
        time_zone TEXT,
        language TEXT,
        access_token TEXT
    )`);
});

db.close();
