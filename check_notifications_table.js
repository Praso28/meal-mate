const db = require('./src/config/db');

const checkNotificationsTable = async () => {
  try {
    // Check if notifications table exists
    const tableQuery = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'notifications'
      );
    `;
    const tableResult = await db.query(tableQuery);
    console.log('Notifications table exists:', tableResult.rows[0].exists);
    
    if (tableResult.rows[0].exists) {
      // Get columns
      const columnsQuery = `
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'notifications'
        ORDER BY ordinal_position;
      `;
      const columnsResult = await db.query(columnsQuery);
      console.log('Notifications table columns:', columnsResult.rows);
    } else {
      // Create the table
      console.log('Creating notifications table...');
      const createTableQuery = `
        CREATE TABLE notifications (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id),
          title VARCHAR(255) NOT NULL,
          message TEXT NOT NULL,
          type VARCHAR(50) NOT NULL,
          read BOOLEAN DEFAULT FALSE,
          related_id INTEGER,
          related_to VARCHAR(50),
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
      `;
      await db.query(createTableQuery);
      console.log('Notifications table created successfully');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error checking notifications table:', error);
    process.exit(1);
  }
};

checkNotificationsTable();
