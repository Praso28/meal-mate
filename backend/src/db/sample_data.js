const db = require('../config/db');

const addSampleData = async () => {
  try {
    // Add sample donations with different statuses
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
      (2, 'Fresh Vegetables', 'Assorted fresh vegetables', 30, 'kg', '2025-05-15', '123 Main St', 'Anytown', 'CA', '12345', 'Ring doorbell', '2025-05-01', '10:00', '12:00', 'pending', NULL, NULL, CURRENT_TIMESTAMP - INTERVAL '10 days'),
      (2, 'Canned Goods', 'Assorted canned goods', 50, 'cans', '2025-06-15', '123 Main St', 'Anytown', 'CA', '12345', 'Ring doorbell', '2025-05-02', '14:00', '16:00', 'assigned', 3, 4, CURRENT_TIMESTAMP - INTERVAL '9 days'),
      (2, 'Pasta and Rice', 'Pasta and rice packages', 40, 'kg', '2025-07-15', '123 Main St', 'Anytown', 'CA', '12345', 'Ring doorbell', '2025-05-03', '10:00', '12:00', 'in_transit', 3, 4, CURRENT_TIMESTAMP - INTERVAL '8 days'),
      (2, 'Bread', 'Fresh bread loaves', 20, 'loaves', '2025-05-10', '123 Main St', 'Anytown', 'CA', '12345', 'Ring doorbell', '2025-05-04', '14:00', '16:00', 'completed', 3, 4, CURRENT_TIMESTAMP - INTERVAL '7 days'),
      (2, 'Milk', 'Fresh milk', 15, 'liters', '2025-05-20', '123 Main St', 'Anytown', 'CA', '12345', 'Ring doorbell', '2025-05-05', '10:00', '12:00', 'completed', 3, 4, CURRENT_TIMESTAMP - INTERVAL '6 days'),
      (2, 'Cereal', 'Breakfast cereal boxes', 25, 'boxes', '2025-06-20', '123 Main St', 'Anytown', 'CA', '12345', 'Ring doorbell', '2025-05-06', '14:00', '16:00', 'completed', 3, 4, CURRENT_TIMESTAMP - INTERVAL '5 days'),
      (2, 'Fruits', 'Assorted fresh fruits', 35, 'kg', '2025-05-25', '123 Main St', 'Anytown', 'CA', '12345', 'Ring doorbell', '2025-05-07', '10:00', '12:00', 'pending', NULL, NULL, CURRENT_TIMESTAMP - INTERVAL '4 days'),
      (2, 'Juice', 'Fruit juice bottles', 30, 'bottles', '2025-06-25', '123 Main St', 'Anytown', 'CA', '12345', 'Ring doorbell', '2025-05-08', '14:00', '16:00', 'pending', NULL, NULL, CURRENT_TIMESTAMP - INTERVAL '3 days'),
      (2, 'Eggs', 'Fresh eggs', 20, 'dozen', '2025-05-30', '123 Main St', 'Anytown', 'CA', '12345', 'Ring doorbell', '2025-05-09', '10:00', '12:00', 'assigned', 3, 4, CURRENT_TIMESTAMP - INTERVAL '2 days'),
      (2, 'Cheese', 'Assorted cheese', 15, 'kg', '2025-06-30', '123 Main St', 'Anytown', 'CA', '12345', 'Ring doorbell', '2025-05-10', '14:00', '16:00', 'in_transit', 3, 4, CURRENT_TIMESTAMP - INTERVAL '1 day')
    `;
    
    await db.query(donationsQuery);
    console.log('Sample donations added successfully');
    
    process.exit(0);
  } catch (error) {
    console.error('Error adding sample data:', error);
    process.exit(1);
  }
};

addSampleData();
