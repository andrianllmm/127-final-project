-- migrate:up
ALTER TYPE order_status ADD VALUE IF NOT EXISTS 'draft' BEFORE 'open';

-- migrate:down
-- PostgreSQL does not support removing enum values directly.
-- This migration is intentionally irreversible.
