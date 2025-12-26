CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS entries (
    id INTEGER PRIMARY KEY,
    date TEXT NOT NULL UNIQUE,
    title_enc TEXT NOT NULL,
    content_enc TEXT NOT NULL,
    thanks_enc TEXT NOT NULL
);

CREATE TABLE devices (id INTEGER PRIMARY KEY, label TEXT NOT NULL, token_hash TEXT NOT NULL UNIQUE);