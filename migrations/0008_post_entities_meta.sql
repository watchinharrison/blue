-- Migration number: 0008 	 2023-01-08T15:01:40.363Z
ALTER TABLE post_entities
ADD COLUMN title TEXT
ADD COLUMN description TEXT;