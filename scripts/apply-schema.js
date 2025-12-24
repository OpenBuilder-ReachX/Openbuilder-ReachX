const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

// Supabase Connection Details
const DB_HOST = '[2a05:d018:135e:164e:883b:4f10:faa7:1af1]'; // IPv6 Direct
const DB_PORT = 5432;
const DB_USER = 'postgres';
const DB_PASS = 'y1EIgKKYVKvuk0Ns';
const DB_NAME = 'postgres';

const connectionString = `postgresql://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;

async function applySchema() {
    console.log('Connecting to Supabase Database...');
    const client = new Client({
        connectionString: connectionString,
        ssl: { rejectUnauthorized: false } // Required for Supabase
    });

    try {
        await client.connect();
        console.log('Connected!');

        const seedPath = path.join(__dirname, '../supabase/seed.sql');
        console.log(`Reading schema from ${seedPath}...`);
        const sql = fs.readFileSync(seedPath, 'utf8');

        console.log('Executing SQL...');
        await client.query(sql);
        console.log('✅ Schema applied successfully!');

    } catch (err) {
        console.error('❌ Error applying schema:', err);
    } finally {
        await client.end();
    }
}

applySchema();
