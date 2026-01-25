CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT current_timestamp
);

CREATE TABLE IF NOT EXISTS entries (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    date TEXT NOT NULL,
    title_enc TEXT NOT NULL,
    content_enc TEXT NOT NULL,
    thanks_enc TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT current_timestamp,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    UNIQUE (user_id, date)
);

CREATE INDEX IF NOT EXISTS idx_entries_user ON entries (user_id);

CREATE TABLE IF NOT EXISTS devices (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    label TEXT NOT NULL,
    token_hash TEXT NOT NULL UNIQUE,
    FOREIGN KEY user_id REFERENCES users (id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_devices_user ON devices (user_id);