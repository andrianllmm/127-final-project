import { Pool } from 'pg';
import { env } from '../config/env.js';
import { auth } from '../modules/auth/auth.config.js';

const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

type SeedUser = {
  name: string;
  email: string;
  password: string;
  role: 'customer' | 'vendor' | 'rider';
  phone_number?: string;
};

const users: SeedUser[] = [
  // =========================
  // PRIMARY USERS
  // =========================
  {
    name: 'Ana Reyes',
    email: 'ana.reyes@example.com',
    password: 'password123',
    role: 'customer',
    phone_number: '+639171111001',
  },
  {
    name: 'Ben Santos',
    email: 'ben.santos@example.com',
    password: 'password123',
    role: 'customer',
    phone_number: '+639171111002',
  },
  {
    name: 'Carla Dela Cruz',
    email: 'carla.dc@example.com',
    password: 'password123',
    role: 'customer',
    phone_number: '+639171111003',
  },

  {
    name: 'Diego Tan',
    email: 'diego.tan@example.com',
    password: 'password123',
    role: 'vendor',
    phone_number: '+639182222001',
  },
  {
    name: 'Elena Ocampo',
    email: 'elena.ocampo@example.com',
    password: 'password123',
    role: 'vendor',
    phone_number: '+639182222002',
  },

  {
    name: 'Felix Cruz',
    email: 'felix.cruz@example.com',
    password: 'password123',
    role: 'rider',
    phone_number: '+639193333001',
  },
  {
    name: 'Grace Lim',
    email: 'grace.lim@example.com',
    password: 'password123',
    role: 'rider',
    phone_number: '+639193333002',
  },

  // =========================
  // GENERIC POOL (IMPORTANT FOR ANALYTICS)
  // =========================

  // Customers (heavy usage simulation)
  {
    name: 'Customer One',
    email: 'customer1@example.com',
    password: 'password123',
    role: 'customer',
    phone_number: '+639100000001',
  },
  {
    name: 'Customer Two',
    email: 'customer2@example.com',
    password: 'password123',
    role: 'customer',
    phone_number: '+639100000002',
  },
  {
    name: 'Customer Three',
    email: 'customer3@example.com',
    password: 'password123',
    role: 'customer',
    phone_number: '+639100000003',
  },

  // Vendors (multiple stores possible later)
  {
    name: 'Vendor One',
    email: 'vendor1@example.com',
    password: 'password123',
    role: 'vendor',
    phone_number: '+639200000001',
  },

  // Riders (distribution simulation)
  {
    name: 'Rider One',
    email: 'rider1@example.com',
    password: 'password123',
    role: 'rider',
    phone_number: '+639300000001',
  },
];

async function resetDatabase() {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    await client.query(`
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
    `);

    await client.query('COMMIT');
  } finally {
    client.release();
  }
}

async function createUsers() {
  const map: Record<string, any> = {};

  for (const u of users) {
    const res = await auth.api.signUpEmail({
      body: {
        email: u.email,
        password: u.password,
        name: u.name,
        role: u.role,
        phone_number: u.phone_number,
      },
    });

    const user = (res as any)?.user;
    if (!user?.id) throw new Error(`Failed user creation: ${u.email}`);

    map[u.email] = user;
    console.log(`Created user: ${u.email} -> ${user.id}`);
  }

  return map;
}

async function seedDB(userMap: Record<string, any>) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // =========================
    // USERS GROUPING
    // =========================
    const vendors = {
      diego: userMap['diego.tan@example.com'],
      elena: userMap['elena.ocampo@example.com'],
      vendor1: userMap['vendor1@example.com'],
    };

    const customers = [
      userMap['ana.reyes@example.com'],
      userMap['ben.santos@example.com'],
      userMap['carla.dc@example.com'],
      userMap['customer1@example.com'],
      userMap['customer2@example.com'],
      userMap['customer3@example.com'],
    ];

    const riders = [
      userMap['felix.cruz@example.com'],
      userMap['grace.lim@example.com'],
      userMap['rider1@example.com'],
    ];

    // =========================
    // STORES (ALL VENDORS)
    // =========================
    await client.query(
      `
      INSERT INTO store (user_id, store_name, store_address, created_at)
      VALUES
        ($1, 'Diego''s Karinderya', 'Sto. Tomas, Angeles City', NOW() - INTERVAL '90 days'),
        ($2, 'Elena''s Bakeshop', 'Balibago, Angeles City', NOW() - INTERVAL '85 days'),
        ($3, 'Vendor One Food Hub', 'Downtown Angeles City', NOW() - INTERVAL '60 days')
      `,
      [vendors.diego.id, vendors.elena.id, vendors.vendor1.id],
    );

    const stores = await client.query<{ store_id: string; user_id: string }>(`
      SELECT store_id, user_id FROM store
    `);

    const diegoStore = stores.rows.find((s) => s.user_id === vendors.diego.id)!;
    const elenaStore = stores.rows.find((s) => s.user_id === vendors.elena.id)!;
    const vendor1Store = stores.rows.find((s) => s.user_id === vendors.vendor1.id)!;

    // =========================
    // STORE ITEMS (HIGH VOLUME)
    // =========================
    await client.query(
      `
      INSERT INTO store_item (
        store_id,
        name,
        description,
        price,
        is_available,
        created_at
      )
      VALUES
        -- Diego
        ($1, 'Adobo', 'Classic', 85, TRUE, NOW()),
        ($1, 'Sinigang', 'Sour soup', 120, TRUE, NOW()),
        ($1, 'Lechon Kawali', 'Crispy pork', 130, TRUE, NOW()),
        ($1, 'BBQ Stick', 'Grilled pork', 25, TRUE, NOW()),

        -- Elena
        ($2, 'Pandesal', 'Bread', 5, TRUE, NOW()),
        ($2, 'Ensaymada', 'Sweet bread', 35, TRUE, NOW()),
        ($2, 'Ube Cake', 'Purple yam cake', 140, TRUE, NOW()),
        ($2, 'Leche Flan', 'Custard', 55, TRUE, NOW()),

        -- Vendor1 (analytics-heavy store)
        ($3, 'Burger', 'Beef burger', 90, TRUE, NOW()),
        ($3, 'Cheese Burger', 'Cheese burger', 110, TRUE, NOW()),
        ($3, 'Chicken Burger', 'Chicken patty', 100, TRUE, NOW()),
        ($3, 'Fries Small', 'Fries', 50, TRUE, NOW()),
        ($3, 'Fries Large', 'Fries', 80, TRUE, NOW()),
        ($3, 'Milk Tea', 'Drink', 70, TRUE, NOW()),
        ($3, 'Iced Coffee', 'Coffee', 65, TRUE, NOW())
      `,
      [diegoStore.store_id, elenaStore.store_id, vendor1Store.store_id],
    );

    const items = await client.query<{
      store_item_id: string;
      store_id: string;
      price: number;
    }>(`SELECT * FROM store_item`);

    const getItems = (storeId: string) => items.rows.filter((i) => i.store_id === storeId);

    const diegoItems = getItems(diegoStore.store_id);
    const elenaItems = getItems(elenaStore.store_id);
    const vendor1Items = getItems(vendor1Store.store_id);

    const pick = (arr: any[], n: number) => arr.slice(0, n);

    // =========================
    // ORDERS (REALISTIC HEAVY TRAFFIC)
    // =========================
    let index = 0;

    const allStores = [
      { store: diegoStore, items: diegoItems },
      { store: elenaStore, items: elenaItems },
      { store: vendor1Store, items: vendor1Items },
    ];

    for (const customer of customers) {
      for (const storeGroup of allStores) {
        // 4–6 orders per customer per store
        for (let i = 0; i < 5; i++) {
          const rider = riders[(index + i) % riders.length];

          const status =
            index % 10 === 0
              ? 'cancelled'
              : index % 10 === 1
                ? 'accepted'
                : index % 10 === 2
                  ? 'picked_up'
                  : 'delivered';

          const order = await client.query<{ order_id: string }>(
            `
            INSERT INTO "order" (
              customer_id,
              store_id,
              rider_id,
              status,
              payment_method,
              delivery_address,
              created_at,
              updated_at
            )
            VALUES (
              $1, $2, $3, $4,
              'gcash',
              'Angeles City',
              NOW() - INTERVAL '1 day' * $5,
              NOW()
            )
            RETURNING order_id
            `,
            [customer.id, storeGroup.store.store_id, rider.id, status, index],
          );

          // 1–3 items per order
          const itemsInOrder = pick(storeGroup.items, 1 + (index % 3));

          for (const item of itemsInOrder) {
            await client.query(
              `
              INSERT INTO order_item (
                order_id,
                store_item_id,
                price_snapshot,
                quantity
              )
              VALUES ($1, $2, $3, $4)
              `,
              [order.rows[0]?.order_id, item.store_item_id, item.price, 1 + (index % 2)],
            );
          }

          index++;
        }
      }
    }

    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}

async function seed() {
  await resetDatabase();
  const userMap = await createUsers();
  await seedDB(userMap);
  await pool.end();
}

seed()
  .then(() => console.log('Seeding complete'))
  .catch((err) => {
    console.error('Seeding failed:', err);
    process.exit(1);
  });
