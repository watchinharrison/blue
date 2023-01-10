-- Migration number: 0000 	 2022-12-31T15:36:46.980Z
CREATE TABLE
  users (
    id INTEGER PRIMARY KEY,
    first_name VARCHAR(255) NULL,
    last_name VARCHAR(255) NULL,
    email VARCHAR(255) UNIQUE,
    username VARCHAR(16) UNIQUE NULL,
    password VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NULL
  );