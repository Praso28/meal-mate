const db = require('../config/db');
const bcrypt = require('bcryptjs');

const VALID_ROLES = ['donor', 'volunteer', 'food_bank', 'foodbank', 'admin'];

class User {
    static async create({ email, password, role, name, address, phone }) {
        if (!VALID_ROLES.includes(role)) {
            throw new Error('Invalid role specified');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const query = `
            INSERT INTO users (email, password, role, name, address, phone, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            RETURNING id, email, role, name, address, phone, created_at
        `;
        const values = [email, hashedPassword, role, name, address, phone];
        const { rows } = await db.query(query, values);
        return rows[0];
    }

    static async findByEmail(email) {
        const query = 'SELECT * FROM users WHERE email = $1';
        const { rows } = await db.query(query, [email]);
        return rows[0];
    }

    static async findById(id) {
        const query = 'SELECT * FROM users WHERE id = $1';
        const { rows } = await db.query(query, [id]);
        return rows[0];
    }

    static async findByRole(role) {
        if (!VALID_ROLES.includes(role)) {
            throw new Error('Invalid role specified');
        }

        // Handle both 'foodbank' and 'food_bank' roles
        if (role === 'food_bank') {
            const query = 'SELECT * FROM users WHERE role = $1 OR role = $2';
            const { rows } = await db.query(query, [role, 'foodbank']);
            return rows;
        } else {
            const query = 'SELECT * FROM users WHERE role = $1';
            const { rows } = await db.query(query, [role]);
            return rows;
        }
    }

    static async update(id, userData) {
        const { name, phone, address, city, state, zip_code } = userData;

        const query = `
            UPDATE users
            SET name = COALESCE($1, name),
                phone = COALESCE($2, phone),
                address = COALESCE($3, address),
                city = COALESCE($4, city),
                state = COALESCE($5, state),
                zip_code = COALESCE($6, zip_code),
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $7
            RETURNING id, email, name, role, phone, address, city, state, zip_code
        `;

        const values = [name, phone, address, city, state, zip_code, id];
        const { rows } = await db.query(query, values);
        return rows[0];
    }

    static async updatePassword(id, newPassword) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const query = `
            UPDATE users
            SET password = $1,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $2
            RETURNING id
        `;

        const { rows } = await db.query(query, [hashedPassword, id]);
        return rows[0];
    }

    static async findAll() {
        const query = `
            SELECT id, email, role, name, address, phone, city, state, zip_code, created_at, updated_at, is_active
            FROM users
            ORDER BY created_at DESC
        `;
        const { rows } = await db.query(query);
        return rows;
    }

    static async delete(id) {
        const query = `
            DELETE FROM users
            WHERE id = $1
            RETURNING id
        `;
        const { rows } = await db.query(query, [id]);
        return rows[0];
    }

    static async getStats() {
        const query = `
            SELECT
                COUNT(*) as total_users,
                COUNT(CASE WHEN role = 'donor' THEN 1 END) as donor_count,
                COUNT(CASE WHEN role = 'volunteer' THEN 1 END) as volunteer_count,
                COUNT(CASE WHEN role = 'food_bank' OR role = 'foodbank' THEN 1 END) as foodbank_count,
                COUNT(CASE WHEN role = 'admin' THEN 1 END) as admin_count,
                (SELECT COUNT(DISTINCT volunteer_id) FROM donations WHERE volunteer_id IS NOT NULL) as assigned_volunteer_count
            FROM users
        `;
        const { rows } = await db.query(query);
        return rows[0];
    }
}

module.exports = User;