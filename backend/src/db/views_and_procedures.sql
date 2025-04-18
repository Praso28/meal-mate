-- Views and Stored Procedures for MealMate Application

-- View: Active Donations with User Details
CREATE OR REPLACE VIEW active_donations_view AS
SELECT 
    d.id,
    d.title,
    d.description,
    d.quantity,
    d.unit,
    d.status,
    d.pickup_date,
    d.pickup_time_start,
    d.pickup_time_end,
    d.created_at,
    donor.id AS donor_id,
    donor.name AS donor_name,
    donor.phone AS donor_phone,
    vol.id AS volunteer_id,
    vol.name AS volunteer_name,
    vol.phone AS volunteer_phone,
    fb.id AS foodbank_id,
    fb.name AS foodbank_name,
    fb.phone AS foodbank_phone,
    d.pickup_address,
    d.pickup_city,
    d.pickup_state,
    d.pickup_zip_code,
    d.pickup_instructions
FROM 
    donations d
JOIN 
    users donor ON d.donor_id = donor.id
LEFT JOIN 
    users vol ON d.volunteer_id = vol.id
LEFT JOIN 
    users fb ON d.foodbank_id = fb.id
WHERE 
    d.status IN ('pending', 'assigned', 'in_transit')
ORDER BY 
    d.pickup_date ASC;

-- View: Inventory Status
CREATE OR REPLACE VIEW inventory_status_view AS
SELECT 
    i.id,
    i.name,
    i.description,
    i.quantity,
    i.unit,
    i.expiry_date,
    i.storage_location,
    i.minimum_stock_level,
    i.maximum_stock_level,
    u.name AS foodbank_name,
    c.name AS category_name,
    CASE 
        WHEN i.quantity <= i.minimum_stock_level THEN 'Low Stock'
        WHEN i.quantity >= i.maximum_stock_level THEN 'Overstocked'
        ELSE 'Normal'
    END AS stock_status,
    CASE 
        WHEN i.expiry_date IS NOT NULL AND i.expiry_date <= CURRENT_DATE + INTERVAL '7 days' THEN 'Expiring Soon'
        WHEN i.expiry_date IS NOT NULL AND i.expiry_date <= CURRENT_DATE THEN 'Expired'
        ELSE 'Good'
    END AS expiry_status
FROM 
    inventory i
JOIN 
    users u ON i.foodbank_id = u.id
LEFT JOIN 
    categories c ON i.category_id = c.id;

-- View: User Activity Summary
CREATE OR REPLACE VIEW user_activity_summary AS
SELECT 
    u.id,
    u.name,
    u.email,
    u.role,
    u.created_at,
    COUNT(DISTINCT d_donor.id) AS donations_made,
    COUNT(DISTINCT d_vol.id) AS deliveries_completed,
    COUNT(DISTINCT d_fb.id) AS donations_received,
    MAX(d_any.created_at) AS last_activity_date
FROM 
    users u
LEFT JOIN 
    donations d_donor ON u.id = d_donor.donor_id
LEFT JOIN 
    donations d_vol ON u.id = d_vol.volunteer_id AND d_vol.status = 'completed'
LEFT JOIN 
    donations d_fb ON u.id = d_fb.foodbank_id AND d_fb.status = 'completed'
LEFT JOIN 
    donations d_any ON u.id IN (d_any.donor_id, d_any.volunteer_id, d_any.foodbank_id)
GROUP BY 
    u.id, u.name, u.email, u.role, u.created_at;

-- View: Donation Trends
CREATE OR REPLACE VIEW donation_trends_view AS
SELECT 
    DATE_TRUNC('month', created_at) AS month,
    COUNT(*) AS donation_count,
    SUM(quantity) AS total_quantity,
    COUNT(DISTINCT donor_id) AS unique_donors,
    COUNT(DISTINCT foodbank_id) AS unique_foodbanks,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) AS completed_count,
    ROUND(AVG(EXTRACT(EPOCH FROM (updated_at - created_at)) / 3600)::numeric, 2) AS avg_completion_hours
FROM 
    donations
GROUP BY 
    DATE_TRUNC('month', created_at)
ORDER BY 
    month DESC;

-- Stored Procedure: Assign Volunteer to Donation
CREATE OR REPLACE PROCEDURE assign_volunteer_to_donation(
    donation_id INTEGER,
    volunteer_id INTEGER
)
LANGUAGE plpgsql
AS $$
DECLARE
    donation_record donations%ROWTYPE;
BEGIN
    -- Check if donation exists and is in pending status
    SELECT * INTO donation_record FROM donations WHERE id = donation_id;
    
    IF donation_record IS NULL THEN
        RAISE EXCEPTION 'Donation with ID % not found', donation_id;
    END IF;
    
    IF donation_record.status != 'pending' THEN
        RAISE EXCEPTION 'Donation is not in pending status';
    END IF;
    
    -- Check if volunteer exists and is active
    IF NOT EXISTS (SELECT 1 FROM users WHERE id = volunteer_id AND role = 'volunteer' AND is_active = TRUE) THEN
        RAISE EXCEPTION 'Volunteer with ID % not found or not active', volunteer_id;
    END IF;
    
    -- Update the donation
    UPDATE donations
    SET volunteer_id = assign_volunteer_to_donation.volunteer_id,
        status = 'assigned',
        updated_at = CURRENT_TIMESTAMP
    WHERE id = donation_id;
    
    -- Create notifications
    INSERT INTO notifications (user_id, title, message, type, related_id, related_to)
    VALUES (donation_record.donor_id, 'Donation Assigned', 'Your donation has been assigned to a volunteer.', 'donation_status', donation_id, 'donations');
    
    INSERT INTO notifications (user_id, title, message, type, related_id, related_to)
    VALUES (volunteer_id, 'New Assignment', 'You have been assigned to a new donation pickup.', 'donation_status', donation_id, 'donations');
    
    COMMIT;
END;
$$;

-- Stored Procedure: Update Donation Status
CREATE OR REPLACE PROCEDURE update_donation_status(
    donation_id INTEGER,
    new_status VARCHAR
)
LANGUAGE plpgsql
AS $$
DECLARE
    donation_record donations%ROWTYPE;
    valid_statuses VARCHAR[] := ARRAY['pending', 'assigned', 'in_transit', 'completed', 'cancelled'];
BEGIN
    -- Validate status
    IF NOT (new_status = ANY(valid_statuses)) THEN
        RAISE EXCEPTION 'Invalid status: %. Must be one of: %', new_status, array_to_string(valid_statuses, ', ');
    END IF;
    
    -- Check if donation exists
    SELECT * INTO donation_record FROM donations WHERE id = donation_id;
    
    IF donation_record IS NULL THEN
        RAISE EXCEPTION 'Donation with ID % not found', donation_id;
    END IF;
    
    -- Update the donation status
    UPDATE donations
    SET status = new_status,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = donation_id;
    
    COMMIT;
END;
$$;

-- Stored Procedure: Generate Inventory Report
CREATE OR REPLACE FUNCTION generate_inventory_report(foodbank_id INTEGER)
RETURNS TABLE (
    category_name VARCHAR,
    item_count BIGINT,
    total_quantity NUMERIC,
    low_stock_count BIGINT,
    expiring_soon_count BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.name AS category_name,
        COUNT(i.id) AS item_count,
        SUM(i.quantity) AS total_quantity,
        COUNT(CASE WHEN i.quantity <= i.minimum_stock_level THEN 1 END) AS low_stock_count,
        COUNT(CASE WHEN i.expiry_date <= CURRENT_DATE + INTERVAL '7 days' AND i.expiry_date >= CURRENT_DATE THEN 1 END) AS expiring_soon_count
    FROM 
        inventory i
    LEFT JOIN 
        categories c ON i.category_id = c.id
    WHERE 
        i.foodbank_id = generate_inventory_report.foodbank_id
    GROUP BY 
        c.name
    ORDER BY 
        item_count DESC;
END;
$$;

-- Stored Procedure: Calculate User Statistics
CREATE OR REPLACE FUNCTION calculate_user_statistics()
RETURNS TABLE (
    role VARCHAR,
    user_count BIGINT,
    active_last_month BIGINT,
    new_last_month BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.role,
        COUNT(DISTINCT u.id) AS user_count,
        COUNT(DISTINCT CASE WHEN EXISTS (
            SELECT 1 FROM donations d 
            WHERE (d.donor_id = u.id OR d.volunteer_id = u.id OR d.foodbank_id = u.id)
            AND d.updated_at >= CURRENT_DATE - INTERVAL '30 days'
        ) THEN u.id END) AS active_last_month,
        COUNT(DISTINCT CASE WHEN u.created_at >= CURRENT_DATE - INTERVAL '30 days' THEN u.id END) AS new_last_month
    FROM 
        users u
    GROUP BY 
        u.role
    ORDER BY 
        user_count DESC;
END;
$$;
