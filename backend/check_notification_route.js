const axios = require('axios');
const db = require('./src/config/db');

const checkNotificationRoute = async () => {
  try {
    // First, check if there are any notifications in the database
    const notificationsQuery = `SELECT * FROM notifications LIMIT 5`;
    const notificationsResult = await db.query(notificationsQuery);
    console.log('Notifications in database:', notificationsResult.rows);
    
    // Check if the server is running
    try {
      const response = await axios.get('http://localhost:3000/api/auth/check');
      console.log('Server response:', response.data);
    } catch (error) {
      console.log('Server check error:', error.message);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error checking notification route:', error);
    process.exit(1);
  }
};

checkNotificationRoute();
