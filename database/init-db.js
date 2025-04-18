const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../backend/.env') });

// Create a PostgreSQL connection pool
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'mealmate',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
});

/**
 * Initialize the database with schema
 */
async function initializeDatabase() {
  try {
    console.log('Initializing database...');

    // Read the schema file
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    console.log('Database connection parameters:', {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || '5432',
      database: process.env.DB_NAME || 'mealmate',
      user: process.env.DB_USER || 'postgres'
    });

    // Execute the schema
    await pool.query(schema);

    console.log('Database schema initialized successfully');

    // Create admin user
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const adminResult = await pool.query(
      `INSERT INTO users (name, email, password, role, is_active)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (email) DO NOTHING
       RETURNING id`,
      ['Admin User', 'admin@mealmate.org', hashedPassword, 'admin', true]
    );

    if (adminResult.rows.length > 0) {
      console.log('Admin user created successfully');
    } else {
      console.log('Admin user already exists');
    }

    // Create sample users for testing
    if (process.env.NODE_ENV === 'development') {
      const samplePassword = await bcrypt.hash('password123', 10);

      // Create donor user
      await pool.query(
        `INSERT INTO users (name, email, password, role, phone, address, city, state, zip_code, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         ON CONFLICT (email) DO NOTHING`,
        ['John Donor', 'donor@example.com', samplePassword, 'donor', '555-123-4567', '123 Main St', 'Anytown', 'CA', '12345', true]
      );

      // Create volunteer user
      await pool.query(
        `INSERT INTO users (name, email, password, role, phone, address, city, state, zip_code, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         ON CONFLICT (email) DO NOTHING`,
        ['Jane Volunteer', 'volunteer@example.com', samplePassword, 'volunteer', '555-987-6543', '456 Oak Ave', 'Anytown', 'CA', '12345', true]
      );

      // Create foodbank user
      const foodbankResult = await pool.query(
        `INSERT INTO users (name, email, password, role, phone, address, city, state, zip_code, organization_name, organization_type, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
         ON CONFLICT (email) DO NOTHING
         RETURNING id`,
        ['Community Foodbank', 'foodbank@example.com', samplePassword, 'foodbank', '555-789-0123', '789 Elm St', 'Anytown', 'CA', '12345', 'Community Food Bank', 'Non-profit', true]
      );

      // Create foodbank entry if user was created
      if (foodbankResult.rows.length > 0) {
        const foodbankId = foodbankResult.rows[0].id;
        await pool.query(
          `INSERT INTO food_banks (user_id, capacity, current_stock, storage_type)
           VALUES ($1, $2, $3, $4)`,
          [foodbankId, 5000.00, 0.00, 'Refrigerated and Dry Storage']
        );
      }

      console.log('Sample users created successfully');
    }

    console.log('Database initialization completed');
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
      console.log('Database initialization completed successfully');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Database initialization failed:', err);
      process.exit(1);
    });
}

module.exports = { initializeDatabase };