// database.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Use a file-based database instead of an in-memory database
const dbPath = path.resolve(__dirname, 'database.db');
const db = new sqlite3.Database(dbPath);

// Initialize the database schema
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS connections (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            access_token TEXT,
            instance_url TEXT,
            org_id TEXT,
            salesforce_url TEXT,
            name TEXT,
            instance_name TEXT,
            organization_type TEXT,
            is_sandbox BOOLEAN,
            created_date TEXT,
            primary_contact TEXT,
            country TEXT,
            default_locale TEXT,
            time_zone TEXT,
            language TEXT
        )
    `);
});

module.exports = db;
