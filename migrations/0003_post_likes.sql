-- Migration number: 0003 	 2023-01-02T15:25:59.078Z
CREATE TABLE
  likes (
    user_id INTEGER NOT NULL,
    post_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (post_id) REFERENCES posts (id),
    PRIMARY KEY (user_id, post_id)
  );

ALTER TABLE posts
ADD COLUMN likes_count INTEGER DEFAULT 0;