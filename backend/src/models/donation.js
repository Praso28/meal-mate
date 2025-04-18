const db = require('../config/db');

class Donation {
    static async create({
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
        categories,
        foodbank_id,
        status = 'pending'
    }) {
        const query = `
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
                foodbank_id,
                status,
                created_at
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, CURRENT_TIMESTAMP)
            RETURNING *
        `;
        const values = [
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
            foodbank_id,
            status
        ];
        const { rows } = await db.query(query, values);
        const donation = rows[0];

        // If categories are provided, add them to the donation_categories table
        if (categories && categories.length > 0) {
            const categoryValues = categories.map(categoryId => {
                return `(${donation.id}, ${categoryId})`;
            }).join(', ');

            const categoryQuery = `
                INSERT INTO donation_categories (donation_id, category_id)
                VALUES ${categoryValues}
                RETURNING *
            `;

            await db.query(categoryQuery);
        }

        return donation;
    }

    static async findById(id) {
        const query = `
            SELECT d.*,
                   u1.name as donor_name,
                   u2.name as volunteer_name,
                   u3.name as foodbank_name
            FROM donations d
            LEFT JOIN users u1 ON d.donor_id = u1.id
            LEFT JOIN users u2 ON d.volunteer_id = u2.id
            LEFT JOIN users u3 ON d.foodbank_id = u3.id
            WHERE d.id = $1
        `;
        const { rows } = await db.query(query, [id]);
        return rows[0];
    }

    static async findByDonor(donorId) {
        const query = `
            SELECT d.*,
                   u1.name as donor_name,
                   u2.name as volunteer_name,
                   u3.name as foodbank_name
            FROM donations d
            LEFT JOIN users u1 ON d.donor_id = u1.id
            LEFT JOIN users u2 ON d.volunteer_id = u2.id
            LEFT JOIN users u3 ON d.foodbank_id = u3.id
            WHERE d.donor_id = $1
            ORDER BY d.created_at DESC
        `;
        const { rows } = await db.query(query, [donorId]);
        return rows;
    }

    static async findByVolunteer(volunteerId) {
        const query = `
            SELECT d.*,
                   u1.name as donor_name,
                   u2.name as volunteer_name,
                   u3.name as foodbank_name
            FROM donations d
            LEFT JOIN users u1 ON d.donor_id = u1.id
            LEFT JOIN users u2 ON d.volunteer_id = u2.id
            LEFT JOIN users u3 ON d.foodbank_id = u3.id
            WHERE d.volunteer_id = $1
            ORDER BY d.created_at DESC
        `;
        const { rows } = await db.query(query, [volunteerId]);
        return rows;
    }

    static async findByFoodBank(foodBankId) {
        const query = `
            SELECT d.*,
                   u1.name as donor_name,
                   u2.name as volunteer_name,
                   u3.name as foodbank_name
            FROM donations d
            LEFT JOIN users u1 ON d.donor_id = u1.id
            LEFT JOIN users u2 ON d.volunteer_id = u2.id
            LEFT JOIN users u3 ON d.foodbank_id = u3.id
            WHERE d.foodbank_id = $1
            ORDER BY d.created_at DESC
        `;
        const { rows } = await db.query(query, [foodBankId]);
        return rows;
    }

    static async getAvailable() {
        const query = `
            SELECT d.*,
                   u1.name as donor_name,
                   u2.name as volunteer_name,
                   u3.name as foodbank_name
            FROM donations d
            LEFT JOIN users u1 ON d.donor_id = u1.id
            LEFT JOIN users u2 ON d.volunteer_id = u2.id
            LEFT JOIN users u3 ON d.foodbank_id = u3.id
            WHERE d.status = 'pending'
            ORDER BY d.created_at DESC
        `;
        const { rows } = await db.query(query);
        return rows;
    }

    static async assignVolunteer(donationId, volunteerId) {
        const query = `
            UPDATE donations
            SET volunteer_id = $2,
                status = 'assigned',
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $1 AND status = 'pending'
            RETURNING *
        `;
        const { rows } = await db.query(query, [donationId, volunteerId]);
        return rows[0];
    }

    static async assignFoodBank(donationId, foodBankId) {
        const query = `
            UPDATE donations
            SET foodbank_id = $2,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $1
            RETURNING *
        `;
        const { rows } = await db.query(query, [donationId, foodBankId]);
        return rows[0];
    }

    static async updateStatus(donationId, status) {
        const validStatuses = ['pending', 'assigned', 'in_transit', 'completed', 'cancelled'];
        if (!validStatuses.includes(status)) {
            throw new Error('Invalid status');
        }

        const query = `
            UPDATE donations
            SET status = $2,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $1
            RETURNING *
        `;
        const { rows } = await db.query(query, [donationId, status]);
        return rows[0];
    }

    static async delete(donationId, userId) {
        const query = `
            DELETE FROM donations
            WHERE id = $1 AND donor_id = $2
            RETURNING *
        `;
        const { rows } = await db.query(query, [donationId, userId]);
        return rows[0];
    }

    static async getStats() {
        const query = `
            SELECT
                COUNT(*) as total_donations,
                COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_donations,
                COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_donations,
                COUNT(CASE WHEN status = 'assigned' THEN 1 END) as in_progress_donations
            FROM donations
        `;
        const { rows } = await db.query(query);
        return rows[0];
    }

    static async getDonorStats(donorId) {
        const query = `
            SELECT
                COUNT(*) as total_donations,
                COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_donations,
                COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_donations,
                COUNT(CASE WHEN status = 'assigned' THEN 1 END) as in_progress_donations
            FROM donations
            WHERE donor_id = $1
        `;
        const { rows } = await db.query(query, [donorId]);
        return rows[0];
    }

    static async getVolunteerStats(volunteerId) {
        const query = `
            SELECT
                COUNT(CASE WHEN status = 'assigned' OR status = 'in_transit' THEN 1 END) as assigned_count,
                COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_count,
                (SELECT COUNT(*) FROM donations WHERE status = 'pending') as available_count
            FROM donations
            WHERE volunteer_id = $1
        `;
        const { rows } = await db.query(query, [volunteerId]);
        return rows[0];
    }

    static async findAll() {
        const query = `
            SELECT d.*,
                   u1.name as donor_name,
                   u2.name as volunteer_name,
                   u3.name as foodbank_name
            FROM donations d
            LEFT JOIN users u1 ON d.donor_id = u1.id
            LEFT JOIN users u2 ON d.volunteer_id = u2.id
            LEFT JOIN users u3 ON d.foodbank_id = u3.id
            ORDER BY d.created_at DESC
        `;
        const { rows } = await db.query(query);
        return rows;
    }

    static async findByStatus(status) {
        const query = `
            SELECT d.*,
                   u1.name as donor_name,
                   u2.name as volunteer_name,
                   u3.name as foodbank_name
            FROM donations d
            LEFT JOIN users u1 ON d.donor_id = u1.id
            LEFT JOIN users u2 ON d.volunteer_id = u2.id
            LEFT JOIN users u3 ON d.foodbank_id = u3.id
            WHERE d.status = $1
            ORDER BY d.created_at DESC
        `;
        const { rows } = await db.query(query, [status]);
        return rows;
    }

    static async update(donationId, donationData) {
        const {
            title, description, quantity, unit, expiry_date,
            pickup_address, pickup_city, pickup_state, pickup_zip_code,
            pickup_instructions, pickup_date, pickup_time_start, pickup_time_end,
            volunteer_id, foodbank_id, status
        } = donationData;

        const query = `
            UPDATE donations
            SET title = COALESCE($1, title),
                description = COALESCE($2, description),
                quantity = COALESCE($3, quantity),
                unit = COALESCE($4, unit),
                expiry_date = COALESCE($5, expiry_date),
                pickup_address = COALESCE($6, pickup_address),
                pickup_city = COALESCE($7, pickup_city),
                pickup_state = COALESCE($8, pickup_state),
                pickup_zip_code = COALESCE($9, pickup_zip_code),
                pickup_instructions = COALESCE($10, pickup_instructions),
                pickup_date = COALESCE($11, pickup_date),
                pickup_time_start = COALESCE($12, pickup_time_start),
                pickup_time_end = COALESCE($13, pickup_time_end),
                volunteer_id = COALESCE($14, volunteer_id),
                foodbank_id = COALESCE($15, foodbank_id),
                status = COALESCE($16, status),
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $17
            RETURNING *
        `;

        const values = [
            title, description, quantity, unit, expiry_date,
            pickup_address, pickup_city, pickup_state, pickup_zip_code,
            pickup_instructions, pickup_date, pickup_time_start, pickup_time_end,
            volunteer_id, foodbank_id, status, donationId
        ];

        const { rows } = await db.query(query, values);
        return rows[0];
    }

    static async findByVolunteerId(volunteerId) {
        const query = `
            SELECT d.*,
                   u1.name as donor_name,
                   u3.name as foodbank_name
            FROM donations d
            LEFT JOIN users u1 ON d.donor_id = u1.id
            LEFT JOIN users u3 ON d.foodbank_id = u3.id
            WHERE d.volunteer_id = $1
            ORDER BY d.created_at DESC
        `;
        const { rows } = await db.query(query, [volunteerId]);
        return rows;
    }

    static async updateStatus(donationId, status) {
        const query = `
            UPDATE donations
            SET status = $1,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $2
            RETURNING *
        `;

        const { rows } = await db.query(query, [status, donationId]);
        return rows[0];
    }

    static async findByFoodBankAndStatus(foodbankId, status) {
        const query = `
            SELECT d.*,
                   u1.name as donor_name,
                   u2.name as volunteer_name
            FROM donations d
            LEFT JOIN users u1 ON d.donor_id = u1.id
            LEFT JOIN users u2 ON d.volunteer_id = u2.id
            WHERE d.foodbank_id = $1 AND d.status = $2
            ORDER BY d.created_at DESC
        `;
        const { rows } = await db.query(query, [foodbankId, status]);
        return rows;
    }

    static async getFoodBankStats(foodbankId) {
        const query = `
            SELECT
                COUNT(*) as total_donations,
                COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_donations,
                COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_donations,
                COUNT(DISTINCT volunteer_id) as assigned_volunteers
            FROM donations
            WHERE foodbank_id = $1
        `;
        const { rows } = await db.query(query, [foodbankId]);
        return rows[0];
    }
}

module.exports = Donation;