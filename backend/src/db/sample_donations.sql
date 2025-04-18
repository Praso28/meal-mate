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
(2, 'Fresh Apples', 'Red delicious apples', 50, 'kg', '2025-05-01', '123 Main St', 'Anytown', 'CA', '12345', 'Ring the doorbell', '2025-04-25', '10:00', '12:00', 'assigned', 3, 4),
(2, 'Canned Soup', 'Assorted canned soups', 100, 'cans', '2025-06-01', '456 Oak St', 'Anytown', 'CA', '12345', 'Call when arriving', '2025-04-26', '14:00', '16:00', 'in_transit', 3, 4);
