-- First drop dependent tables that reference users
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS volunteer_assignments;
DROP TABLE IF EXISTS donation_categories;
DROP TABLE IF EXISTS donations;
DROP TABLE IF EXISTS food_banks;
DROP TABLE IF EXISTS users;

-- Recreate users table with all required columns
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('donor', 'volunteer', 'food_bank', 'admin')),
    address TEXT,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create required indexes
CREATE INDEX idx_users_email ON users(email);

-- Recreate other tables that depend on users
-- food_banks table
CREATE TABLE food_banks (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    contact_number VARCHAR(20) NOT NULL,
    capacity DECIMAL(10,2) NOT NULL,
    current_stock DECIMAL(10,2) DEFAULT 0,
    user_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- donations table
CREATE TABLE donations (
    id SERIAL PRIMARY KEY,
    donor_id INTEGER REFERENCES users(id),
    volunteer_id INTEGER REFERENCES users(id),
    foodbank_id INTEGER REFERENCES users(id),
    description TEXT NOT NULL,
    quantity VARCHAR(255) NOT NULL,
    expiry_date DATE NOT NULL,
    pickup_address TEXT NOT NULL,
    pickup_instructions TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'pending' 
        CHECK (status IN ('pending', 'assigned', 'picked_up', 'delivered', 'completed', 'cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- volunteer_assignments table
CREATE TABLE volunteer_assignments (
    id SERIAL PRIMARY KEY,
    volunteer_id INTEGER REFERENCES users(id),
    donation_id INTEGER REFERENCES donations(id),
    status VARCHAR(50) NOT NULL CHECK (status IN ('pending', 'accepted', 'completed', 'cancelled')),
    pickup_time TIMESTAMP,
    delivery_time TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- notifications table
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);