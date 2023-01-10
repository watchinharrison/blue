-- Migration number: 0010 	 2023-01-10T10:02:28.267Z
ALTER TABLE post_entities
ADD COLUMN site_name VARCHAR(255);