-- Sample DML Operations for MealMate Application

-- Insert sample categories
INSERT INTO categories (name, description) VALUES
('Canned Goods', 'Non-perishable canned food items'),
('Grains', 'Rice, pasta, and other grain products'),
('Breakfast', 'Breakfast cereals and related items'),
('Spreads', 'Peanut butter, jelly, and other spreads'),
('Baking', 'Flour, sugar, and other baking ingredients'),
('Oils', 'Cooking oils and related products'),
('Spices', 'Salt, pepper, and other spices'),
('Dairy', 'Milk, cheese, and other dairy products'),
('Produce', 'Fresh fruits and vegetables'),
('Meat', 'Fresh and frozen meat products');

-- Insert sample users (with hashed passwords - 'password123' for all)
INSERT INTO users (email, password, role, name, address, phone, city, state, zip_code) VALUES
('admin@mealmate.com', '$2a$10$XFE0rQyZ5GfZy8xV7XNzI.4C9Wv8/6y8Fxf5yYVXzpMV/mSytYY6W', 'admin', 'Admin User', '123 Admin St', '555-1000', 'Admin City', 'AC', '10000'),
('donor1@example.com', '$2a$10$XFE0rQyZ5GfZy8xV7XNzI.4C9Wv8/6y8Fxf5yYVXzpMV/mSytYY6W', 'donor', 'John Donor', '123 Main St', '555-1001', 'Anytown', 'CA', '12345'),
('volunteer1@example.com', '$2a$10$XFE0rQyZ5GfZy8xV7XNzI.4C9Wv8/6y8Fxf5yYVXzpMV/mSytYY6W', 'volunteer', 'Sarah Helper', '456 Oak Ave', '555-1002', 'Anytown', 'CA', '12345'),
('foodbank1@example.com', '$2a$10$XFE0rQyZ5GfZy8xV7XNzI.4C9Wv8/6y8Fxf5yYVXzpMV/mSytYY6W', 'foodbank', 'Community Food Bank', '789 Food St', '555-1003', 'Anytown', 'CA', '12345'),
('donor2@example.com', '$2a$10$XFE0rQyZ5GfZy8xV7XNzI.4C9Wv8/6y8Fxf5yYVXzpMV/mSytYY6W', 'donor', 'Jane Giver', '234 Elm St', '555-1004', 'Othertown', 'NY', '67890'),
('volunteer2@example.com', '$2a$10$XFE0rQyZ5GfZy8xV7XNzI.4C9Wv8/6y8Fxf5yYVXzpMV/mSytYY6W', 'volunteer', 'Mike Volunteer', '567 Pine Ave', '555-1005', 'Othertown', 'NY', '67890'),
('foodbank2@example.com', '$2a$10$XFE0rQyZ5GfZy8xV7XNzI.4C9Wv8/6y8Fxf5yYVXzpMV/mSytYY6W', 'foodbank', 'Helping Hands Food Bank', '890 Charity Rd', '555-1006', 'Othertown', 'NY', '67890');

-- Insert sample donations
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
    foodbank_id
) VALUES 
(2, 'Canned Vegetables', 'Assorted canned vegetables', 30, 'cans', '2025-12-31', '123 Main St', 'Anytown', 'CA', '12345', 'Ring doorbell', '2025-05-01', '10:00', '12:00', 'pending', NULL, NULL),
(2, 'Rice and Pasta', 'Rice and pasta packages', 20, 'kg', '2025-12-31', '123 Main St', 'Anytown', 'CA', '12345', 'Ring doorbell', '2025-05-02', '14:00', '16:00', 'assigned', 3, 4),
(2, 'Breakfast Cereal', 'Various breakfast cereals', 15, 'boxes', '2025-10-15', '123 Main St', 'Anytown', 'CA', '12345', 'Ring doorbell', '2025-05-03', '10:00', '12:00', 'in_transit', 3, 4),
(2, 'Canned Soup', 'Assorted canned soups', 25, 'cans', '2025-11-30', '123 Main St', 'Anytown', 'CA', '12345', 'Ring doorbell', '2025-05-04', '14:00', '16:00', 'completed', 3, 4),
(5, 'Fresh Produce', 'Fresh fruits and vegetables', 40, 'kg', '2025-05-15', '234 Elm St', 'Othertown', 'NY', '67890', 'Leave at back door', '2025-05-05', '09:00', '11:00', 'pending', NULL, NULL),
(5, 'Baking Supplies', 'Flour, sugar, and other baking items', 15, 'kg', '2025-08-20', '234 Elm St', 'Othertown', 'NY', '67890', 'Leave at back door', '2025-05-06', '13:00', '15:00', 'assigned', 6, 7),
(5, 'Cooking Oil', 'Various cooking oils', 10, 'bottles', '2025-07-10', '234 Elm St', 'Othertown', 'NY', '67890', 'Leave at back door', '2025-05-07', '09:00', '11:00', 'completed', 6, 7);

-- Link donations to categories
INSERT INTO donation_categories (donation_id, category_id) VALUES
(1, 1), -- Canned Vegetables -> Canned Goods
(2, 2), -- Rice and Pasta -> Grains
(3, 3), -- Breakfast Cereal -> Breakfast
(4, 1), -- Canned Soup -> Canned Goods
(5, 9), -- Fresh Produce -> Produce
(6, 5), -- Baking Supplies -> Baking
(7, 6); -- Cooking Oil -> Oils

-- Insert sample inventory items
INSERT INTO inventory (
    foodbank_id,
    name,
    description,
    category_id,
    quantity,
    unit,
    expiry_date,
    storage_location,
    minimum_stock_level,
    maximum_stock_level
) VALUES 
(4, 'Canned Beans', 'Black beans, kidney beans, and pinto beans', 1, 50, 'cans', '2025-12-31', 'Shelf A1', 10, 100),
(4, 'Rice', 'White and brown rice', 2, 100, 'kg', '2025-12-31', 'Shelf B2', 20, 200),
(4, 'Pasta', 'Various types of pasta', 2, 75, 'kg', '2025-12-31', 'Shelf B3', 15, 150),
(4, 'Canned Soup', 'Chicken noodle, tomato, and vegetable soup', 1, 40, 'cans', '2025-10-15', 'Shelf A2', 10, 80),
(7, 'Cereal', 'Various types of cereal', 3, 30, 'boxes', '2025-08-20', 'Shelf C1', 5, 50),
(7, 'Flour', 'All-purpose flour', 5, 50, 'kg', '2025-10-10', 'Shelf E1', 10, 100),
(7, 'Sugar', 'Granulated sugar', 5, 40, 'kg', '2025-12-25', 'Shelf E2', 10, 80);

-- Insert sample notifications
INSERT INTO notifications (user_id, title, message, type, related_id, related_to) VALUES
(2, 'Donation Assigned', 'Your donation "Rice and Pasta" has been assigned to a volunteer.', 'donation_status', 2, 'donations'),
(3, 'New Assignment', 'You have been assigned to pick up donation "Rice and Pasta".', 'donation_status', 2, 'donations'),
(2, 'Donation Completed', 'Your donation "Canned Soup" has been successfully delivered.', 'donation_status', 4, 'donations'),
(3, 'Delivery Confirmed', 'Your delivery of "Canned Soup" has been confirmed.', 'donation_status', 4, 'donations'),
(4, 'New Inventory Alert', 'Inventory item "Canned Soup" is running low.', 'inventory', 4, 'inventory');

-- Sample UPDATE operations
-- Update a user's contact information
UPDATE users
SET phone = '555-1111', address = '124 Updated St', updated_at = CURRENT_TIMESTAMP
WHERE id = 2;

-- Update a donation status
UPDATE donations
SET status = 'in_transit', updated_at = CURRENT_TIMESTAMP
WHERE id = 2;

-- Update inventory quantity
UPDATE inventory
SET quantity = quantity - 5, updated_at = CURRENT_TIMESTAMP
WHERE id = 1;

-- Mark notifications as read
UPDATE notifications
SET read = TRUE
WHERE user_id = 2;

-- Sample DELETE operations
-- Delete a cancelled donation
DELETE FROM donations
WHERE id = 7 AND status = 'completed';

-- Delete expired inventory items
DELETE FROM inventory
WHERE expiry_date < CURRENT_DATE;

-- Sample complex queries
-- Find all donations that need volunteer assignment
SELECT d.*, u.name as donor_name
FROM donations d
JOIN users u ON d.donor_id = u.id
WHERE d.status = 'pending'
AND d.volunteer_id IS NULL
ORDER BY d.pickup_date ASC;

-- Find inventory items that are below minimum stock level
SELECT i.*, u.name as foodbank_name
FROM inventory i
JOIN users u ON i.foodbank_id = u.id
WHERE i.quantity < i.minimum_stock_level
ORDER BY i.quantity ASC;

-- Get donation statistics by month
SELECT 
    DATE_TRUNC('month', created_at) as month,
    COUNT(*) as total_donations,
    SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_donations,
    SUM(quantity) as total_quantity
FROM donations
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month DESC;

-- Get user activity statistics
SELECT 
    u.role,
    COUNT(DISTINCT u.id) as user_count,
    COUNT(DISTINCT d.id) as donation_count
FROM users u
LEFT JOIN donations d ON u.id = d.donor_id
GROUP BY u.role
ORDER BY user_count DESC;
