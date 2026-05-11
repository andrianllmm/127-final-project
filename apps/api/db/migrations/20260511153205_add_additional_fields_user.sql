-- migrate:up
ALTER TABLE
  "user"
ADD
  COLUMN IF NOT EXISTS "role" text;

ALTER TABLE
  "user"
ADD
  COLUMN IF NOT EXISTS "phone_number" text;

-- migrate:down
ALTER TABLE
  "user" DROP COLUMN IF EXISTS "role";

ALTER TABLE
  "user" DROP COLUMN IF EXISTS "phone_number";
