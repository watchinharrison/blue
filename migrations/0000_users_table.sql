-- Migration number: 0000 	 2022-12-31T15:36:46.980Z
CREATE TABLE
  users (
    id INTEGER PRIMARY KEY,
    first_name TEXT NULL,
    last_name TEXT NULL,
    email TEXT UNIQUE,
    username TEXT UNIQUE NULL,
    password TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NULL
  );