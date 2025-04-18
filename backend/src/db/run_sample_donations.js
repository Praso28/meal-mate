const fs = require('fs');
const path = require('path');
const db = require('../config/db');

const runSampleDonations = async () => {
  try {
    const sqlFilePath = path.join(__dirname, 'sample_donations.sql');
    const sql = fs.readFileSync(sqlFilePath, 'utf8');
    
    await db.query(sql);
    console.log('Sample donations added successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error adding sample donations:', error);
    process.exit(1);
  }
};

runSampleDonations();
