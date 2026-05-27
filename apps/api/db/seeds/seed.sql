-- =========================
-- SEED DATA
-- =========================

BEGIN;

-- Reset all tables
TRUNCATE TABLE
  order_item,
  "order",
  store_item,
  store,
  account,
  session,
  verification,
  "user",
  schema_migrations
RESTART IDENTITY CASCADE;

-- =========================
-- USERS
-- =========================
-- NOTE: Assumes Better Auth manages auth tables (email/password only)
-- No session/account/verification seeding.

INSERT INTO "user"
    (user_id, name, email, "emailVerified", image, "createdAt", "updatedAt", phone_number, role)
VALUES
    -- Customers
    ('550e8400-e29b-41d4-a716-446655440001', 'Ana Reyes',       'ana.reyes@example.com',    TRUE,  NULL, NOW() - INTERVAL '30 days', NOW() - INTERVAL '30 days', '+639171111001', 'customer'),
    ('550e8400-e29b-41d4-a716-446655440002', 'Ben Santos',      'ben.santos@example.com',   TRUE,  NULL, NOW() - INTERVAL '25 days', NOW() - INTERVAL '25 days', '+639171111002', 'customer'),
    ('550e8400-e29b-41d4-a716-446655440003', 'Carla Dela Cruz', 'carla.dc@example.com',     FALSE, NULL, NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days', '+639171111003', 'customer'),

    -- Vendors
    ('550e8400-e29b-41d4-a716-446655440004', 'Diego Tan',       'diego.tan@example.com',    TRUE,  NULL, NOW() - INTERVAL '60 days', NOW() - INTERVAL '60 days', '+639182222001', 'vendor'),
    ('550e8400-e29b-41d4-a716-446655440005', 'Elena Ocampo',    'elena.ocampo@example.com', TRUE,  NULL, NOW() - INTERVAL '55 days', NOW() - INTERVAL '55 days', '+639182222002', 'vendor'),

    -- Riders
    ('550e8400-e29b-41d4-a716-446655440006', 'Felix Cruz',      'felix.cruz@example.com',   TRUE,  NULL, NOW() - INTERVAL '45 days', NOW() - INTERVAL '45 days', '+639193333001', 'rider'),
    ('550e8400-e29b-41d4-a716-446655440007', 'Grace Lim',       'grace.lim@example.com',    TRUE,  NULL, NOW() - INTERVAL '40 days', NOW() - INTERVAL '40 days', '+639193333002', 'rider')
ON CONFLICT (user_id) DO NOTHING;


-- =========================
-- STORES
-- =========================

INSERT INTO store
    (store_id, user_id, store_name, store_address, created_at)
VALUES
    ('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440004', 'Diego''s Karinderya', 'Blk 3 Lot 5, Purok 2, Sto. Tomas, Angeles City', NOW() - INTERVAL '58 days'),
    ('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440005', 'Elena''s Bakeshop',   '22 MacArthur Highway, Balibago, Angeles City',    NOW() - INTERVAL '53 days')
ON CONFLICT (store_id) DO NOTHING;


-- =========================
-- STORE ITEMS
-- =========================

INSERT INTO store_item
    (store_item_id, store_id, name, description, price, is_available, image_url, created_at)
VALUES
    ('770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'Adobong Manok',     'Classic chicken adobo with garlic fried rice',   85.00, TRUE,  NULL, NOW() - INTERVAL '58 days'),
    ('770e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001', 'Sinigang na Baboy', 'Pork ribs in sour tamarind broth with veggies', 110.00, TRUE,  NULL, NOW() - INTERVAL '58 days'),
    ('770e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440001', 'Lechon Kawali',     'Crispy deep-fried pork belly',                   95.00, TRUE,  NULL, NOW() - INTERVAL '58 days'),
    ('770e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440001', 'Pork BBQ (1 stick)','Grilled marinated pork skewer',                  25.00, TRUE,  NULL, NOW() - INTERVAL '58 days'),
    ('770e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440001', 'Buko Juice',        'Fresh young coconut juice (large)',               40.00, FALSE, NULL, NOW() - INTERVAL '30 days'),

    ('770e8400-e29b-41d4-a716-446655440006', '660e8400-e29b-41d4-a716-446655440002', 'Pandesal (dozen)', 'Freshly baked soft bread rolls',            60.00, TRUE, NULL, NOW() - INTERVAL '53 days'),
    ('770e8400-e29b-41d4-a716-446655440007', '660e8400-e29b-41d4-a716-446655440002', 'Ensaymada',        'Soft brioche topped with butter and sugar', 35.00, TRUE, NULL, NOW() - INTERVAL '53 days'),
    ('770e8400-e29b-41d4-a716-446655440008', '660e8400-e29b-41d4-a716-446655440002', 'Leche Flan',       'Classic creamy caramel custard',            55.00, TRUE, NULL, NOW() - INTERVAL '53 days'),
    ('770e8400-e29b-41d4-a716-446655440009', '660e8400-e29b-41d4-a716-446655440002', 'Ube Bread Loaf',   'Purple yam flavored sliced loaf bread',     95.00, TRUE, NULL, NOW() - INTERVAL '40 days'),
    ('770e8400-e29b-41d4-a716-446655440010', '660e8400-e29b-41d4-a716-446655440002', 'Puto Cheese',      'Steamed rice cake topped with cheddar',     10.00, TRUE, NULL, NOW() - INTERVAL '40 days')
ON CONFLICT (store_item_id) DO NOTHING;


-- =========================
-- ORDERS
-- =========================

INSERT INTO "order"
    (order_id, customer_id, store_id, rider_id, status, payment_method, delivery_address, created_at, updated_at)
VALUES
    -- Diego's Karinderya orders (store_id: 660e8400-e29b-41d4-a716-446655440001)
    ('880e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440006', 'delivered', 'gcash', 'Unit 4B, Villa Residences, Sto. Tomas, Angeles City', NOW() - INTERVAL '28 days', NOW() - INTERVAL '28 days'),
    ('880e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440006', 'delivered', 'cash',  '18 Mabalacat St., Balibago, Angeles City',            NOW() - INTERVAL '25 days', NOW() - INTERVAL '25 days'),
    ('880e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440006', 'delivered', 'gcash', 'Unit 4B, Villa Residences, Sto. Tomas, Angeles City', NOW() - INTERVAL '20 days', NOW() - INTERVAL '20 days'),
    ('880e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440006', 'delivered', 'cash',  '18 Mabalacat St., Balibago, Angeles City',            NOW() - INTERVAL '18 days', NOW() - INTERVAL '18 days'),
    ('880e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440006', 'delivered', 'gcash', '101 Friendship Highway, Angeles City',               NOW() - INTERVAL '15 days', NOW() - INTERVAL '15 days'),
    ('880e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440006', 'delivered', 'gcash', 'Unit 4B, Villa Residences, Sto. Tomas, Angeles City', NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days'),
    ('880e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440006', 'delivered', 'cash',  '18 Mabalacat St., Balibago, Angeles City',            NOW() - INTERVAL '8 days',  NOW() - INTERVAL '8 days'),
    ('880e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440006', 'delivered', 'gcash', 'Unit 4B, Villa Residences, Sto. Tomas, Angeles City', NOW() - INTERVAL '5 days',  NOW() - INTERVAL '5 days'),
    ('880e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440006', 'delivered', 'cash',  '101 Friendship Highway, Angeles City',               NOW() - INTERVAL '3 days',  NOW() - INTERVAL '3 days'),
    ('880e8400-e29b-41d4-a716-446655440014', '550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440006', 'delivered', 'gcash', '18 Mabalacat St., Balibago, Angeles City',            NOW() - INTERVAL '2 days',  NOW() - INTERVAL '2 days'),
    ('880e8400-e29b-41d4-a716-446655440015', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440006', 'delivered', 'gcash', 'Unit 4B, Villa Residences, Sto. Tomas, Angeles City', NOW() - INTERVAL '1 day',   NOW() - INTERVAL '1 day'),
    ('880e8400-e29b-41d4-a716-446655440016', '550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440006', 'picked_up', 'cash',  '18 Mabalacat St., Balibago, Angeles City',            NOW() - INTERVAL '2 hours', NOW() - INTERVAL '1 hour'),
    ('880e8400-e29b-41d4-a716-446655440017', '550e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440006', 'accepted',  'gcash', '101 Friendship Highway, Angeles City',               NOW() - INTERVAL '30 minutes', NOW() - INTERVAL '25 minutes'),
    ('880e8400-e29b-41d4-a716-446655440018', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', NULL,      'open',      'gcash', 'Unit 4B, Villa Residences, Sto. Tomas, Angeles City', NOW() - INTERVAL '10 minutes', NOW() - INTERVAL '10 minutes'),
    ('880e8400-e29b-41d4-a716-446655440019', '550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001', NULL,      'cancelled', 'cash',  '18 Mabalacat St., Balibago, Angeles City',            NOW() - INTERVAL '6 days',   NOW() - INTERVAL '6 days'),

    -- Elena's Bakeshop orders (store_id: 660e8400-e29b-41d4-a716-446655440002)
    ('880e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440007', 'delivered', 'cash',  '18 Mabalacat St., Balibago, Angeles City',            NOW() - INTERVAL '8 days',  NOW() - INTERVAL '8 days'),
    ('880e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440007', 'picked_up', 'gcash', 'Unit 4B, Villa Residences, Sto. Tomas, Angeles City', NOW() - INTERVAL '20 minutes', NOW() - INTERVAL '10 minutes'),
    ('880e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440002', NULL,      'cancelled', 'cash',  '18 Mabalacat St., Balibago, Angeles City',            NOW() - INTERVAL '3 days',     NOW() - INTERVAL '3 days')
ON CONFLICT (order_id) DO NOTHING;


-- =========================
-- ORDER ITEMS
-- =========================

INSERT INTO order_item
    (order_item_id, order_id, store_item_id, price_snapshot, quantity)
VALUES
    -- Diego's Karinderya order items
    ('990e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001',  85.00, 2),
    ('990e8400-e29b-41d4-a716-446655440021', '880e8400-e29b-41d4-a716-446655440004', '770e8400-e29b-41d4-a716-446655440001',  85.00, 1),
    ('990e8400-e29b-41d4-a716-446655440022', '880e8400-e29b-41d4-a716-446655440004', '770e8400-e29b-41d4-a716-446655440004',  25.00, 3),
    ('990e8400-e29b-41d4-a716-446655440023', '880e8400-e29b-41d4-a716-446655440007', '770e8400-e29b-41d4-a716-446655440002', 110.00, 1),
    ('990e8400-e29b-41d4-a716-446655440024', '880e8400-e29b-41d4-a716-446655440008', '770e8400-e29b-41d4-a716-446655440003',  95.00, 1),
    ('990e8400-e29b-41d4-a716-446655440025', '880e8400-e29b-41d4-a716-446655440008', '770e8400-e29b-41d4-a716-446655440004',  25.00, 2),
    ('990e8400-e29b-41d4-a716-446655440026', '880e8400-e29b-41d4-a716-446655440009', '770e8400-e29b-41d4-a716-446655440001',  85.00, 2),
    ('990e8400-e29b-41d4-a716-446655440027', '880e8400-e29b-41d4-a716-446655440010', '770e8400-e29b-41d4-a716-446655440002', 110.00, 1),
    ('990e8400-e29b-41d4-a716-446655440028', '880e8400-e29b-41d4-a716-446655440011', '770e8400-e29b-41d4-a716-446655440001',  85.00, 3),
    ('990e8400-e29b-41d4-a716-446655440029', '880e8400-e29b-41d4-a716-446655440012', '770e8400-e29b-41d4-a716-446655440003',  95.00, 1),
    ('990e8400-e29b-41d4-a716-446655440030', '880e8400-e29b-41d4-a716-446655440013', '770e8400-e29b-41d4-a716-446655440004',  25.00, 4),
    ('990e8400-e29b-41d4-a716-446655440031', '880e8400-e29b-41d4-a716-446655440014', '770e8400-e29b-41d4-a716-446655440002', 110.00, 1),
    ('990e8400-e29b-41d4-a716-446655440032', '880e8400-e29b-41d4-a716-446655440014', '770e8400-e29b-41d4-a716-446655440001',  85.00, 1),
    ('990e8400-e29b-41d4-a716-446655440033', '880e8400-e29b-41d4-a716-446655440015', '770e8400-e29b-41d4-a716-446655440003',  95.00, 2),
    ('990e8400-e29b-41d4-a716-446655440034', '880e8400-e29b-41d4-a716-446655440016', '770e8400-e29b-41d4-a716-446655440001',  85.00, 1),
    ('990e8400-e29b-41d4-a716-446655440035', '880e8400-e29b-41d4-a716-446655440017', '770e8400-e29b-41d4-a716-446655440004',  25.00, 5),
    ('990e8400-e29b-41d4-a716-446655440036', '880e8400-e29b-41d4-a716-446655440018', '770e8400-e29b-41d4-a716-446655440002', 110.00, 1),
    ('990e8400-e29b-41d4-a716-446655440037', '880e8400-e29b-41d4-a716-446655440019', '770e8400-e29b-41d4-a716-446655440003',  95.00, 1),

    -- Elena's Bakeshop order items
    ('990e8400-e29b-41d4-a716-446655440003', '880e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440006',  60.00, 1),
    ('990e8400-e29b-41d4-a716-446655440004', '880e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440008',  55.00, 2),
    ('990e8400-e29b-41d4-a716-446655440005', '880e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440007',  35.00, 3),
    ('990e8400-e29b-41d4-a716-446655440006', '880e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440009',  95.00, 1),
    ('990e8400-e29b-41d4-a716-446655440011', '880e8400-e29b-41d4-a716-446655440006', '770e8400-e29b-41d4-a716-446655440010',  10.00, 10)
ON CONFLICT (order_item_id) DO NOTHING;

COMMIT;
