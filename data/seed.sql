create table if not exists users (
    id integer primary key check (id = 1),
    username text not null unique,
    password_hash text not null
);
