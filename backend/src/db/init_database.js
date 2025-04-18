const fs = require('fs');
const path = require('path');
const db = require('../config/db');

const initDatabase = async () => {
  try {
    console.log('Initializing database...');
    
    // Read SQL files
    const schemaSQL = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    const triggersSQL = fs.readFileSync(path.join(__dirname, 'triggers.sql'), 'utf8');
    const viewsAndProceduresSQL = fs.readFileSync(path.join(__dirname, 'views_and_procedures.sql'), 'utf8');
    const sampleDMLSQL = fs.readFileSync(path.join(__dirname, 'sample_dml.sql'), 'utf8');
    
    // Execute schema creation
    console.log('Creating database schema...');
    await db.query(schemaSQL);
    console.log('Database schema created successfully.');
    
    // Execute triggers creation
    console.log('Creating triggers...');
    await db.query(triggersSQL);
    console.log('Triggers created successfully.');
    
    // Execute views and procedures creation
    console.log('Creating views and procedures...');
    await db.query(viewsAndProceduresSQL);
    console.log('Views and procedures created successfully.');
    
    // Check if sample data should be loaded
    const loadSampleData = process.env.LOAD_SAMPLE_DATA === 'true';
    if (loadSampleData) {
      console.log('Loading sample data...');
      await db.query(sampleDMLSQL);
      console.log('Sample data loaded successfully.');
    }
    
    console.log('Database initialization completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
};

// Run the initialization
initDatabase();
