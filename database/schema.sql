-- MealMate Database Schema

-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS inventory_transactions CASCADE;
DROP TABLE IF EXISTS inventory CASCADE;
DROP TABLE IF EXISTS donation_assignments CASCADE;
DROP TABLE IF EXISTS donation_categories CASCADE;
DROP TABLE IF EXISTS donations CASCADE;
DROP TABLE IF EXISTS food_banks CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS food_categories CASCADE;
DROP TABLE IF EXISTS settings CASCADE;
DROP TABLE IF EXISTS volunteer_assignments CASCADE;

-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('donor', 'volunteer', 'foodbank', 'admin')),
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(50),
    state VARCHAR(50),
    zip_code VARCHAR(20),
    organization_name VARCHAR(100),
    organization_type VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create food_banks table
CREATE TABLE food_banks (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL REFERENCES users(id),
    capacity DECIMAL(10,2) NOT NULL, -- in kg
    current_stock DECIMAL(10,2) DEFAULT 0,
    storage_type VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create food categories table
CREATE TABLE food_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create donations table
CREATE TABLE donations (
    id SERIAL PRIMARY KEY,
    donor_id INTEGER NOT NULL REFERENCES users(id),
    title VARCHAR(100) NOT NULL,
    description TEXT,
    quantity NUMERIC(10, 2) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    expiry_date DATE,
    pickup_address TEXT,
    pickup_city VARCHAR(50),
    pickup_state VARCHAR(50),
    pickup_zip_code VARCHAR(20),
    pickup_instructions TEXT,
    pickup_date DATE,
    pickup_time_start TIME,
    pickup_time_end TIME,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'assigned', 'in_transit', 'completed', 'cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create donation_categories table (junction table)
CREATE TABLE donation_categories (
    donation_id INTEGER REFERENCES donations(id),
    category_id INTEGER REFERENCES food_categories(id),
    PRIMARY KEY (donation_id, category_id)
);

-- Create donation assignments table
CREATE TABLE donation_assignments (
    id SERIAL PRIMARY KEY,
    donation_id INTEGER NOT NULL REFERENCES donations(id),
    volunteer_id INTEGER REFERENCES users(id),
    foodbank_id INTEGER REFERENCES users(id),
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    pickup_time TIMESTAMP,
    delivery_time TIMESTAMP,
    status VARCHAR(20) NOT NULL DEFAULT 'assigned' CHECK (status IN ('assigned', 'in_transit', 'completed', 'cancelled')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create inventory table
CREATE TABLE inventory (
    id SERIAL PRIMARY KEY,
    foodbank_id INTEGER NOT NULL REFERENCES users(id),
    category_id INTEGER REFERENCES food_categories(id),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    quantity NUMERIC(10, 2) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    expiry_date DATE,
    minimum_stock_level NUMERIC(10, 2),
    maximum_stock_level NUMERIC(10, 2),
    storage_location VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create inventory transactions table
CREATE TABLE inventory_transactions (
    id SERIAL PRIMARY KEY,
    inventory_id INTEGER NOT NULL REFERENCES inventory(id),
    donation_id INTEGER REFERENCES donations(id),
    transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN ('donation_in', 'distribution_out', 'adjustment', 'expired')),
    quantity NUMERIC(10, 2) NOT NULL,
    previous_quantity NUMERIC(10, 2) NOT NULL,
    new_quantity NUMERIC(10, 2) NOT NULL,
    notes TEXT,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create notifications table
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    title VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('info', 'success', 'warning', 'error')),
    related_to VARCHAR(20) CHECK (related_to IN ('donation', 'assignment', 'inventory', 'system')),
    related_id INTEGER,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create settings table
CREATE TABLE settings (
    id SERIAL PRIMARY KEY,
    key VARCHAR(50) UNIQUE NOT NULL,
    value TEXT,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default food categories
INSERT INTO food_categories (name, description) VALUES
('Fruits', 'Fresh fruits and fruit products'),
('Vegetables', 'Fresh vegetables and vegetable products'),
('Grains', 'Rice, wheat, oats, and other grain products'),
('Protein', 'Meat, fish, eggs, and other protein sources'),
('Dairy', 'Milk, cheese, yogurt, and other dairy products'),
('Canned Goods', 'Canned fruits, vegetables, soups, and other preserved foods'),
('Dry Goods', 'Pasta, cereal, and other dry packaged foods'),
('Beverages', 'Water, juice, and other non-alcoholic drinks'),
('Snacks', 'Chips, crackers, and other snack foods'),
('Condiments', 'Sauces, spices, and other flavor enhancers'),
('Baby Food', 'Formula, baby food, and other infant nutrition'),
('Other', 'Miscellaneous food items');

-- Insert default settings
INSERT INTO settings (key, value, description) VALUES
('system_name', 'MealMate', 'Name of the system'),
('contact_email', 'support@mealmate.org', 'Support email address'),
('notification_enabled', 'true', 'Whether notifications are enabled'),
('max_donation_days', '30', 'Maximum number of days a donation can be scheduled in advance'),
('min_password_length', '8', 'Minimum password length for users');

-- Create indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_donations_donor_id ON donations(donor_id);
CREATE INDEX idx_donations_status ON donations(status);
CREATE INDEX idx_donation_assignments_donation_id ON donation_assignments(donation_id);
CREATE INDEX idx_donation_assignments_volunteer_id ON donation_assignments(volunteer_id);
CREATE INDEX idx_donation_assignments_foodbank_id ON donation_assignments(foodbank_id);
CREATE INDEX idx_inventory_foodbank_id ON inventory(foodbank_id);
CREATE INDEX idx_inventory_category_id ON inventory(category_id);
CREATE INDEX idx_inventory_expiry_date ON inventory(expiry_date);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_users_modtime
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_food_banks_modtime
    BEFORE UPDATE ON food_banks
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_food_categories_modtime
    BEFORE UPDATE ON food_categories
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_donations_modtime
    BEFORE UPDATE ON donations
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_donation_assignments_modtime
    BEFORE UPDATE ON donation_assignments
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_inventory_modtime
    BEFORE UPDATE ON inventory
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_settings_modtime
    BEFORE UPDATE ON settings
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();