-- Migration number: 0007 	 2023-01-08T10:35:13.072Z
ALTER TABLE post_entities
ADD COLUMN width INTEGER;

ALTER TABLE post_entities
ADD COLUMN height INTEGER;

ALTER TABLE post_entities
ADD COLUMN thumbnail_url VARCHAR(255) NULL;