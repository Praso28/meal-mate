const { Pool } = require('pg');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from the correct path
dotenv.config({ path: path.join(__dirname, '../../.env') });

class Database {
  constructor() {
    this._pool = null;
    this._setupPool = null;
  }

  get pool() {
    if (!this._pool) {
      this._pool = new Pool({
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT),
        database: process.env.NODE_ENV === 'test' ? `${process.env.DB_NAME}_test` : process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
      });

      this._pool.on('error', (err) => {
        console.error('Unexpected error on idle client', err);
        process.exit(-1);
      });
    }
    return this._pool;
  }

  async query(text, params) {
    return this.pool.query(text, params);
  }

  async close() {
    if (this._pool) {
      const pool = this._pool;
      this._pool = null;
      await pool.end();
    }
    if (this._setupPool) {
      const setupPool = this._setupPool;
      this._setupPool = null;
      await setupPool.end();
    }
  }

  async setupTestDb() {
    if (process.env.NODE_ENV !== 'test') {
      throw new Error('setupTestDb should only be called in test environment');
    }

    // Connect to default postgres database
    if (!this._setupPool) {
      this._setupPool = new Pool({
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT),
        database: 'postgres',
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
      });
    }

    try {
      // Check if test database exists
      const result = await this._setupPool.query(
        "SELECT 1 FROM pg_database WHERE datname = 'mealmate_test'"
      );

      if (result.rows.length === 0) {
        // Create test database if it doesn't exist
        await this._setupPool.query('CREATE DATABASE mealmate_test');
      }
    } catch (err) {
      // Ignore database already exists error
      if (err.code !== '23505') {
        throw err;
      }
    }
  }
}

module.exports = { Database };