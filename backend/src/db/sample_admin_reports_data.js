const db = require('../config/db');

const addSampleAdminReportsData = async () => {
  try {
    // Add more donations with different statuses to improve report data
    const donationsQuery = `
      INSERT INTO donations (
        donor_id, 
        title, 
        description, 
        quantity, 
        unit, 
        expiry_date, 
        pickup_address, 
        pickup_city, 
        pickup_state, 
        pickup_zip_code, 
        pickup_instructions, 
        pickup_date, 
        pickup_time_start, 
        pickup_time_end, 
        status, 
        volunteer_id, 
        foodbank_id,
        created_at
      ) VALUES 
      (2, 'Canned Goods Donation', 'Various canned goods', 40, 'cans', '2025-06-30', '456 Oak St', 'Anytown', 'CA', '12345', 'Leave at front door', '2025-05-15', '09:00', '11:00', 'completed', 3, 4, CURRENT_TIMESTAMP - INTERVAL '60 days'),
      (2, 'Fresh Produce', 'Fresh vegetables and fruits', 25, 'kg', '2025-05-25', '456 Oak St', 'Anytown', 'CA', '12345', 'Leave at front door', '2025-05-16', '13:00', '15:00', 'completed', 3, 4, CURRENT_TIMESTAMP - INTERVAL '55 days'),
      (2, 'Dairy Products', 'Milk and cheese', 15, 'liters', '2025-05-20', '456 Oak St', 'Anytown', 'CA', '12345', 'Leave at front door', '2025-05-17', '10:00', '12:00', 'completed', 3, 4, CURRENT_TIMESTAMP - INTERVAL '50 days'),
      (2, 'Bread and Pastries', 'Fresh bread and pastries', 30, 'items', '2025-05-18', '456 Oak St', 'Anytown', 'CA', '12345', 'Leave at front door', '2025-05-18', '14:00', '16:00', 'completed', 3, 4, CURRENT_TIMESTAMP - INTERVAL '45 days'),
      (2, 'Baby Food', 'Assorted baby food jars', 50, 'jars', '2025-07-15', '456 Oak St', 'Anytown', 'CA', '12345', 'Leave at front door', '2025-05-19', '09:00', '11:00', 'completed', 3, 4, CURRENT_TIMESTAMP - INTERVAL '40 days'),
      (2, 'Pasta and Rice', 'Dry pasta and rice', 35, 'kg', '2025-08-20', '456 Oak St', 'Anytown', 'CA', '12345', 'Leave at front door', '2025-05-20', '13:00', '15:00', 'assigned', 3, 4, CURRENT_TIMESTAMP - INTERVAL '35 days'),
      (2, 'Cooking Oil', 'Vegetable and olive oil', 20, 'bottles', '2025-09-10', '456 Oak St', 'Anytown', 'CA', '12345', 'Leave at front door', '2025-05-21', '10:00', '12:00', 'assigned', 3, 4, CURRENT_TIMESTAMP - INTERVAL '30 days'),
      (2, 'Canned Soup', 'Various canned soups', 45, 'cans', '2025-07-25', '456 Oak St', 'Anytown', 'CA', '12345', 'Leave at front door', '2025-05-22', '14:00', '16:00', 'assigned', 3, 4, CURRENT_TIMESTAMP - INTERVAL '25 days'),
      (2, 'Breakfast Cereal', 'Assorted breakfast cereals', 25, 'boxes', '2025-08-15', '456 Oak St', 'Anytown', 'CA', '12345', 'Leave at front door', '2025-05-23', '09:00', '11:00', 'pending', NULL, NULL, CURRENT_TIMESTAMP - INTERVAL '20 days'),
      (2, 'Snack Foods', 'Assorted snacks', 30, 'packages', '2025-09-05', '456 Oak St', 'Anytown', 'CA', '12345', 'Leave at front door', '2025-05-24', '13:00', '15:00', 'pending', NULL, NULL, CURRENT_TIMESTAMP - INTERVAL '15 days'),
      (2, 'Frozen Meals', 'Assorted frozen meals', 20, 'meals', '2025-07-20', '456 Oak St', 'Anytown', 'CA', '12345', 'Leave at front door', '2025-05-25', '10:00', '12:00', 'pending', NULL, NULL, CURRENT_TIMESTAMP - INTERVAL '10 days'),
      (2, 'Condiments', 'Assorted condiments', 15, 'bottles', '2025-08-30', '456 Oak St', 'Anytown', 'CA', '12345', 'Leave at front door', '2025-05-26', '14:00', '16:00', 'pending', NULL, NULL, CURRENT_TIMESTAMP - INTERVAL '5 days')
    `;
    
    await db.query(donationsQuery);
    console.log('Sample admin reports data added successfully');
    
    process.exit(0);
  } catch (error) {
    console.error('Error adding sample admin reports data:', error);
    process.exit(1);
  }
};

addSampleAdminReportsData();
