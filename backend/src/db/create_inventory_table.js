const db = require('../config/db');

const createInventoryTable = async () => {
  try {
    // Create inventory table
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS inventory (
        id SERIAL PRIMARY KEY,
        foodbank_id INTEGER NOT NULL REFERENCES users(id),
        item_name VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        quantity INTEGER NOT NULL,
        unit VARCHAR(50) NOT NULL,
        expiry_date DATE,
        notes TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    await db.query(createTableQuery);
    console.log('Inventory table created successfully');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating inventory table:', error);
    process.exit(1);
  }
};

createInventoryTable();
