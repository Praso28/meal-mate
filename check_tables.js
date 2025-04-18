const db = require('./src/config/db');

const checkTables = async () => {
  try {
    // Get all tables
    const tablesQuery = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = current_schema() 
      AND table_type = 'BASE TABLE';
    `;
    
    const { rows: tables } = await db.query(tablesQuery);
    console.log('Tables:', tables);
    
    // For each table, get its columns
    for (const table of tables) {
      const columnsQuery = `
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = $1
        ORDER BY ordinal_position;
      `;
      
      const { rows: columns } = await db.query(columnsQuery, [table.table_name]);
      console.log(`\nTable: ${table.table_name}`);
      console.log('Columns:', columns);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error checking tables:', error);
    process.exit(1);
  }
};

checkTables();
