const { Pool } = require('pg');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const pool = new Pool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

// Add connection test
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
    } else {
        console.log('Database connected successfully');
    }
});

module.exports = {
    query: (text, params) => pool.query(text, params),
    pool
};