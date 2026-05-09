-- migrate:up
create table users (
  id serial primary key,
  email text not null unique
);

-- migrate:down
drop table users;
