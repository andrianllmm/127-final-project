-- =========================
-- SEED DATA (idempotent)
-- =========================
-- Safe to run multiple times — every INSERT uses
-- ON CONFLICT DO NOTHING keyed on each table's PRIMARY KEY.
--
-- Covers: user, session, account, verification,
--         store, store_item, order, order_item
--
-- Roles: 3 customers, 2 vendors, 2 riders
-- Stores: 2 stores (one per vendor)
-- Items: 4-5 items per store
-- Orders: one of every status
-- =========================

BEGIN;

-- =========================
-- USERS
-- =========================

INSERT INTO "user"
    (user_id, name, email, "emailVerified", image, "createdAt", "updatedAt", password_hash, phone_number, role)
VALUES
    -- Customers
    ('usr_c1', 'Ana Reyes',       'ana.reyes@example.com',    TRUE,  NULL, NOW() - INTERVAL '30 days', NOW() - INTERVAL '30 days', '$2b$10$placeholder_hash_customer1', '+639171111001', 'customer'),
    ('usr_c2', 'Ben Santos',      'ben.santos@example.com',   TRUE,  NULL, NOW() - INTERVAL '25 days', NOW() - INTERVAL '25 days', '$2b$10$placeholder_hash_customer2', '+639171111002', 'customer'),
    ('usr_c3', 'Carla Dela Cruz', 'carla.dc@example.com',     FALSE, NULL, NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days', '$2b$10$placeholder_hash_customer3', '+639171111003', 'customer'),
    -- Vendors
    ('usr_v1', 'Diego Tan',       'diego.tan@example.com',    TRUE,  NULL, NOW() - INTERVAL '60 days', NOW() - INTERVAL '60 days', '$2b$10$placeholder_hash_vendor1',   '+639182222001', 'vendor'),
    ('usr_v2', 'Elena Ocampo',    'elena.ocampo@example.com', TRUE,  NULL, NOW() - INTERVAL '55 days', NOW() - INTERVAL '55 days', '$2b$10$placeholder_hash_vendor2',   '+639182222002', 'vendor'),
    -- Riders
    ('usr_r1', 'Felix Cruz',      'felix.cruz@example.com',   TRUE,  NULL, NOW() - INTERVAL '45 days', NOW() - INTERVAL '45 days', '$2b$10$placeholder_hash_rider1',    '+639193333001', 'rider'),
    ('usr_r2', 'Grace Lim',       'grace.lim@example.com',    TRUE,  NULL, NOW() - INTERVAL '40 days', NOW() - INTERVAL '40 days', '$2b$10$placeholder_hash_rider2',    '+639193333002', 'rider')
ON CONFLICT (user_id) DO NOTHING;


-- =========================
-- SESSIONS
-- =========================

INSERT INTO session
    (id, "expiresAt", token, "createdAt", "updatedAt", "ipAddress", "userAgent", "userId")
VALUES
    ('ses_c1_1', NOW() + INTERVAL '7 days', 'tok_c1_abc123def456', NOW() - INTERVAL '1 hour',     NOW() - INTERVAL '1 hour',     '203.177.10.5',  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0)',  'usr_c1'),
    ('ses_v1_1', NOW() + INTERVAL '7 days', 'tok_v1_xyz789uvw012', NOW() - INTERVAL '2 hours',    NOW() - INTERVAL '2 hours',    '203.177.10.20', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'usr_v1'),
    ('ses_r1_1', NOW() + INTERVAL '7 days', 'tok_r1_mno345pqr678', NOW() - INTERVAL '30 minutes', NOW() - INTERVAL '30 minutes', '203.177.10.35', 'Mozilla/5.0 (Android 13; Mobile)',          'usr_r1')
ON CONFLICT (id) DO NOTHING;


-- =========================
-- ACCOUNTS
-- =========================
-- Credential accounts for all users

INSERT INTO account
    (id, "accountId", "providerId", "userId", password, "createdAt", "updatedAt")
VALUES
    ('acc_c1', 'usr_c1', 'credential', 'usr_c1', '$2b$10$placeholder_hash_customer1', NOW() - INTERVAL '30 days', NOW() - INTERVAL '30 days'),
    ('acc_c2', 'usr_c2', 'credential', 'usr_c2', '$2b$10$placeholder_hash_customer2', NOW() - INTERVAL '25 days', NOW() - INTERVAL '25 days'),
    ('acc_c3', 'usr_c3', 'credential', 'usr_c3', '$2b$10$placeholder_hash_customer3', NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days'),
    ('acc_v1', 'usr_v1', 'credential', 'usr_v1', '$2b$10$placeholder_hash_vendor1',   NOW() - INTERVAL '60 days', NOW() - INTERVAL '60 days'),
    ('acc_v2', 'usr_v2', 'credential', 'usr_v2', '$2b$10$placeholder_hash_vendor2',   NOW() - INTERVAL '55 days', NOW() - INTERVAL '55 days'),
    ('acc_r1', 'usr_r1', 'credential', 'usr_r1', '$2b$10$placeholder_hash_rider1',    NOW() - INTERVAL '45 days', NOW() - INTERVAL '45 days'),
    ('acc_r2', 'usr_r2', 'credential', 'usr_r2', '$2b$10$placeholder_hash_rider2',    NOW() - INTERVAL '40 days', NOW() - INTERVAL '40 days')
ON CONFLICT (id) DO NOTHING;

-- Google OAuth account for Ana
INSERT INTO account
    (id, "accountId", "providerId", "userId", "accessToken", "refreshToken", "accessTokenExpiresAt", scope, "createdAt", "updatedAt")
VALUES
    ('acc_c1_goog', '10812345678901234567', 'google', 'usr_c1',
     'ya29.placeholder_access_token',
     '1//placeholder_refresh_token',
     NOW() + INTERVAL '1 hour',
     'openid email profile',
     NOW() - INTERVAL '30 days',
     NOW() - INTERVAL '30 days')
ON CONFLICT (id) DO NOTHING;


-- =========================
-- VERIFICATIONS
-- =========================

INSERT INTO verification
    (id, identifier, value, "expiresAt", "createdAt", "updatedAt")
VALUES
    -- Spent — Ana's email verification (already expired)
    ('ver_c1_email',   'ana.reyes@example.com',  'vrfy_ana_tok_111aaa',   NOW() - INTERVAL '29 days',    NOW() - INTERVAL '30 days',   NOW() - INTERVAL '30 days'),
    -- Pending — Carla's email, not yet verified
    ('ver_c3_email',   'carla.dc@example.com',   'vrfy_carla_tok_333ccc', NOW() + INTERVAL '24 hours',   NOW() - INTERVAL '10 days',   NOW() - INTERVAL '10 days'),
    -- Active — Ben's password reset token
    ('ver_c2_pwreset', 'ben.santos@example.com', 'pwrst_ben_tok_222bbb',  NOW() + INTERVAL '15 minutes', NOW() - INTERVAL '5 minutes', NOW() - INTERVAL '5 minutes')
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

-- Diego's Karinderya
INSERT INTO store_item
    (store_item_id, store_id, name, description, price, is_available, image_url, created_at)
VALUES
    ('itm_v1_01', 'str_v1', 'Adobong Manok',     'Classic chicken adobo with garlic fried rice',   85.00, TRUE,  NULL, NOW() - INTERVAL '58 days'),
    ('itm_v1_02', 'str_v1', 'Sinigang na Baboy', 'Pork ribs in sour tamarind broth with veggies', 110.00, TRUE,  NULL, NOW() - INTERVAL '58 days'),
    ('itm_v1_03', 'str_v1', 'Lechon Kawali',     'Crispy deep-fried pork belly',                   95.00, TRUE,  NULL, NOW() - INTERVAL '58 days'),
    ('itm_v1_04', 'str_v1', 'Pork BBQ (1 stick)','Grilled marinated pork skewer',                  25.00, TRUE,  NULL, NOW() - INTERVAL '58 days'),
    -- Intentionally unavailable — useful for testing availability filters
    ('itm_v1_05', 'str_v1', 'Buko Juice',        'Fresh young coconut juice (large)',               40.00, FALSE, NULL, NOW() - INTERVAL '30 days')
ON CONFLICT (store_item_id) DO NOTHING;

-- Elena's Bakeshop
INSERT INTO store_item
    (store_item_id, store_id, name, description, price, is_available, image_url, created_at)
VALUES
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
    -- delivered — Ana @ Karinderya, Felix
    ('ord_001', 'usr_c1', 'str_v1', 'usr_r1', 'delivered', 'gcash', 'Unit 4B, Villa Residences, Sto. Tomas, Angeles City', NOW() - INTERVAL '10 days',    NOW() - INTERVAL '10 days'  + INTERVAL '45 minutes'),
    -- delivered — Ben @ Bakeshop, Grace
    ('ord_002', 'usr_c2', 'str_v2', 'usr_r2', 'delivered', 'cash',  '18 Mabalacat St., Balibago, Angeles City',            NOW() - INTERVAL '8 days',     NOW() - INTERVAL '8 days'   + INTERVAL '30 minutes'),
    -- picked_up — Ana @ Bakeshop, Grace
    ('ord_003', 'usr_c1', 'str_v2', 'usr_r2', 'picked_up', 'gcash', 'Unit 4B, Villa Residences, Sto. Tomas, Angeles City', NOW() - INTERVAL '20 minutes', NOW() - INTERVAL '10 minutes'),
    -- accepted  — Ben @ Karinderya, Felix
    ('ord_004', 'usr_c2', 'str_v1', 'usr_r1', 'accepted',  'cash',  '18 Mabalacat St., Balibago, Angeles City',            NOW() - INTERVAL '15 minutes', NOW() - INTERVAL '12 minutes'),
    -- open      — Carla @ Karinderya, no rider yet
    ('ord_005', 'usr_c3', 'str_v1', NULL,      'open',      'gcash', '101 Friendship Highway, Angeles City',               NOW() - INTERVAL '5 minutes',  NOW() - INTERVAL '5 minutes'),
    -- cancelled — Ben @ Bakeshop
    ('ord_006', 'usr_c2', 'str_v2', NULL,      'cancelled', 'cash',  '18 Mabalacat St., Balibago, Angeles City',            NOW() - INTERVAL '3 days',     NOW() - INTERVAL '3 days'   + INTERVAL '5 minutes')
ON CONFLICT (order_id) DO NOTHING;


-- =========================
-- ORDER ITEMS
-- =========================
-- price_snapshot records the price at order time,
-- independent of any future changes to store_item.price.

INSERT INTO order_item
    (order_item_id, order_id, store_item_id, price_snapshot, quantity)
VALUES
    -- ord_001: Ana @ Karinderya — Adobong Manok x2, Buko Juice x1
    ('oi_001_01', 'ord_001', 'itm_v1_01',  85.00, 2),
    ('oi_001_02', 'ord_001', 'itm_v1_05',  40.00, 1),
    -- ord_002: Ben @ Bakeshop — Pandesal x1, Leche Flan x2
    ('oi_002_01', 'ord_002', 'itm_v2_01',  60.00, 1),
    ('oi_002_02', 'ord_002', 'itm_v2_03',  55.00, 2),
    -- ord_003: Ana @ Bakeshop — Ensaymada x3, Ube Bread Loaf x1
    ('oi_003_01', 'ord_003', 'itm_v2_02',  35.00, 3),
    ('oi_003_02', 'ord_003', 'itm_v2_04',  95.00, 1),
    -- ord_004: Ben @ Karinderya — Sinigang x1, BBQ x4
    ('oi_004_01', 'ord_004', 'itm_v1_02', 110.00, 1),
    ('oi_004_02', 'ord_004', 'itm_v1_04',  25.00, 4),
    -- ord_005: Carla @ Karinderya — Lechon Kawali x1, Adobong Manok x1
    ('oi_005_01', 'ord_005', 'itm_v1_03',  95.00, 1),
    ('oi_005_02', 'ord_005', 'itm_v1_01',  85.00, 1),
    -- ord_006: Ben @ Bakeshop (cancelled) — Puto Cheese x10
    ('oi_006_01', 'ord_006', 'itm_v2_05',  10.00, 10)
ON CONFLICT (order_item_id) DO NOTHING;

COMMIT;