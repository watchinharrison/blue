-- Migration number: 0004 	 2023-01-02T22:35:31.584Z
ALTER TABLE posts
ADD COLUMN reply_id INTEGER NULL;

ALTER TABLE posts
ADD COLUMN thread_id INTEGER NULL;