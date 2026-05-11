-- =========================
-- SEED DATA
-- =========================

BEGIN;

-- =========================
-- USERS
-- =========================
-- NOTE: Assumes Better Auth manages auth tables (email/password only)
-- No session/account/verification seeding.

INSERT INTO "user"
    (id, name, email, "emailVerified", image, "createdAt", "updatedAt", phone_number, role)
VALUES
    -- Customers
    ('usr_c1', 'Ana Reyes',       'ana.reyes@example.com',    TRUE,  NULL, NOW() - INTERVAL '30 days', NOW() - INTERVAL '30 days', '+639171111001', 'customer'),
    ('usr_c2', 'Ben Santos',      'ben.santos@example.com',   TRUE,  NULL, NOW() - INTERVAL '25 days', NOW() - INTERVAL '25 days', '+639171111002', 'customer'),
    ('usr_c3', 'Carla Dela Cruz', 'carla.dc@example.com',     FALSE, NULL, NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days', '+639171111003', 'customer'),

    -- Vendors
    ('usr_v1', 'Diego Tan',       'diego.tan@example.com',    TRUE,  NULL, NOW() - INTERVAL '60 days', NOW() - INTERVAL '60 days', '+639182222001', 'vendor'),
    ('usr_v2', 'Elena Ocampo',    'elena.ocampo@example.com', TRUE,  NULL, NOW() - INTERVAL '55 days', NOW() - INTERVAL '55 days', '+639182222002', 'vendor'),

    -- Riders
    ('usr_r1', 'Felix Cruz',      'felix.cruz@example.com',   TRUE,  NULL, NOW() - INTERVAL '45 days', NOW() - INTERVAL '45 days', '+639193333001', 'rider'),
    ('usr_r2', 'Grace Lim',       'grace.lim@example.com',    TRUE,  NULL, NOW() - INTERVAL '40 days', NOW() - INTERVAL '40 days', '+639193333002', 'rider')
ON CONFLICT (id) DO NOTHING;


-- =========================
-- STORES
-- =========================
INSERT INTO store
    (store_id, user_id, store_name, store_address, created_at)
VALUES
    ('str_v1', 'usr_v1', 'Diego''s Karinderya', 'Blk 3 Lot 5, Purok 2, Sto. Tomas, Angeles City', NOW() - INTERVAL '58 days'),
    ('str_v2', 'usr_v2', 'Elena''s Bakeshop',   '22 MacArthur Highway, Balibago, Angeles City',    NOW() - INTERVAL '53 days')
ON CONFLICT (store_id) DO NOTHING;


-- =========================
-- STORE ITEMS
-- =========================
INSERT INTO store_item
    (store_item_id, store_id, name, description, price, is_available, image_url, created_at)
VALUES
    ('itm_v1_01', 'str_v1', 'Adobong Manok',     'Classic chicken adobo with garlic fried rice',   85.00, TRUE,  NULL, NOW() - INTERVAL '58 days'),
    ('itm_v1_02', 'str_v1', 'Sinigang na Baboy', 'Pork ribs in sour tamarind broth with veggies', 110.00, TRUE,  NULL, NOW() - INTERVAL '58 days'),
    ('itm_v1_03', 'str_v1', 'Lechon Kawali',     'Crispy deep-fried pork belly',                   95.00, TRUE,  NULL, NOW() - INTERVAL '58 days'),
    ('itm_v1_04', 'str_v1', 'Pork BBQ (1 stick)','Grilled marinated pork skewer',                  25.00, TRUE,  NULL, NOW() - INTERVAL '58 days'),
    ('itm_v1_05', 'str_v1', 'Buko Juice',        'Fresh young coconut juice (large)',               40.00, FALSE, NULL, NOW() - INTERVAL '30 days'),

    ('itm_v2_01', 'str_v2', 'Pandesal (dozen)', 'Freshly baked soft bread rolls',            60.00, TRUE, NULL, NOW() - INTERVAL '53 days'),
    ('itm_v2_02', 'str_v2', 'Ensaymada',        'Soft brioche topped with butter and sugar', 35.00, TRUE, NULL, NOW() - INTERVAL '53 days'),
    ('itm_v2_03', 'str_v2', 'Leche Flan',       'Classic creamy caramel custard',            55.00, TRUE, NULL, NOW() - INTERVAL '53 days'),
    ('itm_v2_04', 'str_v2', 'Ube Bread Loaf',   'Purple yam flavored sliced loaf bread',     95.00, TRUE, NULL, NOW() - INTERVAL '40 days'),
    ('itm_v2_05', 'str_v2', 'Puto Cheese',      'Steamed rice cake topped with cheddar',     10.00, TRUE, NULL, NOW() - INTERVAL '40 days')
ON CONFLICT (store_item_id) DO NOTHING;


-- =========================
-- ORDERS
-- =========================
INSERT INTO "order"
    (order_id, customer_id, store_id, rider_id, status, payment_method, delivery_address, created_at, updated_at)
VALUES
    ('ord_001', 'usr_c1', 'str_v1', 'usr_r1', 'delivered', 'gcash', 'Unit 4B, Villa Residences, Sto. Tomas, Angeles City', NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days'),
    ('ord_002', 'usr_c2', 'str_v2', 'usr_r2', 'delivered', 'cash',  '18 Mabalacat St., Balibago, Angeles City',            NOW() - INTERVAL '8 days',  NOW() - INTERVAL '8 days'),
    ('ord_003', 'usr_c1', 'str_v2', 'usr_r2', 'picked_up', 'gcash', 'Unit 4B, Villa Residences, Sto. Tomas, Angeles City', NOW() - INTERVAL '20 minutes', NOW() - INTERVAL '10 minutes'),
    ('ord_004', 'usr_c2', 'str_v1', 'usr_r1', 'accepted',  'cash',  '18 Mabalacat St., Balibago, Angeles City',            NOW() - INTERVAL '15 minutes', NOW() - INTERVAL '12 minutes'),
    ('ord_005', 'usr_c3', 'str_v1', NULL,      'open',      'gcash', '101 Friendship Highway, Angeles City',               NOW() - INTERVAL '5 minutes',  NOW() - INTERVAL '5 minutes'),
    ('ord_006', 'usr_c2', 'str_v2', NULL,      'cancelled', 'cash',  '18 Mabalacat St., Balibago, Angeles City',            NOW() - INTERVAL '3 days',     NOW() - INTERVAL '3 days')
ON CONFLICT (order_id) DO NOTHING;


-- =========================
-- ORDER ITEMS
-- =========================
INSERT INTO order_item
    (order_item_id, order_id, store_item_id, price_snapshot, quantity)
VALUES
    ('oi_001_01', 'ord_001', 'itm_v1_01',  85.00, 2),
    ('oi_001_02', 'ord_001', 'itm_v1_05',  40.00, 1),

    ('oi_002_01', 'ord_002', 'itm_v2_01',  60.00, 1),
    ('oi_002_02', 'ord_002', 'itm_v2_03',  55.00, 2),

    ('oi_003_01', 'ord_003', 'itm_v2_02',  35.00, 3),
    ('oi_003_02', 'ord_003', 'itm_v2_04',  95.00, 1),

    ('oi_004_01', 'ord_004', 'itm_v1_02', 110.00, 1),
    ('oi_004_02', 'ord_004', 'itm_v1_04',  25.00, 4),

    ('oi_005_01', 'ord_005', 'itm_v1_03',  95.00, 1),
    ('oi_005_02', 'ord_005', 'itm_v1_01',  85.00, 1),

    ('oi_006_01', 'ord_006', 'itm_v2_05',  10.00, 10)
ON CONFLICT (order_item_id) DO NOTHING;

COMMIT;
