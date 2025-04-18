const { Pool } = require('pg');
const logger = require('./logger');

// Create a PostgreSQL connection pool
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'mealmate',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
});

// Log connection events
pool.on('connect', () => {
  logger.info('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  logger.error('PostgreSQL database error:', err);
});

/**
 * Execute a query with parameters
 * @param {string} text - SQL query text
 * @param {Array} params - Query parameters
 * @returns {Promise<Object>} Query result
 */
const query = async (text, params) => {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    
    logger.debug(`Executed query: ${text}`);
    logger.debug(`Query duration: ${duration}ms, rows: ${result.rowCount}`);
    
    return result;
  } catch (error) {
    logger.error(`Query error: ${error.message}`);
    logger.error(`Query: ${text}`);
    logger.error(`Params: ${JSON.stringify(params)}`);
    throw error;
  }
};

/**
 * Execute a transaction with multiple queries
 * @param {Function} callback - Transaction callback function that receives a client
 * @returns {Promise<any>} Transaction result
 */
const transaction = async (callback) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    logger.error(`Transaction error: ${error.message}`);
    throw error;
  } finally {
    client.release();
  }
};

module.exports = {
  query,
  transaction,
  pool
};
