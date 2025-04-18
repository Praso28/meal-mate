const db = require('../config/db');

const checkSchema = async () => {
  try {
    // Check inventory table columns
    const { rows } = await db.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'inventory';
    `);
    
    console.log('Inventory table columns:', rows);
    
    process.exit(0);
  } catch (error) {
    console.error('Error checking schema:', error);
    process.exit(1);
  }
};

checkSchema();
