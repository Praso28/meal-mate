const db = require('../config/db');

const addSampleInventoryData = async () => {
  try {
    // Add sample inventory items for foodbank (ID 4)
    const inventoryQuery = `
      INSERT INTO inventory (
        foodbank_id,
        name,
        description,
        category_id,
        quantity,
        unit,
        expiry_date,
        storage_location,
        created_at,
        updated_at
      ) VALUES
      (4, 'Canned Beans', 'Black beans, kidney beans, and pinto beans', 1, 50, 'cans', '2025-12-31', 'Shelf A1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (4, 'Rice', 'White and brown rice', 2, 100, 'kg', '2025-12-31', 'Shelf B2', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (4, 'Pasta', 'Various types of pasta', 2, 75, 'kg', '2025-12-31', 'Shelf B3', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (4, 'Canned Soup', 'Chicken noodle, tomato, and vegetable soup', 1, 40, 'cans', '2025-10-15', 'Shelf A2', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (4, 'Cereal', 'Various types of cereal', 3, 30, 'boxes', '2025-08-20', 'Shelf C1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (4, 'Peanut Butter', 'Creamy and crunchy', 4, 25, 'jars', '2025-11-10', 'Shelf D1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (4, 'Jelly', 'Grape and strawberry', 4, 20, 'jars', '2025-09-05', 'Shelf D2', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (4, 'Canned Vegetables', 'Corn, green beans, and peas', 1, 60, 'cans', '2025-12-15', 'Shelf A3', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (4, 'Canned Fruit', 'Peaches, pears, and mixed fruit', 1, 45, 'cans', '2025-11-20', 'Shelf A4', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (4, 'Flour', 'All-purpose flour', 5, 50, 'kg', '2025-10-10', 'Shelf E1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (4, 'Sugar', 'Granulated sugar', 5, 40, 'kg', '2025-12-25', 'Shelf E2', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (4, 'Cooking Oil', 'Vegetable and canola oil', 6, 30, 'bottles', '2025-09-15', 'Shelf F1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (4, 'Salt', 'Table salt', 7, 20, 'containers', '2026-12-31', 'Shelf G1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (4, 'Pepper', 'Black pepper', 7, 15, 'containers', '2026-12-31', 'Shelf G2', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (4, 'Canned Tuna', 'Tuna in water', 1, 35, 'cans', '2025-08-10', 'Shelf A5', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `;

    await db.query(inventoryQuery);
    console.log('Sample inventory data added successfully');

    process.exit(0);
  } catch (error) {
    console.error('Error adding sample inventory data:', error);
    process.exit(1);
  }
};

addSampleInventoryData();
