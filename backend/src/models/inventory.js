const db = require('../config/db');

class Inventory {
    static async create({ foodbank_id, name, description, category_id, quantity, unit, expiry_date, storage_location }) {
        const query = `
            INSERT INTO inventory (foodbank_id, name, description, category_id, quantity, unit, expiry_date, storage_location, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            RETURNING *
        `;
        const values = [foodbank_id, name, description, category_id, quantity, unit, expiry_date, storage_location];
        const { rows } = await db.query(query, values);
        return rows[0];
    }

    static async findByFoodbank(foodbankId) {
        const query = `
            SELECT *
            FROM inventory
            WHERE foodbank_id = $1
            ORDER BY created_at DESC
        `;
        const { rows } = await db.query(query, [foodbankId]);
        return rows;
    }

    static async findById(id) {
        const query = `
            SELECT *
            FROM inventory
            WHERE id = $1
        `;
        const { rows } = await db.query(query, [id]);
        return rows[0];
    }

    static async update(id, { item_name, category, quantity, unit, expiry_date, notes }) {
        const query = `
            UPDATE inventory
            SET item_name = COALESCE($1, item_name),
                category = COALESCE($2, category),
                quantity = COALESCE($3, quantity),
                unit = COALESCE($4, unit),
                expiry_date = COALESCE($5, expiry_date),
                notes = COALESCE($6, notes),
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $7
            RETURNING *
        `;
        const values = [item_name, category, quantity, unit, expiry_date, notes, id];
        const { rows } = await db.query(query, values);
        return rows[0];
    }

    static async delete(id) {
        const query = `
            DELETE FROM inventory
            WHERE id = $1
            RETURNING *
        `;
        const { rows } = await db.query(query, [id]);
        return rows[0];
    }

    static async getLowStockItems(foodbankId, threshold = 10) {
        const query = `
            SELECT *
            FROM inventory
            WHERE foodbank_id = $1 AND quantity <= $2
            ORDER BY quantity ASC
        `;
        const { rows } = await db.query(query, [foodbankId, threshold]);
        return rows;
    }

    static async getExpiringItems(foodbankId, days = 7) {
        const query = `
            SELECT *
            FROM inventory
            WHERE foodbank_id = $1
            AND expiry_date IS NOT NULL
            AND expiry_date <= CURRENT_DATE + INTERVAL '${days} days'
            ORDER BY expiry_date ASC
        `;
        const { rows } = await db.query(query, [foodbankId]);
        return rows;
    }

    static async getInventoryStats(foodbankId) {
        const query = `
            SELECT
                COUNT(*) as total_items,
                SUM(quantity) as total_quantity,
                COUNT(CASE WHEN quantity <= 10 THEN 1 END) as low_stock_count,
                COUNT(CASE WHEN expiry_date <= CURRENT_DATE + INTERVAL '7 days' AND expiry_date >= CURRENT_DATE THEN 1 END) as expiring_soon_count
            FROM inventory
            WHERE foodbank_id = $1
        `;
        const { rows } = await db.query(query, [foodbankId]);
        return rows[0];
    }

    static async getCategoryBreakdown(foodbankId) {
        const query = `
            SELECT
                category,
                COUNT(*) as item_count,
                SUM(quantity) as total_quantity
            FROM inventory
            WHERE foodbank_id = $1
            GROUP BY category
            ORDER BY total_quantity DESC
        `;
        const { rows } = await db.query(query, [foodbankId]);
        return rows;
    }
}

module.exports = Inventory;