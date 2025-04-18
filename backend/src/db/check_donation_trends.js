const db = require('../config/db');

const checkDonationTrends = async () => {
  try {
    const { rows } = await db.query(`
      SELECT 
        DATE_TRUNC('month', created_at) as month,
        COUNT(*) as count
      FROM donations
      WHERE foodbank_id = 4
      GROUP BY month
      ORDER BY month
    `);
    console.log(rows);
    process.exit(0);
  } catch (error) {
    console.error('Error checking donation trends:', error);
    process.exit(1);
  }
};

checkDonationTrends();
