-- Database Schema for MealMate Application
-- This schema follows Third Normal Form (3NF)

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('donor', 'volunteer', 'food_bank', 'foodbank', 'admin')),
    name VARCHAR(255) NOT NULL,
    address TEXT,
    phone VARCHAR(20),
    city VARCHAR(100),
    state VARCHAR(50),
    zip_code VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Donations Table
CREATE TABLE IF NOT EXISTS donations (
    id SERIAL PRIMARY KEY,
    donor_id INTEGER NOT NULL REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    quantity INTEGER NOT NULL,
    unit VARCHAR(50) NOT NULL,
    expiry_date DATE,
    pickup_address TEXT NOT NULL,
    pickup_city VARCHAR(100),
    pickup_state VARCHAR(50),
    pickup_zip_code VARCHAR(20),
    pickup_instructions TEXT,
    pickup_date DATE NOT NULL,
    pickup_time_start TIME NOT NULL,
    pickup_time_end TIME NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('pending', 'assigned', 'in_transit', 'completed', 'cancelled')),
    volunteer_id INTEGER REFERENCES users(id),
    foodbank_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Donation Categories (Junction Table for Many-to-Many Relationship)
CREATE TABLE IF NOT EXISTS donation_categories (
    id SERIAL PRIMARY KEY,
    donation_id INTEGER NOT NULL REFERENCES donations(id) ON DELETE CASCADE,
    category_id INTEGER NOT NULL REFERENCES categories(id),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(donation_id, category_id)
);

-- Inventory Table
CREATE TABLE IF NOT EXISTS inventory (
    id SERIAL PRIMARY KEY,
    foodbank_id INTEGER NOT NULL REFERENCES users(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category_id INTEGER REFERENCES categories(id),
    quantity INTEGER NOT NULL,
    unit VARCHAR(50) NOT NULL,
    expiry_date DATE,
    storage_location VARCHAR(100),
    minimum_stock_level INTEGER,
    maximum_stock_level INTEGER,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
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

-- Audit Log Table
CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    action VARCHAR(50) NOT NULL,
    table_name VARCHAR(50) NOT NULL,
    record_id INTEGER,
    old_values JSONB,
    new_values JSONB,
    ip_address VARCHAR(50),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Comments on tables to document their purpose
COMMENT ON TABLE users IS 'Stores all user accounts including donors, volunteers, food banks, and admins';
COMMENT ON TABLE categories IS 'Food categories for donations and inventory items';
COMMENT ON TABLE donations IS 'Food donations from donors to food banks';
COMMENT ON TABLE donation_categories IS 'Junction table linking donations to their categories';
COMMENT ON TABLE inventory IS 'Inventory items stored at food banks';
COMMENT ON TABLE notifications IS 'User notifications for various events';
COMMENT ON TABLE audit_logs IS 'Audit trail for tracking changes to data';
