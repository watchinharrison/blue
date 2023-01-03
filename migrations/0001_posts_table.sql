-- Migration number: 0001 	 2023-01-01T12:13:54.808Z
-- Migration number: 0000 	 2022-12-31T15:36:46.980Z
CREATE TABLE
  posts (
    id INTEGER PRIMARY KEY,
    text TEXT NULL,
    user_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NULL
  );

CREATE TABLE
  post_entities (
    id INTEGER PRIMARY KEY,
    type TEXT NULL,
    post_id INTEGER,
    indices TEXT NULL,
    url TEXT NULL,
    entity_type TEXT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NULL
  );