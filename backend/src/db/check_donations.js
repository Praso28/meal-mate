const db = require('../config/db');

const checkDonations = async () => {
  try {
    const { rows } = await db.query("SELECT * FROM donations WHERE foodbank_id = 4 AND (status = 'assigned' OR status = 'in_transit');");
    console.log(rows);
    process.exit(0);
  } catch (error) {
    console.error('Error checking donations:', error);
    process.exit(1);
  }
};

checkDonations();
