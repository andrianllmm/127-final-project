-- migrate:up
CREATE TABLE users (
  id serial PRIMARY KEY,
  email text NOT NULL UNIQUE
);

-- migrate:down
DROP TABLE users;
