-- =========================
-- Core App Database Entities
-- =========================

-- =========================
-- EXTENSIONS
-- =========================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =========================
-- ENUM TYPES
-- =========================

DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('customer', 'vendor', 'rider');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE order_status AS ENUM (
        'open',
        'accepted',
        'picked_up',
        'delivered',
        'cancelled'
    );
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_method AS ENUM ('cash', 'gcash');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- =========================
-- USER TABLE (pre-existing)
-- =========================

-- Rename id -> user_id if old column name still exists
DO $$ BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'user'
          AND table_schema = 'public'
          AND column_name = 'id'
    ) THEN
        ALTER TABLE "user" RENAME COLUMN id TO user_id;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'user'
          AND table_schema = 'public'
          AND column_name = 'password_hash'
    ) THEN
        ALTER TABLE "user" ADD COLUMN password_hash TEXT;
        UPDATE "user" SET password_hash = 'temporary_hash' WHERE password_hash IS NULL;
        ALTER TABLE "user" ALTER COLUMN password_hash SET NOT NULL;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'user'
          AND table_schema = 'public'
          AND column_name = 'phone_number'
    ) THEN
        ALTER TABLE "user" ADD COLUMN phone_number VARCHAR(50);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'user'
          AND table_schema = 'public'
          AND column_name = 'role'
    ) THEN
        ALTER TABLE "user" ADD COLUMN role user_role NOT NULL DEFAULT 'customer';
    END IF;
END $$;

-- =========================
-- STORE TABLE
-- =========================

CREATE TABLE IF NOT EXISTS store (
    store_id      TEXT          PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    user_id       TEXT          NOT NULL,
    store_name    VARCHAR(255)  NOT NULL,
    store_address TEXT          NOT NULL,
    created_at    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_store_user
        FOREIGN KEY (user_id)
        REFERENCES "user"(user_id)
        ON DELETE CASCADE
);

-- =========================
-- STORE ITEM TABLE
-- =========================

CREATE TABLE IF NOT EXISTS store_item (
    store_item_id TEXT          PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    store_id      TEXT          NOT NULL,
    name          VARCHAR(255)  NOT NULL,
    description   TEXT,
    price         NUMERIC(10,2) NOT NULL CHECK (price >= 0),
    is_available  BOOLEAN       DEFAULT TRUE,
    image_url     TEXT,
    created_at    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_store_item_store
        FOREIGN KEY (store_id)
        REFERENCES store(store_id)
        ON DELETE CASCADE
);

-- =========================
-- ORDER TABLE
-- =========================

CREATE TABLE IF NOT EXISTS "order" (
    order_id         TEXT           PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    customer_id      TEXT           NOT NULL,
    store_id         TEXT           NOT NULL,
    rider_id         TEXT,
    status           order_status   NOT NULL DEFAULT 'open',
    payment_method   payment_method NOT NULL,
    delivery_address TEXT           NOT NULL,
    created_at       TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_order_customer
        FOREIGN KEY (customer_id)
        REFERENCES "user"(user_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_order_store
        FOREIGN KEY (store_id)
        REFERENCES store(store_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_order_rider
        FOREIGN KEY (rider_id)
        REFERENCES "user"(user_id)
        ON DELETE SET NULL
);

-- Auto-update updated_at on every row change
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger
        WHERE tgname = 'trg_order_updated_at'
    ) THEN
        CREATE TRIGGER trg_order_updated_at
        BEFORE UPDATE ON "order"
        FOR EACH ROW EXECUTE FUNCTION set_updated_at();
    END IF;
END $$;

-- =========================
-- ORDER ITEM TABLE
-- =========================

CREATE TABLE IF NOT EXISTS order_item (
    order_item_id  TEXT          PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    order_id       TEXT          NOT NULL,
    store_item_id  TEXT          NOT NULL,
    price_snapshot NUMERIC(10,2) NOT NULL,
    quantity       INTEGER       NOT NULL CHECK (quantity > 0),

    CONSTRAINT fk_order_item_order
        FOREIGN KEY (order_id)
        REFERENCES "order"(order_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_order_item_store_item
        FOREIGN KEY (store_item_id)
        REFERENCES store_item(store_item_id)
        ON DELETE RESTRICT
);

-- =========================
-- INDEXES
-- =========================

CREATE INDEX IF NOT EXISTS idx_store_user_id         ON store(user_id);
CREATE INDEX IF NOT EXISTS idx_store_item_store_id   ON store_item(store_id);
CREATE INDEX IF NOT EXISTS idx_order_customer_id     ON "order"(customer_id);
CREATE INDEX IF NOT EXISTS idx_order_store_id        ON "order"(store_id);
CREATE INDEX IF NOT EXISTS idx_order_rider_id        ON "order"(rider_id);
CREATE INDEX IF NOT EXISTS idx_order_status          ON "order"(status);
CREATE INDEX IF NOT EXISTS idx_order_item_order_id   ON order_item(order_id);


INSERT INTO schema_migrations (version)
VALUES ('20260511214300')
ON CONFLICT (version) DO NOTHING;