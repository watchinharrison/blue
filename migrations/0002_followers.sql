-- Migration number: 0002 	 2023-01-02T13:01:30.855Z
CREATE TABLE
  followers (
    user_id INTEGER NOT NULL,
    follower_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (follower_id) REFERENCES users (id),
    PRIMARY KEY (user_id, follower_id)
  );