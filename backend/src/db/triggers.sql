-- Triggers for MealMate Application

-- Function to update the 'updated_at' timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update the 'updated_at' timestamp for users table
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Trigger to update the 'updated_at' timestamp for donations table
CREATE TRIGGER update_donations_updated_at
BEFORE UPDATE ON donations
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Trigger to update the 'updated_at' timestamp for inventory table
CREATE TRIGGER update_inventory_updated_at
BEFORE UPDATE ON inventory
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Function to log changes to the audit_logs table
CREATE OR REPLACE FUNCTION audit_log_changes()
RETURNS TRIGGER AS $$
DECLARE
    old_row_json JSONB := NULL;
    new_row_json JSONB := NULL;
BEGIN
    IF (TG_OP = 'UPDATE') THEN
        old_row_json = to_jsonb(OLD);
        new_row_json = to_jsonb(NEW);
    ELSIF (TG_OP = 'DELETE') THEN
        old_row_json = to_jsonb(OLD);
    ELSIF (TG_OP = 'INSERT') THEN
        new_row_json = to_jsonb(NEW);
    END IF;

    INSERT INTO audit_logs (
        user_id,
        action,
        table_name,
        record_id,
        old_values,
        new_values,
        ip_address
    ) VALUES (
        CASE 
            WHEN TG_OP = 'INSERT' THEN 
                CASE 
                    WHEN TG_TABLE_NAME = 'users' THEN NEW.id
                    ELSE current_setting('app.current_user_id', TRUE)::INTEGER
                END
            ELSE current_setting('app.current_user_id', TRUE)::INTEGER
        END,
        TG_OP,
        TG_TABLE_NAME,
        CASE
            WHEN TG_OP = 'INSERT' THEN NEW.id
            ELSE OLD.id
        END,
        old_row_json,
        new_row_json,
        current_setting('app.client_ip', TRUE)
    );

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Audit triggers for each table
CREATE TRIGGER audit_users_changes
AFTER INSERT OR UPDATE OR DELETE ON users
FOR EACH ROW EXECUTE FUNCTION audit_log_changes();

CREATE TRIGGER audit_donations_changes
AFTER INSERT OR UPDATE OR DELETE ON donations
FOR EACH ROW EXECUTE FUNCTION audit_log_changes();

CREATE TRIGGER audit_inventory_changes
AFTER INSERT OR UPDATE OR DELETE ON inventory
FOR EACH ROW EXECUTE FUNCTION audit_log_changes();

-- Function to create notifications when donation status changes
CREATE OR REPLACE FUNCTION notify_on_donation_status_change()
RETURNS TRIGGER AS $$
DECLARE
    donor_id INTEGER;
    volunteer_id INTEGER;
    foodbank_id INTEGER;
    donation_title TEXT;
BEGIN
    -- Only proceed if status has changed
    IF (TG_OP = 'INSERT') OR (OLD.status IS DISTINCT FROM NEW.status) THEN
        donor_id := NEW.donor_id;
        volunteer_id := NEW.volunteer_id;
        foodbank_id := NEW.foodbank_id;
        donation_title := NEW.title;
        
        -- Create notifications based on the new status
        CASE NEW.status
            WHEN 'assigned' THEN
                -- Notify donor
                INSERT INTO notifications (user_id, title, message, type, related_id, related_to)
                VALUES (donor_id, 'Donation Assigned', 'Your donation "' || donation_title || '" has been assigned to a volunteer.', 'donation_status', NEW.id, 'donations');
                
                -- Notify volunteer if exists
                IF volunteer_id IS NOT NULL THEN
                    INSERT INTO notifications (user_id, title, message, type, related_id, related_to)
                    VALUES (volunteer_id, 'New Assignment', 'You have been assigned to pick up donation "' || donation_title || '".', 'donation_status', NEW.id, 'donations');
                END IF;
                
            WHEN 'in_transit' THEN
                -- Notify donor
                INSERT INTO notifications (user_id, title, message, type, related_id, related_to)
                VALUES (donor_id, 'Donation In Transit', 'Your donation "' || donation_title || '" is now in transit.', 'donation_status', NEW.id, 'donations');
                
                -- Notify foodbank if exists
                IF foodbank_id IS NOT NULL THEN
                    INSERT INTO notifications (user_id, title, message, type, related_id, related_to)
                    VALUES (foodbank_id, 'Incoming Donation', 'Donation "' || donation_title || '" is on its way to your food bank.', 'donation_status', NEW.id, 'donations');
                END IF;
                
            WHEN 'completed' THEN
                -- Notify donor
                INSERT INTO notifications (user_id, title, message, type, related_id, related_to)
                VALUES (donor_id, 'Donation Completed', 'Your donation "' || donation_title || '" has been successfully delivered.', 'donation_status', NEW.id, 'donations');
                
                -- Notify volunteer if exists
                IF volunteer_id IS NOT NULL THEN
                    INSERT INTO notifications (user_id, title, message, type, related_id, related_to)
                    VALUES (volunteer_id, 'Delivery Confirmed', 'Your delivery of "' || donation_title || '" has been confirmed.', 'donation_status', NEW.id, 'donations');
                END IF;
                
            WHEN 'cancelled' THEN
                -- Notify all parties
                INSERT INTO notifications (user_id, title, message, type, related_id, related_to)
                VALUES (donor_id, 'Donation Cancelled', 'Your donation "' || donation_title || '" has been cancelled.', 'donation_status', NEW.id, 'donations');
                
                IF volunteer_id IS NOT NULL THEN
                    INSERT INTO notifications (user_id, title, message, type, related_id, related_to)
                    VALUES (volunteer_id, 'Assignment Cancelled', 'The assignment for "' || donation_title || '" has been cancelled.', 'donation_status', NEW.id, 'donations');
                END IF;
                
                IF foodbank_id IS NOT NULL THEN
                    INSERT INTO notifications (user_id, title, message, type, related_id, related_to)
                    VALUES (foodbank_id, 'Donation Cancelled', 'The donation "' || donation_title || '" has been cancelled.', 'donation_status', NEW.id, 'donations');
                END IF;
        END CASE;
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger for donation status notifications
CREATE TRIGGER donation_status_notification
AFTER INSERT OR UPDATE ON donations
FOR EACH ROW EXECUTE FUNCTION notify_on_donation_status_change();

-- Function to update inventory when donation is completed
CREATE OR REPLACE FUNCTION update_inventory_on_donation_complete()
RETURNS TRIGGER AS $$
BEGIN
    -- Only proceed if status changed to 'completed'
    IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status <> 'completed') THEN
        -- Check if the donation has a foodbank assigned
        IF NEW.foodbank_id IS NOT NULL THEN
            -- Insert or update inventory based on the donation
            -- First, check if a similar item exists
            DECLARE
                existing_item_id INTEGER;
            BEGIN
                SELECT id INTO existing_item_id
                FROM inventory
                WHERE foodbank_id = NEW.foodbank_id
                AND name ILIKE NEW.title
                LIMIT 1;
                
                IF existing_item_id IS NOT NULL THEN
                    -- Update existing inventory item
                    UPDATE inventory
                    SET quantity = quantity + NEW.quantity,
                        updated_at = CURRENT_TIMESTAMP
                    WHERE id = existing_item_id;
                ELSE
                    -- Create new inventory item
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
                    ) VALUES (
                        NEW.foodbank_id,
                        NEW.title,
                        NEW.description,
                        (SELECT category_id FROM donation_categories WHERE donation_id = NEW.id LIMIT 1),
                        NEW.quantity,
                        NEW.unit,
                        NEW.expiry_date,
                        'New Donation',
                        CURRENT_TIMESTAMP,
                        CURRENT_TIMESTAMP
                    );
                END IF;
            END;
        END IF;
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update inventory when donation is completed
CREATE TRIGGER update_inventory_on_donation_complete
AFTER UPDATE ON donations
FOR EACH ROW EXECUTE FUNCTION update_inventory_on_donation_complete();
