-- Migration number: 0001 	 2023-01-01T12:13:54.808Z
-- Migration number: 0000 	 2022-12-31T15:36:46.980Z
CREATE TABLE
  posts (
    id INTEGER PRIMARY KEY,
    text VARCHAR(1024) NULL,
    user_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NULL
  );

CREATE TABLE
  post_entities (
    id INTEGER PRIMARY KEY,
    type VARCHAR(12) NULL,
    post_id INTEGER,
    indices VARCHAR(12) NULL,
    url VARCHAR(255) NULL,
    entity_type VARCHAR(12) NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NULL
  );