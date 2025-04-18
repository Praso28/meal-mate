const { pool } = require('../config/db');
const fs = require('fs');
const path = require('path');

/**
 * Initialize the database with schema
 */
async function initializeDatabase() {
  try {
    console.log('Initializing database...');
    
    // Read the schema file
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Execute the schema
    await pool.query(schema);
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  } finally {
    // Close the pool
    await pool.end();
  }
}

// Run the initialization if this script is executed directly
if (require.main === module) {
  initializeDatabase()
    .then(() => {
      console.log('Database initialization completed');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Database initialization failed:', err);
      process.exit(1);
    });
}

module.exports = { initializeDatabase };
